'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/useLang';
import { apiGet, imgUrl, type PageContent, type Milestone, type StatItem, type Partner, type TeamMember, type NewsItem } from '@/lib/api';
import Link from 'next/link';

const c: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };
const sec: React.CSSProperties = { padding: '96px 0' };
const secB: React.CSSProperties = { ...sec, borderTop: '1px solid rgba(255,255,255,0.06)' };

export default function AboutPage() {
  const { t } = useLang();
  const [page, setPage] = useState<PageContent | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    apiGet<PageContent>('/api/pages/about').then(setPage).catch(() => {});
    apiGet<Milestone[]>('/api/milestones').then(setMilestones).catch(() => {});
    apiGet<StatItem[]>('/api/stats').then(setStats).catch(() => {});
    apiGet<Partner[]>('/api/partners').then(setPartners).catch(() => {});
    apiGet<TeamMember[]>('/api/team').then(setTeam).catch(() => {});
    apiGet<{ items: NewsItem[] }>('/api/news?limit=3').then(d => setNews(d.items)).catch(() => {});
  }, []);

  return (
    <>
      <section style={{ ...sec, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />
        <div style={{ ...c, position: 'relative' }}>
          <div style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards' }}>
            <div className="section-label">{t('關於協會', 'About')}</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 20 }}>{page ? t(page.title_zh, page.title_en) : t('關於我們', 'About Us')}</h1>
            <div className="divider" />
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 64 }}>
        <div style={{ ...c, maxWidth: 800 }}>
          {page && <div className="prose" style={{ animation: 'fadeInUp 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) forwards' }} dangerouslySetInnerHTML={{ __html: t(page.content_zh, page.content_en) }} />}
        </div>
      </section>

      {stats.length > 0 && (
        <section style={secB}>
          <div style={c}>
            <div className="glass-card" style={{ padding: '48px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32 }}>
                {stats.map(s => <div key={s.id} style={{ textAlign: 'center' }}><div className="gradient-text-accent" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: 4 }}>{s.value}</div><div style={{ fontSize: 12, color: '#71717a' }}>{t(s.label_zh, s.label_en)}</div></div>)}
              </div>
            </div>
          </div>
        </section>
      )}

      {milestones.length > 0 && (
        <section style={{ ...secB, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 60%)' }} />
          <div style={{ ...c, position: 'relative', maxWidth: 700, textAlign: 'center' }}>
            <div className="section-label">{t('發展歷程', 'Our Journey')}</div>
            <h2 className="section-title" style={{ marginBottom: 48 }}>{t('協會里程碑', 'Key Milestones')}</h2>
            <div style={{ position: 'relative', textAlign: 'left' }}>
              <div style={{ position: 'absolute', left: 5, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)' }} />
              {milestones.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', gap: 20, marginBottom: 36, animation: `fadeInUp 0.6s ${0.1 * i}s cubic-bezier(0.22,1,0.36,1) forwards`, opacity: 0 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: 4, boxShadow: '0 0 0 4px #09090b' }} />
                  <div><div className="gradient-text-accent" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{m.year}</div><h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{t(m.title_zh, m.title_en)}</h4><p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6 }}>{t(m.description_zh, m.description_en)}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section style={secB}>
          <div style={c}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}><div className="section-label">{t('合作夥伴', 'Partners')}</div><h2 className="section-title">{t('攜手共建生態', 'Building Together')}</h2></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
              {partners.map(p => <div key={p.id} className="glass-card" style={{ width: 140, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}><img src={imgUrl(p.logo_url)} alt={p.name} style={{ maxHeight: 36, maxWidth: 100, objectFit: 'contain', opacity: 0.6, filter: 'grayscale(1)' }} /></div>)}
            </div>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section style={secB}>
          <div style={c}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}><div className="section-label">{t('領導團隊', 'Leadership')}</div><h2 className="section-title">{t('顧問委員會', 'Advisory Board')}</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {team.slice(0, 4).map(m => <div key={m.id} className="glass-card" style={{ padding: 24, textAlign: 'center' }}><img src={imgUrl(m.avatar_url)} alt="" style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', marginBottom: 12, border: '2px solid rgba(255,255,255,0.06)' }} /><h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t(m.name_zh, m.name_en)}</h4><p style={{ fontSize: 12, color: '#818cf8' }}>{t(m.title_zh, m.title_en)}</p></div>)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}><Link href="/team" className="btn-secondary">{t('查看全部', 'View All')} →</Link></div>
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section style={secB}>
          <div style={c}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}><div className="section-label">{t('最新動態', 'Latest')}</div><h2 className="section-title">{t('協會新聞', 'News')}</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {news.map(item => <Link key={item.id} href={`/news/${item.id}`} className="glass-card" style={{ overflow: 'hidden', display: 'block', textDecoration: 'none', color: 'inherit' }}>{item.cover_image && <div style={{ height: 160, overflow: 'hidden' }}><img src={imgUrl(item.cover_image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}<div style={{ padding: 20 }}><h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#fff' }}>{t(item.title_zh, item.title_en)}</h3><p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t(item.summary_zh, item.summary_en)}</p></div></Link>)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
