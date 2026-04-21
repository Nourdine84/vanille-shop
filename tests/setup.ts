import { test as base, expect } from "@playwright/test";

/* 🔥 IMPORT SAFE (évite crash si mauvais chemin) */
let mockProducts: any[] = [];

try {
  // 👉 chemin attendu : tests/mocks/products.ts
  // ⚠️ IMPORTANT : vérifie bien ce dossier
  // tests/
  //   mocks/
  //     products.ts
  mockProducts = require("./mocks/products").mockProducts;
} catch (e) {
  console.warn("⚠️ mockProducts non trouvé, fallback activé");

  // 🔥 FALLBACK (évite crash total des tests)
  mockProducts = [
    {
      id: "fallback-1",
      name: "Produit Test",
      slug: "produit-test",
      priceCents: 1000,
      imageUrl: "/images/test.jpg",
      stock: 10,
      category: "vanille",
      badge: null,
      isPack: false,
      description: "Fallback product",
    },
  ];
}

/* ================= EXTENSION ================= */

export const test = base.extend({
  page: async ({ page }, use) => {

    // 🔥 MOCK GLOBAL API PRODUCTS
    await page.route("**/api/products", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockProducts),
      });
    });

    await use(page);
  },
});

export { expect };