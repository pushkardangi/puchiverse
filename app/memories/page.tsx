import { auth } from "@clerk/nextjs/server";
import MemoriesPage from "@/components/memories/MemoriesPage";

export default async function Page() {
  await auth.protect();
  return <MemoriesPage />;
}
