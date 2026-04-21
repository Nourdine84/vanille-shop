import { test, expect } from "../setup";

test.describe("📱 Responsive mobile", () => {
  test("Navigation mobile produits → panier", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Ajouter" }).first().click();

    const miniCart = page.getByTestId("mini-cart");

    if (!(await miniCart.isVisible())) {
      await page.getByTestId("cart-button").click();
    }

    await expect(miniCart).toBeVisible();
    await expect(page.getByTestId("checkout-button")).toBeVisible();
  });

  test("Page checkout visible sur mobile", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toBeVisible();
  });
});