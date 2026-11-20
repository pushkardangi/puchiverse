"use client";

import { Loader2, Search, X } from "lucide-react";
import type { FormEvent } from "react";
import { inputClass, labelClass } from "@/components/us/formStyles";
import { USERNAME_MAX_LENGTH } from "@/lib/username";

type UsernameSearchFormProps = {
  value: string;
  loading: boolean;
  canClear: boolean;
  validationMessage: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
};

export default function UsernameSearchForm({
  value,
  loading,
  canClear,
  validationMessage,
  onChange,
  onSubmit,
  onClear,
}: UsernameSearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!loading) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-3">
      <label htmlFor="partner-username" className={labelClass}>
        Their exact username
      </label>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-sm font-medium text-[#A35C69]"
        >
          @
        </span>
        <input
          id="partner-username"
          name="username"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter exact username"
          maxLength={USERNAME_MAX_LENGTH + 1}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-invalid={validationMessage ? true : undefined}
          aria-describedby={validationMessage ? "partner-username-error" : undefined}
          className={`${inputClass} pl-9`}
        />
      </div>
      {validationMessage && (
        <p id="partner-username-error" role="alert" className="text-xs leading-5 text-[#A14F5C]">
          {validationMessage}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || value.trim() === ""}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#B66D79] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#A35C69] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 aria-hidden="true" size={16} className="animate-spin" />
          ) : (
            <Search aria-hidden="true" size={16} />
          )}
          {loading ? "Searching…" : "Search"}
        </button>
        {canClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-[#E5DAD5] bg-white px-4 text-sm font-medium text-[#665753] transition hover:bg-[#FCF5F4]"
          >
            <X aria-hidden="true" size={16} />
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
