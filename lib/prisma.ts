import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 🔥 FACTORY PRISMA (SAFE PROD + VERCEL FIX)
 */
function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  // ✅ priorité DATABASE_URL (FIX PRINCIPAL)
  if (databaseUrl) {
    return new PrismaClient({
      datasourceUrl: databaseUrl,
      log: ["error"],
    });
  }

  // ⚠️ fallback Accelerate (optionnel)
  if (process.env.PRISMA_ACCELERATE_URL) {
    return new PrismaClient({
      datasourceUrl: process.env.PRISMA_ACCELERATE_URL,
      log: ["error"],
    });
  }

  // fallback ultime (dev local)
  return new PrismaClient({
    log: ["error"],
  });
}

/**
 * 🔥 INSTANCE UNIQUE
 */
export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

/**
 * 🔥 CACHE DEV
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}