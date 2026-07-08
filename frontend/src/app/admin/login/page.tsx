'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:37900';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '登入失敗'); return; }
      localStorage.setItem('hkba_admin_token', data.token);
      router.push('/admin');
    } catch { setError('網絡錯誤'); } finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none', transition: 'border-color 0.2s' };

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 auto 16px', boxShadow: '0 4px 24px rgba(99,102,241,0.3)' }}>H</div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>HKBA 管理後台</h1>
          <p style={{ fontSize: 13, color: '#71717a' }}>請輸入帳號密碼登入</p>
        </div>
        <form onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#71717a', marginBottom: 6, fontWeight: 500 }}>用戶名</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(99,102,241,0.5)'} onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'} required />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#71717a', marginBottom: 6, fontWeight: 500 }}>密碼</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(99,102,241,0.5)'} onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'} required />
          </div>
          {error && <p style={{ fontSize: 13, color: '#ef4444', marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px 0', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'all 0.2s' }}>
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  );
}
