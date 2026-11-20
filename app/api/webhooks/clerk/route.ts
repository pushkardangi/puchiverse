import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { isUserEvent, processClerkWebhook } from "@/services/clerk-webhook.service";

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    console.error("Clerk webhook signing secret is not configured");
    return new Response("Webhook is not configured", { status: 500 });
  }

  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    console.error("Clerk webhook signature verification failed");
    return new Response("Invalid webhook", { status: 400 });
  }

  const eventId = request.headers.get("svix-id");
  if (!eventId) {
    return new Response("Missing webhook event ID", { status: 400 });
  }
  if (!isUserEvent(event)) {
    return new Response("Ignored", { status: 200 });
  }

  try {
    await processClerkWebhook(eventId, event);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Clerk webhook processing failed", error instanceof Error ? error.name : "Unknown error");
    return new Response("Webhook processing failed", { status: 500 });
  }
}
