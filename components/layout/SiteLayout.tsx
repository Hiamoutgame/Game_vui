"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/libs/navigation";
import { site } from "@/libs/content/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[color:var(--neon-cyan)] bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue))] shadow-[0_0_22px_rgba(130,0,255,0.55)]">
      <div className="mx-auto flex min-h-[84px] max-w-7xl items-center justify-between gap-6 px-5 md:px-10 lg:px-[72px]">
        <Link className="rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]" href="/" onClick={() => setOpen(false)}>

          <Image src="/logo-vttv.png" alt="Vũ Trụ Task Vụ" width={191} height={100} className="h-12 w-auto" priority />

        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="min-h-11 rounded px-1 py-3 text-sm font-bold text-white transition hover:text-[color:var(--neon-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded border border-[color:rgba(39,255,255,0.45)] lg:hidden"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Mở menu</span>
          <span className="h-0.5 w-6 rounded bg-[color:var(--neon-cyan)]" />
          <span className="h-0.5 w-6 rounded bg-[color:var(--neon-cyan)]" />
          <span className="h-0.5 w-6 rounded bg-[color:var(--neon-cyan)]" />
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-[color:rgba(39,255,255,0.35)] bg-[color:var(--background)] px-5 py-4 lg:hidden" aria-label="Điều hướng mobile">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded px-3 py-3 font-bold text-white hover:bg-white/10" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/mission/play") {
    return null;
  }

  return (
    <footer className="relative overflow-hidden border-t border-[color:rgba(39,255,255,0.35)] bg-[linear-gradient(180deg,#0c0228_0%,var(--background)_100%)] px-5 py-14 md:px-10 lg:px-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(39,255,255,0.035)_1px,transparent_1px),linear-gradient(rgba(130,0,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1.25fr_0.9fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="inline-flex rounded transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
          >
            <Image src="/logo-vttv.png" alt="Vũ Trụ Task Vụ" width={191} height={100} className="h-10 w-auto" priority />
          </Link>
          <p className="mt-5 font-[family-name:var(--font-heading)] text-base font-bold text-white">{site.tagline}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--text-muted)]">{site.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--neon-cyan)]">
            <span className="rounded border border-[color:rgba(39,255,255,0.28)] bg-[color:rgba(39,255,255,0.06)] px-3 py-2">18–24 tuổi</span>
            <span className="rounded border border-[color:rgba(39,255,255,0.28)] bg-[color:rgba(39,255,255,0.06)] px-3 py-2">TP.HCM</span>
          </div>
        </div>

        <nav aria-label="Điều hướng cuối trang">
          <h2 className="font-[family-name:var(--font-heading)] text-base font-bold uppercase tracking-[0.16em] text-white">Điều hướng</h2>
          <div className="mt-5 grid gap-1">
            <Link href="/" className="inline-flex min-h-10 items-center rounded px-1 text-sm text-white/75 transition hover:translate-x-1 hover:text-[color:var(--neon-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]">
              Trang chủ
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-10 items-center rounded px-1 text-sm text-white/75 transition hover:translate-x-1 hover:text-[color:var(--neon-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-base font-bold uppercase tracking-[0.16em] text-white">Thông tin liên hệ</h2>
          <address className="mt-5 grid gap-4 not-italic text-sm">
            <a
              href={site.contactPerson.phoneHref}
              className="group flex items-start gap-3 rounded text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
            >
              <span className="grid h-8 min-w-11 place-items-center rounded border border-[color:rgba(39,255,255,0.35)] bg-[color:rgba(39,255,255,0.08)] font-mono text-[10px] font-bold text-[color:var(--neon-cyan)]" aria-hidden="true">TEL</span>
              <span>
                <span className="block text-xs text-[color:var(--text-muted)]">Điện thoại</span>
                <span className="mt-1 block group-hover:text-[color:var(--neon-cyan)]">{site.contactPerson.phone}</span>
              </span>
            </a>
            <a
              href={`mailto:${site.contactEmail}`}
              className="group flex items-start gap-3 rounded text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
            >
              <span className="grid h-8 min-w-11 place-items-center rounded border border-[color:rgba(39,255,255,0.35)] bg-[color:rgba(39,255,255,0.08)] font-mono text-[10px] font-bold text-[color:var(--neon-cyan)]" aria-hidden="true">MAIL</span>
              <span className="min-w-0">
                <span className="block text-xs text-[color:var(--text-muted)]">Email chiến dịch</span>
                <span className="mt-1 block break-all group-hover:text-[color:var(--neon-cyan)]">{site.contactEmail}</span>
              </span>
            </a>
            <a
              href={`mailto:${site.contactPerson.email}`}
              className="group flex items-start gap-3 rounded text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
            >
              <span className="grid h-8 min-w-11 place-items-center rounded border border-[color:rgba(255,0,255,0.35)] bg-[color:rgba(255,0,255,0.08)] font-mono text-[10px] font-bold text-[color:var(--neon-pink)]" aria-hidden="true">ID</span>
              <span className="min-w-0">
                <span className="block font-bold text-white">{site.contactPerson.name}</span>
                <span className="mt-1 block text-xs text-[color:var(--text-muted)]">{site.contactPerson.role}</span>
                <span className="mt-1 block break-all text-xs group-hover:text-[color:var(--neon-cyan)]">{site.contactPerson.email}</span>
              </span>
            </a>
          </address>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-base font-bold uppercase tracking-[0.16em] text-white">Kết nối với chúng tôi</h2>
          <div className="mt-5 grid gap-3">
            <a
              className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-[color:rgba(39,255,255,0.35)] bg-[color:rgba(39,255,255,0.06)] px-4 text-sm font-bold text-white transition hover:border-[color:var(--neon-cyan)] hover:bg-[color:rgba(39,255,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
              href={site.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Theo dõi Vũ Trụ Task Vụ trên Facebook"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--neon-cyan)] font-[family-name:var(--font-heading)] text-lg font-bold text-black" aria-hidden="true">f</span>
              Facebook
            </a>
            <a
              className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-[color:rgba(255,0,255,0.35)] bg-[color:rgba(255,0,255,0.07)] px-4 text-sm font-bold text-white transition hover:border-[color:var(--neon-pink)] hover:bg-[color:rgba(255,0,255,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-pink)]"
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Theo dõi Vũ Trụ Task Vụ trên Instagram"
            >
              <svg className="h-8 w-8 rounded-full bg-[color:rgba(255,0,255,0.12)] p-1.5 text-[color:var(--neon-pink)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <path d="M17.5 6.5h.01" />
              </svg>
              Instagram
            </a>
            <a
              className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-[color:rgba(39,255,255,0.35)] bg-[color:rgba(39,255,255,0.06)] px-4 text-sm font-bold text-white transition hover:border-[color:var(--neon-cyan)] hover:bg-[color:rgba(39,255,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]"
              href={site.social.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="Theo dõi Vũ Trụ Task Vụ trên TikTok"
            >
              <svg className="h-8 w-8 rounded-full bg-[color:rgba(39,255,255,0.12)] p-1.5 text-[color:var(--neon-cyan)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.53 2h3.21c.13 1.13.57 2.25 1.35 3.09A5.4 5.4 0 0 0 20.5 6.72v3.17a8.42 8.42 0 0 1-4.66-1.4v6.48c0 3.54-2.86 6.03-6.11 6.03a6.04 6.04 0 0 1-6.23-6.04c0-3.45 2.83-6.05 6.23-6.05.39 0 .78.04 1.16.12v3.29a3.3 3.3 0 0 0-1.16-.21 2.85 2.85 0 1 0 2.8 2.85V2z" />
              </svg>
              TikTok
            </a>
          </div>
          <div className="mt-6 rounded-lg border border-[color:rgba(130,0,255,0.45)] bg-[color:rgba(130,0,255,0.1)] p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--neon-pink)]">Tín hiệu chiến dịch</p>
            <p className="mt-2 text-sm font-bold leading-6 text-white">Thoát đa nhiệm ảo, tác vụ đảm bảo.</p>
            <p className="mt-2 text-xs leading-5 text-[color:var(--text-muted)]">Theo dõi kênh chính thức để cập nhật ghi chép và hoạt động mới.</p>
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-[color:rgba(39,255,255,0.22)] pt-7 text-center text-xs text-[color:var(--text-muted)] md:flex-row md:text-left">
        <p>© 2026 {site.displayName}. All Rights Reserved.</p>
        <p>Chiến dịch truyền thông về ảo tưởng đa nhiệm dành cho người trẻ 18–24 tuổi tại TP.HCM.</p>
      </div>
    </footer>
  );
}

export function SkipLink() {
  return <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[color:var(--neon-cyan)] focus:px-4 focus:py-3 focus:font-bold focus:text-black">Bỏ qua điều hướng</a>;
}
