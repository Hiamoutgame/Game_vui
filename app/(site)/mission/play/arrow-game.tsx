"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { soundSystem } from "./sound-system";
import { MAX_PER_GAME_SCORE } from "./types";

const DIRECTIONS = ["up", "down", "left", "right"] as const;
type Direction = (typeof DIRECTIONS)[number];

const OPPOSITES: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
const ARROWS: Record<Direction, string> = { up: "⬆️", down: "⬇️", left: "⬅️", right: "➡️" };
const DIR_LABELS: Record<Direction, string> = { up: "↑ LÊN", down: "↓ XUỐNG", left: "← TRÁI", right: "→ PHẢI" };

function getTimerDuration(level: number): number {
  return Math.max(18, 30 - (level - 1));
}

interface ArrowGameProps {
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

export default function ArrowGame({ globalLevel, gameScore, isPlaying, isComplete, penaltyKey, errorFlash, onScore, onFail, onPenaltyReset }: ArrowGameProps) {
  const [currentDir, setCurrentDir] = useState<Direction>("up");
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
  }, [isPlaying, isComplete, gameScore, globalLevel, penaltyKey, startTimer]);

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

  const handleSelect = useCallback(
    (dir: Direction) => {
      if (!isPlaying || isComplete || gameScore >= MAX_PER_GAME_SCORE) return;

      const correct = OPPOSITES[currentDir];
      if (dir === correct) {
        soundSystem.arrowCorrect();
        onScore();
        pickRandom();
        const duration = getTimerDuration(globalLevel);
        setTimeLeft(duration);
      } else {
        onFail();
      }
    },
    [isPlaying, isComplete, gameScore, currentDir, onScore, onFail, globalLevel]
  );

  // Keyboard handler
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const handler = (e: KeyboardEvent) => {
      let direction: Direction | null = null;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          direction = "up";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          direction = "down";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          direction = "left";
          break;
        case "ArrowRight":
        case "d":
        case "D":
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

      {/* Arrow display */}
      <div
        className={`flex flex-col items-center justify-center h-[140px] border ${errorFlash ? "border-red-500/30" : "border-white/5"} bg-black/45 rounded-lg p-2 transition-colors`}
      >
        <p className="font-mono text-xs text-[color:var(--text-muted)] mb-2">ẤN HƯỚNG NGƯỢC LẠI:</p>
        <div className={`text-3xl font-extrabold tracking-wide ${errorFlash ? "text-red-500" : "text-white"}`}>
          {DIR_LABELS[currentDir]}
        </div>
        <div className="text-5xl mt-1">{ARROWS[currentDir]}</div>
      </div>

      {/* Arrow buttons */}
      <div className="flex flex-col items-center gap-1.5 mt-3">
        <div className="flex justify-center">
          <button
            onClick={() => handleSelect("up")}
            className={`bg-white/10 hover:bg-white/20 text-white h-10 w-16 rounded-lg font-bold text-lg transition ${errorFlash ? "border border-red-500/50" : ""}`}
          >
            ▲
          </button>
        </div>
        <div className="flex justify-center gap-1.5">
          <button
            onClick={() => handleSelect("left")}
            className={`bg-white/10 hover:bg-white/20 text-white h-10 w-16 rounded-lg font-bold text-lg transition ${errorFlash ? "border border-red-500/50" : ""}`}
          >
            ◀
          </button>
          <button
            onClick={() => handleSelect("down")}
            className={`bg-white/10 hover:bg-white/20 text-white h-10 w-16 rounded-lg font-bold text-lg transition ${errorFlash ? "border border-red-500/50" : ""}`}
          >
            ▼
          </button>
          <button
            onClick={() => handleSelect("right")}
            className={`bg-white/10 hover:bg-white/20 text-white h-10 w-16 rounded-lg font-bold text-lg transition ${errorFlash ? "border border-red-500/50" : ""}`}
          >
            ▶
          </button>
        </div>
      </div>

      <div className="text-center mt-2">
        <span className="font-mono text-[10px] text-[color:var(--text-muted)]">
          <kbd className="bg-[color:var(--surface)] px-1 rounded">↑↓←→</kbd> hoặc <kbd className="bg-[color:var(--surface)] px-1 rounded">WASD</kbd>
        </span>
      </div>
    </div>
  );
}
