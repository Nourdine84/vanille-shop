const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        slug: "vanille-bourbon-premium",
        name: "Vanille Bourbon Premium",
        description: "Gousses premium de Madagascar.",
        priceCents: 14900,
        currency: "EUR",
        imageUrl: "/images/vanille1.jpg",
        stock: 100,
        isActive: true
      },
      {
        slug: "vanille-gourmet",
        name: "Vanille Gourmet",
        description: "Qualite exceptionnelle.",
        priceCents: 12900,
        currency: "EUR",
        imageUrl: "/images/vanille2.jpg",
        stock: 50,
        isActive: true
      }
    ]
  });

  console.log("Seed termine ✅");
}

main()
  .catch((e) => {
    console.error("Seed error ❌", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
