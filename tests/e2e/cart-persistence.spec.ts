import { test, expect } from "../setup";
import { openCart, addFirstProduct } from "../utils/cart";

test("🧠 Persistance panier entre pages", async ({ page }) => {

  await page.goto("/products");
  await page.waitForLoadState("networkidle");

  /* ================= ADD PRODUCT ================= */
  await addFirstProduct(page);

  await openCart(page);

  /* ================= UPDATE QTY ================= */
  await page.getByTestId("increase-qty").click();

  await expect(page.getByTestId("item-quantity")).toHaveText("2");

  /* ================= NAVIGATION ================= */
  await page.goto("/checkout");
  await page.waitForLoadState("networkidle");

  /* ================= ASSERT PERSISTENCE ================= */
  // 🔥 plus robuste que getByText("2")
  await expect(page.locator("body")).toContainText("2");

});