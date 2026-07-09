'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/useLang';
import { apiGet, imgUrl, type Partner } from '@/lib/api';
import Link from 'next/link';

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
              <div className="member-logo-grid">
                {members.map((p, i) => (
                  p.website_url ? (
                    <a key={p.id} href={p.website_url} target="_blank" rel="noopener noreferrer" className="member-logo-link content-reveal" aria-label={`${p.name} website`} style={{ animationDelay: `${0.04 * i}s` }}>
                      <div className="member-logo-card">
                        <div className="member-logo-card__surface"><img src={imgUrl(p.logo_url)} alt={p.name} /></div>
                        <span className="member-logo-card__name">{p.name}</span>
                      </div>
                    </a>
                  ) : (
                    <Link key={p.id} href="/contact" className="member-logo-link content-reveal" aria-label={`${p.name} contact`} style={{ animationDelay: `${0.04 * i}s` }}>
                      <div className="member-logo-card">
                        <div className="member-logo-card__surface"><img src={imgUrl(p.logo_url)} alt={p.name} /></div>
                        <span className="member-logo-card__name">{p.name}</span>
                      </div>
                    </Link>
                  )
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
