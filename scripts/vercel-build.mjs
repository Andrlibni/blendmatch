// Build command used by Vercel (`npm run vercel-build`).
// 1. refreshes the photo manifest
// 2. if a database is connected: applies migrations and creates the admin
// 3. builds Next.js
// Without a database the site still builds, so the first deploy can happen
// before the Neon database is connected.
import { execSync } from "node:child_process";

const run = (cmd, env = process.env) => execSync(cmd, { stdio: "inherit", env });
const env = { ...process.env };

// The Neon integration provides the direct (unpooled) URL under one of these names.
env.DATABASE_URL_UNPOOLED ||= env.POSTGRES_URL_NON_POOLING || env.DATABASE_URL;

run("node scripts/scan-images.mjs");

if (env.DATABASE_URL) {
  run("npx prisma migrate deploy", env);
  run("npx tsx prisma/seed.ts", env);
} else {
  console.warn(
    "\n⚠️  DATABASE_URL is not set: skipping database migrations.\n" +
      "   Connect a Neon database in Vercel → Storage, then redeploy.\n",
  );
}

run("npx next build", env);
