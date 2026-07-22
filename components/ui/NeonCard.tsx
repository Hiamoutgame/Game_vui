import type { ReactNode } from "react";

export function NeonCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-white/10 bg-[color:var(--surface)] p-5 shadow-[0_14px_32px_rgba(0,0,0,0.5)] transition duration-200 hover:-translate-y-1 hover:border-[color:rgba(39,255,255,0.55)] hover:shadow-[0_0_28px_rgba(39,255,255,0.2)] ${className}`}>
      {children}
    </div>
  );
}
