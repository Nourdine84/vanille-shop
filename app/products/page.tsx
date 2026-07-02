import { prisma } from "@/lib/prisma";
import ProductsClient from "./products-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isPack: false },
    orderBy: { createdAt: "desc" },
  });

  return <ProductsClient products={products} />;
}
