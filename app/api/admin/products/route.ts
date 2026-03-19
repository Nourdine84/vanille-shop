import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ✅ GET safe
export async function GET() {
  return NextResponse.json({ message: "Admin products API OK" });
}

// ✅ POST avec lazy Prisma
export async function POST(req: Request) {
  try {
    const { prisma } = await import("../../../../lib/prisma"); // 🔥 LA SOLUTION

    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        priceCents: body.priceCents,
        imageUrl: body.imageUrl,
        description: "",
        stock: 10,
        isActive: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur création produit" },
      { status: 500 }
    );
  }
}