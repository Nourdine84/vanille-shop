import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   INIT STRIPE
========================= */
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY manquante");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =========================
   TYPES
========================= */
type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

type ProductDB = {
  id: string;
  stock: number;
};

/* =========================
   BASE URL SAFE
========================= */
function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");

  if (origin) return origin;

  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  return "http://localhost:3000";
}

/* =========================
   POST CHECKOUT
========================= */
export async function POST(req: Request) {
  try {
    const prisma = (await import("@/lib/prisma")).prisma;

    /* =========================
       PARSE BODY
    ========================= */
    let body: { cart: CartItem[] };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "JSON invalide" },
        { status: 400 }
      );
    }

    if (!body.cart || body.cart.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);

    /* =========================
       FETCH PRODUITS
    ========================= */
    const ids = body.cart.map((item) =>
      item.id.split("-")[0]
    );

    const products: ProductDB[] = await prisma.product.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        stock: true,
      },
    });

    const productMap = new Map<string, ProductDB>(
      products.map((p) => [p.id, p])
    );

    /* =========================
       VALIDATION PANIER
    ========================= */
    for (const item of body.cart) {
      const cleanId = item.id.split("-")[0];
      const product = productMap.get(cleanId);

      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable: ${item.name}` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${item.name}` },
          { status: 400 }
        );
      }
    }

    /* =========================
       CALCUL TOTAL
    ========================= */
    const subtotal = body.cart.reduce(
      (acc, item) => acc + item.priceCents * item.quantity,
      0
    );

    const FREE_SHIPPING = 5000;
    const shippingCost = subtotal >= FREE_SHIPPING ? 0 : 490;
    const total = subtotal + shippingCost;

    /* =========================
       CREATE ORDER
    ========================= */
    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        totalCents: total,
        currency: "EUR",
        items: body.cart,
      },
    });

    /* =========================
       STRIPE LINE ITEMS
    ========================= */
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      body.cart.map((item) => {
        const imageUrl =
          item.imageUrl?.startsWith("http")
            ? item.imageUrl
            : `${baseUrl}${item.imageUrl || "/images/product-vanille.jpg"}`;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              description:
                "Vanille premium de Madagascar — Vanille’Or",
              images: [imageUrl],
            },
            unit_amount: item.priceCents,
          },
          quantity: item.quantity,
        };
      });

    /* SHIPPING */
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frais de livraison",
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    /* =========================
       CREATE SESSION
    ========================= */
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH"],
      },

      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        orderId: order.id,
      },
    });

    /* =========================
       LINK ORDER
    ========================= */
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("🔥 STRIPE ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Erreur Stripe",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DEBUG
========================= */
export async function GET() {
  return NextResponse.json({
    message: "Checkout API OK",
    stripe: !!process.env.STRIPE_SECRET_KEY,
  });
}