import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================
   NORMALISATION IMAGE
========================= */
function cleanImage(image) {
  if (!image) return "";

  return image
    .trim()
    .replace(/^.*[\\/]/, "") // enlève tous les dossiers
    .replace(/^images\//, "")
    .replace(/^products\//, "")
    .replace(/^collections\//, "");
}

/* =========================
   SCRIPT
========================= */
async function run() {
  console.log("🚀 CLEAN IMAGE DB START");

  const products = await prisma.product.findMany();

  console.log(`📦 ${products.length} produits trouvés`);

  for (const p of products) {
    const cleaned = cleanImage(p.imageUrl);

    if (cleaned !== p.imageUrl) {
      console.log(`🔧 FIX ${p.name}`);
      console.log(`   AVANT: ${p.imageUrl}`);
      console.log(`   APRÈS: ${cleaned}`);

      await prisma.product.update({
        where: { id: p.id },
        data: {
          imageUrl: cleaned,
        },
      });
    }
  }

  console.log("✅ CLEAN DB DONE");
}

run()
  .catch((e) => {
    console.error("❌ ERROR:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });