"use client";

import { Check } from "lucide-react";

type ToggleRowProps = {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export default function ToggleRow({ label, hint, checked, onChange, className = "" }: ToggleRowProps) {
  return (
    <label className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#E5DAD5] bg-white px-4 py-3 ${className}`}>
      <span>
        <span className="block text-xs font-medium text-[#665753]">{label}</span>
        {hint && <span className="mt-1 block text-[11px] leading-4 text-[#998A84]">{hint}</span>}
      </span>
      <span className="relative shrink-0">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
        <span className="block h-7 w-12 rounded-full bg-[#D7CDC8] transition peer-checked:bg-[#B66D79] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#A35C69]" />
        <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition peer-checked:translate-x-5">
          <Check aria-hidden="true" size={11} className={checked ? "text-[#B66D79]" : "text-transparent"} />
        </span>
      </span>
    </label>
  );
}
