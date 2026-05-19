import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatStatus(status: string) {
  switch (status) {
    case "PAID":
      return "Payée";

    case "SHIPPED":
      return "Expédiée";

    case "DELIVERED":
      return "Livrée";

    case "FAILED":
      return "Échec";

    case "CANCELED":
      return "Annulée";

    default:
      return "En attente";
  }
}

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div style={page}>
      <div style={container}>

        <h1 style={title}>
          Mes commandes
        </h1>

        {orders.length === 0 ? (
          <div style={emptyBox}>
            Aucune commande pour le moment.
          </div>
        ) : (
          <div style={ordersGrid}>
            {orders.map((order) => {
              const items = order.items as {
                name: string;
                quantity: number;
                priceCents: number;
              }[];

              return (
                <div key={order.id} style={card}>

                  {/* HEADER */}
                  <div style={top}>
                    <div>
                      <div style={orderId}>
                        #{order.id.slice(0, 8)}
                      </div>

                      <div style={date}>
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div style={status}>
                      {formatStatus(order.status)}
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div style={itemsBox}>
                    {items.map((item, index) => (
                      <div
                        key={index}
                        style={itemRow}
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>

                        <strong>
                          {formatPrice(item.priceCents)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL */}
                  <div style={totalBox}>
                    <span>Total</span>

                    <strong>
                      {formatPrice(order.totalCents)}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const page: React.CSSProperties = {
  background: "#f8f5ef",
  minHeight: "100vh",
  padding: "50px 20px",
};

const container: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
};

const title: React.CSSProperties = {
  fontSize: 42,
  marginBottom: 30,
  fontWeight: 800,
};

const emptyBox: React.CSSProperties = {
  background: "white",
  padding: 30,
  borderRadius: 20,
};

const ordersGrid: React.CSSProperties = {
  display: "grid",
  gap: 24,
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const top: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 24,
};

const orderId: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 20,
};

const date: React.CSSProperties = {
  color: "#777",
  marginTop: 6,
  fontSize: 14,
};

const status: React.CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
  padding: "10px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 700,
  height: "fit-content",
};

const itemsBox: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #eee",
  paddingBottom: 10,
};

const totalBox: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 24,
  fontSize: 20,
  fontWeight: 800,
};