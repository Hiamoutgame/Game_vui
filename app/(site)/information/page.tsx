import Link from "next/link";
import { articles } from "@/libs/content/articles";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function InformationPage() {
  const [featured, ...rest] = articles;
  return (
    <main id="main-content" className="px-5 py-16 md:px-10 lg:px-24">
      <SectionHeading eyebrow="INFORMATION" title="Thông tin" intro="Các ghi chép dịch chuyển vũ trụ giúp bạn đọc nhanh vấn đề đa nhiệm ảo trước khi thử nhiệm vụ." />
      <div className="mx-auto mt-10 max-w-7xl">
        <NeonCard className="grid gap-6 md:grid-cols-[0.9fr_1.3fr]">
          <div className="aspect-square rounded-lg border border-[color:rgba(39,255,255,0.28)] bg-[linear-gradient(135deg,rgba(130,0,255,0.28),rgba(39,255,255,0.12))]" />
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--neon-cyan)]">{featured.category}</p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white">{featured.title}</h2>
            <p className="mt-4 leading-7 text-[color:var(--text-muted)]">{featured.excerpt}</p>
            <Link className="mt-6 inline-flex min-h-11 items-center font-bold text-[color:var(--neon-cyan)]" href={`/information/${featured.slug}`}>Đọc ghi chép →</Link>
          </div>
        </NeonCard>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <NeonCard key={article.slug}>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--neon-cyan)]">{article.category}</p>
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white">{article.title}</h2>
              <p className="mt-3 min-h-24 text-sm leading-6 text-[color:var(--text-muted)]">{article.excerpt}</p>
              {article.status === "summary-only" ? <p className="mt-3 text-xs font-bold text-[color:var(--neon-pink)]">Đang chờ full content</p> : null}
              <Link className="mt-4 inline-flex min-h-11 items-center font-bold text-[color:var(--neon-cyan)]" href={`/information/${article.slug}`}>Xem chi tiết →</Link>
            </NeonCard>
          ))}
        </div>
      </div>
    </main>
  );
}
