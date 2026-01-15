'use client';
import { useState } from 'react';

export default function Widget() {
  const [msg, setMsg] = useState('');
  const [log, setLog] = useState<string[]>([]);

  async function send() {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    setLog([...log, 'You: ' + msg, 'Bot: ' + data.reply]);
    setMsg('');
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Motors Sooq Chat</h2>
      <div style={{ minHeight: 300, border: '1px solid #ccc', padding: 10 }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <input value={msg} onChange={e => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}