import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Mes commandes</h1>

      {orders.length === 0 ? (
        <p>Aucune commande pour le moment</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = order.items as any[];

            return (
              <div
                key={order.id}
                className="border rounded-lg p-6 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-semibold">
                      Commande #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      {(order.totalCents / 100).toFixed(2)} €
                    </p>
                    <p
                      className={`text-sm ${
                        order.status === "PAID"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>

                {/* PRODUITS */}
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>

                      <span>
                        {(item.priceCents / 100).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
