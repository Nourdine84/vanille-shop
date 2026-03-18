"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "../../../components/ui/toast";

type Order = {
  id: string;
  totalCents: number;
  status: string;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    priceCents: number;
  }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      showToast("Erreur chargement commandes", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        showToast("Erreur mise à jour", "error");
        return;
      }

      showToast("Statut mis à jour", "success");
      fetchOrders();
    } catch {
      showToast("Erreur réseau", "error");
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Commandes</h1>

      {orders.length === 0 ? (
        <p>Aucune commande</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #eee",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              {/* HEADER */}
              <div style={{ marginBottom: "10px" }}>
                <strong>Commande #{order.id.slice(0, 8)}</strong>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ITEMS */}
              <div style={{ marginBottom: "10px" }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ fontSize: "14px" }}>
                    {item.name} x{item.quantity}
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>
                  {(order.totalCents / 100).toFixed(2)} €
                </strong>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}