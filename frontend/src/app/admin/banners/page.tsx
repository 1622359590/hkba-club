'use client';
import { useEffect, useState } from 'react';
import { adminGet, adminPost, adminPut, adminDelete } from '@/lib/adminApi';
import { FormField, Input, BilingualField, ImageField, Toggle, AdminCard } from '@/components/admin/FormControls';

interface Banner { id: number; title_zh: string; title_en: string; subtitle_zh: string; subtitle_en: string; description_zh: string; description_en: string; image_url: string; link_url: string; video_url: string; sort_order: number; is_active: number; }
const empty = { title_zh:'', title_en:'', subtitle_zh:'', subtitle_en:'', description_zh:'', description_en:'', image_url:'', link_url:'', video_url:'', sort_order:0, is_active:1 };

const btnEdit: React.CSSProperties = { fontSize: 12, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 };
const btnDel: React.CSSProperties = { fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 };
const badge = (active: boolean): React.CSSProperties => ({ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: active ? 'rgba(34,197,94,0.1)' : 'rgba(113,113,122,0.1)', color: active ? '#22c55e' : '#71717a' });

export default function BannersAdmin() {
  const [items, setItems] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const load = () => adminGet<Banner[]>('/api/banners/all').then(setItems);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editing) await adminPut(`/api/banners/${editing.id}`, form); else await adminPost('/api/banners', form);
    setShowForm(false); setEditing(null); setForm(empty); load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Banner 管理</h1>
        <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="btn-accent" style={{ fontSize: 13 }}>+ 新增</button>
      </div>
      {showForm && (
        <AdminCard title={editing ? '編輯 Banner' : '新增 Banner'} actions={<button onClick={() => { setShowForm(false); setEditing(null); }} style={{ fontSize: 12, color: '#71717a', background: 'none', border: 'none', cursor: 'pointer' }}>取消</button>}>
          <BilingualField label="標題" valueZh={form.title_zh} valueEn={form.title_en} onChangeZh={v => setForm(f => ({...f, title_zh: v}))} onChangeEn={v => setForm(f => ({...f, title_en: v}))} />
          <BilingualField label="副標題" valueZh={form.subtitle_zh} valueEn={form.subtitle_en} onChangeZh={v => setForm(f => ({...f, subtitle_zh: v}))} onChangeEn={v => setForm(f => ({...f, subtitle_en: v}))} />
          <BilingualField label="描述" type="textarea" valueZh={form.description_zh} valueEn={form.description_en} onChangeZh={v => setForm(f => ({...f, description_zh: v}))} onChangeEn={v => setForm(f => ({...f, description_en: v}))} />
          <ImageField value={form.image_url} onChange={v => setForm(f => ({...f, image_url: v}))} label="Banner 圖片" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="連結 URL"><Input value={form.link_url} onChange={v => setForm(f => ({...f, link_url: v}))} /></FormField>
            <FormField label="視頻 URL"><Input value={form.video_url} onChange={v => setForm(f => ({...f, video_url: v}))} /></FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="排序"><Input type="number" value={String(form.sort_order)} onChange={v => setForm(f => ({...f, sort_order: +v}))} /></FormField>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 16 }}><Toggle checked={!!form.is_active} onChange={v => setForm(f => ({...f, is_active: v ? 1 : 0}))} label="啟用" /></div>
          </div>
          <button onClick={handleSave} className="btn-accent" style={{ fontSize: 13, marginTop: 8 }}>保存</button>
        </AdminCard>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            {item.image_url && <img src={item.image_url} alt="" style={{ width: 96, height: 48, objectFit: 'cover', borderRadius: 8 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title_zh || item.title_en}</div>
              <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>{item.subtitle_zh || item.subtitle_en}</div>
            </div>
            <span style={badge(!!item.is_active)}>{item.is_active ? '啟用' : '停用'}</span>
            <button onClick={() => { setEditing(item); setForm(item); setShowForm(true); }} style={btnEdit}>編輯</button>
            <button onClick={() => { if (confirm('確定刪除？')) adminDelete(`/api/banners/${item.id}`).then(load); }} style={btnDel}>刪除</button>
          </div>
        ))}
        {items.length === 0 && <div style={{ textAlign: 'center', padding: '48px 0', color: '#52525b', fontSize: 13 }}>暫無 Banner</div>}
      </div>
    </div>
  );
}
