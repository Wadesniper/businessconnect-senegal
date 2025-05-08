import React, { useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSent(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 32 }}>
      <h1>Contactez-nous</h1>
      <p>
        Pour toute question ou demande, contactez-nous par email&nbsp;:
        <br />
        <a href="mailto:contact@businessconnectsenegal.com" style={{ fontWeight: 'bold', fontSize: 18 }}>
          contact@businessconnectsenegal.com
        </a>
      </p>
      <h2>Ou envoyez-nous un message&nbsp;:</h2>
      {sent && <div style={{ color: 'green', marginBottom: 16 }}>Votre message a bien été envoyé !</div>}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          name="name"
          placeholder="Votre nom"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: 8, fontSize: 16 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Votre email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: 8, fontSize: 16 }}
        />
        <textarea
          name="message"
          placeholder="Votre message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{ padding: 8, fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16, background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
          {loading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

export default ContactPage; 