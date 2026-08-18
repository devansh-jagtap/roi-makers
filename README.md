## ROI Makers

The public site is backed by a Prisma/Supabase lead and subscriber system, Supabase Auth dashboard, Brevo transactional mail, and XLSX/CSV exports.

### Setup

1. Copy `.env.example` to `.env.local` and add Supabase, database, and Brevo credentials.
2. Apply `prisma/migrations/20260818000000_initial/migration.sql` to the Supabase database (or run `npx prisma migrate deploy`).
3. Run `prisma/supabase-rls.sql` in the Supabase SQL editor.
4. Create the first user in Supabase Auth, then create its `profiles` row with `role = 'ADMIN'` and the Auth user UUID in `auth_user_id`.
5. Run `npm run dev`.

Dashboard routes: `/dashboard`, `/dashboard/leads`, `/dashboard/analytics`, `/dashboard/subscribers`, `/dashboard/export`, and `/dashboard/team` (admin only).

`/api/leads` persists a lead before attempting Brevo notifications. `/api/subscribers` handles explicit newsletter/blog opt-ins and `/api/unsubscribe` preserves records while marking them unsubscribed.

## Development

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
