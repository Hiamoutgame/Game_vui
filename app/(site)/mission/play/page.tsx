"use client";

import { useState, useCallback, useRef, Suspense, useMemo, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGameEngine } from "./game-engine";
import MemoryGame from "./memory-game";
import BallGame from "./ball-game";
import WordGame from "./word-game";
import ArrowGame from "./arrow-game";
import GameDemo from "./game-demo";
import GameSummary from "./game-summary";
import { GAME_NAMES, GAME_NUMBERS, VICTORY_LEVEL, GAME_MAX_SCORES } from "./types";
import type { GameId } from "./types";
import { DistractionNotifications } from "@/components/ui/distraction-notifications";

function GamePlayContent() {
  const router = useRouter();
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
  const isMultiTrial = demoParam === "multi";
  const initialDemo = demoParam === "single" ? "single" : null;
  const [demoMode, setDemoMode] = useState<"single" | null>(initialDemo);

  // Per-game penalty keys (incremented on fail to trigger child reset)
  const [penaltyKeys, setPenaltyKeys] = useState<Record<GameId, number>>({ km: 0, ht: 0, nc: 0, px: 0 });

  // Error flash for HUD border
  const [errorFlash, setErrorFlash] = useState(false);

  // Summary
  const [showSummary, setShowSummary] = useState(false);
  const [expectedPercent, setExpectedPercent] = useState<number | null>(null);
  const [expectedPercentInput, setExpectedPercentInput] = useState("");

  // Track if game has been initialized
  const startedRef = useRef(false);

  const startGame = useCallback(() => {
    startedRef.current = true;
    if (isMultiTrial) {
      actions.startGame(activeTaskIds, 4);
    } else {
      actions.startGame(activeTaskIds);
    }
    setShowSummary(false);
    setPenaltyKeys({ km: 0, ht: 0, nc: 0, px: 0 });
    setErrorFlash(false);
  }, [activeTaskIds, isMultiTrial, actions]);

  // Auto-start if no demo
  useEffect(() => {
    if (!startedRef.current && !initialDemo) {
      if (!isMultiTrial) return;
      startedRef.current = true;
      setTimeout(() => {
        actions.startGame(activeTaskIds, 4);
      }, 0);
    }
  }, [initialDemo, isMultiTrial, activeTaskIds, actions]);

  // Victory detection
  useEffect(() => {
    if (isMultiTrial) return;
    if (engine.victory && !showSummary && !engine.isPlaying) {
      const t = setTimeout(() => setShowSummary(true), 200);
      return () => clearTimeout(t);
    }
  }, [engine.victory, engine.isPlaying, showSummary, isMultiTrial]);

  // All active games reached their own target score.
  const targetScore = isMultiTrial ? 4 : undefined;
  const allComplete = activeTaskIds.every((g) => (engine.gameScores[g] || 0) >= (targetScore ?? (GAME_MAX_SCORES[g] || 20)));


  useEffect(() => {
    if (isMultiTrial || !engine.isPlaying || showSummary || !allComplete) return;

    const timer = setTimeout(() => {
      actions.endGame();
      setShowSummary(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [actions, allComplete, engine.isPlaying, isMultiTrial, showSummary]);

  const handleDemoFinish = useCallback(() => {
    setDemoMode(null);
    router.replace("/mission");
  }, [router]);

  const handleExpectedPercentSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const parsedPercent = Number(expectedPercentInput);
      if (!Number.isFinite(parsedPercent) || parsedPercent < 0 || parsedPercent > 100) return;
      setExpectedPercent(Math.round(parsedPercent));
      startGame();
    },
    [expectedPercentInput, startGame]
  );

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

  const handleLevelChange = useCallback(
    (gameId: GameId, level: number) => {
      actions.setGameLevel(gameId, level);
    },
    [actions]
  );

  const handlePenaltyReset = useCallback(() => {
    // no-op — penalty flash handled by parent
  }, []);

  const handleEndGame = useCallback(() => {
    if (!allComplete) return;
    actions.endGame();
    setShowSummary(true);
  }, [actions, allComplete]);

  const handleBackHome = useCallback(() => {
    window.location.href = "/mission";
  }, []);

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
        <GameDemo gameList={activeTaskIds} standalone={true} isOpen={true} onFinish={handleDemoFinish} />
      </main>
    );
  }

  const shouldAskExpectedPercent = !isMultiTrial && expectedPercent === null && !engine.isPlaying && !engine.victory;
  const parsedExpectedPercent = Number(expectedPercentInput);
  const isExpectedPercentValid =
    expectedPercentInput.trim().length > 0 &&
    Number.isFinite(parsedExpectedPercent) &&
    parsedExpectedPercent >= 0 &&
    parsedExpectedPercent <= 100;

  if (shouldAskExpectedPercent) {
    return (
      <main id="main-content" className="px-5 py-10 md:px-10 lg:px-24 min-h-[80vh] flex items-center justify-center">
        <section className="w-full max-w-xl rounded-2xl border border-[color:var(--neon-cyan)]/50 bg-[color:var(--surface)] p-6 text-center shadow-[0_0_30px_rgba(39,255,255,0.16)]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">
            Khởi tạo nhiệm vụ
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
            Bạn nghĩ mình hoàn thành được bao nhiêu phần trăm?
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
            Nhập dự đoán ban đầu của bạn. Sau khi hoàn thành, hệ thống sẽ lấy tổng điểm trừ số lần sai để tính % thực tế và so sánh với dự đoán này.
          </p>

          <form onSubmit={handleExpectedPercentSubmit} className="mt-6 space-y-4">
            <label className="block text-left text-sm font-bold text-white" htmlFor="expected-percent">
              Dự đoán hoàn thành (%)
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/50 px-4 py-3 focus-within:border-[color:var(--neon-cyan)]">
              <input
                id="expected-percent"
                type="number"
                min={0}
                max={100}
                step={1}
                value={expectedPercentInput}
                onChange={(event) => setExpectedPercentInput(event.target.value)}
                placeholder="Ví dụ: 70"
                className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder:text-white/25"
                autoFocus
              />
              <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[color:var(--neon-cyan)]">%</span>
            </div>
            <button
              type="submit"
              disabled={!isExpectedPercentValid}
              className="min-h-12 w-full rounded-lg bg-[color:var(--neon-cyan)] px-6 font-bold text-black transition hover:bg-[color:var(--neon-purple)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              Bắt đầu nhiệm vụ
            </button>
          </form>
        </section>
      </main>
    );
  }

  const isKm = activeTaskIds.includes("km");
  const isHt = activeTaskIds.includes("ht");
  const isNc = activeTaskIds.includes("nc");
  const isPx = activeTaskIds.includes("px");
  const maxLevel = isMultiTrial ? 4 : VICTORY_LEVEL;
  const gameCount = activeTaskIds.length;
  const isDenseGrid = gameCount >= 3;
  const gameGridClass =
    gameCount === 2
      ? "grid gap-4 md:grid-cols-2 max-w-6xl mx-auto"
      : "grid gap-2 md:grid-cols-2 max-w-4xl mx-auto";
  const gameCardSizeClass = gameCount === 2 ? "p-4 min-h-[360px]" : "p-2 min-h-[310px]";
  const getCenteredThirdCardClass = (gameId: GameId) =>
    gameCount === 3 && activeTaskIds[2] === gameId
      ? "md:col-span-2 md:mx-auto md:w-full md:max-w-[calc(50%_-_0.5rem)]"
      : "";

  return (
    <main id="main-content" className={`px-4 md:px-6 lg:px-8 ${isDenseGrid ? "py-1" : "py-5"}`}>
      <div className={`mx-auto max-w-[1440px] ${isDenseGrid ? "space-y-1.5" : "space-y-3"}`}>
        {/* Breadcrumbs */}
        <div className={`${isDenseGrid ? "hidden" : "flex"} items-center gap-2 font-mono text-xs font-bold text-[color:var(--text-muted)]`}>
          <Link href="/mission" className="hover:text-[color:var(--neon-cyan)]">Nhiệm vụ hệ thống</Link>
          <span>/</span>
          <span>Đa nhiệm ảo</span>
          <span>/</span>
          <span className="text-[color:var(--neon-cyan)]">Đang chơi</span>
        </div>

        {/* HUD */}
        <div className={`flex flex-wrap items-center justify-between rounded-lg border bg-[color:var(--surface)] transition-all duration-200 ${isDenseGrid ? "gap-2 px-3 py-1.5" : "gap-3 px-4 py-3"} ${errorFlash ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" : "border-[color:var(--neon-cyan)] shadow-[0_0_24px_rgba(39,255,255,0.18)]"}`}>
          <div className={`flex items-center flex-wrap ${isDenseGrid ? "gap-3 md:gap-5" : "gap-4 md:gap-6"}`}>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--text-muted)]">Hiệu suất</p>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">{engine.totalScore} XP</h2>
            </div>
            {/* <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--text-muted)]">Điểm từng tác vụ</p>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {activeTaskIds.map((g) => (
                  <span key={g} className="inline-block border border-white/10 bg-black/35 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                    {GAME_NUMBERS[g]}: {getDisplayScore(g)}/{GAME_MAX_SCORES[g] || 20}
                  </span>
                ))}
              </div>
            </div> */}
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--text-muted)]">Đang xử lý</p>
              <h2 className={`font-[family-name:var(--font-heading)] text-xl font-bold ${errorFlash ? "text-red-400" : "text-[color:var(--neon-cyan)]"}`}>
                {activeTaskIds.length}/4 TÁC VỤ
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEndGame}
              disabled={!allComplete}
              className="inline-flex min-h-9 items-center justify-center rounded border border-[color:var(--neon-pink)]/60 bg-transparent px-3 py-1.5 text-xs font-bold text-[color:var(--neon-pink)] transition hover:bg-[rgba(255,0,255,0.1)] disabled:cursor-not-allowed disabled:border-white/15 disabled:text-white/35 disabled:hover:bg-transparent"
              title={allComplete ? "Kết thúc nhiệm vụ" : "Cần đạt điểm tối đa ở tất cả tác vụ"}
            >
              Kết thúc
            </button>
            <button
              onClick={handleBackHome}
              disabled={!allComplete}
              className="inline-flex min-h-9 items-center justify-center rounded border border-white/20 bg-transparent px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/35 disabled:hover:bg-transparent"
              title={allComplete ? "Thoát nhiệm vụ" : "Cần đạt điểm tối đa ở tất cả tác vụ"}
            >
              Thoát
            </button>
          </div>
        </div>
        {/* Game Grid */}
        <div className={gameGridClass}>
          {/* Panel 1: Memory */}
          {isKm && (
            <div className={`rounded-lg border-2 bg-[color:var(--surface)] ${gameCardSizeClass} ${getCenteredThirdCardClass("km")} flex flex-col justify-between transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]" : "border-[color:var(--neon-cyan)]/40 shadow-[0_0_24px_rgba(39,255,255,0.15)]"}`}>
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex flex-col">
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${errorFlash ? "text-red-400" : "text-[color:var(--neon-cyan)]"}`}>Tác vụ {GAME_NUMBERS.km}</span>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-sm">{GAME_NAMES.km}</h3>
                </div>
                <div className={`rounded border ${engine.isPlaying ? (errorFlash ? "border-red-500 text-red-400" : "border-[color:var(--neon-cyan)] text-[color:var(--neon-cyan)] shadow-[0_0_10px_rgba(39,255,255,0.3)]") : "border-white/20 text-white/40"} bg-black px-2 py-0.5 font-mono text-[10px]`}>
                  {engine.isPlaying ? "ONLINE" : "OFFLINE"}
                </div>
              </div>
              <MemoryGame
                compact={isDenseGrid}
                globalLevel={engine.currentLevel}
                gameScore={engine.gameScores.km || 0}
                isPlaying={engine.isPlaying && !engine.victory}
                isComplete={actions.isGameComplete("km")}
                penaltyKey={penaltyKeys.km}
                errorFlash={errorFlash}
                onScore={() => handleScore("km")}
                onFail={() => handleFail("km")}
                onPenaltyReset={() => handlePenaltyReset()}
                onLevelChange={(lvl) => handleLevelChange("km", lvl)}
              />
            </div>
          )}

          {/* Panel 2: Ball */}
          {isHt && (
            <div className={`rounded-lg border-2 bg-[color:var(--surface)] ${gameCardSizeClass} ${getCenteredThirdCardClass("ht")} flex flex-col justify-between transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]" : "border-[color:var(--neon-pink)]/40 shadow-[0_0_24px_rgba(255,0,255,0.15)]"}`}>
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex flex-col">
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${errorFlash ? "text-red-400" : "text-[color:var(--neon-pink)]"}`}>Tác vụ {GAME_NUMBERS.ht}</span>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-sm">{GAME_NAMES.ht}</h3>
                </div>
                <div className={`rounded border ${engine.isPlaying ? (errorFlash ? "border-red-500 text-red-400" : "border-[color:var(--neon-pink)] text-[color:var(--neon-pink)] shadow-[0_0_10px_rgba(255,0,255,0.3)]") : "border-white/20 text-white/40"} bg-black px-2 py-0.5 font-mono text-[10px]`}>
                  {engine.isPlaying ? "ONLINE" : "OFFLINE"}
                </div>
              </div>
              <BallGame
                compact={isDenseGrid}
                gameScore={engine.gameScores.ht || 0}
                isPlaying={engine.isPlaying && !engine.victory}
                isComplete={actions.isGameComplete("ht")}
                penaltyKey={penaltyKeys.ht}
                errorFlash={errorFlash}
                onScore={() => handleScore("ht")}
                onFail={() => handleFail("ht")}
                onPenaltyReset={() => handlePenaltyReset()}
                onLevelChange={(lvl) => handleLevelChange("ht", lvl)}
              />
            </div>
          )}

          {/* Panel 3: Word/Stroop */}
          {isNc && (
            <div className={`rounded-lg border-2 bg-[color:var(--surface)] ${gameCardSizeClass} ${getCenteredThirdCardClass("nc")} flex flex-col justify-between transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]" : "border-[color:var(--neon-cyan)]/40 shadow-[0_0_24px_rgba(39,255,255,0.15)]"}`}>
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex flex-col">
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${errorFlash ? "text-red-400" : "text-[color:var(--neon-cyan)]"}`}>Tác vụ {GAME_NUMBERS.nc}</span>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-sm">{GAME_NAMES.nc}</h3>
                </div>
                <div className={`rounded border ${engine.isPlaying ? (errorFlash ? "border-red-500 text-red-400" : "border-[color:var(--neon-cyan)] text-[color:var(--neon-cyan)] shadow-[0_0_10px_rgba(39,255,255,0.3)]") : "border-white/20 text-white/40"} bg-black px-2 py-0.5 font-mono text-[10px]`}>
                  {engine.isPlaying ? "ONLINE" : "OFFLINE"}
                </div>
              </div>
              <WordGame
                compact={isDenseGrid}
                gameScore={engine.gameScores.nc || 0}
                isPlaying={engine.isPlaying && !engine.victory}
                isComplete={actions.isGameComplete("nc")}
                penaltyKey={penaltyKeys.nc}
                errorFlash={errorFlash}
                onScore={() => handleScore("nc")}
                onFail={() => handleFail("nc")}
                onPenaltyReset={() => handlePenaltyReset()}
                onLevelChange={(lvl) => handleLevelChange("nc", lvl)}
              />
            </div>
          )}

          {/* Panel 4: Arrow */}
          {isPx && (
            <div className={`rounded-lg border-2 bg-[color:var(--surface)] ${gameCardSizeClass} ${getCenteredThirdCardClass("px")} flex flex-col justify-between transition-all duration-200 ${errorFlash ? "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.3)]" : "border-[color:var(--neon-green)]/40 shadow-[0_0_24px_rgba(57,255,20,0.15)]"}`}>
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex flex-col">
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${errorFlash ? "text-red-400" : "text-[color:var(--neon-green)]"}`}>Tác vụ {GAME_NUMBERS.px}</span>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-white text-sm">{GAME_NAMES.px}</h3>
                </div>
                <div className={`rounded border ${engine.isPlaying ? (errorFlash ? "border-red-500 text-red-400" : "border-[color:var(--neon-green)] text-[color:var(--neon-green)] shadow-[0_0_10px_rgba(57,255,20,0.3)]") : "border-white/20 text-white/40"} bg-black px-2 py-0.5 font-mono text-[10px]`}>
                  {engine.isPlaying ? "ONLINE" : "OFFLINE"}
                </div>
              </div>
              <ArrowGame
                compact={isDenseGrid}
                gameScore={engine.gameScores.px || 0}
                isPlaying={engine.isPlaying && !engine.victory}
                isComplete={actions.isGameComplete("px")}
                penaltyKey={penaltyKeys.px}
                errorFlash={errorFlash}
                onScore={() => handleScore("px")}
                onFail={() => handleFail("px")}
                onPenaltyReset={() => handlePenaltyReset()}
                onLevelChange={(lvl) => handleLevelChange("px", lvl)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary Overlay */}
      <GameSummary
        isOpen={showSummary && !isMultiTrial}
        isVictory={engine.victory}
        totalScore={engine.totalScore}
        totalFails={engine.totalFails}
        currentLevel={engine.currentLevel}
        maxLevel={maxLevel}
        gameStartTime={engine.gameStartTime}
        gameScores={engine.gameScores}
        gameFailures={engine.gameFailures}
        gameLevels={engine.gameLevels}
        activeGames={activeTaskIds}
        expectedPercent={expectedPercent}
        onBackHome={handleBackHome}
        onClose={handleBackToConfig}
      />
      {engine.isPlaying && !engine.victory && <DistractionNotifications />}
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
