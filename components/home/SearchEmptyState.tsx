type SearchEmptyStateProps = {
  title: string;
  description?: string;
  tone?: "neutral" | "error";
};

export default function SearchEmptyState({ title, description, tone = "neutral" }: SearchEmptyStateProps) {
  const palette =
    tone === "error" ? "border-[#E7CBCD] bg-[#FFF7F7] text-[#A14F5C]" : "border-[#F0E8E3] bg-[#FAF8F5] text-[#665753]";

  return (
    <div role={tone === "error" ? "alert" : "status"} className={`mt-5 rounded-2xl border p-4 text-center ${palette}`}>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mt-1 text-xs leading-5 opacity-80">{description}</p>}
    </div>
  );
}
