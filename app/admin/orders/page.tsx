"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

/* =========================
   TYPES
========================= */
type Order = {
  id: string;
  totalCents: number;
  status: string;
  createdAt: string;
  email?: string;
  items: {
    name: string;
    quantity: number;
    priceCents: number;
  }[];
};

type Stats = {
  totalOrders: number;
  totalRevenue: number;
  monthRevenue: number;
};

type ChartItem = {
  date: string;
  value: number;
};

type ProductStat = {
  name: string;
  quantity: number;
  revenue: number;
  margin: number;
};

/* =========================
   COMPONENT
========================= */
export default function AdminOrdersPage() {

  // ✅ FIX SSR ULTRA SAFE (IMPORTANT)
  const toast = useToast();
  const showToast = (...args: any[]) => {
    if (toast && typeof toast.showToast === "function") {
      toast.showToast(...args);
    }
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [topProducts, setTopProducts] = useState<ProductStat[]>([]);
  const [topRevenueProducts, setTopRevenueProducts] = useState<ProductStat[]>([]);
  const [averageCart, setAverageCart] = useState(0);

  const [filter, setFilter] = useState("ACTIVE");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* =========================
     FETCH
  ========================= */
  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `/api/admin/orders?status=${filter}&search=${search}&page=${page}`
      );

      const data = await res.json();

      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);

      const productMap: Record<string, { quantity: number; revenue: number }> = {};

      let total = 0;

      data.orders.forEach((order: Order) => {
        total += order.totalCents;

        order.items?.forEach((item) => {
          if (!productMap[item.name]) {
            productMap[item.name] = {
              quantity: 0,
              revenue: 0,
            };
          }

          productMap[item.name].quantity += item.quantity;
          productMap[item.name].revenue +=
            item.priceCents * item.quantity;
        });
      });

      const enriched = Object.entries(productMap).map(
        ([name, data]) => {
          const revenue = data.revenue / 100;
          const margin = revenue * 0.6;

          return {
            name,
            quantity: data.quantity,
            revenue,
            margin,
          };
        }
      );

      setTopProducts(
        [...enriched].sort((a, b) => b.quantity - a.quantity).slice(0, 5)
      );

      setTopRevenueProducts(
        [...enriched].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
      );

      if (data.orders.length > 0) {
        setAverageCart(total / data.orders.length / 100);
      }

    } catch {
      showToast("Erreur chargement commandes", "error");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/orders/stats");
      const data = await res.json();
      setStats(data);
    } catch {
      showToast("Erreur stats", "error");
    }
  };

  const fetchChart = async () => {
    try {
      const res = await fetch("/api/admin/orders/chart");
      const data = await res.json();
      setChartData(data.data || []);
    } catch {
      showToast("Erreur graphique", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchChart();
  }, [filter, search, page]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      showToast("Statut mis à jour", "success");
      fetchOrders();
    } catch {
      showToast("Erreur update", "error");
    }
  };

  return (
    <div className="container py-10">
      <h1 style={title}>Dashboard commandes</h1>

      {stats && (
        <div style={kpiGrid}>
          <div style={kpiCard}>
            <p>Total commandes</p>
            <strong>{stats.totalOrders}</strong>
          </div>

          <div style={kpiCard}>
            <p>CA total</p>
            <strong>{(stats.totalRevenue / 100).toFixed(2)} €</strong>
          </div>

          <div style={kpiCard}>
            <p>CA du mois</p>
            <strong>{(stats.monthRevenue / 100).toFixed(2)} €</strong>
          </div>

          <div style={kpiCard}>
            <p>Panier moyen</p>
            <strong>{averageCart.toFixed(2)} €</strong>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div style={chartBox}>
          <h3>Évolution du CA (30 jours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#a16207" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {topRevenueProducts.length > 0 && (
        <div style={chartBox}>
          <h3>Top produits (CA)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topRevenueProducts}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#a16207" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {topProducts.length > 0 && (
        <div style={chartBox}>
          <h3>Top produits (volume)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="quantity" fill="#111" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {topRevenueProducts.length > 0 && (
        <div style={topBox}>
          <h3>Marge estimée (top produits)</h3>
          {topRevenueProducts.map((p, i) => (
            <div key={i}>
              {p.name} — {p.margin.toFixed(2)} €
            </div>
          ))}
        </div>
      )}

      <a href="/api/admin/orders/export" style={exportBtn}>
        Export CSV
      </a>

      <input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        style={searchInput}
      />

      <div style={filters}>
        {["ACTIVE", "PENDING", "PAID", "FAILED"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setPage(1);
              setFilter(f);
            }}
            style={{
              ...filterBtn,
              background: filter === f ? "#111" : "#eee",
              color: filter === f ? "white" : "#111",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {orders.map((order) => (
        <div key={order.id} style={card}>
          <strong>#{order.id.slice(0, 8)}</strong>
          <p style={date}>{new Date(order.createdAt).toLocaleString()}</p>
          <p>{order.email || "Pas d’email"}</p>
          <strong>{(order.totalCents / 100).toFixed(2)} €</strong>

          <select
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      ))}

      <div style={pagination}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          ←
        </button>

        <span>Page {page} / {totalPages}</span>

        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          →
        </button>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const title = { fontSize: "28px", marginBottom: "20px" };
const kpiGrid = { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", marginBottom: "30px" };
const kpiCard = { background: "white", padding: "20px", borderRadius: "12px", textAlign: "center" as const };
const chartBox = { background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px" };
const topBox = { background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px" };
const exportBtn = { display: "inline-block", marginBottom: "20px", padding: "10px", background: "#111", color: "white", borderRadius: "8px", textDecoration: "none" };
const searchInput = { padding: "10px", width: "100%", marginBottom: "20px" };
const filters = { display: "flex", gap: "10px", marginBottom: "20px" };
const filterBtn = { padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" };
const card = { background: "white", padding: "20px", borderRadius: "12px", marginBottom: "15px" };
const date = { fontSize: "12px", color: "#666" };
const pagination = { marginTop: "20px", display: "flex", gap: "10px" };