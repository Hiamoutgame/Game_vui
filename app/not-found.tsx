import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="grid min-h-[60vh] place-items-center px-5 py-20 text-center">
      <section>
        <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-[color:var(--neon-pink)]">ERROR 404</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-5xl font-bold uppercase text-white">Focus not found</h1>
        <p className="mx-auto mt-4 max-w-xl text-[color:var(--text-muted)]">Cổng dịch chuyển này chưa tồn tại hoặc đã bị đổi tọa độ.</p>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded border border-[color:var(--neon-cyan)] px-6 font-bold text-[color:var(--neon-cyan)]">Về trang chủ</Link>
      </section>
    </main>
  );
}
