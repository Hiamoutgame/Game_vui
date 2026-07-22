import { site } from "@/libs/content/site";

export default function ContactPage() {
  return (
    <main id="main-content" className="px-5 py-20 md:px-10 lg:px-24 min-h-[85vh] flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-12">
        
        {/* Contact Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-[color:var(--neon-cyan)]">
            TRẠM LIÊN LẠC // VŨ TRỤ TASK VỤ
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase text-white md:text-5xl">
            THÔNG TIN LIÊN HỆ
          </h1>
          <p className="text-base leading-7 text-[color:var(--text-muted)] md:text-lg">
            Kết nối với ban tổ chức chiến dịch để trao đổi thông tin, hợp tác truyền thông hoặc gửi câu hỏi về Vũ Trụ Task Vụ.
          </p>
        </div>

        {/* Contact Content Grid (Centered Panel) */}
        <div className="flex justify-center">
          <div className="flex flex-col justify-between w-full max-w-sm rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--neon-purple)] p-8 shadow-[0_0_30px_rgba(130,0,255,0.4)] min-h-[420px]">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase text-white/90 tracking-widest">
                  THÔNG TIN LIÊN HỆ
                </p>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase text-white">
                  {site.contactPerson.name}
                </h2>
                <p className="font-bold text-[color:var(--neon-cyan)] text-lg">
                  {site.contactPerson.role}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[color:var(--neon-cyan)]/30">
                <div className="flex items-center gap-4">
                  <svg className="h-6 w-6 text-[color:var(--neon-cyan)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={site.contactPerson.phoneHref} className="font-semibold text-white hover:text-[color:var(--neon-cyan)] transition">
                    SĐT: {site.contactPerson.phone}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <svg className="h-6 w-6 text-[color:var(--neon-cyan)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${site.contactPerson.email}`} className="font-semibold text-white hover:text-[color:var(--neon-cyan)] transition break-all">
                    {site.contactPerson.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Row */}
            <div className="flex justify-start gap-4 pt-8">
              <a 
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--surface)] text-white hover:bg-[color:var(--neon-cyan)] hover:text-black transition"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a 
                href="#"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--surface)] text-white hover:bg-[color:var(--neon-cyan)] hover:text-black transition"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a 
                href="#"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-[color:var(--neon-cyan)] bg-[color:var(--surface)] text-white hover:bg-[color:var(--neon-cyan)] hover:text-black transition"
                aria-label="TikTok"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.45-5.65-.01-2.05 1.05-4.04 2.72-5.15 1.52-1.03 3.44-1.35 5.23-1.07V15c-1.29-.27-2.67-.09-3.78.69-.97.68-1.5 1.83-1.41 3.03.09 1.25.96 2.37 2.12 2.8 1.34.47 2.88.24 4.02-.63.95-.71 1.49-1.85 1.5-3.05.02-5.93.01-11.87.01-17.81v-.01z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Footer Note */}
        <div className="flex justify-center">
          <div className="w-full rounded-lg border border-[color:var(--neon-purple)] bg-[color:var(--surface)] px-6 py-6 text-center shadow-[0_0_16px_rgba(130,0,255,0.2)]">
            <p className="font-semibold text-[color:var(--text-muted)] text-sm md:text-base">
              Phản hồi của bạn giúp hệ thống hiểu rõ hơn về đa nhiệm ảo và thói quen chuyển tác vụ của người trẻ.
            </p>
          </div>
        </div>
        
      </div>
    </main>
  );
}
