'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/useLang';
import { apiGet, imgUrl, type Partner } from '@/lib/api';

const c: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

export default function MembersPage() {
  const { t } = useLang();
  const [partners, setPartners] = useState<Partner[]>([]);
  useEffect(() => { apiGet<Partner[]>('/api/partners').then(setPartners).catch(() => {}); }, []);

  const groups = partners.reduce((a, p) => { if (!a[p.group_name]) a[p.group_name] = []; a[p.group_name].push(p); return a; }, {} as Record<string, Partner[]>);

  return (
    <>
      <section style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />
        <div style={{ ...c, position: 'relative' }}>
          <div style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards' }}>
            <div className="section-label">{t('會員單位', 'Members')}</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>{t('合作夥伴與會員', 'Partners & Members')}</h1>
            <p className="section-desc">{t('攜手共建區塊鏈生態系統', 'Building the blockchain ecosystem together')}</p>
            <div className="divider" style={{ marginTop: 20 }} />
          </div>
        </div>
      </section>
      <section style={{ paddingBottom: 96 }}>
        <div style={c}>
          {Object.entries(groups).map(([group, members]) => (
            <div key={group} style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20 }}>
                {members.map((p, i) => (
                  <div key={p.id} className="glass-card" style={{ width: 160, height: 88, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, animation: `fadeInUp 0.5s ${0.04 * i}s cubic-bezier(0.22,1,0.36,1) forwards`, opacity: 0 }}>
                    <img src={imgUrl(p.logo_url)} alt={p.name} style={{ maxHeight: 36, maxWidth: 120, objectFit: 'contain', opacity: 0.6, filter: 'grayscale(1)', transition: 'all 0.3s' }} />
                    <span style={{ fontSize: 11, color: '#71717a' }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {partners.length === 0 && <div style={{ textAlign: 'center', padding: '64px 0', color: '#52525b' }}>{t('暫無會員', 'No members')}</div>}
        </div>
      </section>
    </>
  );
}
