'use client';
import { useEffect, useState } from 'react';
import { adminGet, adminPost, adminPut, adminDelete } from '@/lib/adminApi';
import { FormField, Input, BilingualField, ImageField, Select, Toggle, AdminCard } from '@/components/admin/FormControls';

interface TeamMember { id: number; name_zh: string; name_en: string; title_zh: string; title_en: string; bio_zh: string; bio_en: string; avatar_url: string; group_name: string; social_facebook: string; social_twitter: string; social_linkedin: string; social_instagram: string; sort_order: number; is_active: number; }
const groups = [{value:'honorary_chairman',label:'榮譽主席'},{value:'chairman',label:'會長'},{value:'vice_chairman',label:'副會長'},{value:'committee',label:'委員'},{value:'advisor',label:'顧問'}];
const empty = { name_zh:'', name_en:'', title_zh:'', title_en:'', bio_zh:'', bio_en:'', avatar_url:'', group_name:'committee', social_facebook:'', social_twitter:'', social_linkedin:'', social_instagram:'', sort_order:0, is_active:1 };
const btnEdit: React.CSSProperties = { fontSize: 12, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 };
const btnDel: React.CSSProperties = { fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 };

export default function TeamAdmin() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const load = () => adminGet<TeamMember[]>('/api/team/all').then(setItems);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editing) await adminPut(`/api/team/${editing.id}`, form); else await adminPost('/api/team', form);
    setShowForm(false); setEditing(null); setForm(empty); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>團隊管理</h1>
        <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="btn-accent" style={{ fontSize: 13 }}>+ 新增成員</button>
      </div>
      {showForm && (
        <AdminCard title={editing ? '編輯成員' : '新增成員'} actions={<button onClick={() => { setShowForm(false); setEditing(null); }} style={{ fontSize: 12, color: '#71717a', background: 'none', border: 'none', cursor: 'pointer' }}>取消</button>}>
          <BilingualField label="姓名" valueZh={form.name_zh} valueEn={form.name_en} onChangeZh={v => setForm(f => ({...f, name_zh: v}))} onChangeEn={v => setForm(f => ({...f, name_en: v}))} required />
          <BilingualField label="職位" valueZh={form.title_zh} valueEn={form.title_en} onChangeZh={v => setForm(f => ({...f, title_zh: v}))} onChangeEn={v => setForm(f => ({...f, title_en: v}))} required />
          <BilingualField label="簡介" type="textarea" valueZh={form.bio_zh} valueEn={form.bio_en} onChangeZh={v => setForm(f => ({...f, bio_zh: v}))} onChangeEn={v => setForm(f => ({...f, bio_en: v}))} />
          <ImageField value={form.avatar_url} onChange={v => setForm(f => ({...f, avatar_url: v}))} label="頭像" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="分組"><Select value={form.group_name} onChange={v => setForm(f => ({...f, group_name: v}))} options={groups} /></FormField>
            <FormField label="排序"><Input type="number" value={String(form.sort_order)} onChange={v => setForm(f => ({...f, sort_order: +v}))} /></FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="Facebook"><Input value={form.social_facebook} onChange={v => setForm(f => ({...f, social_facebook: v}))} /></FormField>
            <FormField label="LinkedIn"><Input value={form.social_linkedin} onChange={v => setForm(f => ({...f, social_linkedin: v}))} /></FormField>
          </div>
          <Toggle checked={!!form.is_active} onChange={v => setForm(f => ({...f, is_active: v ? 1 : 0}))} label="啟用" />
          <button onClick={handleSave} className="btn-accent" style={{ fontSize: 13, marginTop: 12 }}>保存</button>
        </AdminCard>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            {item.avatar_url && <img src={item.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{item.name_zh || item.name_en}</div>
              <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>{item.title_zh || item.title_en} · {groups.find(g => g.value === item.group_name)?.label || item.group_name}</div>
            </div>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: item.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(113,113,122,0.1)', color: item.is_active ? '#22c55e' : '#71717a' }}>{item.is_active ? '啟用' : '停用'}</span>
            <button onClick={() => { setEditing(item); setForm(item); setShowForm(true); }} style={btnEdit}>編輯</button>
            <button onClick={() => { if (confirm('確定刪除？')) adminDelete(`/api/team/${item.id}`).then(load); }} style={btnDel}>刪除</button>
          </div>
        ))}
        {items.length === 0 && <div style={{ textAlign: 'center', padding: '48px 0', color: '#52525b', fontSize: 13 }}>暫無團隊成員</div>}
      </div>
    </div>
  );
}
