import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) return;
    setBusy(true); setFeedback(null);
    const formData = new FormData(); formData.append('file', file);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('/api/resume/upload/', formData, { headers: { Authorization: `Bearer ${token}` } });
      setFeedback({ type: 'success', text: 'Your resume is uploaded and ready to use with applications.' });
    } catch (error) {
      const detail = error.response?.data?.detail || (error.response?.status === 400 ? 'A resume may already be attached to this account. Try signing in again or contact support.' : 'Upload didn’t go through. Check your connection and try again.');
      setFeedback({ type: 'error', text: detail });
    } finally { setBusy(false); }
  }

  return <section className="form-layout">
    <div className="form-promo"><span className="eyebrow">Your profile, ready to go</span><h1>One resume. More room for possibility.</h1><p>Upload your latest resume once and use it when you apply to roles that feel right for you.</p><div className="form-points"><span>PDF or Word document works best</span><span>Keep your resume up to date</span></div></div>
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Upload your resume</h2><p className="form-subtitle">Choose a file from your device.</p>
      {feedback && <div className={`feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.text}</div>}
      <label className="file-drop"><span className="company-mark" style={{ margin: '0 auto 12px' }}>↑</span><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => { setFile(e.target.files?.[0] || null); setFeedback(null); }} required /><p>{file ? `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB` : 'PDF, DOC or DOCX · choose a file to continue'}</p></label>
      <button className="button" type="submit" disabled={busy || !file}>{busy ? <><span className="spinner" />Uploading…</> : <>Upload resume <span aria-hidden="true">→</span></>}</button>
      <p className="form-footnote"><Link to="/">Back to opportunities</Link></p>
    </form>
  </section>;
}

export default ResumeUpload;
