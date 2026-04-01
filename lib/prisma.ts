import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 🔥 DETECTION BUILD VERCEL (FIABLE)
 */
const isBuild =
  process.env.VERCEL === "1" &&
  process.env.NEXT_RUNTIME === undefined;

/**
 * 🔥 INSTANCE SAFE
 */
export const prisma: PrismaClient = isBuild
  ? ({} as PrismaClient) // ⛔ bloque Prisma au build
  : globalForPrisma.prisma ??
    new PrismaClient({
      log: ["error", "warn"],
    });

/**
 * 🔥 DEV CACHE
 */
if (!isBuild && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}