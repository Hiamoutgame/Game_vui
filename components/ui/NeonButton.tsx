import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const variantClass = {
  primary: "border-[color:var(--neon-cyan)] bg-[color:var(--neon-blue)] text-white shadow-[0_0_24px_rgba(39,255,255,0.28)] hover:bg-[color:var(--neon-purple)]",
  secondary: "border-[color:rgba(39,255,255,0.55)] bg-transparent text-[color:var(--neon-cyan)] hover:bg-[rgba(39,255,255,0.1)]",
};

type NeonButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: keyof typeof variantClass;
};

export function NeonButton({ children, className = "", variant = "primary", ...props }: NeonButtonProps) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-6 py-3 font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
