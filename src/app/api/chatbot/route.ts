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
      return NextResponse.json({
        reply: '❌ OPENAI_API_KEY غير موجود'
      }, { status: 500 });
    }

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          temperature: 0.4,
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content
        || 'لم أتمكن من توليد رد',
    });

  } catch (err: any) {
    return NextResponse.json({
      reply: `❌ خطأ في السيرفر: ${err.message}`
    }, { status: 500 });
  }
}
