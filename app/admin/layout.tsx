import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newReclamationsCount = await prisma.reclamation.count({
    where: { status: "NEW" },
  });

  return (
    <div style={layout}>
      <AdminSidebar
        newReclamationsCount={newReclamationsCount}
      />

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

const content: React.CSSProperties = {
  flex: 1,
  padding: 30,
  overflowX: "hidden",
};
