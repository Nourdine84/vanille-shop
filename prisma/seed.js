const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Vanille Gourmet Madagascar 250g",
        slug: "vanille-gourmet-250g",
        description: "Vanille premium qualité exceptionnelle",
        imageUrl: "/products/vanille-250.jpg",
        priceCents: 3200,
        stock: 50,
        category: "vanille",
        isActive: true,
      },
      {
        name: "Vanille Gourmet Madagascar 1kg",
        slug: "vanille-gourmet-1kg",
        description: "Vanille premium pour professionnels",
        imageUrl: "/products/vanille-1kg.jpg",
        priceCents: 12000,
        stock: 20,
        category: "vanille",
        isActive: true,
      },
      {
        name: "Cannelle en poudre 1kg",
        slug: "cannelle-poudre-1kg",
        description: "Cannelle de qualité supérieure",
        imageUrl: "/products/cannelle.jpg",
        priceCents: 1000,
        stock: 100,
        category: "epices",
        isActive: true,
      },
    ],
  });

  console.log("🌱 Seed produits OK");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());