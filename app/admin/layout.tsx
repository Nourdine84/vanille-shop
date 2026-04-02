"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Produits", href: "/admin/products", icon: "📦" },
    { name: "Commandes", href: "/admin/orders", icon: "🧾" },
    { name: "Blog", href: "/admin/blog", icon: "📝" },
  ];

  return (
    <div style={layout}>
      {/* SIDEBAR */}
      <aside style={sidebar}>
        <h2 style={logo}>VanilleOr Admin</h2>

        <nav style={nav}>
          {menu.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    ...menuItem,
                    background: isActive ? "#a16207" : "transparent",
                    color: isActive ? "white" : "#ccc",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTENT */}
      <main style={content}>{children}</main>
    </div>
  );
}

/* ================= STYLE ================= */

const layout = {
  display: "flex",
};

const sidebar = {
  width: "240px",
  minHeight: "100vh",
  background: "#0f0f0f",
  color: "white",
  padding: "20px",
  display: "flex",
  flexDirection: "column" as const,
};

const logo = {
  marginBottom: "30px",
  fontSize: "18px",
  fontWeight: "bold",
};

const nav = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

const menuItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px",
  borderRadius: "10px",
  transition: "0.2s",
  cursor: "pointer",
};

const content = {
  flex: 1,
  padding: "30px",
  background: "#faf7f2",
};