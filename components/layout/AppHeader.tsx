import { Heart, HeartHandshake } from "lucide-react";
import IconButton from "@/components/common/IconButton";

type AppHeaderProps = {
  onProfileClick: () => void;
};

export default function AppHeader({ onProfileClick }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-5 pb-5 pt-[max(1.75rem,env(safe-area-inset-top))] sm:px-8 sm:pb-7">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E5E5]">
            <Heart aria-hidden="true" size={19} className="fill-[#B66D79] text-[#B66D79]" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            puchiverse<span className="text-[#B66D79]">.</span>
          </span>
        </div>
        <p className="mt-2 text-xs text-[#766d69]">Your little world, just for two.</p>
      </div>
      <IconButton label="Select Us" onClick={onProfileClick}>
        <HeartHandshake aria-hidden="true" size={21} strokeWidth={1.8} />
      </IconButton>
    </header>
  );
}
