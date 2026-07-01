# PowerLog

A powerlifting tracker built with Next.js, Prisma, and Auth.js. Log your sets, track volume over time, and see your estimated 1RM progress automatically.

## Stack

Next.js 16, TypeScript, Prisma 7, SQLite, Auth.js, Recharts, Tailwind CSS

## Setup

Install dependencies, add a `.env` file with `DATABASE_URL` and `AUTH_SECRET`, run migrations with `npx prisma migrate dev`, seed exercises with `npx tsx prisma/seed.ts`, then start with `npm run dev`