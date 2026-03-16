import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// A Resend inicializálása az API kulccsal
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, telepules, meret, lejto, arnyekolt, ajanlott_modell, kereskedo_neve } = body;

    // E-mail tartalma (HTML formátumban)
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

    // Levél küldése
    const data = await resend.emails.send({
      from: 'Navimow Kalkulátor <kalkulator@te-domained.hu>', // FONTOS: Ezt majd írd át a Resend-ben hitelesített e-mail címedre!
      to: [email, 'info@robot.hu'], // Elmegy a vevőnek és neked is egyszerre
      subject: 'A Te Segway Navimow javaslatod',
      html: emailHtml,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
