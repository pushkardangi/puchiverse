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
