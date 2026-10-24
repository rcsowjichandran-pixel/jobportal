import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault(); setBusy(true); setFeedback(null);
    try {
      await axios.post('http://localhost:8000/register/', form);
      setFeedback({ type: 'success', text: 'Account created. Taking you to log in…' });
      window.setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      const details = error.response?.data;
      const message = typeof details === 'object' && details ? Object.values(details).flat().join(' ') : 'We couldn’t create your account. Please try again.';
      setFeedback({ type: 'error', text: message });
    } finally { setBusy(false); }
  }

  return <section className="form-layout">
    <div className="form-promo"><span className="eyebrow">Make your next move</span><h1>A little closer to work that fits.</h1><p>Create your profile to apply for thoughtful opportunities and keep every application in one calm, clear place.</p><div className="form-points"><span>Save time on every application</span><span>See all your progress at a glance</span></div></div>
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Create your account</h2><p className="form-subtitle">A few details to get you started.</p>
      {feedback && <div className={`feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.text}</div>}
      <div className="form-field"><label htmlFor="username">Username</label><input id="username" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Choose a username" required /></div>
      <div className="form-field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /></div>
      <div className="form-field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" required /></div>
      <button className="button" type="submit" disabled={busy}>{busy ? <><span className="spinner" />Creating account…</> : <>Create account <span aria-hidden="true">→</span></>}</button>
      <p className="form-footnote">Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  </section>;
}

export default Register;
