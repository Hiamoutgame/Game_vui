import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";

const signals = [
  {
    number: "01",
    title: "Đổi tab liên tục",
    copy: "Bạn nhảy giữa chat, task, mail và bảng kế hoạch như đang tăng tốc, nhưng mỗi lần chuyển tab là một lần mất lại ngữ cảnh.",
  },
  {
    number: "02",
    title: "Hoảng deadline",
    copy: "Mọi việc đều gắn nhãn khẩn cấp. Nhịp làm việc bị kéo bởi tiếng chuông cuối hạn, không phải bởi thứ tự ưu tiên thật.",
  },
  {
    number: "03",
    title: "Nhầm bận với giỏi",
    copy: "Danh sách việc dài làm bạn có vẻ đang thắng trận, nhưng kết quả chính vẫn đứng yên trong màn sương thông báo.",
  },
];

const approachSteps = [
  {
    step: "01",
    title: "Nhận diện",
    desc: "Gọi tên các khoảnh khắc đổi tab, lướt app và làm nhiều việc cùng lúc.",
  },
  {
    step: "02",
    title: "Đối chiếu",
    desc: "Biến tình huống quen thuộc thành meme, ghi chép và media dễ chia sẻ.",
  },
  {
    step: "03",
    title: "Hành động",
    desc: "Dẫn người xem đến nhiệm vụ ngắn để kiểm tra thói quen tập trung.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content">
      {/* 1. Hero Section */}
      <section className="cyber-grid relative isolate min-h-[580px] overflow-hidden px-5 py-20 md:px-10 lg:px-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-[color:var(--neon-cyan)]">
            / VỀ DỰ ÁN
          </p>
          <h1 className="neon-text font-[family-name:var(--font-heading)] text-5xl font-bold uppercase leading-none text-white md:text-7xl">
            GIẢI MÃ ĐA NHIỆM ẢO
          </h1>
          <p className="max-w-3xl text-xl font-bold leading-9 text-white md:text-2xl">
            VŨ TRỤ TASK VỤ giúp người trẻ nhìn lại thói quen đổi tác vụ liên tục và cảm giác bận rộn nhưng không thật sự hiệu quả.
          </p>
          <p className="max-w-3xl text-base leading-7 text-[color:var(--text-muted)] md:text-lg">
            Chiến dịch dành cho nhóm 18-24 tuổi tại TP.HCM, biến những khoảnh khắc alt-tab, chạy deadline và quá tải thông tin thành nội dung dễ nhận diện, dễ chia sẻ và có thể hành động.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <NeonButton href="/mission">Làm nhiệm vụ</NeonButton>
            <NeonButton href="/information" variant="secondary">Khám phá nội dung</NeonButton>
          </div>
        </div>
      </section>

      {/* 2. Story Section */}
      <section className="px-5 py-20 md:px-10 lg:px-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--neon-pink)]">
              SYSTEM BRIEF / 18-24
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase leading-tight text-white md:text-5xl">
              Tụi mình không chống multitask. Tụi mình chống ảo giác năng suất.
            </h2>
            <p className="text-base leading-8 text-[color:var(--text-muted)] md:text-lg">
              Vấn đề không nằm ở việc mở nhiều tab, mà nằm ở khoảnh khắc người trẻ tưởng mình đang kiểm soát mọi thứ trong khi sự chú ý bị kéo đi liên tục. VŨ TRỤ TASK VỤ tạo ra một không gian truyền thông vui, gần gũi và có chút hỗn loạn có chủ đích để biến hiện tượng đó thành thứ dễ gọi tên.
            </p>
          </div>

          {/* Interface Visual Mockup */}
          <div className="relative overflow-hidden rounded-lg border border-[color:rgba(130,0,255,0.6)] bg-[color:var(--surface)] p-8 shadow-[0_0_30px_rgba(130,0,255,0.35)] min-h-[320px] flex flex-col justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(39,255,255,0.15),transparent_70%)] pointer-events-none" aria-hidden="true" />
            <div className="grid gap-4 sm:grid-cols-2 relative z-10">
              <div className="rounded border border-[color:rgba(39,255,255,0.5)] bg-[color:rgba(55,15,255,0.8)] p-3">
                <p className="font-mono text-xs font-bold text-white">GOOGLE DOCS</p>
                <div className="mt-2 h-2 w-full rounded bg-[color:rgba(39,255,255,0.5)]" />
              </div>
              <div className="rounded border border-[color:rgba(39,255,255,0.5)] bg-[color:rgba(130,0,255,0.8)] p-3">
                <p className="font-mono text-xs font-bold text-white">GOOGLE SLIDES</p>
                <div className="mt-2 h-2 w-full rounded bg-[color:rgba(39,255,255,0.5)]" />
              </div>
              <div className="rounded border border-[color:rgba(39,255,255,0.5)] bg-[color:rgba(255,0,255,0.5)] p-3">
                <p className="font-mono text-xs font-bold text-white">CHATGPT</p>
                <div className="mt-2 h-2 w-full rounded bg-[color:rgba(39,255,255,0.5)]" />
              </div>
              <div className="rounded border border-[color:rgba(39,255,255,0.5)] bg-[color:rgba(9,0,31,0.9)] p-3">
                <p className="font-mono text-xs font-bold text-white">DEADLINE 23:59</p>
                <div className="mt-2 h-2 w-full rounded bg-[color:rgba(39,255,255,0.5)]" />
              </div>
            </div>
            <div className="mt-6 font-mono text-sm font-bold text-[color:var(--neon-green)] relative z-10">
              TASK SYNC: CHƯA ỔN ĐỊNH
            </div>
          </div>
        </div>
      </section>

      {/* 3. Signals Section */}
      <section className="px-5 py-16 md:px-10 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white md:text-5xl">
              Dấu hiệu đa nhiệm ảo
            </h2>
            <p className="text-base leading-7 text-[color:var(--text-muted)] md:text-lg">
              Khi não đang mở quá nhiều cổng cùng lúc, cảm giác bận rộn có thể chỉ là nhiễu tín hiệu. Nhận diện ba dấu hiệu trước khi năng lượng bị rút cạn.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {signals.map((sig) => (
              <NeonCard key={sig.number} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--background)] font-bold text-[color:var(--neon-cyan)]">
                      ⚡
                    </div>
                    <span className="font-mono text-sm font-bold text-[color:var(--neon-pink)]">
                      {sig.number}
                    </span>
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-white">
                    {sig.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
                    {sig.copy}
                  </p>
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Campaign Approach */}
      <section className="px-5 py-16 md:px-10 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white md:text-5xl">
              Chiến dịch vận hành như một nhiệm vụ hệ thống
            </h2>
            <p className="text-base leading-7 text-[color:var(--text-muted)] md:text-lg">
              Từ nội dung ghi chép, media archive đến nhiệm vụ 60 giây, mỗi điểm chạm đều giúp người xem tự soi lại cách mình chuyển đổi tác vụ và cảm giác năng suất của bản thân.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {approachSteps.map((item) => (
              <NeonCard key={item.step}>
                <span className="font-mono text-sm font-bold text-[color:var(--neon-cyan)]">
                  {item.step}
                </span>
                <h3 className="mt-2 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                  {item.desc}
                </p>
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="px-5 py-20 md:px-10 lg:px-24">
        <div className="mx-auto max-w-4xl rounded-lg border border-[color:rgba(39,255,255,0.5)] bg-[color:rgba(20,7,60,0.8)] p-8 text-center shadow-[0_0_30px_rgba(39,255,255,0.25)] md:p-12">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white md:text-4xl">
            Muốn biết mình đang đa nhiệm thật hay chỉ đang chạy vòng quanh?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[color:var(--text-muted)]">
            Bắt đầu nhiệm vụ ngắn để nhìn lại cách bạn chuyển tab, phản ứng với deadline và giữ nhịp tập trung.
          </p>
          <NeonButton href="/mission" className="mt-8">
            Bắt đầu nhiệm vụ
          </NeonButton>
        </div>
      </section>
    </main>
  );
}
