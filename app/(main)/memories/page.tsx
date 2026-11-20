import { requireActiveUser } from "@/lib/require-active-user";
import MemoriesPage from "@/components/memories/MemoriesPage";

export default async function Page() {
  await requireActiveUser();
  return <MemoriesPage />;
}
