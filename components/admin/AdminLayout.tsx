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
    { name: "Dashboard", href: "/admin" },
    { name: "Produits", href: "/admin/products" },
    { name: "Commandes", href: "/admin/orders" },
    { name: "Blog", href: "/admin/blog" },
    { name: "Paramètres", href: "/admin/settings" },
  ];

  return (
    <div style={layout}>
      {/* SIDEBAR */}
      <div style={sidebar}>
        <h2 style={logo}>VanilleOr Admin</h2>

        {menu.map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                ...menuItem,
                background:
                  pathname === item.href ? "#a16207" : "transparent",
                color: pathname === item.href ? "white" : "#333",
              }}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </div>

      {/* CONTENT */}
      <div style={content}>{children}</div>
    </div>
  );
}

/* ================= STYLE ================= */

const layout = {
  display: "flex",
};

const sidebar = {
  width: "220px",
  minHeight: "100vh",
  background: "#111",
  color: "white",
  padding: "20px",
};

const logo = {
  marginBottom: "20px",
};

const menuItem = {
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "10px",
  cursor: "pointer",
};

const content = {
  flex: 1,
  padding: "20px",
  background: "#faf7f2",
};