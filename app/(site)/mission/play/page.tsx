"use client";

import { useState, useCallback, useRef, Suspense, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./game-engine";
import MemoryGame from "./memory-game";
import BallGame from "./ball-game";
import WordGame from "./word-game";
import ArrowGame from "./arrow-game";
import GameDemo from "./game-demo";
import GameSummary from "./game-summary";
import { GAME_NAMES, GAME_NUMBERS, VICTORY_LEVEL } from "./types";
import type { GameId } from "./types";

function GamePlayContent() {
  const searchParams = useSearchParams();
  const taskQuery = searchParams.get("tasks");
  const demoParam = searchParams.get("demo");

  const activeTaskIds: GameId[] = useMemo(
    () =>
      taskQuery
        ? (taskQuery.split(",").filter((t): t is GameId => ["km", "ht", "nc", "px"].includes(t)))
        : ["km", "ht", "nc", "px"],
    [taskQuery]
  );

  const [engine, actions] = useGameEngine();

  // Demo mode
  const initialDemo = demoParam === "single" || demoParam === "multi" ? (demoParam as "single" | "multi") : null;
  const [demoMode, setDemoMode] = useState<"single" | "multi" | null>(initialDemo);

  // Per-game penalty keys (incremented on fail to trigger child reset)
  const [penaltyKeys, setPenaltyKeys] = useState<Record<GameId, number>>({ km: 0, ht: 0, nc: 0, px: 0 });

  // Error flash for HUD border
  const [errorFlash, setErrorFlash] = useState(false);

  // Summary
  const [showSummary, setShowSummary] = useState(false);

  // Track if game has been initialized
  const startedRef = useRef(false);

  const startGame = useCallback(() => {
    startedRef.current = true;
    if (demoMode === "multi") {
      actions.startGame(activeTaskIds, 4);
    } else {
      actions.startGame(activeTaskIds);
    }
    setShowSummary(false);
    setPenaltyKeys({ km: 0, ht: 0, nc: 0, px: 0 });
    setErrorFlash(false);
  }, [activeTaskIds, demoMode, actions]);

  // Auto-start if no demo
  useEffect(() => {
    if (!startedRef.current && !initialDemo) {
      startedRef.current = true;
      setTimeout(() => {
        if (demoMode === "multi") actions.startGame(activeTaskIds, 4);
        else actions.startGame(activeTaskIds);
      }, 0);
    }
  }, [initialDemo, demoMode, activeTaskIds, actions]);

  // Victory detection
  useEffect(() => {
    if (engine.victory && !showSummary && !engine.isPlaying) {
      const t = setTimeout(() => setShowSummary(true), 200);
      return () => clearTimeout(t);
    }
  }, [engine.victory, engine.isPlaying, showSummary]);

  // All active games maxed out
  const allComplete = activeTaskIds.every((g) => (engine.gameScores[g] || 0) >= 20);

  const handleDemoFinish = useCallback(() => {
    setDemoMode(null);
    if (demoMode === "single") {
      window.location.href = "/mission";
    } else {
      startGame();
    }
  }, [demoMode, startGame]);

  const handleScore = useCallback(
    (gameId: GameId) => actions.addScore(gameId),
    [actions]
  );

  const handleFail = useCallback(
    (gameId: GameId) => {
      setErrorFlash(true);
      setTimeout(() => setErrorFlash(false), 400);
      actions.penalizeGame(gameId);
      setPenaltyKeys((prev) => ({ ...prev, [gameId]: (prev[gameId] || 0) + 1 }));
    },
    [actions]
  );

  const handlePenaltyReset = useCallback(() => {
    // no-op — penalty flash handled by parent
  }, []);

  const handleEndGame = useCallback(() => {
    actions.endGame();
    setShowSummary(true);
  }, [actions]);

  const handleRestart = useCallback(() => {
    setShowSummary(false);
    startGame();
  }, [startGame]);

  const handleBackToConfig = useCallback(() => {
    setShowSummary(false);
    actions.resetGameState();
    startedRef.current = false;
    window.location.href = "/mission";
  }, [actions]);

  // Demo mode
  if (demoMode) {
    return (
      <main id="main-content" className="px-5 py-10 md:px-10 lg:px-24 min-h-[80vh] flex items-center justify-center">
        <GameDemo gameList={activeTaskIds} standalone={demoMode === "single"} isOpen={true} onFinish={handleDemoFinish} />
      </main>
    );
  }

  const isKm = activeTaskIds.includes("km");
  const isHt = activeTaskIds.includes("ht");
  const isNc = activeTaskIds.includes("nc");
  const isPx = activeTaskIds.includes("px");

  return (
    <main id="main-content" className="px-5 py-10 md:px-10 lg:px-24">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[color:var(--text-muted)]">
          <Link href="/mission" className="hover:text-[color:var(--neon-cyan)]">Nhiệm vụ hệ thống</Link>
          <span>/</span>
          <span>Đa nhiệm ảo</span>
          <span>/</span>
          <span className="text-[color:var(--neon-cyan)]">Đang chơi</span>
        </div>

        {/* HUD */}
        <div className={`flex flex-wrap items-center justify-between gap-6 rounded-lg border bg-[color:var(--surface)] p-6 transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" : "border-[color:var(--neon-cyan)] shadow-[0_0_24px_rgba(39,255,255,0.18)]"}`}>
          <div className="flex items-center gap-6 md:gap-10 flex-wrap">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--text-muted)]">Hiệu suất</p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">{engine.totalScore} XP</h2>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--text-muted)]">Cấp độ</p>
              <span className="inline-block bg-[color:var(--neon-purple)] text-white px-4 py-1 rounded-full font-bold text-sm">
                Cấp {engine.currentLevel}/{VICTORY_LEVEL}
              </span>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--text-muted)]">Đang xử lý</p>
              <h2 className={`font-[family-name:var(--font-heading)] text-2xl font-bold ${errorFlash ? "text-red-400" : "text-[color:var(--neon-cyan)]"}`}>
                {activeTaskIds.length}/4 TÁC VỤ
              </h2>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--text-muted)]">Gián đoạn</p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[color:var(--neon-pink)]">{engine.totalFails}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleEndGame} className="inline-flex min-h-11 items-center justify-center rounded border border-[color:var(--neon-pink)]/60 bg-transparent px-4 py-2 text-xs font-bold text-[color:var(--neon-pink)] hover:bg-[rgba(255,0,255,0.1)] transition">
              Kết thúc
            </button>
            <Link href="/mission" className="inline-flex min-h-11 items-center justify-center rounded border border-white/20 bg-transparent px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition">
              Thoát
            </Link>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[color:var(--neon-purple)]/60 bg-[color:var(--surface)] px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-white text-sm">
            <span className="text-[color:var(--neon-green)]">●</span>
            <span>{engine.isPlaying ? "Đang vận hành" : "Đã dừng"}: {activeTaskIds.length} tác vụ.</span>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[11px] text-[color:var(--text-muted)]">
            {isKm && <span>[Phím 1-9,0 / Numpad]: Lật bài</span>}
            {isHt && <span>[A/D hoặc Giữ chuột kéo]: Hứng tác vụ</span>}
            {isNc && <span>[Y]: Đúng / [N]: Sai</span>}
            {isPx && <span>[Mũi Tên / WASD]: Phản xạ ngược</span>}
          </div>
        </div>

        {/* Victory / Complete state */}
        {(engine.victory || allComplete || !engine.isPlaying && !showSummary) && (engine.victory || allComplete) ? (
          <div className="rounded-lg border border-[color:var(--neon-green)] bg-[rgba(57,255,20,0.06)] p-8 text-center max-w-2xl mx-auto space-y-6">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--neon-green)]">SIMULATION COMPLETE</p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white">Báo cáo đa nhiệm ảo</h2>
            <div className="text-left space-y-4 rounded bg-black/40 p-6 font-mono text-sm text-[color:var(--text-muted)]">
              <p>● Số tác vụ: <strong className="text-white">{activeTaskIds.length}/4</strong></p>
              <p>● Tổng XP: <strong className="text-white">{engine.totalScore} XP</strong></p>
              <p>● Phí tổn chú ý: <strong className="text-[color:var(--neon-pink)]">~{Math.min(90, activeTaskIds.length * 18)}% năng lực nhận thức</strong></p>
              <p>● Khuyên dùng: <strong className="text-[color:var(--neon-cyan)]">Khóa một tab 15 phút để hồi năng lượng.</strong></p>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={handleRestart} className="inline-flex min-h-11 items-center justify-center rounded bg-[color:var(--neon-cyan)] text-black px-6 font-bold hover:bg-[color:var(--neon-purple)] hover:text-white transition">Chơi lại</button>
              <Link href="/information" className="inline-flex min-h-11 items-center justify-center rounded border border-[color:var(--neon-cyan)]/50 px-6 font-bold text-[color:var(--text-muted)] hover:text-white transition">Đọc bài viết liên quan</Link>
            </div>
          </div>
        ) : (
          /* Game Grid */
          <div className="grid gap-6 md:grid-cols-2">
            {/* Panel 1: Memory */}
            {isKm && (
              <div className={`rounded-lg border-2 bg-[color:var(--surface)] p-5 flex flex-col justify-between min-h-[440px] transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]" : "border-[color:var(--neon-cyan)]/40 shadow-[0_0_24px_rgba(39,255,255,0.15)]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${errorFlash ? "text-red-400" : "text-[color:var(--neon-cyan)]"}`}>Tác vụ {GAME_NUMBERS.km}</span>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-base">{GAME_NAMES.km}</h3>
                  </div>
                  <div className={`rounded border ${engine.isPlaying ? (errorFlash ? "border-red-500 text-red-400" : "border-[color:var(--neon-cyan)] text-[color:var(--neon-cyan)] shadow-[0_0_10px_rgba(39,255,255,0.3)]") : "border-white/20 text-white/40"} bg-black px-3 py-1 font-mono text-xs`}>
                    {engine.isPlaying ? "ONLINE" : "OFFLINE"}
                  </div>
                </div>
                <MemoryGame
                  globalLevel={engine.currentLevel}
                  gameScore={engine.gameScores.km || 0}
                  isPlaying={engine.isPlaying && !engine.victory}
                  isComplete={actions.isGameComplete("km")}
                  penaltyKey={penaltyKeys.km}
                  errorFlash={errorFlash}
                  onScore={() => handleScore("km")}
                  onFail={() => handleFail("km")}
                  onPenaltyReset={() => handlePenaltyReset()}
                />
              </div>
            )}

            {/* Panel 2: Ball */}
            {isHt && (
              <div className={`rounded-lg border-2 bg-[color:var(--surface)] p-5 flex flex-col justify-between min-h-[440px] transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]" : "border-[color:var(--neon-pink)]/40 shadow-[0_0_24px_rgba(255,0,255,0.15)]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${errorFlash ? "text-red-400" : "text-[color:var(--neon-pink)]"}`}>Tác vụ {GAME_NUMBERS.ht}</span>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-base">{GAME_NAMES.ht}</h3>
                  </div>
                  <div className={`rounded border ${engine.isPlaying ? (errorFlash ? "border-red-500 text-red-400" : "border-[color:var(--neon-pink)] text-[color:var(--neon-pink)] shadow-[0_0_10px_rgba(255,0,255,0.3)]") : "border-white/20 text-white/40"} bg-black px-3 py-1 font-mono text-xs`}>
                    {engine.isPlaying ? "ONLINE" : "OFFLINE"}
                  </div>
                </div>
                <BallGame
                  globalLevel={engine.currentLevel}
                  gameScore={engine.gameScores.ht || 0}
                  isPlaying={engine.isPlaying && !engine.victory}
                  isComplete={actions.isGameComplete("ht")}
                  penaltyKey={penaltyKeys.ht}
                  errorFlash={errorFlash}
                  onScore={() => handleScore("ht")}
                  onFail={() => handleFail("ht")}
                  onPenaltyReset={() => handlePenaltyReset()}
                />
              </div>
            )}

            {/* Panel 3: Word/Stroop */}
            {isNc && (
              <div className={`rounded-lg border-2 bg-[color:var(--surface)] p-5 flex flex-col justify-between min-h-[440px] transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]" : "border-[color:var(--neon-cyan)]/40 shadow-[0_0_24px_rgba(39,255,255,0.15)]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${errorFlash ? "text-red-400" : "text-[color:var(--neon-cyan)]"}`}>Tác vụ {GAME_NUMBERS.nc}</span>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-base">{GAME_NAMES.nc}</h3>
                  </div>
                  <div className={`rounded border ${engine.isPlaying ? (errorFlash ? "border-red-500 text-red-400" : "border-[color:var(--neon-cyan)] text-[color:var(--neon-cyan)] shadow-[0_0_10px_rgba(39,255,255,0.3)]") : "border-white/20 text-white/40"} bg-black px-3 py-1 font-mono text-xs`}>
                    {engine.isPlaying ? "ONLINE" : "OFFLINE"}
                  </div>
                </div>
                <WordGame
                  globalLevel={engine.currentLevel}
                  gameScore={engine.gameScores.nc || 0}
                  isPlaying={engine.isPlaying && !engine.victory}
                  isComplete={actions.isGameComplete("nc")}
                  penaltyKey={penaltyKeys.nc}
                  errorFlash={errorFlash}
                  onScore={() => handleScore("nc")}
                  onFail={() => handleFail("nc")}
                  onPenaltyReset={() => handlePenaltyReset()}
                />
              </div>
            )}

            {/* Panel 4: Arrow */}
            {isPx && (
              <div className={`rounded-lg border-2 bg-[color:var(--surface)] p-5 flex flex-col justify-between min-h-[440px] transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]" : "border-[color:var(--neon-green)]/40 shadow-[0_0_24px_rgba(57,255,20,0.15)]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${errorFlash ? "text-red-400" : "text-[color:var(--neon-green)]"}`}>Tác vụ {GAME_NUMBERS.px}</span>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-base">{GAME_NAMES.px}</h3>
                  </div>
                  <div className={`rounded border ${engine.isPlaying ? (errorFlash ? "border-red-500 text-red-400" : "border-[color:var(--neon-green)] text-[color:var(--neon-green)] shadow-[0_0_10px_rgba(57,255,20,0.3)]") : "border-white/20 text-white/40"} bg-black px-3 py-1 font-mono text-xs`}>
                    {engine.isPlaying ? "ONLINE" : "OFFLINE"}
                  </div>
                </div>
                <ArrowGame
                  globalLevel={engine.currentLevel}
                  gameScore={engine.gameScores.px || 0}
                  isPlaying={engine.isPlaying && !engine.victory}
                  isComplete={actions.isGameComplete("px")}
                  penaltyKey={penaltyKeys.px}
                  errorFlash={errorFlash}
                  onScore={() => handleScore("px")}
                  onFail={() => handleFail("px")}
                  onPenaltyReset={() => handlePenaltyReset()}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Overlay */}
      <GameSummary
        isOpen={showSummary}
        isVictory={engine.victory}
        totalScore={engine.totalScore}
        totalFails={engine.totalFails}
        currentLevel={engine.currentLevel}
        gameStartTime={engine.gameStartTime}
        gameScores={engine.gameScores}
        gameFailures={engine.gameFailures}
        activeGames={activeTaskIds}
        onRestart={handleRestart}
        onClose={handleBackToConfig}
      />
    </main>
  );
}

export default function GamePlayPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-mono text-[color:var(--text-muted)]">Đang tải màn hình mô phỏng...</div>}>
      <GamePlayContent />
    </Suspense>
  );
}
