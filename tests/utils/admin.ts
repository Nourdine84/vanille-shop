import { Page } from "@playwright/test";

export async function loginAsAdmin(page: Page) {
  await page.context().addCookies([
    {
      name: "admin",
      value: "true",
      domain: "localhost",
      path: "/",
    },
  ]);
}