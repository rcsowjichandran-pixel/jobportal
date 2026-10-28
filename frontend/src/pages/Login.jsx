import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await axios.post('/api/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Those details didn’t match an account. Check them and try again.');
    } finally { setBusy(false); }
  }

  return <section className="form-layout">
    <div className="form-promo"><span className="eyebrow">Welcome back</span><h1>Your next chapter is closer than you think.</h1><p>Sign in to pick up where you left off, keep track of your applications, and discover roles shaped around your next move.</p><div className="form-points"><span>One place for every application</span><span>Opportunities worth your time</span></div></div>
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Log in to Northstar</h2><p className="form-subtitle">Good to have you back.</p>
      {error && <div className="feedback error" role="alert">{error}</div>}
      <div className="form-field"><label htmlFor="username">Username</label><input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" required /></div>
      <div className="form-field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required /></div>
      <button className="button" type="submit" disabled={busy}>{busy ? <><span className="spinner" />Signing in…</> : <>Continue <span aria-hidden="true">→</span></>}</button>
      <p className="form-footnote">New to Northstar? <Link to="/register">Create an account</Link></p>
    </form>
  </section>;
}

export default Login;
