import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  action?: ReactNode;
};

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex min-h-11 items-center justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}
