'use client';
import { useEffect, useState } from 'react';
import { adminGet, adminPost, adminPut, adminDelete } from '@/lib/adminApi';
import { FormField, Input, ImageField, AdminCard } from '@/components/admin/FormControls';

interface Partner { id: number; name: string; logo_url: string; website_url: string; group_name: string; sort_order: number; is_active: number; }
const empty = { name: '', logo_url: '', website_url: '', group_name: 'default', sort_order: 0, is_active: 1 };
const btnEdit: React.CSSProperties = { fontSize: 12, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 };
const btnDel: React.CSSProperties = { fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 };

export default function MembersAdmin() {
  const [items, setItems] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const load = () => adminGet<Partner[]>('/api/partners/all').then(setItems);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editing) await adminPut(`/api/partners/${editing.id}`, form); else await adminPost('/api/partners', form);
    setShowForm(false); setEditing(null); setForm(empty); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>會員單位管理</h1>
        <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="btn-accent" style={{ fontSize: 13 }}>+ 新增會員</button>
      </div>
      {showForm && (
        <AdminCard title={editing ? '編輯會員' : '新增會員'} actions={<button onClick={() => { setShowForm(false); setEditing(null); }} style={{ fontSize: 12, color: '#71717a', background: 'none', border: 'none', cursor: 'pointer' }}>取消</button>}>
          <FormField label="名稱" required><Input value={form.name} onChange={v => setForm(f => ({...f, name: v}))} /></FormField>
          <ImageField value={form.logo_url} onChange={v => setForm(f => ({...f, logo_url: v}))} label="Logo" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <FormField label="網站"><Input value={form.website_url} onChange={v => setForm(f => ({...f, website_url: v}))} /></FormField>
            <FormField label="分組"><Input value={form.group_name} onChange={v => setForm(f => ({...f, group_name: v}))} /></FormField>
            <FormField label="排序"><Input type="number" value={String(form.sort_order)} onChange={v => setForm(f => ({...f, sort_order: +v}))} /></FormField>
          </div>
          <button onClick={handleSave} className="btn-accent" style={{ fontSize: 13, marginTop: 8 }}>保存</button>
        </AdminCard>
      )}
      <div className="admin-member-grid">
        {items.map(item => (
          <div key={item.id} className="admin-panel admin-member-card">
            {item.logo_url && <img src={item.logo_url} alt={item.name} className="admin-member-logo" />}
            <div style={{ width: '100%', fontSize: 13, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <button onClick={() => { setEditing(item); setForm(item); setShowForm(true); }} style={btnEdit}>編輯</button>
              <button onClick={() => { if (confirm('確定刪除？')) adminDelete(`/api/partners/${item.id}`).then(load); }} style={btnDel}>刪除</button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div style={{ textAlign: 'center', padding: '48px 0', color: '#52525b', fontSize: 13 }}>暫無會員</div>}
    </div>
  );
}
