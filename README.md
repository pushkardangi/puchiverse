This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Copy `.env.example` to `.env.local` and configure the Clerk keys and
`MONGODB_URI` with a MongoDB Atlas connection string. Set
`CLERK_WEBHOOK_SIGNING_SECRET` to the signing secret for a Clerk webhook
endpoint at `/api/webhooks/clerk` subscribed to `user.created`, `user.updated`,
`user.deleted`, and `user.merged`. Keep both secrets server-side and never
commit credentials. With the app running, `GET /api/health/db` checks database
connectivity and returns 503 when unavailable.

Webhook processing requires a transaction-capable MongoDB deployment, such as
an Atlas replica set, and permission to create indexes. Clerk delivery is
asynchronous: a missing database user is allowed while synchronization is
pending, but a soft-deleted user is denied access to the protected pages. A
merge retains both user records, marking the deleted identity with
`mergedIntoClerkId`; no application-owned data is deleted or moved. Future
features storing user references must resolve this mapping explicitly.
Profile updates are ordered by Clerk's user update time and then event time;
events with identical values for both cannot be ordered reliably. Existing
Clerk users require a separate backfill or a replay of their user events.

Run `npm run test:webhooks` with `MONGODB_TEST_URI` set to a dedicated test
database on a transaction-capable MongoDB deployment. The test creates and
removes its own uniquely named records, and verifies real signatures using a
temporary test secret. The test runner requires Node.js 22.15 or later.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Home screen

The App Router entry point is `app/page.tsx`. The screen is composed in
`components/home/HomePage.tsx`, with reusable layout, home, and common components
under `components/`. Sample content and the demo date are in `data/demoData.ts`;
the live day calculation is in `hooks/useCountdown.ts`.

The home and Puchis pages share an in-memory demo counter and session history,
which reset on reload. The initial total is sample data and has no historical
entries; the seven-day graph counts only puchis added during the current session,
grouped by the device's local date. No backend is connected, so puchis and prepared hugs are not delivered.
Memories and Us navigation still changes the selection only. Replace the demo
date and remote sample images when real content is available.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
