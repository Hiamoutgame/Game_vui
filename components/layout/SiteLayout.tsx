"use client";

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
        <Link className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase leading-none tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)]" href="/" onClick={() => setOpen(false)}>
          <span className="block">VU TRU</span>
          <span className="block">TASK VU</span>
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
  return (
    <footer className="border-t border-[color:rgba(39,255,255,0.28)] bg-[color:var(--background)] px-5 py-14 md:px-10 lg:px-24">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.1fr_0.8fr]">
        <div>
          <p className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white">{site.displayName}</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[color:var(--text-muted)]">{site.description}</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">Điều hướng</h2>
          <div className="mt-4 grid gap-3">
            {navItems.map((item) => <Link key={item.href} href={item.href} className="text-sm text-white/85 hover:text-[color:var(--neon-cyan)]">{item.label}</Link>)}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">Liên hệ</h2>
          <div className="mt-4 grid gap-3 text-sm text-white/85">
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            <a href={site.contactPerson.phoneHref}>{site.contactPerson.phone}</a>
            <span>{site.contactPerson.name}</span>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">Social</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <a className="text-white/85 hover:text-[color:var(--neon-cyan)]" href={site.social.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-[color:rgba(39,255,255,0.22)] pt-6 text-center text-xs text-[color:var(--text-muted)]">© 2026 VŨ TRỤ TASK VỤ. All Rights Reserved.</p>
    </footer>
  );
}

export function SkipLink() {
  return <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[color:var(--neon-cyan)] focus:px-4 focus:py-3 focus:font-bold focus:text-black">Bỏ qua điều hướng</a>;
}
