import { test, expect } from "@playwright/test";

test("⚠️ Affichage stock limité", async ({ page }) => {
  await page.goto("/products");

  await expect(page.getByText("Stock limité")).toBeVisible();
});