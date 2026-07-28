"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { soundSystem } from "./sound-system";
import { MAX_PER_GAME_SCORE } from "./types";

const DIRECTIONS = ["up", "down", "left", "right"] as const;
type Direction = (typeof DIRECTIONS)[number];

const OPPOSITES: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
const ARROWS: Record<Direction, string> = { up: "⬆️", down: "⬇️", left: "⬅️", right: "➡️" };

function getTimerDuration(level: number): number {
  return Math.max(18, 30 - (level - 1));
}

interface ArrowGameProps {
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

export default function ArrowGame({ compact = false, gameScore, isPlaying, isComplete, penaltyKey, errorFlash, onScore, onFail, onPenaltyReset, onLevelChange }: ArrowGameProps) {
  const arrowLevel = Math.max(1, gameScore + 1);
  const [currentDir, setCurrentDir] = useState<Direction>("up");
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const isCompleteRef = useRef(isComplete);
  const timedOutRef = useRef(false);

  // Sync refs after render
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isCompleteRef.current = isComplete;
  });

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = getTimerDuration(arrowLevel);
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
  }, [arrowLevel]);

  useEffect(() => {
    if (timeLeft > 0 || !timedOutRef.current || !isPlaying || isComplete) return;
    timedOutRef.current = false;
    onFail();
  }, [timeLeft, isPlaying, isComplete, onFail]);

  const pickRandom = () => {
    setCurrentDir(DIRECTIONS[Math.floor(Math.random() * 4)]);
  };

  // Initialize / restart timer
  useEffect(() => {
    if (isPlaying && !isComplete && gameScore < MAX_PER_GAME_SCORE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional init
      startTimer();
      pickRandom();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isComplete, gameScore, arrowLevel, penaltyKey, startTimer]);

  // Penalty reset
  useEffect(() => {
    if (penaltyKey > 0 && isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        pickRandom();
        startTimer();
        onPenaltyReset();
      }, 600);
    }
  }, [penaltyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Report per-game level to engine
  useEffect(() => {
    if (isPlaying && onLevelChange) onLevelChange(arrowLevel);
  }, [arrowLevel, isPlaying, onLevelChange]);

  const handleSelect = useCallback(
    (dir: Direction) => {
      if (!isPlaying || isComplete || gameScore >= MAX_PER_GAME_SCORE) return;

      const correct = OPPOSITES[currentDir];
      if (dir === correct) {
        soundSystem.arrowCorrect();
        onScore();
        pickRandom();
        const duration = getTimerDuration(arrowLevel);
        setTimeLeft(duration);
      } else {
        onFail();
      }
    },
    [isPlaying, isComplete, gameScore, currentDir, onScore, onFail, arrowLevel]
  );

  // Keyboard handler
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const handler = (e: KeyboardEvent) => {
      let direction: Direction | null = null;
      switch (e.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
      }
      if (direction) {
        e.preventDefault();
        handleSelect(direction);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isPlaying, isComplete, handleSelect]);

  const isThisComplete = isComplete || gameScore >= MAX_PER_GAME_SCORE;
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
    <div className={`rounded-lg bg-black/60 border border-white/5 flex flex-col justify-between ${compact ? "min-h-[245px] p-2" : "min-h-[230px] p-3"}`}>
      {/* Timer */}
      <div className={`flex items-center justify-between w-full ${compact ? "mb-1" : "mb-2"}`}>
        <span className="font-mono text-xs text-[color:var(--text-muted)]">⏱</span>
        <span className={`font-mono text-sm font-bold ${timerClass}`}>{Math.ceil(timeLeft)}s</span>
      </div>

      {/* Arrow display */}
      <div
        className={`flex flex-col items-center justify-center ${compact ? "h-[120px]" : "h-[95px]"} border ${errorFlash ? "border-red-500/30" : "border-white/5"} bg-black/45 rounded-lg p-2 transition-colors`}
      >
        <div className={`${compact ? "text-6xl mt-1" : "text-4xl mt-1"}`}>{ARROWS[currentDir]}</div>
      </div>

      {/* Arrow buttons */}
      <div className="flex flex-col items-center gap-1 mt-2">
        <div className="flex justify-center">
          <button
            onClick={() => handleSelect("up")}
            className={`bg-white/10 hover:bg-white/20 text-white ${compact ? "h-10 w-16 text-xl" : "h-8 w-12 text-base"} rounded-lg font-bold transition ${errorFlash ? "border border-red-500/50" : ""}`}
          >
            ▲
          </button>
        </div>
        <div className="flex justify-center gap-1">
          <button
            onClick={() => handleSelect("left")}
            className={`bg-white/10 hover:bg-white/20 text-white ${compact ? "h-10 w-16 text-xl" : "h-8 w-12 text-base"} rounded-lg font-bold transition ${errorFlash ? "border border-red-500/50" : ""}`}
          >
            ◀
          </button>
          <button
            onClick={() => handleSelect("down")}
            className={`bg-white/10 hover:bg-white/20 text-white ${compact ? "h-10 w-16 text-xl" : "h-8 w-12 text-base"} rounded-lg font-bold transition ${errorFlash ? "border border-red-500/50" : ""}`}
          >
            ▼
          </button>
          <button
            onClick={() => handleSelect("right")}
            className={`bg-white/10 hover:bg-white/20 text-white ${compact ? "h-10 w-16 text-xl" : "h-8 w-12 text-base"} rounded-lg font-bold transition ${errorFlash ? "border border-red-500/50" : ""}`}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
