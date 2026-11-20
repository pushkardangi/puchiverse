import "server-only";

import { displayNameOf } from "@/lib/public-profile";
import { prepareRelationshipDb } from "@/lib/relationship-db";
import type { UserSearchResponse } from "@/lib/relationship-types";
import Relationship from "@/models/Relationship";
import User from "@/models/User";
import type { CurrentUser } from "@/lib/current-user";
import { hasActiveRelationship, pendingBetween, RelationshipError } from "@/services/relationship.service";

const NOT_FOUND: UserSearchResponse = { result: null, requestState: "none", incomingRequestId: null };

// Exact, normalized username match only. Every reason a target is unavailable
// (self, deleted, undiscoverable, already coupled) yields the same empty result.
export async function searchUserByUsername(me: CurrentUser, username: string): Promise<UserSearchResponse> {
  await prepareRelationshipDb();

  if (await hasActiveRelationship([me._id])) {
    throw new RelationshipError("already_connected", "You're already connected with someone.");
  }

  const target = await User.findOne({
    username,
    _id: { $ne: me._id },
    deletedAt: null,
    mergedIntoClerkId: null,
    discoverable: { $ne: false },
  })
    .select("firstName lastName username avatar")
    .lean();
  if (!target?.username || (await hasActiveRelationship([target._id]))) return NOT_FOUND;

  const pending = await Relationship.findOne(pendingBetween(me._id, target._id)).select("requestedBy").lean();
  const incoming = pending !== null && !pending.requestedBy.equals(me._id);

  return {
    result: {
      id: String(target._id),
      username: target.username,
      displayName: displayNameOf(target),
      avatar: target.avatar ?? null,
      relationshipStatus: "available",
    },
    requestState: !pending ? "none" : incoming ? "incoming_pending" : "outgoing_pending",
    incomingRequestId: incoming ? String(pending._id) : null,
  };
}
