"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { soundSystem } from "./sound-system";
import { MAX_PER_GAME_SCORE } from "./types";

const EMOJIS = ["🎮","🎯","⭐","🔥","💎","🎪","🎭","🎨","🚀","🌙","🎵","🍀","🌈","🦊","🐼","🦄","🍕","⚡","🎁","🏆"];

interface GridConfig {
  pairs: number;
  cols: number;
  totalCards: number;
}

function getGridConfig(memLevel: number): GridConfig {
  if (memLevel <= 4)  return { pairs: 2, cols: 2, totalCards: 4 };
  if (memLevel <= 8)  return { pairs: 3, cols: 3, totalCards: 6 };
  if (memLevel <= 13) return { pairs: 4, cols: 3, totalCards: 8 };
  return { pairs: 5, cols: 3, totalCards: 10 };
}

function getTimerDuration(memLevel: number): number {
  return Math.max(25, 30 - (memLevel - 1) * 0.5);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const NUMPAD_POSITIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

interface MemoryGameProps {
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

export default function MemoryGame({ gameScore, isPlaying, isComplete, penaltyKey, errorFlash, onScore, onFail, onPenaltyReset }: MemoryGameProps) {
  const [memoryLevel, setMemoryLevel] = useState(1);
  const [cards, setCards] = useState<string[]>([]);
  const [gridConfig, setGridConfig] = useState<GridConfig>({ pairs: 2, cols: 2, totalCards: 4 });
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flippedPairRef = useRef<number[]>([]);
  const matchedCountRef = useRef(0);
  const isPlayingRef = useRef(isPlaying);
  const isCompleteRef = useRef(isComplete);

  // Sync refs after render
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isCompleteRef.current = isComplete;
  });

  const setup = useCallback(
    (memLevel: number) => {
      const config = getGridConfig(memLevel);
      setGridConfig(config);

      const shuffledEmojis = shuffleArray(EMOJIS);
      const picked = shuffledEmojis.slice(0, config.pairs);
      const cardData = shuffleArray([...picked, ...picked]);
      setCards(cardData);

      setFlippedIndices(new Set());
      setMatchedIndices(new Set());
      setLocked(false);
      flippedPairRef.current = [];
      matchedCountRef.current = 0;

      const duration = getTimerDuration(memLevel);
      setTimeLeft(duration);
    },
    []
  );

  // Initialize
  useEffect(() => {
    if (isPlaying) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional init on play start
      setMemoryLevel(1);
      setup(1);
    }
  }, [isPlaying, setup]);

  // Timer
  useEffect(() => {
    if (!isPlaying || isComplete) return;
    if (timerRef.current) clearInterval(timerRef.current);

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

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isComplete, onFail, memoryLevel]);

  // Penalty reset
  useEffect(() => {
    if (penaltyKey > 0 && isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        setMemoryLevel(1);
        setup(1);
        onPenaltyReset();
      }, 600);
    }
  }, [penaltyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle completion when score reaches max
  useEffect(() => {
    if (gameScore >= MAX_PER_GAME_SCORE && isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [gameScore, isPlaying]);

  const tryFlip = useCallback(
    (index: number) => {
      if (!isPlayingRef.current || isCompleteRef.current) return;
      if (locked) return;
      if (flippedIndices.has(index) || matchedIndices.has(index)) return;

      const newFlipped = new Set(flippedIndices);
      newFlipped.add(index);
      setFlippedIndices(newFlipped);

      flippedPairRef.current.push(index);

      if (flippedPairRef.current.length === 2) {
        setLocked(true);
        const [first, second] = flippedPairRef.current;

        if (cards[first] === cards[second]) {
          soundSystem.memoryCorrect();
          setTimeout(() => {
            const newMatched = new Set(matchedIndices);
            newMatched.add(first);
            newMatched.add(second);
            setMatchedIndices(newMatched);
            setFlippedIndices(new Set());
            flippedPairRef.current = [];
            setLocked(false);
            matchedCountRef.current++;

            onScore();

            if (matchedCountRef.current >= gridConfig.pairs) {
              if (gameScore + matchedCountRef.current >= MAX_PER_GAME_SCORE) {
                // Memory complete – will be handled by parent
              } else {
                setMemoryLevel((prev) => {
                  const next = Math.min(20, prev + 1);
                  setup(next);
                  return next;
                });
              }
            }
          }, 300);
        } else {
          soundSystem.wrong();
          setTimeout(() => {
            const newFlipped2 = new Set(flippedIndices);
            newFlipped2.delete(first);
            newFlipped2.delete(second);
            setFlippedIndices(newFlipped2);
            flippedPairRef.current = [];
            setLocked(false);
            onFail();
          }, 800);
        }
      }
    },
    [flippedIndices, matchedIndices, locked, cards, gridConfig.pairs, onScore, onFail, setup, gameScore]
  );

  // Keyboard handler
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const handler = (e: KeyboardEvent) => {
      let cardIndex: number | null = null;
      const code = e.code;

      if (code === "Numpad0" || code === "Digit0") {
        cardIndex = 9;
      } else if (code.startsWith("Numpad")) {
        const d = parseInt(code.slice(6));
        if (d >= 1 && d <= 9) cardIndex = d - 1;
      } else if (code.startsWith("Digit")) {
        const d = parseInt(code.slice(5));
        if (d >= 1 && d <= 9) cardIndex = d - 1;
      }

      if (cardIndex !== null && cardIndex < cards.length) {
        tryFlip(cardIndex);
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isPlaying, isComplete, cards.length, tryFlip]);

  const timerClass =
    timeLeft <= 3 ? "text-[color:var(--neon-pink)] animate-pulse" : timeLeft <= 10 ? "text-[color:var(--neon-pink)]" : "text-[color:var(--neon-cyan)]";

  const isThisComplete = isComplete || gameScore >= MAX_PER_GAME_SCORE;

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

  const CARD_SIZE = gridConfig.cols === 2 ? 80 : 76;

  return (
    <div className="rounded-lg bg-black/60 p-5 border border-white/5 min-h-[300px] flex flex-col items-center justify-center w-full">
      {/* Timer */}
      <div className="flex items-center justify-between w-full mb-4">
        <span className="font-mono text-xs text-[color:var(--text-muted)]">⏱</span>
        <span className={`font-mono text-sm font-bold ${timerClass}`}>{Math.ceil(timeLeft)}s</span>
      </div>

      {/* Card Grid */}
      <div
        className="grid gap-3 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridConfig.cols}, ${CARD_SIZE}px)`,
          gridTemplateRows: `repeat(${Math.ceil(gridConfig.totalCards / gridConfig.cols)}, ${CARD_SIZE}px)`,
        }}
      >
        {cards.map((emoji, idx) => {
          const isFlipped = flippedIndices.has(idx) || matchedIndices.has(idx);
          const isMatched = matchedIndices.has(idx);
          const label = idx < NUMPAD_POSITIONS.length ? NUMPAD_POSITIONS[idx] : idx + 1;
          const isCentered = gridConfig.totalCards === 10 && idx === 9;

          return (
            <div
              key={idx}
              className={`card-3d-container ${isCentered ? "col-start-2" : ""}`}
              style={{ width: CARD_SIZE, height: CARD_SIZE }}
              onClick={() => tryFlip(idx)}
            >
              <div
                className={`card-3d cursor-pointer ${isFlipped ? "flipped" : ""} ${
                  isMatched ? "opacity-0 scale-90 transition-all duration-500 pointer-events-none" : ""
                }`}
                style={{ width: CARD_SIZE, height: CARD_SIZE }}
              >
                {/* Front (face down) */}
                <div
                  className={`card-front border rounded-lg ${
                    errorFlash ? "border-red-500/40" : "border-[color:var(--neon-cyan)]/40"
                  } bg-gradient-to-br from-[#1b084e] to-[#09001f] flex flex-col items-center justify-center shadow-[inset_0_0_12px_rgba(39,255,255,0.1)] transition hover:border-[color:var(--neon-cyan)]`}
                  style={{ width: CARD_SIZE, height: CARD_SIZE }}
                >
                  <span className={`font-mono text-xs ${errorFlash ? "text-red-400" : "text-[color:var(--neon-cyan)]/70"}`}>
                    {label}
                  </span>
                  <span className={`font-mono text-xs mt-0.5 ${errorFlash ? "text-red-500" : "text-[color:var(--neon-cyan)]/50"}`}>
                    ?
                  </span>
                </div>
                {/* Back (flipped) */}
                <div
                  className="card-back border border-[color:var(--neon-pink)] rounded-lg bg-gradient-to-br from-[#370fff] to-[#8200ff] flex items-center justify-center shadow-[0_0_18px_rgba(255,0,255,0.4)]"
                  style={{ width: CARD_SIZE, height: CARD_SIZE }}
                >
                  <span className="text-2xl">{emoji}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[color:var(--text-muted)] mt-4 text-center">
        Phím <kbd className="bg-[color:var(--surface)] px-1 rounded text-[10px]">1-{gridConfig.totalCards}</kbd> / Numpad để lật
      </p>
    </div>
  );
}
