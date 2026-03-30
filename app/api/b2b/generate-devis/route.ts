import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const quantity = searchParams.get("quantity") || "";
  const company = searchParams.get("company") || "";

  const priceMap: Record<string, number> = {
    "10 kg": 1200,
    "25 kg": 2800,
    "50 kg": 5200,
    "100 kg +": 9500,
  };

  const price = priceMap[quantity] || 0;

  const html = `
  <html>
    <body style="font-family:Arial;background:#faf7f2;padding:40px;">
      <div style="max-width:700px;margin:auto;background:white;padding:40px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.08);">

        <h1 style="color:#a16207;margin-bottom:10px;">
          Vanille’Or
        </h1>

        <p style="color:#777;margin-bottom:30px;">
          Vanille premium de Madagascar — Qualité professionnelle
        </p>

        <h2 style="margin-bottom:20px;">📄 Devis professionnel</h2>

        <div style="background:#f3f4f6;padding:15px;border-radius:10px;margin-bottom:20px;">
          <p><strong>Client :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Entreprise :</strong> ${company || "-"}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:25px;">
          <thead>
            <tr>
              <th style="text-align:left;border-bottom:1px solid #ddd;padding-bottom:10px;">Produit</th>
              <th style="text-align:center;border-bottom:1px solid #ddd;">Quantité</th>
              <th style="text-align:right;border-bottom:1px solid #ddd;">Prix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:10px 0;">Vanille premium Madagascar</td>
              <td style="text-align:center;">${quantity}</td>
              <td style="text-align:right;">${price} €</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:15px;">
          <strong>Total</strong>
          <strong style="color:#a16207;font-size:20px;">${price} €</strong>
        </div>

        <p style="margin-top:30px;color:#555;line-height:1.6;">
          ✔ Approvisionnement direct Madagascar<br/>
          ✔ Qualité premium sélectionnée<br/>
          ✔ Capacité de livraison gros volumes (tonnes)
        </p>

        <div style="margin-top:30px;padding-top:15px;border-top:1px solid #eee;color:#777;font-size:12px;">
          Ce devis est valable 7 jours — Vanille’Or
        </div>

      </div>
    </body>
  </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}