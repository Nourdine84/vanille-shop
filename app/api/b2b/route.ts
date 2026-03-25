import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, company, quantity, message } = body;

    await resend.emails.send({
      from: "contact@vanilleor.fr",
      to: "tn.smok@hotmail.fr",
      subject: "Nouvelle demande B2B 🚀",
      html: `
        <h2>Nouvelle demande professionnelle</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Entreprise :</strong> ${company}</p>
        <p><strong>Quantité :</strong> ${quantity}</p>
        <p><strong>Message :</strong><br/>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: true }, { status: 500 });
  }
}