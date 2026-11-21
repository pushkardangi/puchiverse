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

## Partner search and relationship requests

Users without an active couple see "Find Your Person" on the Search tab of the
bottom navigation. The section is
shown only when `GET /api/relationships/me` reports `status: "single"`.
`GET /api/users/search?username=` performs an exact, case-insensitive lookup
(leading `@` stripped) and returns at most one minimal public profile; the
caller, deleted, merged, undiscoverable (`discoverable: false`) and already
coupled users all produce the same empty result. `POST /api/relationship-requests`
(`{ receiverId }`) and `POST /api/relationship-requests/[requestId]/accept`
derive the caller from the Clerk session. Accepting runs in a MongoDB
transaction; a single `relationships` collection tracks each relationship from
pending request to active (or ended/rejected/cancelled), and unique partial
indexes guarantee one pending request per user pair
and one active relationship per user. Searches and requests are limited to 10 per
minute per user using in-memory counters, which are per server instance; use a
shared store for strict limits across instances. Run
`npm run test:partner-search` with `MONGODB_TEST_URI` set as above.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Home screen

The App Router entry point is `app/page.tsx`. The screen is composed in
`components/home/HomePage.tsx`, with reusable layout, home, and common components
under `components/`. Some sample content remains in `data/demoData.ts`.

The Home and Puchis pages use the MongoDB-backed puchi transaction history for
the shared count and sent/received statistics. Sending requires an authenticated
user with an active relationship, and request idempotency is enforced by a
couple- and sender-scoped unique index. `GET /api/puchis/history?page=1&limit=20`
returns a newest-first page of minimal sender details. Memories and other Us content
still include demo data.

The Home page's Love Jar stores notes in MongoDB for the active relationship.
Either partner can use the plus button on the card to add a note for the other;
only the recipient can retrieve and open it. Each partner's count shows notes
received, not notes they wrote.
Run `node --experimental-strip-types --no-warnings --test tests/love-jar.test.mjs`
to check recipient and relationship isolation using mocked database models.

Virtual hugs can be previewed in numerical order from `public/gifs/hugs` before
sending. The server validates and stores the selected filename, and allows only
one pending outgoing hug per sender. Existing pending hugs remain queued. The
recipient sees each hug across the app for at least six seconds after its GIF
loads and marks it seen with Continue. Both partners must have an active
relationship, MongoDB must allow index creation, and the GIF assets must be
present in the deployed `public/gifs/hugs` directory.
Run `node --experimental-strip-types --no-warnings --test tests/virtual-hug.test.mjs`
to check hug delivery and authorization with mocked database models.

## Shared events

Milestones, important dates, and scheduled events use one MongoDB collection,
scoped to the active relationship and distinguished by tag. Both partners can
add, edit, and delete milestones and important dates. The Something special card
shows the nearest upcoming important date or scheduled event, including today;
annual dates recur from their original date, with February 29 observed on
February 28 in non-leap years. Past one-off events and milestones are excluded.
Events added on the card are schedules, not milestones or important dates.
The card can edit or delete the currently displayed schedule.

Shared events start empty; earlier browser-only milestone and date data is left
untouched and is not imported. Milestone photographs remain temporary browser
previews and are not saved or shared. Reminder settings are saved but do not
send notifications yet. Run `node --experimental-strip-types --no-warnings --test tests/events.test.mjs`
to check event validation and countdown behavior.

## Couple profile

`GET /api/couple-profile` returns the active couple's profile and shared
preferences. Both partners can update names, nicknames, start date, tagline and
preferences with `PATCH /api/couple-profile`. Names and photos initially come
from their account records; the start date is blank until set. Profile edits
are scoped to the active relationship. Photo changes in the form are temporary
device-only previews; they are not saved or shared. Us settings remain local to
the device, and earlier browser-only profile and preference data is left
untouched and is not imported.

Run `node --experimental-strip-types --no-warnings --test tests/couple-profile.test.mjs`
to check validation and relationship isolation with mocked database models.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
