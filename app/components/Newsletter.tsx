"use client";
import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const validate = (e: string) => /\S+@\S+\.\S+/.test(e);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === 'sending') return; // prevent dupes
    if (!validate(email)) {
      setMessage("Inserisci una email valida.");
      setStatus('error');
      return;
    }
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Errore');
      setStatus('success');
      setMessage('Grazie! Iscrizione avvenuta con successo.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Errore durante l\'invio.');
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto mb-24 px-6">
      <div className="bg-gradient-to-br from-[#4d5c3a] to-[#3f4f36] rounded-2xl border border-[#5a6b4a] p-10 md:p-12 shadow-lg">
        <h3 className="text-3xl font-bold text-white mb-3">Iscriviti alla nostra newsletter</h3>
        <p className="text-[#d4c4a8] mb-6 text-lg">Ricevi offerte esclusive, news e consigli di viaggio direttamente nella tua casella.</p>
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center" aria-describedby="newsletter-status">
          <label htmlFor="newsletter-email" className="sr-only">Email</label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email"
            className="bg-white/95 px-5 py-3 rounded-lg border border-white/20 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-[#bfae82] focus:border-transparent text-[#4d5c3a] placeholder-[#8a8f80] transition-all"
            aria-invalid={status === 'error'}
            required
          />
          <button
            type="submit"
            className="bg-[#bfae82] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-[#a88f5f] transition-all disabled:opacity-60 whitespace-nowrap"
            disabled={status === 'sending' || status === 'success'}
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? 'Invio...' : status === 'success' ? 'Iscritto ✓' : 'Iscriviti'}
          </button>
        </form>

        <div id="newsletter-status" className="mt-4" aria-live="polite">
          {message && (
            <p className={`${status === 'error' ? 'text-red-300' : 'text-green-300'} flex items-center gap-2 text-sm`}>
              {status === 'success' ? (
                <span aria-hidden className="inline-block">✓</span>
              ) : null}
              <span>{message}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
