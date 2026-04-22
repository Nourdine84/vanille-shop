import { test as base, expect } from "@playwright/test";

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  stock?: number;
  category?: string;
  badge?: string | null;
  isPack?: boolean;
  description?: string;
};

/* ================= MOCK SAFE ================= */

let mockProducts: Product[] = [];

try {
  // ✅ chemin officiel attendu
  // tests/mocks/products.ts
  // export const mockProducts = [...]
  const mod = require("./mocks/products");

  if (Array.isArray(mod?.mockProducts)) {
    mockProducts = mod.mockProducts;
  } else {
    throw new Error("mockProducts invalide");
  }

} catch (e) {
  console.warn("⚠️ mockProducts non trouvé → fallback activé");

  // 🔥 fallback ultra safe CI
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
    {
      id: "fallback-2",
      name: "Produit Test 2",
      slug: "produit-test-2",
      priceCents: 1200,
      imageUrl: "/images/test2.jpg",
      stock: 5,
      category: "epices",
      badge: null,
      isPack: false,
      description: "Fallback product 2",
    },
  ];
}

/* ================= EXTENSION PLAYWRIGHT ================= */

export const test = base.extend({
  page: async ({ page }, use) => {

    // 🔥 MOCK GLOBAL API PRODUCTS (CRITIQUE POUR STABILITÉ TESTS)
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

/* ================= EXPORT ================= */

export { expect };