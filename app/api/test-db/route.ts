import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$connect();
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ error: e.message });
  }
}
