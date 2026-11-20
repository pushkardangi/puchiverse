"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRelationshipState } from "@/lib/relationship-client";
import type { RelationshipState } from "@/lib/relationship-types";

// The relationship state is only known once the server answers; it is never inferred locally.
export function useRelationshipState() {
  const [state, setState] = useState<RelationshipState | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchRelationshipState(controller.signal)
      .then(setState)
      .catch(() => {});
    return () => controller.abort();
  }, [version]);

  const refresh = useCallback(() => setVersion((value) => value + 1), []);
  return { state, refresh };
}
