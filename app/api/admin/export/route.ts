import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   HELPERS
========================= */
function formatPrice(cents: number) {
  return (cents / 100).toFixed(2);
}

function escapeCSV(value: any) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`; // ✅ évite bug CSV
}

/* =========================
   EXPORT CSV
========================= */
export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma"); // ✅ FIX CRITIQUE

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "ID",
      "Date",
      "Email",
      "Status",
      "Total (€)",
    ];

    const rows = orders.map((o) => [
      escapeCSV(o.id),
      escapeCSV(new Date(o.createdAt).toISOString()),
      escapeCSV(o.email || ""),
      escapeCSV(o.status),
      escapeCSV(formatPrice(o.totalCents)),
    ]);

    const csv = [
      header.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    console.log("📦 CSV GENERATED:", orders.length, "orders");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=orders.csv",
      },
    });

  } catch (error) {
    console.error("🔥 CSV ERROR:", error);

    return NextResponse.json(
      { error: "Erreur export CSV" },
      { status: 500 }
    );
  }
}