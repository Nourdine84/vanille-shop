import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"], // ⚡ évite les logs inutiles en prod
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}