import { test, expect } from "@playwright/test";

test("🔎 Accès page produit", async ({ page }) => {
  await page.goto("/products");

  await page.getByRole("link", { name: "Voir" }).first().click();

  await expect(page).toHaveURL(/product/);
});