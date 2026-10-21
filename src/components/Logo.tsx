import Link from "next/link";
export default function Logo({ className = "text-[26px] md:text-[32px]" }: { className?: string }) {
  return <Link href="/" className={`font-display ${className}`}>SHOP.CO</Link>;
}
