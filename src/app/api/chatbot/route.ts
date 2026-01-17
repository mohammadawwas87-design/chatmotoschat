import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
أنت مساعد ذكي خاص بموقع MotorsSooq.
تجيب فقط عن السيارات (بيع، شراء، أسعار، مواصفات).
استخدم عناوين واضحة ونقاط عند التعداد.
أسلوبك عربي احترافي.
لا تذكر أي شركة ذكاء اصطناعي.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
       { reply: '✅ ROUTE_UPDATED_2026_TEST' },
        { status: 500 }
      );
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // أنسب + أرخص + أقوى من 3.5
        messages: [
          { role: 'system', content: SYSTEM_PROMPT.trim() },
          { role: 'user', content: String(message ?? '') },
        ],
        temperature: 0.4,
        max_tokens: 350,
      }),
    });

    const raw = await resp.text();

    // لو OpenAI رجّع خطأ، نعرضه بدل ما نخبيه
    if (!resp.ok) {
      return NextResponse.json(
        { reply: `❌ OpenAI Error (${resp.status}): ${raw.slice(0, 900)}` },
        { status: 500 }
      );
    }

    const data = JSON.parse(raw);
    const reply = data?.choices?.[0]?.message?.content;

    return NextResponse.json({
      reply: reply || '❌ ما وصل محتوى رد من OpenAI',
    });
  } catch (err: any) {
    return NextResponse.json(
      { reply: `❌ Server Exception: ${err?.message || String(err)}` },
      { status: 500 }
    );
  }
}
