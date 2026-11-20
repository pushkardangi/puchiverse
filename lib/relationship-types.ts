export type PublicProfile = {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  relationshipStatus: "available";
};

export type RequestState = "none" | "outgoing_pending" | "incoming_pending";

export type UserSearchResponse = {
  result: PublicProfile | null;
  requestState: RequestState;
  incomingRequestId: string | null;
};

export type RelationshipUser = {
  username: string;
  displayName: string;
  avatar: string | null;
};

export type PendingRequest = {
  id: string;
  user: RelationshipUser;
  createdAt: string;
};

export type RelationshipState =
  | { status: "connected"; partner: RelationshipUser; incomingRequests: []; outgoingRequests: [] }
  | { status: "single"; partner: null; incomingRequests: PendingRequest[]; outgoingRequests: PendingRequest[] };

export type ApiErrorCode =
  | "unauthenticated"
  | "invalid_request"
  | "invalid_username"
  | "rate_limited"
  | "already_connected"
  | "request_exists"
  | "incoming_exists"
  | "hug_pending"
  | "not_connected"
  | "unavailable"
  | "not_found"
  | "server_error";

export type ApiErrorBody = {
  error: { code: ApiErrorCode; message: string; requestId?: string };
};
