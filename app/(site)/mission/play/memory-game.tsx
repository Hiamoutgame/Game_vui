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
  if (memLevel < 10) return { pairs: 2, cols: 2, totalCards: 4 };
  if (memLevel < 17) return { pairs: 3, cols: 3, totalCards: 6 };
  return { pairs: 4, cols: 3, totalCards: 8 };
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
  compact?: boolean;
  globalLevel: number;
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

export default function MemoryGame({ compact = false, globalLevel: _globalLevel, gameScore, isPlaying, isComplete, penaltyKey, errorFlash, onScore, onFail, onPenaltyReset, onLevelChange }: MemoryGameProps) {
  void _globalLevel;
  const [memoryProgressLevel, setMemoryProgressLevel] = useState(1);
  const [cards, setCards] = useState<string[]>([]);
  const [gridConfig, setGridConfig] = useState<GridConfig>({ pairs: 2, cols: 2, totalCards: 4 });
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flippedPairRef = useRef<number[]>([]);
  const matchedCountRef = useRef(0);
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
      timedOutRef.current = false;
      setTimeLeft(duration);
    },
    []
  );

  // Initialize card set only when play state starts or restarts
  useEffect(() => {
    if (!isPlaying) {
      wasPlayingRef.current = false;
      return;
    }

    if (!wasPlayingRef.current) {
      setup(1);
      setMemoryProgressLevel(1);
    }
    wasPlayingRef.current = true;
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

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isComplete, timerResetKey]);

  useEffect(() => {
    if (timeLeft > 0 || !timedOutRef.current || !isPlaying || isComplete) return;
    timedOutRef.current = false;
    const nextLevel = memoryProgressLevel + 1;
    setMemoryProgressLevel(nextLevel);
    setup(nextLevel);
    if (gameScoreRef.current < MAX_PER_GAME_SCORE) onFail();
  }, [timeLeft, isPlaying, isComplete, memoryProgressLevel, setup, onFail]);

  // Penalty reset
  useEffect(() => {
    if (penaltyKey > 0 && isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        setFlippedIndices(new Set());
        setLocked(false);
        flippedPairRef.current = [];
        setTimeLeft(getTimerDuration(memoryProgressLevel));
        setTimerResetKey((value) => value + 1);
        onPenaltyReset();
      }, 600);
    }
  }, [penaltyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Report per-game level to engine
  useEffect(() => {
    if (isPlaying && onLevelChange) onLevelChange(memoryProgressLevel);
  }, [memoryProgressLevel, isPlaying, onLevelChange]);

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

            if (matchedCountRef.current >= gridConfig.pairs) {
              if (gameScoreRef.current < MAX_PER_GAME_SCORE) onScore();
              const nextLevel = memoryProgressLevel + 1;
              setMemoryProgressLevel(nextLevel);
              setup(nextLevel);
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
          }, 800);
        }
      }
    },
    [flippedIndices, matchedIndices, locked, cards, gridConfig.pairs, onScore, setup, memoryProgressLevel]
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

  const isThisComplete = false;

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

  const CARD_SIZE = compact ? (gridConfig.cols === 2 ? 76 : 64) : gridConfig.cols === 2 ? 64 : 56;

  return (
    <div className={`rounded-lg bg-black/60 border border-white/5 flex flex-col items-center justify-between w-full ${compact ? "min-h-[245px] p-2" : "min-h-[230px] p-3"}`}>
      {/* Timer */}
      <div className={`flex items-center justify-between w-full ${compact ? "mb-1" : "mb-2"}`}>
        <span className="font-mono text-xs text-[color:var(--text-muted)]">⏱</span>
        <span className={`font-mono text-sm font-bold ${timerClass}`}>{Math.ceil(timeLeft)}s</span>
      </div>

      {/* Card Grid */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className={`grid mx-auto ${compact ? "gap-1.5" : "gap-2"}`}
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
                    <span className={`font-mono ${compact ? "text-base" : "text-xs"} ${errorFlash ? "text-red-400" : "text-[color:var(--neon-cyan)]/70"}`}>
                      {label}
                    </span>
                    <span className={`font-mono ${compact ? "text-base" : "text-xs"} mt-0.5 ${errorFlash ? "text-red-500" : "text-[color:var(--neon-cyan)]/50"}`}>
                      ?
                    </span>
                  </div>
                  {/* Back (flipped) */}
                  <div
                    className="card-back border border-[color:var(--neon-pink)] rounded-lg bg-gradient-to-br from-[#370fff] to-[#8200ff] flex items-center justify-center shadow-[0_0_18px_rgba(255,0,255,0.4)]"
                    style={{ width: CARD_SIZE, height: CARD_SIZE }}
                  >
                    <span className={compact ? "text-3xl" : "text-xl"}>{emoji}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-[color:var(--text-muted)] text-center">
        Phím <kbd className="bg-[color:var(--surface)] px-1 rounded text-[10px]">1-{gridConfig.totalCards}</kbd> / Numpad để lật
      </p>
    </div>
  );
}
