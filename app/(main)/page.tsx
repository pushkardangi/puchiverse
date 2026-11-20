import { requireActiveUser } from "@/lib/require-active-user";
import HomePage from "@/components/home/HomePage";

export default async function Page() {
  await requireActiveUser();
  return <HomePage />;
}
