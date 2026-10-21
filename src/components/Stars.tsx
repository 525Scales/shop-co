import { StarIcon } from "@/components/icons";
export default function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <StarIcon size={size} className="absolute inset-0 text-black/15" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}><StarIcon size={size} className="text-[#ffc633]" /></span>
          </span>
        );
      })}
    </span>
  );
}
