import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "FAILED"
  | "CANCELED";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const statusParam = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);

    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    let where: any = {};

    const validStatuses: OrderStatus[] = [
      "PENDING",
      "PAID",
      "SHIPPED",
      "DELIVERED",
      "FAILED",
      "CANCELED",
    ];

    if (!statusParam || statusParam === "ACTIVE") {
      where.status = {
        in: ["PENDING", "PAID", "SHIPPED"],
      };
    } else if (
      statusParam !== "ALL" &&
      validStatuses.includes(statusParam as OrderStatus)
    ) {
      where.status = statusParam;
    }

    if (search) {
      where.OR = [
        { id: { contains: search } },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (error) {
    console.error("🔥 ADMIN ORDERS ERROR:", error);

    return NextResponse.json(
      {
        orders: [],
        total: 0,
        page: 1,
        totalPages: 1,
      },
      { status: 500 }
    );
  }
}