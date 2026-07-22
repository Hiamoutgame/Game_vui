"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GAME_NAMES, GAME_ICONS, MAX_PER_GAME_SCORE, VICTORY_LEVEL } from "./types";
import type { GameId, GameScores, GameFailures } from "./types";

interface GameSummaryProps {
  isOpen: boolean;
  isVictory: boolean | null;
  totalScore: number;
  totalFails: number;
  currentLevel: number;
  gameStartTime: number | null;
  gameScores: GameScores;
  gameFailures: GameFailures;
  activeGames: GameId[];
  onRestart: () => void;
  onClose: () => void;
}

function getInsight(activeCount: number, fails: number, isVictory: boolean | null) {
  if (isVictory) {
    if (activeCount >= 4) {
      return "Bạn vừa vận hành 4 vũ trụ cùng lúc. Cảm giác quá tải là có thật — mỗi lần đổi tác vụ, não bạn phải tải lại toàn bộ ngữ cảnh.";
    }
    return "Hệ thống ghi nhận: bạn giữ được nhịp ổn định qua các tác vụ. Nhưng hãy nhớ — đa nhiệm thật sự là ảo tưởng, đây chỉ là mô phỏng.";
  }
  if (fails > 10) {
    return "Tín hiệu quá tải được ghi nhận. Khi phải chuyển đổi quá nhiều, lỗi tăng lên. Hãy thử khóa một tác vụ 15 phút trước khi mở tác vụ tiếp theo.";
  }
  return "Mỗi lần chuyển tác vụ tiêu tốn năng lượng nhận thức. Càng ít tác vụ đồng thời, bạn càng xử lý chính xác hơn.";
}

export default function GameSummary({
  isOpen,
  isVictory,
  totalScore,
  totalFails,
  currentLevel,
  gameStartTime,
  gameScores,
  gameFailures,
  activeGames,
  onRestart,
  onClose,
}: GameSummaryProps) {
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional snapshot of current time on open
    if (isOpen) setNow(Date.now());
  }, [isOpen]);

  const maxTotal = activeGames.length * MAX_PER_GAME_SCORE;
  const elapsed = gameStartTime ? Math.floor((now - gameStartTime) / 1000) : 0;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const progressPercent = Math.max(0, parseFloat(((totalScore / maxTotal) * 100).toFixed(1)));
  const insight = getInsight(activeGames.length, totalFails, isVictory);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/75"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Kết quả nhiệm vụ"
    >
      <div className="bg-[color:var(--background)] border border-[color:var(--neon-cyan)]/40 rounded-2xl p-6 md:p-8 max-w-[460px] w-[92%] shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-center max-h-[90vh] overflow-y-auto">
        {/* Title */}
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white mb-1">
          {isVictory ? "🏆 Hệ thống đã ghi nhận kết quả" : "📊 Báo cáo đa nhiệm ảo"}
        </h2>
        <p className="text-sm text-[color:var(--text-muted)] mb-5">
          {isVictory ? "Bạn đã hoàn thành thử thách!" : "Kết quả mô phỏng của bạn"}
        </p>

        {/* Per-game scores */}
        <div className="space-y-2 mb-4">
          {activeGames.map((g) => {
            const score = gameScores[g] || 0;
            const complete = score >= MAX_PER_GAME_SCORE;
            const fails = gameFailures[g] || 0;
            return (
              <div
                key={g}
                className="flex items-center justify-between px-3 py-2 bg-[color:var(--surface)] rounded-lg text-sm"
              >
                <span className="font-bold text-white">
                  {GAME_ICONS[g]} {GAME_NAMES[g]}
                </span>
                <span className={complete ? "text-[color:var(--neon-green)] font-bold" : "text-[color:var(--neon-pink)] font-bold"}>
                  {score}/{MAX_PER_GAME_SCORE} {complete ? "✅" : ""}
                  {fails > 0 && (
                    <small className="text-[color:var(--text-muted)] ml-1">(-{fails})</small>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Total row */}
        <div className="flex justify-between px-3 py-3 bg-[color:var(--neon-blue)]/20 rounded-lg mb-3 font-bold text-white">
          <span>Tổng điểm</span>
          <span>
            {totalScore} / {maxTotal}
          </span>
        </div>

        {/* More stats */}
        <div className="text-left space-y-1 mb-4 text-sm">
          <p className="text-[color:var(--neon-pink)]">❌ Lỗi: {totalFails}</p>
          <p className="text-[color:var(--text-muted)]">
            ⏱ Thời gian: {mins}m {secs}s
          </p>
          <p className="text-[color:var(--neon-purple)] font-bold">
            📊 Cấp đạt được: {currentLevel} / {VICTORY_LEVEL}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="w-full h-6 bg-[color:var(--surface)] rounded-xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[color:var(--neon-cyan)] to-[color:var(--neon-green)] rounded-xl transition-all duration-1000 flex items-center justify-center text-black text-xs font-bold"
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent >= 10 ? `${progressPercent}%` : ""}
            </div>
          </div>
          <p className="text-sm font-bold text-[color:var(--text-muted)] mt-1">
            Tiến độ: {progressPercent}%
          </p>
        </div>

        {/* Insight */}
        <div className="rounded-lg border border-[color:var(--neon-cyan)]/30 bg-[color:var(--surface)] p-4 mb-5 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--neon-cyan)] mb-2">
            💡 Ghi nhận hệ thống
          </p>
          <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">{insight}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="min-h-12 rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--neon-blue)] text-white font-bold shadow-[0_0_20px_rgba(39,255,255,0.3)] hover:bg-[color:var(--neon-purple)] transition-all"
          >
            🔄 Chơi lại nhiệm vụ
          </button>
          <Link
            href="/information"
            className="min-h-12 inline-flex items-center justify-center rounded-lg border border-[color:var(--neon-cyan)]/50 bg-[color:var(--surface)] text-[color:var(--text-muted)] font-bold hover:border-[color:var(--neon-cyan)] hover:text-white transition"
          >
            📖 Đọc ghi chép về đa nhiệm
          </Link>
          <button
            onClick={onClose}
            className="min-h-12 rounded-lg border border-white/10 bg-transparent text-white/60 font-bold hover:text-white hover:bg-white/5 transition"
          >
            Quay về cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
