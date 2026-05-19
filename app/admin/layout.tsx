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
    {
      name: "Dashboard",
      href: "/admin",
      icon: "📊",
    },

    {
      name: "Produits",
      href: "/admin/products",
      icon: "📦",
    },

    {
      name: "Commandes",
      href: "/admin/orders",
      icon: "🧾",
    },

    {
      name: "Blog",
      href: "/admin/blog",
      icon: "📝",
    },

    {
      name: "B2B",
      href: "/admin/b2b",
      icon: "🏢",
    },

    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: "📈",
    },

    {
      name: "Paramètres",
      href: "/admin/settings",
      icon: "⚙️",
    },
  ];

  return (
    <div style={layout}>
      {/* ================= SIDEBAR ================= */}

      <aside style={sidebar}>
        <div>
          <div style={logoBox}>
            <h2 style={logo}>
              Vanille’Or Admin
            </h2>

            <p style={logoSub}>
              Premium Console
            </p>
          </div>

          <nav style={nav}>
            {menu.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(
                  item.href + "/"
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={link}
                >
                  <div
                    style={{
                      ...menuItem,

                      background: isActive
                        ? "linear-gradient(135deg,#b7791f,#8b5e14)"
                        : "transparent",

                      color: isActive
                        ? "white"
                        : "#d1d5db",

                      boxShadow: isActive
                        ? "0 8px 20px rgba(183,121,31,0.25)"
                        : "none",
                    }}
                  >
                    <span style={menuIcon}>
                      {item.icon}
                    </span>

                    <span>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}
        <div style={footer}>
          <div style={footerCard}>
            <p style={footerTitle}>
              Vanille’Or
            </p>

            <p style={footerText}>
              Admin premium e-commerce
            </p>
          </div>
        </div>
      </aside>

      {/* ================= CONTENT ================= */}

      <main style={content}>
        {children}
      </main>
    </div>
  );
}

/* ================= STYLES ================= */

const layout: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: "#f8f5ef",
};

const sidebar: React.CSSProperties = {
  width: 260,
  background: "#0f0f0f",
  color: "white",
  padding: 22,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
  height: "100vh",
  borderRight: "1px solid rgba(255,255,255,0.05)",
};

const logoBox: React.CSSProperties = {
  marginBottom: 34,
};

const logo: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 800,
};

const logoSub: React.CSSProperties = {
  color: "#9ca3af",
  marginTop: 6,
  fontSize: 13,
};

const nav: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const link: React.CSSProperties = {
  textDecoration: "none",
};

const menuItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px 16px",
  borderRadius: 14,
  transition: "0.2s ease",
  fontWeight: 700,
};

const menuIcon: React.CSSProperties = {
  fontSize: 18,
};

const footer: React.CSSProperties = {
  marginTop: 30,
};

const footerCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 18,
  padding: 16,
};

const footerTitle: React.CSSProperties = {
  margin: 0,
  fontWeight: 800,
};

const footerText: React.CSSProperties = {
  marginTop: 6,
  color: "#9ca3af",
  fontSize: 12,
};

const content: React.CSSProperties = {
  flex: 1,
  padding: 30,
  overflowX: "hidden",
};