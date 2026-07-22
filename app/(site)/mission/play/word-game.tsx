"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { soundSystem } from "./sound-system";
import { MAX_PER_GAME_SCORE } from "./types";

const WORDS = ["RED", "BLUE", "GREEN", "YELLOW", "ORANGE", "PURPLE", "PINK", "BLACK", "WHITE", "BROWN"];
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
  word: "RED",
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
  globalLevel: number;
  gameScore: number;
  isPlaying: boolean;
  isComplete: boolean;
  penaltyKey: number;
  errorFlash: boolean;
  onScore: () => void;
  onFail: () => void;
  onPenaltyReset: () => void;
}

export default function WordGame({ globalLevel, gameScore, isPlaying, isComplete, penaltyKey, errorFlash, onScore, onFail, onPenaltyReset }: WordGameProps) {
  const [round, setRound] = useState<StroopRound>(INITIAL_ROUND);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const isCompleteRef = useRef(isComplete);

  // Sync refs after render
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isCompleteRef.current = isComplete;
  });

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = getTimerDuration(globalLevel);
    setTimeLeft(duration);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (isPlayingRef.current && !isCompleteRef.current) {
            onFail();
          }
          return 0;
        }
        if (next <= 3 && next > 0 && isPlayingRef.current) {
          soundSystem.countdownBeep();
        }
        return next;
      });
    }, 1000);
  }, [globalLevel, onFail]);

  // Initialize / restart timer on level change
  useEffect(() => {
    if (isPlaying && !isComplete && gameScore < MAX_PER_GAME_SCORE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional init
      startTimer();
      setRound(generateRound());
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isComplete, gameScore, globalLevel, penaltyKey, startTimer]);

  // Penalty reset
  useEffect(() => {
    if (penaltyKey > 0 && isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        setRound(generateRound());
        startTimer();
        onPenaltyReset();
      }, 600);
    }
  }, [penaltyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback(
    (playerSaidYes: boolean) => {
      if (!isPlaying || isComplete || gameScore >= MAX_PER_GAME_SCORE) return;

      if (playerSaidYes === round.correctAnswer) {
        soundSystem.wordCorrect();
        onScore();
        // Generate new round + reset timer
        setRound(generateRound());
        const duration = getTimerDuration(globalLevel);
        setTimeLeft(duration);
      } else {
        onFail();
        // Timer stopped via parent
      }
    },
    [isPlaying, isComplete, gameScore, round, onScore, onFail, globalLevel]
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

  const isThisComplete = isComplete || gameScore >= MAX_PER_GAME_SCORE;
  const timerClass =
    timeLeft <= 3 ? "text-[color:var(--neon-pink)] animate-pulse" : timeLeft <= 7 ? "text-[color:var(--neon-pink)]" : "text-[color:var(--neon-cyan)]";

  if (isThisComplete) {
    return (
      <div className="rounded-lg bg-black/60 p-5 border border-[color:var(--neon-green)] flex items-center justify-center min-h-[300px]">
        <div className="text-center text-[color:var(--neon-green)] font-bold">
          <div className="text-2xl mb-2">✅</div>
          <div>Hoàn thành!</div>
          <div className="text-xs text-[color:var(--text-muted)] mt-1">Đã ổn định tác vụ</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-black/60 p-5 border border-white/5 min-h-[300px] flex flex-col justify-between">
      {/* Timer */}
      <div className="flex items-center justify-between w-full mb-3">
        <span className="font-mono text-xs text-[color:var(--text-muted)]">⏱</span>
        <span className={`font-mono text-sm font-bold ${timerClass}`}>{Math.ceil(timeLeft)}s</span>
      </div>

      {/* Word display */}
      <div
        className={`flex flex-col items-center justify-center h-[140px] border ${errorFlash ? "border-red-500/30" : "border-white/5"} bg-black/45 rounded-lg p-2 transition-colors`}
      >
        <p className="font-mono text-xs text-[color:var(--text-muted)] mb-3">
          MÀU CHỮ VÀ NGHĨA CÓ TRÙNG NHAU?
        </p>
        <div
          className="text-4xl font-extrabold tracking-widest text-center filter drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]"
          style={{ color: round.colorHex }}
        >
          {round.word}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-3">
        <button
          onClick={() => handleAnswer(true)}
          className="bg-[color:var(--neon-green)]/90 hover:bg-[color:var(--neon-green)] text-black min-h-[46px] rounded-lg text-sm font-extrabold transition shadow-lg"
        >
          [Y] ĐÚNG
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="bg-red-600 hover:bg-red-700 text-white min-h-[46px] rounded-lg text-sm font-extrabold transition shadow-lg"
        >
          [N] SAI
        </button>
      </div>
    </div>
  );
}
