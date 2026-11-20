import { requireActiveUser } from "@/lib/require-active-user";
import PuchisPage from "@/components/puchis/PuchisPage";

export default async function Page() {
  await requireActiveUser();
  return <PuchisPage />;
}
