"use client";

import { Heart } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import FindYourPerson from "@/components/home/FindYourPerson";
import { useRelationshipState } from "@/hooks/useRelationshipState";

export default function SearchPage() {
  const { state, refresh } = useRelationshipState();

  return (
    <div className="space-y-6 pt-2">
      {state === null && (
        <p aria-busy="true" className="pt-6 text-sm text-[#766d69]">
          Loading...
        </p>
      )}
      {state?.status === "single" && (
        <FindYourPerson incomingRequests={state.incomingRequests} onRelationshipChange={refresh} />
      )}
      {state?.status === "connected" && (
        <div className="space-y-3 pt-6 text-center">
          <Heart aria-hidden="true" size={22} className="mx-auto fill-[#C77F89] text-[#C77F89]" />
          <EmptyState message="You're already connected with someone special, so there's no one left to search for." />
        </div>
      )}
    </div>
  );
}
