import { test, expect } from "@playwright/test";

test("🧠 Persistance panier entre pages", async ({ page }) => {
  await page.goto("/products");

  await page.getByRole("button", { name: "Ajouter" }).first().click();

  // 🔥 FIX overlay
  const overlay = page.locator('[data-testid="cart-overlay"]');
  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  }

  await page.getByTestId("cart-button").click();

  const plusBtn = page.getByRole("button", { name: "+" }).first();
  await plusBtn.click();

  await expect(page.getByTestId("item-quantity")).toHaveText("2");

  await page.getByTestId("checkout-button").click();

  await expect(page.getByText("Quantité : 2")).toBeVisible();
});