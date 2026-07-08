'use client';
import { useState, ReactNode } from 'react';

const inputBase: React.CSSProperties = { width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 13, color: '#fff', outline: 'none', transition: 'border-color 0.2s' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, color: '#71717a', marginBottom: 6, fontWeight: 500 };

export function FormField({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return <div style={{ marginBottom: 16 }}><label style={labelStyle}>{label} {required && <span style={{ color: '#ef4444' }}>*</span>}</label>{children}</div>;
}

export function Input({ value, onChange, type, placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder} style={inputBase} onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(99,102,241,0.5)'} onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'} />;
}

export function Textarea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} style={{ ...inputBase, resize: 'vertical' as const }} onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(99,102,241,0.5)'} onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.08)'} />;
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputBase, cursor: 'pointer' }}>{options.map(o => <option key={o.value} value={o.value} style={{ background: '#17171a' }}>{o.label}</option>)}</select>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <div style={{ width: 36, height: 20, borderRadius: 10, background: checked ? '#6366f1' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s' }}>
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: checked ? 18 : 2, transition: 'left 0.2s' }} />
      </div>
      <span style={{ fontSize: 13, color: '#a1a1aa' }}>{label}</span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: 'none' }} />
    </label>
  );
}

export function BilingualField({ label, valueZh, valueEn, onChangeZh, onChangeEn, type = 'text', rows = 4, required }: { label: string; valueZh: string; valueEn: string; onChangeZh: (v: string) => void; onChangeEn: (v: string) => void; type?: 'text' | 'textarea'; rows?: number; required?: boolean }) {
  return (
    <FormField label={label} required={required}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><span style={{ fontSize: 10, color: '#52525b', display: 'block', marginBottom: 4 }}>繁中</span>{type === 'textarea' ? <Textarea value={valueZh} onChange={onChangeZh} rows={rows} /> : <Input value={valueZh} onChange={onChangeZh} />}</div>
        <div><span style={{ fontSize: 10, color: '#52525b', display: 'block', marginBottom: 4 }}>English</span>{type === 'textarea' ? <Textarea value={valueEn} onChange={onChangeEn} rows={rows} /> : <Input value={valueEn} onChange={onChangeEn} />}</div>
      </div>
    </FormField>
  );
}

export function ImageField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    try { const { adminUpload } = await import('@/lib/adminApi'); const r = await adminUpload(file, 'general'); onChange(r.url); } catch { alert('上傳失敗'); } finally { setUploading(false); }
  };
  return (
    <FormField label={label}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        {value && <img src={value.startsWith('http') ? value : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:37900'}${value}`} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }} />}
        <label style={{ cursor: 'pointer', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12, color: '#a1a1aa', transition: 'all 0.2s' }}>{uploading ? '上傳中...' : '選擇圖片'}<input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} /></label>
        {value && <button onClick={() => onChange('')} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>移除</button>}
      </div>
      <Input value={value} onChange={onChange} placeholder="或輸入圖片 URL" />
    </FormField>
  );
}

export function AdminCard({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{title}</h3>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
