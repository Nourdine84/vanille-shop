import { test, expect } from "../setup";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test("Accès page produit", async ({ page }) => {
  await page.goto("/products");

  // 🔒 sécurise le rendu produits
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  // 👉 clic fiable (scope + first)
  await page
    .getByTestId("product-card")
    .first()
    .getByRole("link", { name: /voir/i })
    .click();

  // 🔒 attendre navigation réelle
  await page.waitForLoadState("domcontentloaded");

  await expect(page.locator("h1")).toBeVisible();
});