import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import BlogForm from "@/components/admin/BlogForm";
import { verifyAdminToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import AdminBackButton from "@/components/admin/AdminBackButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const isAdmin = verifyAdminToken(cookies().get(ADMIN_SESSION_COOKIE)?.value);

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) return notFound();

  return (
    <div style={container}>
      <AdminBackButton
        label="Retour dashboard"
        fallback="/admin"
      />

      <br />
      <br />
      
      <h1 style={title}>✏️ Modifier article</h1>
      <BlogForm initialData={post} />
    </div>
  );
}

const container = {
  padding: 30,
};

const title = {
  fontSize: 28,
  marginBottom: 20,
};