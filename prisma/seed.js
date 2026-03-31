const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        slug: "vanille-bourbon-premium",
        name: "Vanille Bourbon Premium",
        description: "Gousses de vanille Bourbon de Madagascar.",
        priceCents: 14900,
        currency: "EUR",
        imageUrl: "/images/product-vanille.jpg", // ✅ CORRIGÉ
        stock: 100,
        isActive: true,
      },
      {
        slug: "vanille-gourmet",
        name: "Vanille Gourmet",
        description: "Qualité exceptionnelle pour pâtisserie haut de gamme.",
        priceCents: 12900,
        currency: "EUR",
        imageUrl: "/images/product-vanille.jpg", // ✅ CORRIGÉ
        stock: 50,
        isActive: true,
      },
    ],
  });

  console.log("Seed terminé ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });