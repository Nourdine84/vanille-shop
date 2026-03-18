import Link from "next/link"
import { prisma } from "../../../lib/prisma"

export default async function Page() {
  const products = await prisma.product.findMany()

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Produits</h1>

      <Link href="/admin/products/new">
        Ajouter produit
      </Link>

      <div style={{ marginTop: 20 }}>
        {products.map((product) => (
          <div key={product.id}>
            {product.name}
          </div>
        ))}
      </div>
    </div>
  )
}

