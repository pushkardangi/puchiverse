import { requireActiveUser } from "@/lib/require-active-user";
import UsPage from "@/components/us/UsPage";

export default async function Page() {
  await requireActiveUser();
  return <UsPage />;
}
