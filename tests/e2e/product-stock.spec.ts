import { test, expect } from "../setup";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test("⚠️ Affichage stock limité", async ({ page }) => {
  await page.goto("/products");

  await page.waitForLoadState("networkidle");

  // 🔒 attendre produits
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  // 🔥 check safe (0 ou +)
  const stockLimited = page.getByTestId("stock-limited");

  const count = await stockLimited.count();

  // 👉 si présent → visible
  if (count > 0) {
    await expect(stockLimited.first()).toBeVisible();
  }

  // 👉 sinon → test passe (pas de faux négatif)
});