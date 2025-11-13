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
    <section className="w-full max-w-4xl mx-auto mb-12 px-6">
      <div className="bg-white rounded-lg border border-[#ececec] p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-[#4d5c3a] mb-2">Iscriviti alla nostra newsletter</h3>
        <p className="text-[#55664a] mb-4">Ricevi offerte esclusive e aggiornamenti.</p>
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 items-center" aria-describedby="newsletter-status">
          <label htmlFor="newsletter-email" className="sr-only">Email</label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email"
            className="bg-[#f7f7f7] px-4 py-2 rounded border border-[#ececec] flex-1 focus:ring-2 focus:ring-[#bfae82]"
            aria-invalid={status === 'error'}
            required
          />
          <button
            type="submit"
            className="bg-[#bfae82] text-white font-semibold px-6 py-2 rounded-md shadow disabled:opacity-60"
            disabled={status === 'sending' || status === 'success'}
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? 'Invio...' : status === 'success' ? 'Iscritto' : 'Iscriviti'}
          </button>
        </form>

        <div id="newsletter-status" className="mt-3" aria-live="polite">
          {message && (
            <p className={`${status === 'error' ? 'text-red-600' : 'text-green-700'} flex items-center gap-2`}> 
              {status === 'success' ? (
                <span aria-hidden className="inline-block w-5 h-5 bg-green-600 rounded-full text-white text-xs flex items-center justify-center">✓</span>
              ) : null}
              <span>{message}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
