'use client';
import { useEffect, useState } from 'react';
import { adminDelete, adminGet, adminPut } from '@/lib/adminApi';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
}

export default function MessagesAdmin() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    adminGet<ContactMessage[]>('/api/contact/messages')
      .then(setItems)
      .catch(() => setError('留言載入失敗，請確認後端服務是否運行'));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await adminPut(`/api/contact/messages/${id}/read`, {});
    window.dispatchEvent(new Event('hkba:messages-updated'));
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('確定刪除此留言？')) return;
    await adminDelete(`/api/contact/messages/${id}`);
    window.dispatchEvent(new Event('hkba:messages-updated'));
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 4 }}>留言管理</h1>
          <p style={{ fontSize: 13, color: '#71717a' }}>查看前台聯絡表單提交，已處理後可標記已讀或刪除。</p>
        </div>
        <button onClick={load} className="btn-secondary" style={{ fontSize: 13 }}>刷新</button>
      </div>
      {error && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 16 }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{item.subject || '無主旨'}</h2>
                  {!item.is_read && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>未讀</span>}
                </div>
                <div style={{ fontSize: 12, color: '#71717a' }}>
                  {item.name} · <a href={`mailto:${item.email}`} style={{ color: '#818cf8', textDecoration: 'none' }}>{item.email}</a>
                  {item.created_at && <> · {new Date(item.created_at).toLocaleString('zh-HK')}</>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {!item.is_read && <button onClick={() => markRead(item.id)} style={{ fontSize: 12, color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer' }}>標記已讀</button>}
                <button onClick={() => remove(item.id)} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>刪除</button>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{item.message}</p>
          </div>
        ))}
      </div>
      {items.length === 0 && !error && <div style={{ textAlign: 'center', padding: '48px 0', color: '#52525b', fontSize: 13 }}>暫無留言</div>}
    </div>
  );
}
