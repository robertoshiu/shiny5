import { asset } from "@/lib/asset";

export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return <img src={asset("/logo.webp")} width={size} height={size} alt="顯藝科技 ShinyLogic" className={className} decoding="async" />;
}
