import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').toString();
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Email non valida' }, { status: 400 });
    }

    // Placeholder: here you would call Mailchimp or save to your DB.
    // For now we just return success.
    return NextResponse.json({ message: 'Iscrizione avvenuta con successo' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Errore interno' }, { status: 500 });
  }
}
