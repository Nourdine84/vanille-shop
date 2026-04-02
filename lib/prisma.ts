import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 🔥 DETECTION BUILD
 */
const isBuild =
  process.env.NEXT_PHASE === "phase-production-build";

/**
 * 🔥 FACTORY PRISMA (SAFE)
 */
function createPrismaClient() {
  // ⚡ Runtime → Accelerate
  if (process.env.PRISMA_ACCELERATE_URL) {
    return new PrismaClient({
      datasourceUrl: process.env.PRISMA_ACCELERATE_URL,
      log: ["error"],
    });
  }

  // fallback local/dev
  return new PrismaClient({
    log: ["error"],
  });
}

/**
 * 🔥 INSTANCE UNIQUE
 */
export const prisma =
  isBuild
    ? ({} as PrismaClient)
    : globalForPrisma.prisma ?? createPrismaClient();

/**
 * 🔥 CACHE DEV
 */
if (!isBuild && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}