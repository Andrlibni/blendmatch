// Runs after migrations, locally (`npm run setup`) and on every Vercel deploy.
// - Creates the first administrator from ADMIN_EMAIL / ADMIN_PASSWORD if it
//   does not exist yet (an existing account is never overwritten).
// - Creates the demo trade accounts only outside Vercel, or with SEED_DEMO=true.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("seed: ADMIN_EMAIL / ADMIN_PASSWORD not set, no administrator created.");
    return;
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters long.");
  }
  const existing = await db.tradeAccount.findUnique({ where: { email } });
  if (existing) {
    console.log(`seed: administrator ${email} already exists.`);
    return;
  }
  await db.tradeAccount.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      company: "Lento (admin)",
      contactName: "Administrator",
      vatNumber: "IT00000000000",
      country: "IT",
      vatCheck: "format",
      approved: true,
      approvedAt: new Date(),
      role: "admin",
    },
  });
  console.log(`seed: administrator ${email} created.`);
}

async function seedDemo() {
  const trade = await bcrypt.hash("demo-trade", 12);
  const admin = await bcrypt.hash("demo-admin", 12);

  const accounts = [
    {
      email: "admin@lento.local",
      passwordHash: admin,
      company: "Lento S.r.l. (admin)",
      contactName: "Lento Admin",
      vatNumber: "IT00743110157",
      country: "IT",
      vatCheck: "format",
      approved: true,
      role: "admin",
    },
    {
      email: "trade@demo.lento",
      passwordHash: trade,
      company: "Weinbar Langsam GmbH",
      contactName: "Jonas Keller",
      businessType: "wine_bar",
      vatNumber: "DE811569869",
      country: "DE",
      vatCheck: "vies",
      vatCheckName: "Demo account",
      approved: true,
    },
    {
      email: "enoteca@demo.lento",
      passwordHash: trade,
      company: "Enoteca Piano Srl",
      contactName: "Chiara Bassi",
      businessType: "wine_shop",
      vatNumber: "IT00743110157",
      country: "IT",
      vatCheck: "vies",
      vatCheckName: "Demo account",
      approved: true,
    },
    {
      email: "london@demo.lento",
      passwordHash: trade,
      company: "Slow Table Ltd",
      contactName: "Sam Patel",
      businessType: "restaurant",
      vatNumber: "GB553557881",
      country: "GB",
      vatCheck: "hmrc",
      vatCheckName: "Demo account",
      approved: true,
    },
    {
      email: "pending@demo.lento",
      passwordHash: trade,
      company: "Vinbaren Hygge ApS",
      contactName: "Freja Holm",
      businessType: "wine_bar",
      vatNumber: "DK13585628",
      country: "DK",
      vatCheck: "unverified",
      vatCheckNote: "VIES unavailable (demo)",
      approved: false,
    },
  ];

  for (const a of accounts) {
    await db.tradeAccount.upsert({
      where: { email: a.email },
      update: {},
      create: { ...a, approvedAt: a.approved ? new Date() : null, vatCheckedAt: new Date() },
    });
  }
  console.log(`seed: ${accounts.length} demo accounts ready.`);
}

async function main() {
  await seedAdmin();
  if (!process.env.VERCEL || process.env.SEED_DEMO === "true") await seedDemo();
}

main().finally(() => db.$disconnect());
