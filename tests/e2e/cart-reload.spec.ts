import { test, expect } from "../setup";
import { openCart } from "../utils/cart";

test("🧠 Persistance panier entre pages", async ({ page }) => {
  await page.goto("/products");

  const btn = page.getByRole("button", { name: /Ajouter/i }).first();

  await btn.click();
  await page.waitForTimeout(200);

  await openCart(page);

  await page.getByTestId("increase-qty").click();

  await expect(page.getByTestId("item-quantity")).toHaveText("2");

  // 🔥 reload safe
  await page.reload();
  await page.waitForTimeout(300);

  await openCart(page);

  await expect(page.getByTestId("item-quantity")).toHaveText("2");
});