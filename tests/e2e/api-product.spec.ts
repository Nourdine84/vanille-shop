import { test, expect } from "@playwright/test";

test("📡 API produits retourne des données", async ({ request }) => {
  const res = await request.get("/api/products");

  expect(res.status()).toBe(200);

  const data = await res.json();

  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
});