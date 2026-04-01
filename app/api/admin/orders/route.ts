import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ FIX CRITIQUE
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

/* =========================
   GET ADMIN ORDERS
========================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const statusParam = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);

    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    /* =========================
       SAFE STATUS FILTER
    ========================= */
    const activeStatuses: OrderStatus[] = ["PENDING", "PAID", "SHIPPED"];

    let where: any = {};

    if (!statusParam || statusParam === "ACTIVE") {
      where.status = { in: activeStatuses };
    } else if (statusParam !== "ALL") {
      if (activeStatuses.includes(statusParam as OrderStatus) ||
          ["DELIVERED", "FAILED", "CANCELED"].includes(statusParam)) {
        where.status = statusParam as OrderStatus;
      }
    }

    /* =========================
       SEARCH
    ========================= */
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

    /* =========================
       QUERY
    ========================= */
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.order.count({ where }),
    ]);

    /* =========================
       RESPONSE
    ========================= */
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