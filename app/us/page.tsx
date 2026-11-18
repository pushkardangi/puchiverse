import { auth } from "@clerk/nextjs/server";
import UsPage from "@/components/us/UsPage";

export default async function Page() {
  await auth.protect();
  return <UsPage />;
}
