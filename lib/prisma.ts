import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 🔥 DETECTION BUILD (FIABLE VERCEL)
 */
const isBuild =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.VERCEL_ENV === "production" && process.env.NEXT_RUNTIME === undefined;

/**
 * 🔥 MOCK SAFE POUR BUILD
 */
function createMockPrisma(): PrismaClient {
  return new Proxy(
    {},
    {
      get() {
        return () => {
          console.warn("⛔ Prisma call blocked during build");
          return null;
        };
      },
    }
  ) as PrismaClient;
}

/**
 * 🔥 INSTANCE
 */
export const prisma: PrismaClient = isBuild
  ? createMockPrisma()
  : globalForPrisma.prisma ??
    new PrismaClient({
      log: ["error"],
    });

if (!isBuild && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}