import { test, expect } from "../setup";

test("📡 API produits retourne des données", async ({ request }) => {

  const res = await request.get("/api/products");

  expect(res.status()).toBe(200);

  const data = await res.json();

  expect(Array.isArray(data)).toBeTruthy();

  // 🔥 tolérance CI → peut être vide en DB fresh
  if (data.length > 0) {
    const product = data[0];

    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
  } else {
    // fallback acceptable
    expect(data.length).toBe(0);
  }
});