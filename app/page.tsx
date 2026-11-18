import { auth } from "@clerk/nextjs/server";
import HomePage from "@/components/home/HomePage";

export default async function Page() {
  await auth.protect();
  return <HomePage />;
}
