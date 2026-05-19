-- CreateEnum
CREATE TYPE "ReclamationStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReclamationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "Reclamation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "orderId" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "ReclamationPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "ReclamationStatus" NOT NULL DEFAULT 'NEW',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reclamation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reclamation_status_idx" ON "Reclamation"("status");

-- CreateIndex
CREATE INDEX "Reclamation_priority_idx" ON "Reclamation"("priority");

-- CreateIndex
CREATE INDEX "Reclamation_email_idx" ON "Reclamation"("email");

-- CreateIndex
CREATE INDEX "Reclamation_createdAt_idx" ON "Reclamation"("createdAt");
