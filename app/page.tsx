import Link from "next/link";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyAssetFrame } from "@/components/ui/EmptyAssetFrame";
import { site } from "@/libs/content/site";

const previews = [
  { title: "Về dự án", text: "Bản đồ chiến dịch giúp người trẻ nhận diện ảo tưởng đa nhiệm và chi phí đổi tác vụ.", href: "/about", cta: "Xem về dự án" },
  { title: "Ghi chép dịch chuyển", text: "Các tình huống deadline, Alt + Tab và cảm giác bận rộn được chuyển thành nội dung dễ đọc.", href: "/information", cta: "Đọc ghi chép" },
  { title: "Media Archive", text: "Photoshoot, series và phim ngắn giữ chất neon/cyberpunk của Vũ Trụ Task Vụ.", href: "/media-archive", cta: "Mở archive" },
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="cyber-grid relative isolate min-h-[760px] overflow-hidden px-5 py-24 md:px-10 lg:px-24">
        <div className="absolute left-10 top-36 hidden rounded border border-[color:rgba(39,255,255,0.5)] bg-[color:rgba(20,7,60,0.8)] px-4 py-2 font-mono text-xs font-bold text-[color:var(--neon-cyan)] shadow-[0_0_18px_rgba(39,255,255,0.25)] md:block" aria-hidden="true">ALT + TAB // DỊCH CHUYỂN</div>
        <div className="absolute right-14 top-56 hidden rounded border border-[color:rgba(39,255,255,0.5)] bg-[color:rgba(20,7,60,0.8)] px-4 py-2 font-mono text-xs font-bold text-[color:var(--neon-pink)] shadow-[0_0_18px_rgba(39,255,255,0.25)] lg:block" aria-hidden="true">FOCUS NOT FOUND</div>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <h1 className="neon-text whitespace-pre-line font-[family-name:var(--font-heading)] text-6xl font-bold uppercase leading-[0.94] text-white md:text-8xl">VŨ TRỤ<br />TASK VỤ</h1>
          <p className="text-2xl font-bold text-white md:text-3xl">{site.tagline}</p>
          <p className="max-w-3xl text-base leading-8 text-[color:var(--text-muted)] md:text-lg">{site.description}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <NeonButton href="/mission">Làm nhiệm vụ</NeonButton>
            <NeonButton href="#explore" variant="secondary">Khám phá nội dung</NeonButton>
          </div>
        </div>
      </section>

      <section id="explore" className="relative overflow-hidden px-5 py-20 md:px-10 lg:px-24">
        <SectionHeading eyebrow="TOA DO TRUY CAP // 03 MODULE" title="Khám phá vũ trụ task vụ" intro="Ba cổng dữ liệu dẫn vào chiến dịch: bản đồ dự án, nhật ký dịch chuyển và kho media neon dành cho phi hành đoàn." />
        <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-3">
          {previews.map((preview) => (
            <NeonCard key={preview.href}>
              <EmptyAssetFrame asset={{ label: preview.title, alt: preview.title, ratio: "wide" }} />
              <h2 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white">{preview.title}</h2>
              <p className="mt-3 min-h-20 text-sm leading-6 text-[color:var(--text-muted)]">{preview.text}</p>
              <Link className="mt-5 inline-flex min-h-11 items-center font-bold text-[color:var(--neon-cyan)]" href={preview.href}>{preview.cta} →</Link>
            </NeonCard>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 lg:px-24">
        <div className="mx-auto max-w-4xl rounded-lg border border-[color:rgba(130,0,255,0.7)] bg-[color:rgba(20,7,60,0.8)] p-8 text-center shadow-[0_0_30px_rgba(130,0,255,0.35)]">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white">Sẵn sàng kiểm tra năng lực đa nhiệm?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[color:var(--text-muted)]">Nhiệm vụ mất khoảng 60 giây và cho bạn một insight ngắn về thói quen đổi tác vụ khi deadline áp sát.</p>
          <NeonButton href="/mission" className="mt-6">Bắt đầu nhiệm vụ</NeonButton>
        </div>
      </section>
    </main>
  );
}
