import { cn } from "@/lib/utils";

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

export default function Device({ type, tint, className }: { type: string; tint: string; className?: string }) {
  const id = `d${type}${tint.slice(1)}`;
  const body = `url(#${id})`, scr = `url(#${id}s)`;
  const dark = shade(tint, -45), light = shade(tint, 24);
  const wall = (cx: number, cy: number, r: number) => (<><circle cx={cx} cy={cy} r={r} fill="#f59e0b" opacity=".35" /><circle cx={cx} cy={cy} r={r * 0.55} fill="#fbbf24" opacity=".5" /></>);
  return (
    <svg viewBox="0 0 200 200" className={cn("h-full w-full", className)} role="img" aria-label={`${type} illustration`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={light} /><stop offset="1" stopColor={dark} /></linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1d3557" /><stop offset="1" stopColor="#0b1220" /></linearGradient>
      </defs>
      <ellipse cx="100" cy="190" rx="60" ry="5" fill="rgba(0,0,0,.09)" />
      {type === "phone" && (<>
        <rect x="62" y="12" width="76" height="176" rx="16" fill={body} /><rect x="67" y="17" width="66" height="166" rx="12" fill={scr} />
        {wall(100, 122, 28)}<rect x="90" y="22" width="20" height="6" rx="3" fill="#000" opacity=".7" /><rect x="138" y="60" width="3" height="22" rx="1.5" fill={dark} />
      </>)}
      {type === "tablet" && (<>
        <rect x="34" y="24" width="132" height="152" rx="14" fill={body} /><rect x="40" y="30" width="120" height="140" rx="9" fill={scr} />{wall(100, 108, 32)}
      </>)}
      {type === "laptop" && (<>
        <rect x="34" y="40" width="132" height="88" rx="7" fill={body} /><rect x="40" y="46" width="120" height="76" rx="3" fill={scr} />{wall(100, 86, 26)}
        <path d="M14 130 H186 L178 143 Q177 148 171 148 H29 Q23 148 22 143 Z" fill={body} /><rect x="86" y="130" width="28" height="4" rx="2" fill={dark} />
      </>)}
      {type === "headphones" && (<>
        <path d="M44 112 V100 A56 56 0 0 1 156 100 V112" fill="none" stroke={body} strokeWidth="12" strokeLinecap="round" />
        <rect x="28" y="102" width="32" height="60" rx="15" fill={body} /><rect x="140" y="102" width="32" height="60" rx="15" fill={body} />
        <rect x="52" y="112" width="10" height="40" rx="5" fill={dark} /><rect x="138" y="112" width="10" height="40" rx="5" fill={dark} />
      </>)}
      {type === "earbuds" && (<>
        <ellipse cx="76" cy="58" rx="14" ry="18" fill={body} /><rect x="71" y="68" width="9" height="34" rx="4.5" fill={body} />
        <ellipse cx="124" cy="58" rx="14" ry="18" fill={body} /><rect x="120" y="68" width="9" height="34" rx="4.5" fill={body} />
        <rect x="48" y="88" width="104" height="80" rx="36" fill={body} /><path d="M50 122 H150" stroke={dark} strokeWidth="2" opacity=".6" /><circle cx="100" cy="142" r="3" fill="#6ee7b7" />
      </>)}
      {type === "speaker" && (<>
        <rect x="58" y="42" width="84" height="126" rx="34" fill={body} /><rect x="58" y="42" width="84" height="24" rx="12" fill={dark} opacity=".45" />
        {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => <circle key={`${r}${c}`} cx={76 + c * 12} cy={84 + r * 14} r="2.3" fill={dark} opacity=".6" />))}
        <circle cx="100" cy="54" r="3" fill="#fff" opacity=".85" />
      </>)}
      {type === "watch" && (<>
        <rect x="76" y="6" width="48" height="54" rx="10" fill={dark} /><rect x="76" y="140" width="48" height="54" rx="10" fill={dark} />
        <rect x="58" y="46" width="84" height="108" rx="26" fill={body} /><rect x="64" y="52" width="72" height="96" rx="21" fill={scr} />
        <circle cx="100" cy="100" r="24" fill="none" stroke="#34d399" strokeWidth="6" strokeDasharray="96 60" strokeLinecap="round" />
        <circle cx="100" cy="100" r="13" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray="50 40" strokeLinecap="round" /><rect x="142" y="78" width="6" height="22" rx="3" fill={dark} />
      </>)}
      {type === "camera" && (<>
        <path d="M68 62 L80 44 H120 L132 62 Z" fill={dark} /><rect x="22" y="60" width="156" height="98" rx="12" fill={body} /><rect x="22" y="60" width="36" height="98" rx="12" fill={dark} opacity=".35" />
        <circle cx="106" cy="110" r="42" fill="#111827" /><circle cx="106" cy="110" r="33" fill="#1f2937" stroke="#374151" strokeWidth="4" /><circle cx="106" cy="110" r="19" fill="#1d4ed8" opacity=".55" /><circle cx="99" cy="103" r="5" fill="#fff" opacity=".5" />
        <rect x="142" y="52" width="20" height="8" rx="3" fill={dark} /><rect x="32" y="70" width="14" height="8" rx="2" fill="#e5e7eb" opacity=".6" />
      </>)}
      {type === "controller" && (<>
        <path d="M52 76 H148 Q172 76 177 118 Q181 158 157 158 Q141 158 131 140 H69 Q59 158 43 158 Q19 158 23 118 Q28 76 52 76 Z" fill={body} />
        <circle cx="66" cy="102" r="10" fill="#0b1220" opacity=".85" /><circle cx="118" cy="124" r="10" fill="#0b1220" opacity=".85" />
        <path d="M76 124 H92 M84 116 V132" stroke="#0b1220" strokeWidth="6" strokeLinecap="round" opacity=".85" />
        {[[138, 90, "#60a5fa"], [148, 100, "#f87171"], [138, 110, "#fbbf24"], [128, 100, "#34d399"]].map(([x, y, c]) => <circle key={`${x}${y}`} cx={x as number} cy={y as number} r="5" fill={c as string} opacity=".9" />)}
      </>)}
    </svg>
  );
}
