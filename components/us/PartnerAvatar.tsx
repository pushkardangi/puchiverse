"use client";

import Image from "next/image";
import { useState } from "react";
import type { Partner } from "@/data/relationshipData";

type PartnerAvatarProps = {
  partner: Pick<Partner, "name" | "avatar">;
  className?: string;
  textClassName?: string;
};

export default function PartnerAvatar({ partner, className = "h-28 w-28", textClassName = "text-4xl" }: PartnerAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = partner.avatar && failedSrc !== partner.avatar;
  const initial = partner.name.trim().charAt(0).toUpperCase() || "♡";

  return (
    <div className={`relative overflow-hidden rounded-full border-4 border-[#FAF8F5] bg-[#F2E3E1] shadow-[0_10px_28px_rgba(78,55,51,0.14)] ${className}`}>
      {showImage ? (
        <Image
          src={partner.avatar!}
          alt={`${partner.name || "Partner"}'s photograph`}
          fill
          unoptimized
          onError={() => setFailedSrc(partner.avatar!)}
          className="object-cover"
        />
      ) : (
        <div aria-hidden="true" className={`flex h-full w-full items-center justify-center font-serif text-[#A35C69] ${textClassName}`}>
          {initial}
        </div>
      )}
    </div>
  );
}
