import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 🔥 FACTORY PRISMA (SAFE PROD + DEV)
 */
function createPrismaClient() {
  // ✅ PRIORITÉ : Accelerate (prod)
  if (process.env.PRISMA_ACCELERATE_URL) {
    return new PrismaClient({
      datasourceUrl: process.env.PRISMA_ACCELERATE_URL,
      log: ["error"],
    });
  }

  // ✅ fallback classique (local/dev)
  return new PrismaClient({
    log: ["error"],
  });
}

/**
 * 🔥 INSTANCE UNIQUE (NO BUILD HACK)
 */
export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

/**
 * 🔥 CACHE DEV (évite multi instances)
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}