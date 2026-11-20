import "server-only";

import { prepareRelationshipDb } from "@/lib/relationship-db";
import PuchiTransaction from "@/models/PuchiTransaction";

export async function preparePuchiDb() {
  await prepareRelationshipDb();
  await PuchiTransaction.init();
}
