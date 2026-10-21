import Device from "./Device";
import type { Product } from "@/lib/queries";
import { cn } from "@/lib/utils";

export default function ProductImage({ p, i = 0, className, pad = true }: { p: Pick<Product, "images" | "device" | "tint" | "name">; i?: number; className?: string; pad?: boolean }) {
  const src = p.images[i];
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-[20px] bg-paper", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className={cn("h-full w-full transition-transform duration-500", pad && "p-[10%]")} style={{ transform: i ? `scale(${1 + i * 0.08})` : undefined }}>
          <Device type={p.device} tint={p.tint} />
        </div>
      )}
    </div>
  );
}
