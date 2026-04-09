import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order) return notFound();

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div style={container}>
      <h1>Commande {order.id.slice(0, 8)}</h1>

      <p>Status : {order.status}</p>
      <p>Total : {formatPrice(order.totalCents)}</p>

      <div style={box}>
        <h3>Client</h3>
        <p>{order.email || "Non renseigné"}</p>
      </div>

      <div style={box}>
        <h3>Articles</h3>

        {items.map((item: any, i: number) => (
          <div key={i} style={row}>
            <span>{item.name}</span>
            <span>
              {item.quantity} × {formatPrice(item.priceCents)}
            </span>
          </div>
        ))}
      </div>

      <div style={box}>
        <h3>Tracking</h3>
        <p>{order.trackingNumber || "Non renseigné"}</p>
        <p>{order.carrier || "Non renseigné"}</p>
      </div>

      <form
        action="/api/admin/orders/update-status"
        method="POST"
        style={form}
      >
        <input type="hidden" name="orderId" value={order.id} />

        <select name="status" defaultValue={order.status}>
          {Object.values(OrderStatus).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          name="trackingNumber"
          defaultValue={order.trackingNumber || ""}
          placeholder="Tracking"
        />

        <input
          name="carrier"
          defaultValue={order.carrier || ""}
          placeholder="Carrier"
        />

        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
}

/* STYLE */

const container = { padding: 30 };
const box = { marginTop: 20, padding: 15, background: "white" };
const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
};
const form = {
  marginTop: 20,
  display: "flex",
  gap: 10,
};