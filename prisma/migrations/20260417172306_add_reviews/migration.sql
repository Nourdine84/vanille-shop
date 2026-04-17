-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isPack" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "packItems" TEXT,
ADD COLUMN     "pricing" JSONB,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'g';

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE INDEX "Product_isPack_idx" ON "Product"("isPack");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
