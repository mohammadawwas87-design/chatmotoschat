'use client';

import { useState } from 'react';

export default function Widget() {
  const [msg, setMsg] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!msg.trim()) return;

    setLoading(true);
    setLog((prev) => [...prev, `🧑‍💼 أنت: ${msg}`]);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      setLog((prev) => [...prev, `🤖 البوت: ${data.reply}`]);
    } catch (e) {
      setLog((prev) => [...prev, '❌ حصل خطأ في الاتصال بالبوت']);
    }

    setMsg('');
    setLoading(false);
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h2>Motors Sooq AI</h2>

      <div
        style={{
          minHeight: 400,
          maxHeight: 500,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          background: '#fafafa',
        }}
      >
        {log.map((l, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            {l}
          </div>
        ))}
        {loading && <div>⏳ البوت يكتب...</div>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          style={{ flex: 1, padding: 8 }}
          placeholder="اكتب سؤالك عن السيارات…"
        />
        <button onClick={send}>إرسال</button>
      </div>
    </div>
  );
}
