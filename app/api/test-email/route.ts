import { NextResponse } from "next/server";
import { sendCustomerOrderEmail } from "@/lib/email";

export async function GET() {
  console.log("🔥 TEST EMAIL TRIGGERED");

  await sendCustomerOrderEmail({
    to: "msanourdine@hotmail.com", // 🔥 IMPORTANT : ton vrai email
    orderId: "TEST-123",
    totalCents: 1299,
    items: [
      {
        name: "Vanille Bourbon Premium",
        quantity: 1,
        priceCents: 1299,
      },
    ],
  });

  return NextResponse.json({ success: true });
}