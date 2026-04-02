import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 🔥 DETECTION BUILD (évite crash Vercel)
 */
const isBuild =
  process.env.NEXT_PHASE === "phase-production-build";

/**
 * 🔥 URL PRIORITAIRE
 */
const databaseUrl =
  process.env.PRISMA_ACCELERATE_URL ||
  process.env.DATABASE_URL;

/**
 * 🔥 INSTANCE PRISMA
 */
export const prisma =
  isBuild
    ? ({} as PrismaClient)
    : globalForPrisma.prisma ??
      new PrismaClient({
        datasourceUrl: databaseUrl,
        log: ["error"],
      });

/**
 * 🔥 CACHE DEV
 */
if (!isBuild && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}