import { test, expect } from "@playwright/test";

test("Panier vide", async ({ page }) => {
  await page.goto("http://localhost:3001/cart");

  await expect(page.getByText("Votre panier est vide")).toBeVisible();
});