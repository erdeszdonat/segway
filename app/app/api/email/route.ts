import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    // 1. Biztonsági ellenőrzés: Látja egyáltalán a Vercel a kulcsot?
    if (!process.env.RESEND_API_KEY) {
      console.error("HIBA: Hiányzik a RESEND_API_KEY a Vercelből!");
      return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { email, telepules, meret, lejto, arnyekolt, ajanlott_modell, kereskedo_neve } = body;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #ff5a00;">Kedves Érdeklődő!</h2>
        <p>Köszönjük, hogy használta a Segway Navimow kalkulátorunkat. Örömmel küldjük el a kertjéhez legjobban illő megoldást:</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #eee; margin-top: 20px;">
          <h3 style="margin-top: 0;">Az Önnek javasolt gép: <span style="color: #ff5a00;">${ajanlott_modell}</span></h3>
          <p><strong>A megadott kert adatai:</strong></p>
          <ul>
            <li><strong>Település:</strong> ${telepules}</li>
            <li><strong>Kert mérete:</strong> ${meret} m²</li>
            <li><strong>Max. lejtő:</strong> ${lejto}%</li>
            <li><strong>Árnyékoltság:</strong> ${arnyekolt === 'igen' ? 'Fák, falak, árnyékos' : 'Tiszta, nyílt égbolt'}</li>
          </ul>
          <p style="margin-bottom: 0;">A legközelebbi partnerünk: <strong>${kereskedo_neve}</strong></p>
        </div>
        
        <p style="margin-top: 30px;">Üdvözlettel,<br/><strong>A Robotfűnyíró Csapat</strong></p>
      </div>
    `;

    // TESZT MÓD BEÁLLÍTÁSA:
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Ez marad így a teszthez
      to: [email],
      subject: 'A Te Segway Navimow javaslatod (TESZT)',
      html: emailHtml,
    });

    // Ha a Resend API hibát dob vissza
    if (data.error) {
      console.error("RESEND API HIBA:", data.error);
      return NextResponse.json({ success: false, error: data.error }, { status: 400 });
    }

    console.log("SIKERES KÜLDÉS:", data);
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("VÁRATLAN SZERVER HIBA:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
