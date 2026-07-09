'use client';
import { useEffect, useState } from 'react';
import { adminGet, adminPut } from '@/lib/adminApi';
import { BilingualField, AdminCard } from '@/components/admin/FormControls';
import type { PageContent } from '@/lib/api';

export default function PagesAdmin() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [editing, setEditing] = useState<PageContent | null>(null);
  const [form, setForm] = useState({ title_zh: '', title_en: '', content_zh: '', content_en: '' });
  useEffect(() => { adminGet<PageContent[]>('/api/pages').then(setPages).catch(() => {}); }, []);

  const handleSave = async () => {
    if (!editing) return;
    await adminPut(`/api/pages/${editing.slug}`, form);
    setEditing(null);
    adminGet<PageContent[]>('/api/pages').then(setPages);
  };
  const pageHelp: Record<string, string> = {
    about: '前台「關於協會」頁面的主內容。',
    membership: '會員服務相關文案，可用於會員/合作機構介紹。',
  };

  return (
    <div>
      <div className="admin-page-heading">
        <h1 className="admin-page-title">頁面內容</h1>
      </div>
      {editing && (
        <AdminCard title={`編輯: ${editing.slug}`} actions={<button type="button" onClick={() => setEditing(null)} className="admin-action is-muted">取消</button>}>
          <BilingualField label="頁面標題" valueZh={form.title_zh} valueEn={form.title_en} onChangeZh={v => setForm(f => ({...f, title_zh: v}))} onChangeEn={v => setForm(f => ({...f, title_en: v}))} />
          <BilingualField label="頁面內容 (HTML)" type="textarea" rows={15} valueZh={form.content_zh} valueEn={form.content_en} onChangeZh={v => setForm(f => ({...f, content_zh: v}))} onChangeEn={v => setForm(f => ({...f, content_en: v}))} />
          <button onClick={handleSave} className="btn-accent" style={{ fontSize: 13, marginTop: 8 }}>保存</button>
        </AdminCard>
      )}
      <div className="admin-list-stack">
        {pages.map(page => (
          <div key={page.id} className="admin-content-row" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontFamily: 'monospace' }}>{page.slug}</span>
              <div>
                <div style={{ fontSize: 14, color: '#fff' }}>{page.title_zh || page.title_en}</div>
                {pageHelp[page.slug] && <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>{pageHelp[page.slug]}</div>}
              </div>
            </div>
            <button type="button" onClick={() => { setEditing(page); setForm({ title_zh: page.title_zh, title_en: page.title_en, content_zh: page.content_zh, content_en: page.content_en }); }} className="admin-action">編輯</button>
          </div>
        ))}
      </div>
    </div>
  );
}
