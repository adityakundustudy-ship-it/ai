"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function LlamaChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: history } = await supabase.from('chat_history').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
        if (history) setMessages(history);
      }
    };
    checkUser();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const userMsg = { role: 'user', content: input, user_id: user.id };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    await supabase.from('chat_history').insert([userMsg]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, history: messages.map(m => ({role: m.role, content: m.content})) })
    });
    const data = await res.json();
    const aiMsg = { role: 'assistant', content: data.text, user_id: user.id };
    setMessages(prev => [...prev, aiMsg]);
    await supabase.from('chat_history').insert([aiMsg]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center font-sans">
      <header className="w-full max-w-2xl flex justify-between py-10">
        <h1 className="text-3xl font-black italic tracking-tighter">LLAMA.AI</h1>
        {!user ? (
          <button onClick={() => supabase.auth.signInWithOAuth({provider:'google'})} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">LOGIN</button>
        ) : (
          <span className="text-zinc-500 text-xs">{user.email}</span>
        )}
      </header>
      
      <main className="w-full max-w-2xl flex-1 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-6 overflow-y-auto mb-6 shadow-2xl">
        {messages.map((m, i) => (
          <div key={i} className={`mb-6 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-800 border border-white/5'}`}>{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-blue-400 animate-pulse text-xs font-bold">LLAMA IS TYPING...</div>}
      </main>

      <div className="w-full max-w-2xl relative mb-10">
        <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleSend()} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 pr-16 focus:outline-none focus:border-blue-500 transition-all" placeholder="Message Llama..."/>
        <button onClick={handleSend} className="absolute right-3 top-3 bg-blue-600 p-3 rounded-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    </div>
  );
}

