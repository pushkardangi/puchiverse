import { Heart } from "lucide-react";
import { ClerkLoaded, ClerkLoading, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="px-5 pb-5 pt-[max(1.75rem,env(safe-area-inset-top))] sm:px-8 sm:pb-7">
      <div className="flex w-full items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E5E5]">
              <Heart aria-hidden="true" size={19} className="fill-[#B66D79] text-[#B66D79]" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              puchiverse<span className="text-[#B66D79]">.</span>
            </span>
          </div>
          <p className="mt-2 text-xs text-[#766d69]">Our little world, just for two.</p>
        </div>
        <div className="flex min-h-9 shrink-0 items-center justify-end">
          <Suspense fallback={<div aria-hidden="true" className="h-9 w-20" />}>
            <ClerkLoading>
              <div className="flex items-center gap-1">
                <Link
                  href="/sign-in"
                  className="rounded-full px-2 py-2 text-xs font-medium text-[#766d69] transition-colors hover:bg-[#F4E9E7] sm:px-3 sm:text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-[#B66D79] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#A35C69] sm:px-4 sm:text-sm"
                >
                  Sign up
                </Link>
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <Show when="signed-out">
                <div className="flex items-center gap-1">
                  <SignInButton>
                    <button
                      type="button"
                      className="rounded-full px-2 py-2 text-xs font-medium text-[#766d69] transition-colors hover:bg-[#F4E9E7] sm:px-3 sm:text-sm"
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button
                      type="button"
                      className="rounded-full bg-[#B66D79] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#A35C69] sm:px-4 sm:text-sm"
                    >
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </ClerkLoaded>
          </Suspense>
        </div>
      </div>
    </header>
  );
}
