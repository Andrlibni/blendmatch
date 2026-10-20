import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

class PendingApproval extends CredentialsSignin {
  code = "pending";
}

const credentialsSchema = z.object({
  email: z.email().transform((e) => e.toLowerCase()),
  password: z.string().min(1).max(200),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/en/trade/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const account = await db.tradeAccount.findUnique({ where: { email: parsed.data.email } });
        if (!account || !(await bcrypt.compare(parsed.data.password, account.passwordHash))) {
          return null;
        }
        if (!account.approved) throw new PendingApproval();
        return { id: account.id, email: account.email, name: account.company };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.accountId = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.accountId) session.user.id = token.accountId as string;
      return session;
    },
  },
});
