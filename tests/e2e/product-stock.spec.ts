import { test, expect } from "@playwright/test";
import { openCart } from "../utils/cart";

test("⚠️ Affichage stock limité", async ({ page }) => {
  await page.goto("/products");

  await expect(page.getByText("Stock limité")).toBeVisible();
});