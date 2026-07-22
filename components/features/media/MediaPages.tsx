"use client";

import { useState } from "react";
import Link from "next/link";
import { photos } from "@/libs/content/media";
import { EmptyAssetFrame } from "@/components/ui/EmptyAssetFrame";
import { NeonCard } from "@/components/ui/NeonCard";

const episodeDetails: Record<string, { title: string; desc: string; duration: string; views: string; rating: string }> = {
  "1": {
    title: "Tập 1: Cổng Dịch Chuyển Vô Hại",
    desc: "Một cú click chuột mở ra 15 tab mới. Phi hành gia bắt đầu lạc trôi giữa những luồng thông báo chat và quên đi deadline ban đầu.",
    duration: "02:15",
    views: "1,402 lượt xem",
    rating: "Đánh giá 9.2/10",
  },
  "2": {
    title: "Tập 2: Tín Hiệu Khẩn Cấp",
    desc: "Mọi task đều có độ ưu tiên cao nhất, tiếng chuông báo liên tục khiến nhịp tim và nhịp làm việc rơi vào hoảng loạn mất kiểm soát.",
    duration: "01:58",
    views: "1,120 lượt xem",
    rating: "Đánh giá 9.0/10",
  },
  "3": {
    title: "Tập 3: Ảo Ảnh Năng Suất",
    desc: "Khi bạn giải quyết hết tất cả các task phụ tinh tinh nhưng nhiệm vụ chính cốt lõi vẫn đứng yên trong màn sương thông báo.",
    duration: "03:02",
    views: "986 lượt xem",
    rating: "Đánh giá 9.4/10",
  },
};

export function MediaArchivePage() {
  return (
    <main id="main-content">
      {/* 1. Media Archive Hero */}
      <section className="cyber-grid relative isolate min-h-[600px] overflow-hidden px-5 py-20 md:px-10 lg:px-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-[color:var(--neon-cyan)]">
            / KHO MEDIA
          </p>
          <h1 className="neon-text font-[family-name:var(--font-heading)] text-5xl font-bold uppercase leading-none text-white md:text-7xl">
            KHO LƯU TRỮ VŨ TRỤ TASK VỤ
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[color:var(--text-muted)] md:text-lg">
            Tập hợp bộ ảnh, series Một Cú Task và phim ngắn của chiến dịch - nơi mọi tín hiệu đa nhiệm ảo được đóng gói thành hình ảnh, meme và câu chuyện dễ chia sẻ.
          </p>
        </div>

        {/* Hero Archive Stack Visuals */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-6">
          <div className="rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--surface)]/90 p-5 shadow-[0_0_24px_rgba(39,255,255,0.25)] min-w-[220px]">
            <p className="font-mono text-xs font-bold text-[color:var(--neon-cyan)]">PHOTOSHOOT</p>
            <div className="mt-4 h-1 w-full rounded bg-[color:var(--neon-cyan)]" />
          </div>
          <div className="rounded-lg border border-[color:var(--neon-purple)] bg-[color:var(--surface)]/90 p-5 shadow-[0_0_24px_rgba(130,0,255,0.25)] min-w-[220px]">
            <p className="font-mono text-xs font-bold text-[color:var(--neon-purple)]">SERIES</p>
            <div className="mt-4 h-1 w-full rounded bg-[color:var(--neon-purple)]" />
          </div>
          <div className="rounded-lg border border-[color:var(--neon-pink)] bg-[color:var(--surface)]/90 p-5 shadow-[0_0_24px_rgba(255,0,255,0.25)] min-w-[220px]">
            <p className="font-mono text-xs font-bold text-[color:var(--neon-pink)]">PHIM NGẮN</p>
            <div className="mt-4 h-1 w-full rounded bg-[color:var(--neon-pink)]" />
          </div>
        </div>
      </section>

      {/* 2. Media Archive Index */}
      <section className="px-5 py-20 md:px-10 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white md:text-5xl">
              Chọn khu vực lưu trữ
            </h2>
            <p className="text-base leading-7 text-[color:var(--text-muted)] md:text-lg">
              Kho Media gom các chất liệu hình ảnh của chiến dịch thành ba cổng nội dung chính: bộ ảnh, series và phim ngắn.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Photoshoot Card */}
            <NeonCard className="flex flex-col justify-between border-[color:var(--neon-cyan)]">
              <div>
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[color:var(--neon-cyan)] to-[color:var(--background)] p-4 min-h-[118px] flex items-end">
                  <span className="font-mono text-xs font-bold text-white">BỘ ẢNH</span>
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white">
                  BỘ ẢNH
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
                  Bộ ảnh đa nhiệm với visual xanh cyan, nhân vật và đạo cụ công nghệ.
                </p>
              </div>
              <Link
                href="/media-archive/photoshoot"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded border border-[color:var(--neon-cyan)] px-4 font-bold text-[color:var(--neon-cyan)] hover:bg-[rgba(39,255,255,0.1)]"
              >
                Mở bộ ảnh
              </Link>
            </NeonCard>

            {/* Series Card */}
            <NeonCard className="flex flex-col justify-between border-[color:var(--neon-purple)]">
              <div>
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[color:var(--neon-purple)] to-[color:var(--background)] p-4 min-h-[118px] flex items-end">
                  <span className="font-mono text-xs font-bold text-white">TẬP NGẮN</span>
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white">
                  SERIES MỘT CÚ TASK
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
                  Các tập nội dung ngắn về tình huống chạy deadline, đổi tab và tự trấn an.
                </p>
              </div>
              <Link
                href="/media-archive/series"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded border border-[color:var(--neon-purple)] px-4 font-bold text-[color:var(--neon-purple)] hover:bg-[rgba(130,0,255,0.1)]"
              >
                Xem series
              </Link>
            </NeonCard>

            {/* Short Film Card */}
            <NeonCard className="flex flex-col justify-between border-[color:var(--neon-pink)]">
              <div>
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[color:var(--neon-pink)] to-[color:var(--background)] p-4 min-h-[118px] flex items-end">
                  <span className="font-mono text-xs font-bold text-white">PHIM</span>
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white">
                  PHIM NGẮN
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
                  Không gian video cho câu chuyện đa nhiệm ảo được kể bằng nhịp nhanh, tương phản cao.
                </p>
              </div>
              <Link
                href="/media-archive/short-film"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded border border-[color:var(--neon-pink)] px-4 font-bold text-[color:var(--neon-pink)] hover:bg-[rgba(255,0,255,0.1)]"
              >
                Xem phim ngắn
              </Link>
            </NeonCard>
          </div>
        </div>
      </section>
    </main>
  );
}

export function PhotoshootPage() {
  const topRowPhotos = photos.slice(0, 4);
  const bottomRowPhotos = photos.slice(4);

  return (
    <main id="main-content" className="px-5 py-16 md:px-10 lg:px-24">
      <div className="mx-auto max-w-7xl relative">
        <Link
          href="/media-archive"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[color:var(--neon-cyan)] bg-transparent px-4 font-bold text-[color:var(--neon-cyan)] transition hover:bg-[rgba(39,255,255,0.1)]"
        >
          ← Quay lại
        </Link>
        <h1 className="mt-8 text-center font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-wide text-white md:text-5xl">
          PHOTOSHOOT
        </h1>
        <p className="mt-3 text-center text-sm text-[color:var(--text-muted)]">
          Ảo ảnh đa nhiệm
        </p>

        {/* Top Row: 4 column grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topRowPhotos.map((photo) => (
            <EmptyAssetFrame key={photo.id} asset={photo} />
          ))}
        </div>

        {/* Bottom Row: Wide photos */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {bottomRowPhotos.map((photo) => (
            <EmptyAssetFrame key={photo.id} asset={photo} className="w-full" />
          ))}
        </div>
      </div>
    </main>
  );
}

export function SeriesPage({ initialEpisode = "1" }: { initialEpisode?: string }) {
  const [activeEp, setActiveEp] = useState<string>(initialEpisode);
  const currentDetails = episodeDetails[activeEp] || episodeDetails["1"];
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <main id="main-content" className="px-5 py-16 md:px-10 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/media-archive"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[color:var(--neon-cyan)] bg-transparent px-4 font-bold text-[color:var(--neon-cyan)] transition hover:bg-[rgba(39,255,255,0.1)]"
        >
          ← Quay lại Media
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start">
          {/* Left Column: Cyberpunk Poster Frame */}
          <div className="relative overflow-hidden rounded-lg border-2 border-[color:var(--neon-cyan)] bg-[color:var(--surface)] p-8 shadow-[0_0_28px_rgba(39,255,255,0.3)] min-h-[460px] flex flex-col justify-between aspect-[3/4]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(39,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(130,0,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] to-transparent opacity-90" />
            <div className="relative z-10">
              <h2 className="neon-text font-[family-name:var(--font-heading)] text-5xl font-bold uppercase leading-none text-white">
                MỘT CÚ<br />TASK
              </h2>
            </div>
            <div className="relative z-10 self-center rounded-full bg-[color:var(--neon-cyan)] px-5 py-2 font-bold text-[color:var(--background)] text-sm shadow-[0_0_12px_rgba(39,255,255,0.6)]">
              Check var siêu năng lực multitask
            </div>
          </div>

          {/* Right Column: Episode Details and Player */}
          <div className="space-y-6">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--neon-pink)]">
              SERIES / MỘT CÚ TASK
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase text-white md:text-5xl">
              SERIES MỘT CÚ TASK
            </h1>

            {/* Mock Player Box */}
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black min-h-[300px] flex flex-col items-center justify-center p-6">
              {isPlaying ? (
                <div className="text-center space-y-4 z-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--neon-cyan)] border-t-transparent" />
                  <p className="font-mono text-sm text-[color:var(--neon-cyan)]">ĐANG PHÁT MOCK VIDEO {currentDetails.title.toUpperCase()}...</p>
                  <button onClick={() => setIsPlaying(false)} className="text-xs text-[color:var(--neon-pink)] underline">Dừng phát</button>
                </div>
              ) : (
                <div className="text-center space-y-4 z-10">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--neon-cyan)] text-black font-bold text-xl shadow-[0_0_24px_rgba(39,255,255,0.6)] transition hover:scale-110"
                    aria-label="Phát video"
                  >
                    ▶
                  </button>
                  <p className="text-sm text-[color:var(--text-muted)]">Nhấp để phát thử tập này</p>
                </div>
              )}
              <div className="absolute bottom-4 left-4 font-mono text-xs text-[color:var(--text-muted)]"> Thời lượng: {currentDetails.duration}</div>
            </div>

            {/* Info Text */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">{currentDetails.title}</h2>
              <p className="text-base leading-7 text-[color:var(--text-muted)]">{currentDetails.desc}</p>
            </div>

            {/* Episode Selector Buttons */}
            <div className="pt-4">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">Chọn tập phim</p>
              <div className="flex flex-wrap gap-3">
                {["1", "2", "3"].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setActiveEp(num);
                      setIsPlaying(false);
                    }}
                    className={`min-h-[44px] min-w-[80px] rounded border px-4 font-bold transition ${activeEp === num ? "border-[color:var(--neon-cyan)] bg-[rgba(39,255,255,0.14)] text-white shadow-[0_0_12px_rgba(39,255,255,0.2)]" : "border-white/10 text-[color:var(--text-muted)] hover:border-white/30"}`}
                  >
                    Tập {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function EpisodePage({ episode }: { episode: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentEp = episodeDetails[episode] || episodeDetails["1"];

  return (
    <main id="main-content" className="px-5 py-16 md:px-10 lg:px-24">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb Path */}
        <div className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--surface)]/80 px-4 font-mono text-xs font-bold text-[color:var(--text-muted)]">
          <Link href="/media-archive" className="hover:text-[color:var(--neon-cyan)]">Media Archive</Link>
          <span>/</span>
          <Link href="/media-archive/series" className="hover:text-[color:var(--neon-cyan)]">Series Một Cú Task</Link>
          <span>/</span>
          <span className="text-[color:var(--neon-cyan)]">Tập {episode}</span>
        </div>

        {/* Flex Anime Player */}
        <div className="relative overflow-hidden rounded-lg border border-[color:var(--neon-cyan)] bg-gradient-to-r from-black to-[color:var(--surface)] min-h-[500px] flex flex-col justify-between p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(39,255,255,0.08),transparent_70%)] pointer-events-none" />

          {/* Title */}
          <h2 className="text-xl font-bold uppercase tracking-wider text-[color:var(--neon-cyan)] z-10">
            TẬP {episode} — {currentEp.title.toUpperCase()}
          </h2>

          {/* Player Core */}
          <div className="my-10 flex flex-col items-center justify-center text-center z-10">
            {isPlaying ? (
              <div className="space-y-4">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[color:var(--neon-cyan)] border-t-transparent" />
                <p className="font-mono text-sm text-[color:var(--neon-cyan)]">ĐANG PHÁT MOCK VIDEO TẬP {episode}...</p>
                <button onClick={() => setIsPlaying(false)} className="text-xs text-[color:var(--neon-pink)] underline">Dừng phát</button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--neon-cyan)] text-black font-bold text-xl shadow-[0_0_28px_rgba(39,255,255,0.6)] transition hover:scale-110"
                >
                  ▶
                </button>
                <p className="text-sm text-[color:var(--text-muted)]">Nhấp để phát video</p>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded border border-[color:var(--neon-cyan)]/20 bg-black/80 px-4 py-3 z-10 text-sm font-mono text-white">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[color:var(--neon-cyan)]">
                {isPlaying ? "⏸ Tạm dừng" : "▶ Phát"}
              </button>
              <span>{isPlaying ? "00:03" : "00:00"} / {currentEp.duration}</span>
            </div>
            <div className="flex-1 max-w-md h-1.5 mx-4 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-[color:var(--neon-cyan)] transition-all duration-300" style={{ width: isPlaying ? "3%" : "0%" }} />
            </div>
            <div>🔊 Âm lượng</div>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {["Tập tiếp", "Tắt đèn", "Theo dõi", "Phóng to", "Autonext: Bật", "Chụp ảnh", "Tải về"].map((tool) => (
            <button key={tool} type="button" className="min-h-[44px] rounded border border-white/10 bg-[color:var(--surface)] px-4 text-xs font-bold text-[color:var(--text-muted)] transition hover:border-[color:var(--neon-cyan)] hover:text-white">
              {tool}
            </button>
          ))}
        </div>

        {/* Episode Shelf */}
        <div className="rounded-lg border border-white/10 bg-[color:var(--surface)] p-6 space-y-4">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)]">VŨ TRỤ TASK VỤ</p>
          <div className="flex flex-wrap gap-3">
            {["1", "2", "3"].map((idx) => (
              <Link
                key={idx}
                href={`/media-archive/series/${idx}`}
                className={`min-h-[48px] inline-flex items-center justify-center rounded px-5 font-bold transition ${episode === idx ? "bg-[color:var(--neon-pink)] text-white shadow-[0_0_16px_rgba(255,0,255,0.4)]" : "bg-white/5 text-[color:var(--text-muted)] hover:bg-white/10"}`}
              >
                Tập {idx}
              </Link>
            ))}
          </div>
        </div>

        {/* Description Banner */}
        <div className="grid gap-6 rounded-lg border border-[color:var(--neon-cyan)]/30 bg-gradient-to-r from-[color:var(--surface)] to-[color:var(--background)] p-6 md:grid-cols-[200px_1fr] items-start">
          <div className="relative overflow-hidden rounded bg-gradient-to-b from-[color:var(--neon-cyan)]/30 to-[color:var(--background)] aspect-[3/4] flex items-center justify-center border border-[color:var(--neon-cyan)]/50">
            <span className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white tracking-widest text-center">
              MỘT CÚ<br />TASK
            </span>
          </div>
          <div className="space-y-4">
            <h3 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[color:var(--neon-green)]">{currentEp.title}</h3>
            <p className="font-bold text-white text-lg">Series Một Cú Task</p>
            <p className="text-base leading-7 text-[color:var(--text-muted)]">{currentEp.desc}</p>

            {/* Meta statistics */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-white">
              <span className="bg-black/60 px-3 py-2 rounded border border-white/10">Thời lượng: {currentEp.duration}</span>
              <span className="bg-black/60 px-3 py-2 rounded border border-white/10">Năm: 2026</span>
              <span className="bg-black/60 px-3 py-2 rounded border border-white/10">{currentEp.views}</span>
              <span className="bg-black/60 px-3 py-2 rounded border border-white/10">{currentEp.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function ShortFilmPage() {
  const [activeTab, setActiveTab] = useState<"FULL" | "TEASER" | "HẬU TRƯỜNG">("FULL");
  const [isPlaying, setIsPlaying] = useState(false);

  const metaData = {
    "FULL": { time: "07:42", views: "1,557 lượt xem", rating: "Đánh giá 9.4/10" },
    "TEASER": { time: "01:15", views: "3,204 lượt xem", rating: "Đánh giá 9.0/10" },
    "HẬU TRƯỜNG": { time: "03:45", views: "948 lượt xem", rating: "Đánh giá 8.8/10" },
  };

  return (
    <main id="main-content" className="px-5 py-16 md:px-10 lg:px-24">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb Path */}
        <div className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--surface)]/80 px-4 font-mono text-xs font-bold text-[color:var(--text-muted)]">
          <Link href="/media-archive" className="hover:text-[color:var(--neon-cyan)]">Media Archive</Link>
          <span>/</span>
          <span className="text-white">Phim ngắn</span>
          <span>/</span>
          <span className="text-[color:var(--neon-cyan)]">Tín hiệu mất tập trung</span>
        </div>

        {/* Flex Anime Player */}
        <div className="relative overflow-hidden rounded-lg border border-[color:var(--neon-cyan)] bg-gradient-to-r from-black to-[color:var(--surface)] min-h-[500px] flex flex-col justify-between p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(39,255,255,0.08),transparent_70%)] pointer-events-none" />

          {/* Title */}
          <h2 className="text-xl font-bold uppercase tracking-wider text-[color:var(--neon-cyan)] z-10">
            {activeTab} — TÍN HIỆU MẤT TẬP TRUNG
          </h2>

          {/* Player Core */}
          <div className="my-10 flex flex-col items-center justify-center text-center z-10">
            {isPlaying ? (
              <div className="space-y-4">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[color:var(--neon-cyan)] border-t-transparent" />
                <p className="font-mono text-sm text-[color:var(--neon-cyan)]">ĐANG PHÁT BẢN {activeTab} CHÍNH THỨC...</p>
                <button onClick={() => setIsPlaying(false)} className="text-xs text-[color:var(--neon-pink)] underline">Dừng phát</button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--neon-cyan)] text-black font-bold text-xl shadow-[0_0_28px_rgba(39,255,255,0.6)] transition hover:scale-110"
                >
                  ▶
                </button>
                <p className="text-sm text-[color:var(--text-muted)]">Nhấp để phát video</p>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded border border-[color:var(--neon-cyan)]/20 bg-black/80 px-4 py-3 z-10 text-sm font-mono text-white">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[color:var(--neon-cyan)]">
                {isPlaying ? "⏸ Tạm dừng" : "▶ Phát"}
              </button>
              <span>{isPlaying ? "00:03" : "00:00"} / {metaData[activeTab].time}</span>
            </div>
            <div className="flex-1 max-w-md h-1.5 mx-4 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-[color:var(--neon-cyan)] transition-all duration-300" style={{ width: isPlaying ? "3%" : "0%" }} />
            </div>
            <div>🔊 Âm lượng</div>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {["Tập tiếp", "Tắt đèn", "Theo dõi", "Phóng to", "Autonext: Bật", "Chụp ảnh", "Tải về"].map((tool) => (
            <button key={tool} type="button" className="min-h-[44px] rounded border border-white/10 bg-[color:var(--surface)] px-4 text-xs font-bold text-[color:var(--text-muted)] transition hover:border-[color:var(--neon-cyan)] hover:text-white">
              {tool}
            </button>
          ))}
        </div>

        {/* Episode/Clip Shelf */}
        <div className="rounded-lg border border-white/10 bg-[color:var(--surface)] p-6 space-y-4">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)]">VŨ TRỤ TASK VỤ</p>
          <div className="flex flex-wrap gap-3">
            {(["FULL", "TEASER", "HẬU TRƯỜNG"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsPlaying(false);
                }}
                className={`min-h-[48px] rounded px-5 font-bold transition ${activeTab === tab ? "bg-[color:var(--neon-pink)] text-white shadow-[0_0_16px_rgba(255,0,255,0.4)]" : "bg-white/5 text-[color:var(--text-muted)] hover:bg-white/10"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Description Banner */}
        <div className="grid gap-6 rounded-lg border border-[color:var(--neon-cyan)]/30 bg-gradient-to-r from-[color:var(--surface)] to-[color:var(--background)] p-6 md:grid-cols-[200px_1fr] items-start">
          <div className="relative overflow-hidden rounded bg-gradient-to-b from-[color:var(--neon-cyan)]/30 to-[color:var(--background)] aspect-[3/4] flex items-center justify-center border border-[color:var(--neon-cyan)]/50">
            <span className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white tracking-widest text-center">
              PHIM<br />NGẮN
            </span>
          </div>
          <div className="space-y-4">
            <h3 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[color:var(--neon-green)]">Tín hiệu mất tập trung</h3>
            <p className="font-bold text-white text-lg">Phim ngắn - VŨ TRỤ TASK VỤ</p>
            <p className="text-base leading-7 text-[color:var(--text-muted)]">Một phim ngắn về khoảnh khắc người trẻ tưởng mình đang xử lý mọi thứ, cho đến khi các tác vụ bắt đầu kéo nhau lệch khỏi quỹ đạo.</p>

            {/* Meta statistics */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-white">
              <span className="bg-black/60 px-3 py-2 rounded border border-white/10">Thời lượng: {metaData[activeTab].time}</span>
              <span className="bg-black/60 px-3 py-2 rounded border border-white/10">Năm: 2026</span>
              <span className="bg-black/60 px-3 py-2 rounded border border-white/10">{metaData[activeTab].views}</span>
              <span className="bg-black/60 px-3 py-2 rounded border border-white/10">{metaData[activeTab].rating}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
