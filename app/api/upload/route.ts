// app/api/upload/route.ts

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Fichier manquant" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "vanilleor",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    if (!uploadResult?.secure_url) {
      throw new Error("Upload Cloudinary échoué");
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
    });

  } catch (error: any) {
    console.error("🔥 UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error: "Upload failed",
        message: error?.message,
      },
      { status: 500 }
    );
  }
}