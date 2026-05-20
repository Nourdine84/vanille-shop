import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderItem = {
  id?: string;
  name?: string;
  quantity?: number;
  priceCents?: number;
};

function formatPrice(cents: number) {
  return `${(Number(cents || 0) / 100)
    .toFixed(2)
    .replace(".", ",")} €`;
}

function parseItems(items: any): OrderItem[] {
  try {
    if (!items) return [];

    if (typeof items === "string") {
      return JSON.parse(items);
    }

    if (Array.isArray(items)) {
      return items;
    }

    return [];
  } catch {
    return [];
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(date);
}

function getLogoPath() {
  const logoPath = path.join(
    process.cwd(),
    "public",
    "images",
    "logo-vanilleor.png"
  );

  return fs.existsSync(logoPath)
    ? logoPath
    : null;
}

async function createInvoicePdf(order: any) {
  const pdfDoc =
    await PDFDocument.create();

  const page =
    pdfDoc.addPage([595, 842]);

  const width =
    page.getWidth();

  const height =
    page.getHeight();

  const font =
    await pdfDoc.embedFont(
      StandardFonts.Helvetica
    );

  const boldFont =
    await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );

  const items = parseItems(
    order.items
  );

  /* ================= HEADER ================= */

  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(
      0.07,
      0.07,
      0.07
    ),
  });

  const logoPath =
    getLogoPath();

  if (logoPath) {
    const logoBytes =
      fs.readFileSync(logoPath);

    const logoImage =
      await pdfDoc.embedPng(
        logoBytes
      );

    page.drawImage(
      logoImage,
      {
        x: 50,
        y: height - 90,
        width: 120,
        height: 45,
      }
    );
  }

  page.drawText(
    "FACTURE",
    {
      x: 390,
      y: height - 50,
      size: 24,
      font: boldFont,
      color: rgb(1, 1, 1),
    }
  );

  const invoiceNumber = `FACT-${new Date(
    order.createdAt
  ).getFullYear()}-${order.id
    .slice(0, 8)
    .toUpperCase()}`;

  page.drawText(
    invoiceNumber,
    {
      x: 390,
      y: height - 75,
      size: 10,
      font,
      color: rgb(
        0.8,
        0.8,
        0.8
      ),
    }
  );

  /* ================= COMPANY ================= */

  page.drawText(
    "Vanille’Or",
    {
      x: 50,
      y: height - 160,
      size: 18,
      font: boldFont,
    }
  );

  page.drawText(
    "Vanille & épices premium de Madagascar",
    {
      x: 50,
      y: height - 182,
      size: 10,
      font,
      color: rgb(
        0.35,
        0.35,
        0.35
      ),
    }
  );

  page.drawText(
    "contact@vanilleor.fr",
    {
      x: 50,
      y: height - 198,
      size: 10,
      font,
      color: rgb(
        0.35,
        0.35,
        0.35
      ),
    }
  );

  /* ================= CLIENT ================= */

  page.drawText(
    "CLIENT",
    {
      x: 50,
      y: height - 250,
      size: 13,
      font: boldFont,
    }
  );

  page.drawText(
    order.email ||
      order.user?.email ||
      "Client non renseigné",
    {
      x: 50,
      y: height - 272,
      size: 10,
      font,
    }
  );

  page.drawText(
    `Commande : #${order.id.slice(
      0,
      8
    )}`,
    {
      x: 50,
      y: height - 288,
      size: 10,
      font,
    }
  );

  page.drawText(
    `Date : ${formatDate(
      order.createdAt
    )}`,
    {
      x: 50,
      y: height - 304,
      size: 10,
      font,
    }
  );

  /* ================= TABLE ================= */

  let y = height - 360;

  page.drawRectangle({
    x: 50,
    y,
    width: 495,
    height: 28,
    color: rgb(
      0.96,
      0.95,
      0.92
    ),
  });

  page.drawText(
    "Produit",
    {
      x: 60,
      y: y + 9,
      size: 10,
      font: boldFont,
    }
  );

  page.drawText(
    "Qté",
    {
      x: 330,
      y: y + 9,
      size: 10,
      font: boldFont,
    }
  );

  page.drawText(
    "Prix",
    {
      x: 390,
      y: y + 9,
      size: 10,
      font: boldFont,
    }
  );

  page.drawText(
    "Total",
    {
      x: 480,
      y: y + 9,
      size: 10,
      font: boldFont,
    }
  );

  y -= 40;

  items.forEach((item) => {
    const quantity =
      Number(
        item.quantity || 1
      );

    const price =
      Number(
        item.priceCents || 0
      );

    const total =
      quantity * price;

    page.drawText(
      item.name ||
        "Produit",
      {
        x: 60,
        y,
        size: 10,
        font,
      }
    );

    page.drawText(
      String(quantity),
      {
        x: 335,
        y,
        size: 10,
        font,
      }
    );

    page.drawText(
      formatPrice(price),
      {
        x: 390,
        y,
        size: 10,
        font,
      }
    );

    page.drawText(
      formatPrice(total),
      {
        x: 480,
        y,
        size: 10,
        font,
      }
    );

    y -= 24;
  });

  /* ================= TOTAL ================= */

  y -= 20;

  page.drawText(
    "TOTAL",
    {
      x: 390,
      y,
      size: 14,
      font: boldFont,
    }
  );

  page.drawText(
    formatPrice(
      order.totalCents
    ),
    {
      x: 480,
      y,
      size: 14,
      font: boldFont,
    }
  );

  /* ================= FOOTER ================= */

  page.drawText(
    "Vanille’Or — Merci pour votre confiance.",
    {
      x: 160,
      y: 40,
      size: 9,
      font,
      color: rgb(
        0.5,
        0.5,
        0.5
      ),
    }
  );

  return await pdfDoc.save();
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    const orderId =
      params.id?.trim();

    if (!orderId) {
      return new Response(
        "ID commande manquant",
        {
          status: 400,
        }
      );
    }

    const isAdmin =
      cookies().get(
        "admin"
      )?.value === "true";

    const userId =
      cookies().get(
        "vanille_or_user"
      )?.value || null;

    const order =
      await prisma.order.findUnique(
        {
          where: {
            id: orderId,
          },

          include: {
            user: true,
          },
        }
      );

    if (!order) {
      return new Response(
        "Commande introuvable",
        {
          status: 404,
        }
      );
    }

    const isOwner =
      userId &&
      order.userId &&
      userId === order.userId;

    if (
      !isAdmin &&
      !isOwner
    ) {
      return new Response(
        "Accès non autorisé",
        {
          status: 403,
        }
      );
    }

    const pdf =
      await createInvoicePdf(
        order
      );

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type":
          "application/pdf",

        "Content-Disposition": `attachment; filename="facture-${order.id.slice(
          0,
          8
        )}.pdf"`,

        "Cache-Control":
          "no-store",
      },
    });
  } catch (error) {
    console.error(
      "🔥 INVOICE PDF ERROR:",
      error
    );

    return new Response(
      "Erreur génération facture",
      {
        status: 500,
      }
    );
  }
}