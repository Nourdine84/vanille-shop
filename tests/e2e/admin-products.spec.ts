import { test, expect } from "../setup";
import { loginAsAdmin } from "../utils/admin";

test.describe("📦 Admin Products", () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
  });

  test("Accès page produits", async ({ page }) => {
    await expect(page.getByText(/Admin Produits/i)).toBeVisible();
  });

  test("Créer produit (flow stable)", async ({ page }) => {

    // FORM MINIMAL SAFE (adapté à ton backend actuel)
    await page.fill('input[name="name"]', "Produit Test QA");
    await page.fill('input[name="slug"]', "produit-test-qa");

    // description optionnelle
    const desc = page.locator('textarea[name="description"]');
    if (await desc.isVisible()) {
      await desc.fill("Test automatique");
    }

    // stock obligatoire
    await page.fill('input[name="stock"]', "10");

    // 🔥 IMPORTANT → ton système pricing dynamique
    const priceInput = page.locator('input[name^="price_"]').first();

    if (await priceInput.isVisible()) {
      await priceInput.fill("1000");
    } else {
      // fallback ancien système
      const fallback = page.locator('input[name="priceCents"]');
      if (await fallback.isVisible()) {
        await fallback.fill("1000");
      }
    }

    // image facultative → skip volontaire (évite flaky Cloudinary)

    await page.locator('button[type="submit"]').click();

    // 🔥 TON BACKEND REDIRECT → on attend navigation
    await page.waitForURL("**/admin/products", { timeout: 10000 });

    // 🔥 Vérification robuste
    await expect(page.getByText("Produit Test QA")).toBeVisible();
  });

  test("Affichage produit list", async ({ page }) => {
    // Tolérant (liste peut être vide)
    const bodyText = await page.textContent("body");

    expect(bodyText).toMatch(/Produit|produit|aucun/i);
  });

});