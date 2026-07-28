import type { AssetRef } from "@/types/content";

import Image from "next/image";

const ratioClass = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-video",
  poster: "aspect-[2/3]",
};

export function EmptyAssetFrame({ asset, className = "" }: { asset: AssetRef; className?: string }) {
  return (
    <div className={`${ratioClass[asset.ratio ?? "wide"]} relative overflow-hidden rounded-lg border border-[color:rgba(39,255,255,0.28)] bg-[linear-gradient(135deg,rgba(130,0,255,0.28),rgba(9,0,31,0.9),rgba(39,255,255,0.12))] ${className}`}>
      {asset.src ? (
        <>
          <Image src={asset.src} alt={asset.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">{asset.label}</p>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,0,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" aria-hidden="true" />
          <div className="absolute inset-0 grid place-items-center p-4 text-center font-mono text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
            {asset.label}
          </div>
        </>
      )}
    </div>
  );
}
