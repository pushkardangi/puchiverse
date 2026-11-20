import { requireActiveUser } from "@/lib/require-active-user";
import SearchPage from "@/components/search/SearchPage";

export default async function Page() {
  await requireActiveUser();
  return <SearchPage />;
}
