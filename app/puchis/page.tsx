import { auth } from "@clerk/nextjs/server";
import PuchisPage from "@/components/puchis/PuchisPage";

export default async function Page() {
  await auth.protect();
  return <PuchisPage />;
}
