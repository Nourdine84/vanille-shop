import { test, expect } from "@playwright/test";

test("Accès page produit", async ({ page }) => {
  await page.goto("http://localhost:3001/products");

  await page.getByText("Voir").first().click();

  await expect(page.locator("h1")).toBeVisible();
});