import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
أنت مساعد ذكي خاص بموقع MotorsSooq.
تجيب فقط عن السيارات، البيع، الشراء، الأسعار، المواصفات.
استخدم عناوين ونقاط عند الحاجة.
لا تذكر أي شركة ذكاء اصطناعي.
`;

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await fetch(
    'https://api.deepseek.com/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ZAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        temperature: 0.3,
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json({
    reply:
      data?.choices?.[0]?.message?.content ??
      'لم أتمكن من توليد رد',
  });
}
