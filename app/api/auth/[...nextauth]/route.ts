import NextAuth from "next-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = NextAuth({
  providers: [],
});

export { handler as GET, handler as POST };