import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const form = await req.formData();
  const method = form.get("_method");

  if (method === "DELETE") {
    try {
      await prisma.blogPost.delete({
        where: { id: params.id },
      });

      return NextResponse.redirect(new URL("/admin/blog", req.url));
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "Erreur suppression" });
    }
  }

  return NextResponse.json({ error: "Méthode invalide" });
}