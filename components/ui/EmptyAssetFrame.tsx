import type { AssetRef } from "@/types/content";

const ratioClass = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-video",
  poster: "aspect-[2/3]",
};

export function EmptyAssetFrame({ asset, className = "" }: { asset: AssetRef; className?: string }) {
  return (
    <div className={`${ratioClass[asset.ratio ?? "wide"]} relative overflow-hidden rounded-lg border border-[color:rgba(39,255,255,0.28)] bg-[linear-gradient(135deg,rgba(130,0,255,0.28),rgba(9,0,31,0.9),rgba(39,255,255,0.12))] ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,0,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" aria-hidden="true" />
      <div className="absolute inset-0 grid place-items-center p-4 text-center font-mono text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
        {asset.label}
      </div>
    </div>
  );
}
