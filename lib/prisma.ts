import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

function createPrismaClient() {
  return new PrismaClient({
    log: ["error"],
  });
}

/**
 * 🔥 CRITIQUE : empêche Prisma pendant build Vercel
 */
if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
  // 👉 pendant le build, Next n’a PAS DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.log("⛔ Prisma skipped (no DATABASE_URL during build)");
    prisma = {} as PrismaClient;
  } else {
    prisma = createPrismaClient();
  }
} else {
  // dev ou runtime
  if (!(global as any).prisma) {
    (global as any).prisma = createPrismaClient();
  }
  prisma = (global as any).prisma;
}

export { prisma };