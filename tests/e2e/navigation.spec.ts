import { test, expect } from "../setup";

test("🧭 Navigation header", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const burger = page.getByTestId("burger-button");
  const navDesktop = page.getByTestId("nav-products");

  /* ================= NAV PRODUCTS ================= */

  if (await burger.isVisible().catch(() => false)) {
    // 📱 MOBILE FLOW
    await burger.click();

    const mobileLink = page.getByTestId("nav-products-mobile");

    if (await mobileLink.isVisible().catch(() => false)) {
      await mobileLink.click();
    } else {
      // fallback sécurité
      await navDesktop.click();
    }
  } else {
    // 💻 DESKTOP FLOW
    await navDesktop.click();
  }

  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(/\/products/);

  /* ================= BACK HOME ================= */

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const logo = page.getByTestId("nav-home").first();

  await expect(logo).toBeVisible();
  await logo.click();

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/$/);
});