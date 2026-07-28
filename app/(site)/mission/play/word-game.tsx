"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { soundSystem } from "./sound-system";
import { MAX_PER_GAME_SCORE } from "./types";

const WORDS = ["ĐỎ", "XANH", "LỤC", "VÀNG", "CAM", "TÍM", "HỒNG", "ĐEN", "TRẮNG", "NÂU"];
const COLORS = [
  "#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#e67e22",
  "#9b59b6", "#ff69b4", "#2c3e50", "#ecf0f1", "#8b4513",
];

interface StroopRound {
  word: string;
  colorHex: string;
  correctAnswer: boolean;
}

const INITIAL_ROUND: StroopRound = {
  word: "ĐỎ",
  colorHex: COLORS[0],
  correctAnswer: true,
};

function generateRound(): StroopRound {
  const shouldMatch = Math.random() < 0.5;
  let wordIdx: number;
  let colorIdx: number;

  if (shouldMatch) {
    const idx = Math.floor(Math.random() * WORDS.length);
    wordIdx = idx;
    colorIdx = idx;
    return { word: WORDS[wordIdx], colorHex: COLORS[colorIdx], correctAnswer: true };
  } else {
    wordIdx = Math.floor(Math.random() * WORDS.length);
    do {
      colorIdx = Math.floor(Math.random() * COLORS.length);
    } while (colorIdx === wordIdx);
    return { word: WORDS[wordIdx], colorHex: COLORS[colorIdx], correctAnswer: false };
  }
}

function getTimerDuration(level: number): number {
  return Math.max(18, 30 - (level - 1));
}

interface WordGameProps {
  compact?: boolean;
  gameScore: number;
  isPlaying: boolean;
  isComplete: boolean;
  penaltyKey: number;
  errorFlash: boolean;
  onScore: () => void;
  onFail: () => void;
  onPenaltyReset: () => void;
  onLevelChange?: (level: number) => void;
}

export default function WordGame({ compact = false, gameScore, isPlaying, isComplete, penaltyKey, errorFlash, onScore, onFail, onPenaltyReset, onLevelChange }: WordGameProps) {
  const wordLevel = Math.max(1, gameScore + 1);
  const [round, setRound] = useState<StroopRound>(INITIAL_ROUND);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const isCompleteRef = useRef(isComplete);
  const wasPlayingRef = useRef(false);
  const timedOutRef = useRef(false);
  const gameScoreRef = useRef(gameScore);

  // Sync refs after render
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isCompleteRef.current = isComplete;
    gameScoreRef.current = gameScore;
  });

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = getTimerDuration(wordLevel);
    timedOutRef.current = false;
    setTimeLeft(duration);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (isPlayingRef.current && !isCompleteRef.current) {
            timedOutRef.current = true;
          }
          return 0;
        }
        if (next <= 3 && next > 0 && isPlayingRef.current) {
          soundSystem.countdownBeep();
        }
        return next;
      });
    }, 1000);
  }, [wordLevel]);

  useEffect(() => {
    if (timeLeft > 0 || !timedOutRef.current || !isPlaying || isComplete) return;
    timedOutRef.current = false;
    onFail();
    setRound(generateRound());
    startTimer();
  }, [timeLeft, isPlaying, isComplete, onFail, startTimer]);

  // Initialize round on start; timer uses wordLevel derived from gameScore.
  // Round (word/color) stays the same — only regenerated on correct answer.
  useEffect(() => {
    if (!isPlaying || isComplete) {
      wasPlayingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const justStarted = !wasPlayingRef.current;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- game timer must initialize when play state starts
    startTimer();
    if (justStarted) {
      setRound(generateRound());
    }

    wasPlayingRef.current = true;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isComplete, startTimer]);

  // Penalty reset
  useEffect(() => {
    if (penaltyKey > 0 && isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        startTimer();
        onPenaltyReset();
      }, 600);
    }
  }, [penaltyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Report per-game level to engine
  useEffect(() => {
    if (isPlaying && onLevelChange) onLevelChange(wordLevel);
  }, [wordLevel, isPlaying, onLevelChange]);

  const handleAnswer = useCallback(
    (playerSaidYes: boolean) => {
      if (!isPlaying || isComplete) return;

      if (playerSaidYes === round.correctAnswer) {
        soundSystem.wordCorrect();
        if (gameScoreRef.current < MAX_PER_GAME_SCORE) onScore();
        setRound(generateRound());
        startTimer();
      } else {
        setRound(generateRound());
        onFail();
        // Timer stopped via parent
      }
    },
    [isPlaying, isComplete, round, onScore, onFail, startTimer]
  );

  // Keyboard: Y/N
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "y" || e.key === "Y") {
        handleAnswer(true);
      } else if (e.key === "n" || e.key === "N") {
        handleAnswer(false);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isPlaying, isComplete, handleAnswer]);

  const isThisComplete = false;
  const timerClass =
    timeLeft <= 3 ? "text-[color:var(--neon-pink)] animate-pulse" : timeLeft <= 7 ? "text-[color:var(--neon-pink)]" : "text-[color:var(--neon-cyan)]";

  if (isThisComplete) {
    return (
      <div className={`rounded-lg bg-black/60 border border-[color:var(--neon-green)] flex items-center justify-center ${compact ? "min-h-[245px] p-2" : "min-h-[230px] p-3"}`}>
        <div className="text-center text-[color:var(--neon-green)] font-bold">
          <div className="text-2xl mb-2">✅</div>
          <div>Hoàn thành!</div>
          <div className="text-xs text-[color:var(--text-muted)] mt-1">Đã ổn định tác vụ</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-black/60 border border-white/5 flex flex-col justify-between ${compact ? "min-h-[252.5px] p-2" : "min-h-[230px] p-3"}`}>
      {/* Timer */}
      <div className={`flex items-center justify-between w-full ${compact ? "mb-1" : "mb-2"}`}>
        <span className="font-mono text-xs text-[color:var(--text-muted)]">⏱</span>
        <span className={`font-mono text-sm font-bold ${timerClass}`}>{Math.ceil(timeLeft)}s</span>
      </div>

      {/* Word display */}
      <div
        className={`flex flex-col items-center justify-center ${compact ? "h-[125px]" : "h-[88px]"} border ${errorFlash ? "border-red-500/30" : "border-white/5"} bg-black/45 rounded-lg p-2 transition-colors`}
      >
        <div
          className={`${compact ? "text-6xl" : "text-4xl"} font-extrabold tracking-widest text-center filter drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]`}
          style={{ color: round.colorHex }}
        >
          {round.word}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => handleAnswer(true)}
          className={`bg-[color:var(--neon-green)]/90 hover:bg-[color:var(--neon-green)] text-black ${compact ? "min-h-11 text-sm" : "min-h-9 text-xs"} rounded-lg font-extrabold transition shadow-lg`}
        >
          [Y] ĐÚNG
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className={`bg-red-600 hover:bg-red-700 text-white ${compact ? "min-h-11 text-sm" : "min-h-9 text-xs"} rounded-lg font-extrabold transition shadow-lg`}
        >
          [N] SAI
        </button>
      </div>
    </div>
  );
}
