import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await (prisma as any).user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const orders = user?.orders || [];

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-10">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande.</p>
          <Link href="/products" className="btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Commande du {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="font-semibold">
                    Total : {(order.totalCents / 100).toFixed(2)} €
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === "PAID" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.status === "PAID" ? "Payée" : "En attente"}
                </span>
              </div>

              {/* Détail des produits commandés */}
              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <p className="font-medium mb-2">Produits :</p>
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{((item.priceCents * item.quantity) / 100).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}