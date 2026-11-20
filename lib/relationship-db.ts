import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

// The unique partial index on relationships.members must exist before any write.
export async function prepareRelationshipDb() {
  const mongoose = await connectToDatabase();
  await Promise.all([User.init(), Relationship.init()]);
  return mongoose;
}
