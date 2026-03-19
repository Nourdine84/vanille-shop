import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const dynamic = "force-dynamic"; // 🔥 évite crash build Vercel

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 🔒 TEMPORAIRE (pas de Prisma ici pour éviter crash build)
        if (
          credentials?.email === "test@test.com" &&
          credentials?.password === "1234"
        ) {
          return {
            id: "1",
            email: "test@test.com",
            name: "Test User",
          };
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };