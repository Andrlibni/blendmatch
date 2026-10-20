// Creates the demo accounts used in development. Safe to run repeatedly.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
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
  console.log(`Seeded ${accounts.length} accounts.`);
}

main().finally(() => db.$disconnect());
