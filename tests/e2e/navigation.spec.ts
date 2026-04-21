import { test, expect } from "../setup";

test("🧭 Navigation header", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("nav-products").click();
  await expect(page).toHaveURL("/products");

  await page.getByRole("link", { name: "Vanille'Or" }).click();
  await expect(page).toHaveURL("/");
});