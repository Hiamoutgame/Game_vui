"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { soundSystem } from "./sound-system";
import { MAX_PER_GAME_SCORE } from "./types";

interface BallGameProps {
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

function getFallTime(level: number): number {
  return Math.max(5, 10 - (level - 1) * 0.5);
}

export default function BallGame({ globalLevel, gameScore, isPlaying, isComplete, penaltyKey, errorFlash, onScore, onFail, onPenaltyReset }: BallGameProps) {
  const [ballPos, setBallPos] = useState({ x: 50, y: 0 });
  const [bucketPos, setBucketPos] = useState(50);
  const bucketPosRef = useRef(50);
  const areaRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef({ x: 50, y: 0 });
  const frameRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const isPressedRef = useRef(false);

  // Sync refs after render
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  });
  const lastXRef = useRef(0);
  const speedRef = useRef(1.5);

  const isThisComplete = isComplete || gameScore >= MAX_PER_GAME_SCORE;

  // Calculate speed based on level and container height
  const calcSpeed = useCallback(() => {
    if (!areaRef.current) return 1.5;
    const height = areaRef.current.offsetHeight;
    const fallTime = getFallTime(globalLevel);
    return height / (fallTime * 60);
  }, [globalLevel]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isThisComplete) return;

    speedRef.current = calcSpeed();

    const animate = () => {
      if (!isPlayingRef.current) return;

      ballRef.current.y += speedRef.current;
      setBallPos({ ...ballRef.current });

      if (!areaRef.current) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const areaHeight = areaRef.current.offsetHeight;
      const ballBottom = ballRef.current.y + 20;

      // Check collision at bucket level
      const bucketTop = areaHeight - 33;
      if (ballBottom >= bucketTop) {
        const ballLeft = ballRef.current.x;
        const bPos = bucketPosRef.current;
        // bucket width ~50px, map percentage to px
        const bucketLeftPx = (bPos / 100) * areaRef.current.offsetWidth - 25;
        const bucketRightPx = bucketLeftPx + 50;

        if (ballLeft + 20 > bucketLeftPx && ballLeft < bucketRightPx) {
          // Caught!
          soundSystem.ballCorrect();
          onScore();
          ballRef.current = { x: Math.random() * (areaRef.current.offsetWidth - 20), y: 0 };
          speedRef.current = calcSpeed();
        } else {
          // Missed
          onFail();
          ballRef.current = { x: Math.random() * (areaRef.current.offsetWidth - 20), y: 0 };
          speedRef.current = calcSpeed();
        }
      } else if (ballRef.current.y >= areaHeight - 20) {
        // Past bottom
        onFail();
        ballRef.current = { x: Math.random() * (areaRef.current.offsetWidth - 20), y: 0 };
        speedRef.current = calcSpeed();
      }

      setBallPos({ ...ballRef.current });
      frameRef.current = requestAnimationFrame(animate);
    };

    // Reset ball
    if (areaRef.current) {
      ballRef.current = { x: Math.random() * (areaRef.current.offsetWidth - 20), y: 0 };
    }
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isPlaying, isThisComplete, onScore, onFail, calcSpeed]);

  // Penalty reset
  useEffect(() => {
    if (penaltyKey > 0 && isPlaying) {
      setTimeout(onPenaltyReset, 600);
    }
  }, [penaltyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mouse/touch handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isPlaying) return;
      isPressedRef.current = true;
      if ("touches" in e) {
        lastXRef.current = e.touches[0].clientX;
      } else {
        lastXRef.current = e.clientX;
      }
    },
    [isPlaying]
  );

  useEffect(() => {
    if (!isPlaying || isThisComplete) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isPressedRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - lastXRef.current;
      lastXRef.current = clientX;

      if (Math.abs(deltaX) > 0 && areaRef.current) {
        const areaWidth = areaRef.current.offsetWidth;
        const pxPerPercent = areaWidth / 100;
        const deltaPercent = deltaX / pxPerPercent;
        const newPos = Math.max(8, Math.min(92, bucketPosRef.current + deltaPercent));
        bucketPosRef.current = newPos;
        setBucketPos(newPos);
      }
    };

    const handleUp = () => {
      isPressedRef.current = false;
    };

    // Keyboard controls
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") {
        const newPos = Math.max(8, bucketPosRef.current - 10);
        bucketPosRef.current = newPos;
        setBucketPos(newPos);
      } else if (e.key === "d" || e.key === "D") {
        const newPos = Math.min(92, bucketPosRef.current + 10);
        bucketPosRef.current = newPos;
        setBucketPos(newPos);
      }
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleMove, { passive: true });
    document.addEventListener("touchend", handleUp);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isPlaying, isThisComplete]);

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
      <div
        ref={areaRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        className={`relative border ${errorFlash ? "border-red-500/30" : "border-white/5"} bg-black/85 rounded-lg h-[210px] overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors`}
      >
        {/* Ball */}
        <div
          className={`absolute h-5 w-5 rounded-full ${
            errorFlash ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" : "bg-[color:var(--neon-pink)] shadow-[0_0_12px_rgba(255,0,255,0.8)]"
          } pointer-events-none transition-colors`}
          style={{ left: `${ballPos.x}px`, top: `${ballPos.y}px` }}
        />
        {/* Bucket */}
        <div
          className={`absolute bottom-3 h-4 w-20 rounded-full ${
            errorFlash ? "bg-red-400" : "bg-[color:var(--neon-cyan)] shadow-[0_0_12px_rgba(39,255,255,0.7)]"
          } pointer-events-none transition-colors`}
          style={{ left: `calc(${bucketPos}% - 40px)` }}
        />
      </div>
      <p className="text-xs text-[color:var(--text-muted)] text-center mt-2">
        Dùng phím <strong className="text-white">A / D</strong> hoặc <strong className="text-white">Nhấn giữ chuột & kéo</strong>
      </p>
    </div>
  );
}
