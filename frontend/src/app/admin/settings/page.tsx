'use client';
import { useState } from 'react';
import { adminPost } from '@/lib/adminApi';
import { FormField, Input, AdminCard } from '@/components/admin/FormControls';

export default function SettingsAdmin() {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [msg, setMsg] = useState('');

  const handleChangePassword = async () => {
    if (newPw !== confirmPw) { setMsg('兩次密碼不一致'); return; }
    try { await adminPost('/api/auth/change-password', { oldPassword: oldPw, newPassword: newPw }); setMsg('密碼修改成功'); setOldPw(''); setNewPw(''); setConfirmPw(''); } catch { setMsg('舊密碼錯誤'); }
  };

  return (
    <div>
      <div className="admin-page-heading">
        <h1 className="admin-page-title">系統設置</h1>
      </div>
      <div style={{ maxWidth: 400 }}>
        <AdminCard title="修改密碼">
          <FormField label="舊密碼"><Input type="password" value={oldPw} onChange={setOldPw} /></FormField>
          <FormField label="新密碼"><Input type="password" value={newPw} onChange={setNewPw} /></FormField>
          <FormField label="確認新密碼"><Input type="password" value={confirmPw} onChange={setConfirmPw} /></FormField>
          {msg && <p style={{ fontSize: 13, color: msg.includes('成功') ? '#22c55e' : '#ef4444', marginBottom: 12 }}>{msg}</p>}
          <button onClick={handleChangePassword} className="btn-accent" style={{ fontSize: 13 }}>修改密碼</button>
        </AdminCard>
      </div>
    </div>
  );
}
