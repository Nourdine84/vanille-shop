import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";

console.log("🔧 NextAuth config chargée");

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        console.log("📧 Tentative de connexion pour:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Email ou mot de passe manquant");
          return null;
        }

        try {
          const user = await (prisma as any).user.findUnique({
            where: { email: credentials.email },
          });

          console.log("👤 Utilisateur trouvé:", user ? "Oui" : "Non");

          if (!user || !user.password) {
            console.log("❌ Utilisateur non trouvé ou pas de mot de passe");
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log("🔑 Mot de passe valide:", isValid);

          if (!isValid) {
            return null;
          }

          console.log("✅ Connexion réussie pour:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("💥 Erreur dans authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔄 JWT callback", { user: !!user });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔄 Session callback", { tokenId: token.id });
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };