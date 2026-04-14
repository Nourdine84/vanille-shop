import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../utils/admin";

test.describe("📦 Admin Products", () => {
  test("Accès page produits", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin/products");

    await expect(page.getByText("Admin Produits")).toBeVisible();
  });

  test("Créer produit", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin/products");

    await page.fill('input[name="name"]', "Produit Test QA");
    await page.fill('input[name="slug"]', "produit-test-qa");
    await page.fill('input[name="description"]', "Test automatique");
    await page.fill('input[name="priceCents"]', "1000");
    await page.fill('input[name="stock"]', "10");

    await page.click('button[type="submit"]');

    await expect(page.getByText("Produit créé avec succès")).toBeVisible();
  });

  test("Affichage produit", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin/products");

    await expect(page.locator("text=Produit")).toBeVisible();
  });
});