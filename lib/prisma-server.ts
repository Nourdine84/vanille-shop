import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 🔥 SAFE VERCEL BUILD DETECTION
 */
const isBuild =
  process.env.VERCEL === "1" &&
  process.env.NEXT_RUNTIME === undefined;

/**
 * 🔥 Prisma instance
 */
export const prisma: PrismaClient = isBuild
  ? ({} as PrismaClient) // ⛔ bloque Prisma pendant build
  : globalForPrisma.prisma ??
    new PrismaClient({
      log: ["error", "warn"],
    });

/**
 * 🔥 Dev cache (évite multi instances)
 */
if (!isBuild && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}