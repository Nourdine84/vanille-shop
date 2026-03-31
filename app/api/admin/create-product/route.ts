import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const imageUrl = formData.get("imageUrl");
    const priceCents = formData.get("priceCents");
    const stock = formData.get("stock");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const isActive = formData.get("isActive");

    if (
      typeof name !== "string" ||
      typeof slug !== "string" ||
      typeof description !== "string" ||
      typeof imageUrl !== "string" ||
      typeof priceCents !== "string" ||
      typeof stock !== "string" ||
      typeof category !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        priceCents: Number(priceCents),
        stock: Number(stock),
        category: category.trim(),
        subCategory:
          typeof subCategory === "string" && subCategory.trim()
            ? subCategory.trim()
            : null,
        isActive: isActive === "on",
      },
    });

    return NextResponse.redirect(new URL("/admin/products", req.url), {
      status: 303,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}