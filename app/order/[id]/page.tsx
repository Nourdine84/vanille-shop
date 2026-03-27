import { prisma } from "@/lib/prisma";

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order) {
    return <div style={{ padding: 40 }}>Commande introuvable</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Suivi de commande</h1>

      <p>Status : {order.status}</p>
      <p>Total : {(order.totalCents / 100).toFixed(2)} €</p>

      {order.trackingNumber && (
        <div style={{ marginTop: "20px" }}>
          <h3>📦 Livraison</h3>
          <p>Transporteur : {order.carrier}</p>
          <p>Numéro : {order.trackingNumber}</p>
        </div>
      )}
    </div>
  );
}