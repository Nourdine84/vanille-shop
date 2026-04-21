import { Page } from "@playwright/test";

export async function loginAsAdmin(page: Page) {
  await page.context().addCookies([
    {
      name: "admin",
      value: "true",
      url: "http://localhost:3000",
      path: "/",
    },
  ]);
}