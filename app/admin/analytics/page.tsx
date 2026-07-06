import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

import RevenueChart from "@/components/admin/RevenueChart";
import AdminBackButton from "@/components/admin/AdminBackButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   HELPERS
========================= */

function formatPrice(price: number) {
  return (
    (price / 100)
      .toFixed(2)
      .replace(".", ",") + " €"
  );
}

function groupOrdersByDay(orders: any[]) {
  const map = new Map<
    string,
    {
      revenue: number;
      count: number;
      date: Date;
    }
  >();

  orders.forEach((order) => {
    const d = new Date(order.createdAt);

    const key = d.toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "short",
      }
    );

    if (!map.has(key)) {
      map.set(key, {
        revenue: 0,
        count: 0,
        date: d,
      });
    }

    const current = map.get(key)!;

    if (order.status === "PAID") {
      current.revenue +=
        order.totalCents;
    }

    current.count += 1;
  });

  const sorted = Array.from(
    map.entries()
  ).sort(
    (a, b) =>
      a[1].date.getTime() -
      b[1].date.getTime()
  );

  return {
    labels: sorted.map(([k]) => k),

    revenue: sorted.map(
      ([, v]) => v.revenue / 100
    ),

    orders: sorted.map(
      ([, v]) => v.count
    ),
  };
}

function parseItems(items: any) {
  try {
    if (!items) return [];

    if (typeof items === "string") {
      return JSON.parse(items);
    }

    if (Array.isArray(items)) {
      return items;
    }

    return [];
  } catch {
    return [];
  }
}

/* =========================
   PAGE
========================= */

export default async function AnalyticsPage() {
  const isAdmin = verifyAdminToken(
    cookies().get(ADMIN_SESSION_COOKIE)?.value
  );

  if (!isAdmin) {
    redirect("/admin/login");
  }

  let orders: any[] = [];
  let products: any[] = [];

  try {
    [orders, products] =
      await Promise.all([
        prisma.order.findMany({
          orderBy: {
            createdAt: "asc",
          },
        }),

        prisma.product.findMany(),
      ]);
  } catch (e) {
    console.error(
      "❌ ANALYTICS ERROR:",
      e
    );
  }

  /* ================= KPI ================= */

  const paidOrders = orders.filter(
    (o) => o.status === "PAID"
  );

  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING"
  );

  const shippedOrders = orders.filter(
    (o) => o.status === "SHIPPED"
  );

  const deliveredOrders = orders.filter(
    (o) => o.status === "DELIVERED"
  );

  const revenue = paidOrders.reduce(
    (acc, o) => acc + o.totalCents,
    0
  );

  const averageBasket =
    paidOrders.length > 0
      ? revenue / paidOrders.length
      : 0;

  const outOfStock =
    products.filter(
      (p) => p.stock <= 0
    ).length;

  const lowStockProducts =
    products.filter(
      (p) =>
        p.stock > 0 &&
        p.stock <= 5
    ).length;

  const inactiveProducts =
    products.filter(
      (p) => !p.isActive
    ).length;

  const activeProducts =
    products.filter(
      (p) => p.isActive
    ).length;

  const packProducts =
    products.filter(
      (p) => p.isPack
    ).length;

  const conversionRate =
    orders.length > 0
      ? (
          (paidOrders.length /
            orders.length) *
          100
        ).toFixed(1)
      : "0";

  const recentOrders =
    [...orders]
      .reverse()
      .slice(0, 5);

  const chart =
    groupOrdersByDay(orders);

  /* ================= TOP PRODUCTS ================= */

  const productSalesMap = new Map<
    string,
    {
      name: string;
      quantity: number;
      revenue: number;
    }
  >();

  paidOrders.forEach((order) => {
    const items = parseItems(
      order.items
    );

    items.forEach((item: any) => {
      const existing =
        productSalesMap.get(item.id);

      if (existing) {
        existing.quantity +=
          item.quantity || 1;

        existing.revenue +=
          (item.priceCents || 0) *
          (item.quantity || 1);
      } else {
        productSalesMap.set(item.id, {
          name:
            item.name ||
            "Produit",
          quantity:
            item.quantity || 1,
          revenue:
            (item.priceCents || 0) *
            (item.quantity || 1),
        });
      }
    });
  });

  const topProducts =
    Array.from(
      productSalesMap.values()
    )
      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      )
      .slice(0, 5);

  return (
    <div style={container}>
      <AdminBackButton
        label="Retour dashboard"
        fallback="/admin"
      />

      <div style={hero}>
        <div>
          <p style={heroTag}>
            ANALYTICS
          </p>

          <h1 style={title}>
            Performance globale
          </h1>

          <p style={subtitle}>
            Analyse complète de
            votre activité
            Vanille’Or.
          </p>
        </div>
      </div>

      {/* KPI */}
      <div style={grid}>
        <Card
          title="💰 Chiffre d’affaires"
          value={formatPrice(revenue)}
        />

        <Card
          title="🧾 Commandes"
          value={orders.length}
        />

        <Card
          title="🛒 Panier moyen"
          value={formatPrice(
            averageBasket
          )}
        />

        <Card
          title="💳 Conversion"
          value={`${conversionRate}%`}
        />

        <Card
          title="📦 Ruptures"
          value={outOfStock}
          danger
        />

        <Card
          title="⚠️ Stock faible"
          value={lowStockProducts}
        />

        <Card
          title="✅ Produits actifs"
          value={activeProducts}
        />

        <Card
          title="❌ Produits inactifs"
          value={inactiveProducts}
        />

        <Card
          title="📦 Packs"
          value={packProducts}
        />

        <Card
          title="📊 Produits total"
          value={products.length}
        />

        <Card
          title="🟡 Pending"
          value={pendingOrders.length}
        />

        <Card
          title="🚚 Expédiées"
          value={shippedOrders.length}
        />

        <Card
          title="✅ Livrées"
          value={deliveredOrders.length}
        />
      </div>

      {/* GRAPH */}
      <div style={section}>
        <h2 style={sectionTitle}>
          📈 Évolution ventes
        </h2>

        <RevenueChart
          labels={chart.labels}
          revenue={chart.revenue}
          orders={chart.orders}
        />
      </div>

      {/* TOP PRODUCTS */}
      <div style={section}>
        <h2 style={sectionTitle}>
          🏆 Produits les plus vendus
        </h2>

        <div style={topProductsGrid}>
          {topProducts.map(
            (product, index) => (
              <div
                key={index}
                style={topProductCard}
              >
                <div
                  style={
                    topProductHeader
                  }
                >
                  <span
                    style={
                      rankingBadge
                    }
                  >
                    #{index + 1}
                  </span>

                  <span
                    style={
                      bestSellerBadge
                    }
                  >
                    BEST SELLER
                  </span>
                </div>

                <h3
                  style={
                    topProductName
                  }
                >
                  {product.name}
                </h3>

                <p
                  style={
                    topProductInfo
                  }
                >
                  Quantité vendue :
                  {" "}
                  <strong>
                    {
                      product.quantity
                    }
                  </strong>
                </p>

                <p
                  style={
                    topProductRevenue
                  }
                >
                  {formatPrice(
                    product.revenue
                  )}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div style={section}>
        <h2 style={sectionTitle}>
          🧾 Dernières commandes
        </h2>

        <div style={ordersGrid}>
          {recentOrders.map((o) => (
            <div
              key={o.id}
              style={orderCard}
            >
              <div
                style={
                  orderTop
                }
              >
                <strong>
                  #
                  {o.id.slice(
                    0,
                    8
                  )}
                </strong>

                <span
                  style={
                    statusBadge
                  }
                >
                  {o.status}
                </span>
              </div>

              <p
                style={
                  orderDate
                }
              >
                {new Date(
                  o.createdAt
                ).toLocaleString(
                  "fr-FR"
                )}
              </p>

              <strong
                style={
                  orderPrice
                }
              >
                {formatPrice(
                  o.totalCents
                )}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function Card({
  title,
  value,
  danger,
}: any) {
  return (
    <div
      style={{
        ...card,
        border: danger
          ? "1px solid #fecaca"
          : "1px solid #eee",
      }}
    >
      <p style={cardTitle}>
        {title}
      </p>

      <h3
        style={{
          ...cardValue,
          color: danger
            ? "#dc2626"
            : "#111",
        }}
      >
        {value}
      </h3>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const container = {
  padding: 30,
};

const hero = {
  marginBottom: 30,
};

const heroTag = {
  color: "#a16207",
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: "0.08em",
};

const title = {
  fontSize: 38,
  marginTop: 10,
  marginBottom: 10,
};

const subtitle = {
  color: "#666",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 20,
};

const cardTitle = {
  color: "#777",
  fontSize: 13,
  marginBottom: 14,
};

const cardValue = {
  fontSize: 28,
  fontWeight: 800,
  margin: 0,
};

const section = {
  marginTop: 30,
  background: "white",
  padding: 24,
  borderRadius: 24,
};

const sectionTitle = {
  marginBottom: 20,
};

const topProductsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const topProductCard = {
  background: "#faf7f2",
  padding: 22,
  borderRadius: 20,
  border: "1px solid #eee",
};

const topProductHeader = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const rankingBadge = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const bestSellerBadge = {
  background: "#111",
  color: "white",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 10,
  fontWeight: 700,
};

const topProductName = {
  marginTop: 0,
  marginBottom: 14,
};

const topProductInfo = {
  color: "#666",
  marginBottom: 12,
};

const topProductRevenue = {
  fontSize: 22,
  fontWeight: 800,
  color: "#a16207",
};

const ordersGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
};

const orderCard = {
  background: "#faf7f2",
  padding: 18,
  borderRadius: 18,
};

const orderTop = {
  display: "flex",
  justifyContent:
    "space-between",
};

const statusBadge = {
  background: "#111",
  color: "white",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 11,
};

const orderDate = {
  color: "#777",
  fontSize: 12,
  marginTop: 10,
};

const orderPrice = {
  display: "block",
  marginTop: 12,
  fontSize: 20,
};