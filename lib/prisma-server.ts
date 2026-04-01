import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

/**
 * 🔥 Empêche Prisma pendant le build Vercel
 */
if (process.env.NEXT_PHASE === "phase-production-build") {
  console.log("⛔ Prisma disabled during build");

  prisma = {} as PrismaClient; // mock safe pour build
} else {
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };