"use client";

import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchEmptyState from "@/components/home/SearchEmptyState";
import UserSearchResult from "@/components/home/UserSearchResult";
import UsernameSearchForm from "@/components/home/UsernameSearchForm";
import PartnerAvatar from "@/components/us/PartnerAvatar";
import {
  acceptRelationshipRequest,
  ApiRequestError,
  searchUsername,
  sendRelationshipRequest,
} from "@/lib/relationship-client";
import type { PendingRequest, RequestState, UserSearchResponse } from "@/lib/relationship-types";
import { normalizeUsername, USERNAME_HELP } from "@/lib/username";

type FindYourPersonProps = {
  incomingRequests: PendingRequest[];
  onRelationshipChange: () => void;
};

type Found = { profile: NonNullable<UserSearchResponse["result"]>; requestState: RequestState; incomingRequestId: string | null };

type View =
  | { kind: "idle" }
  | { kind: "loading" }
  | ({ kind: "found" } & Found)
  | { kind: "not_found" }
  | { kind: "connected" }
  | { kind: "error"; message: string };

const STALE_CODES = ["not_found", "already_connected", "unavailable"];

export default function FindYourPerson({ incomingRequests, onRelationshipChange }: FindYourPersonProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>({ kind: "idle" });
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  function reset() {
    controllerRef.current?.abort();
    setQuery("");
    setView({ kind: "idle" });
    setValidationMessage(null);
    setActionError(null);
    setBusyId(null);
  }

  function handleChange(value: string) {
    setQuery(value);
    setValidationMessage(null);
    if (view.kind !== "loading") setView({ kind: "idle" });
    setActionError(null);
  }

  async function handleSearch() {
    const username = normalizeUsername(query);
    if (!username) {
      setValidationMessage(USERNAME_HELP);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setValidationMessage(null);
    setActionError(null);
    setView({ kind: "loading" });

    try {
      const response = await searchUsername(username, controller.signal);
      if (controller.signal.aborted) return;
      setView(
        response.result
          ? {
              kind: "found",
              profile: response.result,
              requestState: response.requestState,
              incomingRequestId: response.incomingRequestId,
            }
          : { kind: "not_found" },
      );
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof ApiRequestError && error.code === "already_connected") {
        setView({ kind: "connected" });
        onRelationshipChange();
      } else {
        setView({
          kind: "error",
          message: error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.",
        });
      }
    }
  }

  async function handleSend(found: Found) {
    setBusyId(found.profile.id);
    setActionError(null);
    try {
      await sendRelationshipRequest(found.profile.id);
      setView({ ...found, kind: "found", requestState: "outgoing_pending" });
    } catch (error) {
      if (!(error instanceof ApiRequestError)) return;
      if (error.code === "request_exists") {
        setView({ ...found, kind: "found", requestState: "outgoing_pending" });
      } else if (error.code === "incoming_exists") {
        setView({ ...found, kind: "found", requestState: "incoming_pending", incomingRequestId: error.requestId ?? null });
      } else if (error.code === "already_connected") {
        setView({ kind: "connected" });
        onRelationshipChange();
      } else {
        setActionError(error.message);
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleAccept(requestId: string | null) {
    if (!requestId) return;
    setBusyId(requestId);
    setActionError(null);
    try {
      await acceptRelationshipRequest(requestId);
      router.push("/");
    } catch (error) {
      const apiError = error instanceof ApiRequestError ? error : null;
      setActionError(apiError?.message ?? "Something went wrong. Please try again.");
      if (apiError && STALE_CODES.includes(apiError.code)) onRelationshipChange();
    } finally {
      setBusyId(null);
    }
  }

  const loading = view.kind === "loading";

  return (
    <section aria-labelledby="find-your-person-title" className="card-surface">
      <h2 id="find-your-person-title" className="text-xl font-semibold tracking-tight">
        Find Your Person <span className="text-[#A35C69]">♡</span>
      </h2>
      <p className="mt-2 max-w-[300px] text-sm leading-6 text-[#766d69]">
        Know their username? Find them and start your little world together.
      </p>

      <UsernameSearchForm
        value={query}
        loading={loading}
        canClear={query !== "" || view.kind !== "idle"}
        validationMessage={validationMessage}
        onChange={handleChange}
        onSubmit={handleSearch}
        onClear={reset}
      />

      {loading && (
        <p role="status" className="mt-5 flex items-center justify-center gap-2 text-xs text-[#766d69]">
          <Loader2 aria-hidden="true" size={14} className="animate-spin" /> Looking for them…
        </p>
      )}
      {view.kind === "found" && (
        <UserSearchResult
          profile={view.profile}
          requestState={view.requestState}
          busy={busyId !== null}
          errorMessage={actionError}
          onSend={() => handleSend(view)}
          onAccept={() => handleAccept(view.incomingRequestId)}
        />
      )}
      {view.kind === "not_found" && (
        <SearchEmptyState
          title="We couldn't find anyone with that username."
          description="Double-check the username and try again."
        />
      )}
      {view.kind === "connected" && (
        <SearchEmptyState title="You're already connected with someone special." />
      )}
      {view.kind === "error" && <SearchEmptyState tone="error" title={view.message} />}

      {incomingRequests.length > 0 && (
        <div className="mt-6 border-t border-[#F0E8E3] pt-5">
          <h3 className="text-sm font-semibold">Waiting for your answer</h3>
          <ul className="mt-3 space-y-3">
            {incomingRequests.map((request) => (
              <li key={request.id} className="flex items-center gap-3">
                <PartnerAvatar
                  partner={{ name: request.user.displayName, avatar: request.user.avatar ?? "" }}
                  className="h-11 w-11 shrink-0"
                  textClassName="text-base"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{request.user.displayName}</p>
                  <p className="truncate text-xs text-[#766d69]">@{request.user.username}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAccept(request.id)}
                  disabled={busyId !== null}
                  className="flex min-h-11 items-center gap-1.5 rounded-2xl bg-[#B66D79] px-4 text-sm font-medium text-white transition hover:bg-[#A35C69] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyId === request.id ? (
                    <Loader2 aria-hidden="true" size={14} className="animate-spin" />
                  ) : (
                    <Check aria-hidden="true" size={14} />
                  )}
                  Accept
                </button>
              </li>
            ))}
          </ul>
          {view.kind !== "found" && actionError && (
            <p role="alert" className="mt-3 text-xs leading-5 text-[#A14F5C]">
              {actionError}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
