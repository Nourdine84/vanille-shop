import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 🔥 DETECTION BUILD FIABLE
 */
const isBuild =
  process.env.NEXT_PHASE === "phase-production-build";

/**
 * 🔥 INSTANCE SAFE
 */
export const prisma =
  isBuild
    ? ({} as PrismaClient) // ⛔ bloque Prisma au build
    : globalForPrisma.prisma ??
      new PrismaClient({
        log: ["error"],
      });

if (!isBuild && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}