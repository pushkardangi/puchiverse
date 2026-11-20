import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";

export default function HugAnimation({
  gifFileName,
  playbackId,
  onLoad,
  onError,
}: {
  gifFileName: string;
  playbackId?: string;
  onLoad?: () => void;
  onError?: () => void;
}) {
  return (
    <div className="relative mx-auto my-5 flex max-w-[260px] items-center justify-center rounded-[28px] bg-gradient-to-br from-[#F9E8EB] via-[#FFF8F5] to-[#F5E9E1] p-5">
      <Heart aria-hidden="true" size={22} className="absolute left-3 top-3 fill-[#E7ACB5] text-[#E7ACB5] motion-safe:animate-pulse" />
      <Sparkles aria-hidden="true" size={20} className="absolute bottom-3 right-3 text-[#C67E8B] motion-safe:animate-pulse" />
      <div className="overflow-hidden rounded-2xl bg-white/70 shadow-[0_8px_30px_rgba(163,92,105,0.18)] motion-safe:animate-us-pop">
        <Image src={`/gifs/hugs/${gifFileName}${playbackId ? `?hug=${encodeURIComponent(playbackId)}` : ""}`} alt="A warm virtual hug" width={220} height={220} unoptimized onLoad={onLoad} onError={onError} className="h-auto w-full" />
      </div>
    </div>
  );
}
