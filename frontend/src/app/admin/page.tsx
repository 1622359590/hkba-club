'use client';
import { useEffect, useState } from 'react';
import { adminGet } from '@/lib/adminApi';
import Link from 'next/link';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ banners: 0, news: 0, team: 0, partners: 0, events: 0, messages: 0 });
  const [recentNews, setRecentNews] = useState<any[]>([]);
  useEffect(() => {
    Promise.all([
      adminGet<any[]>('/api/banners/all').then(d => d.length).catch(() => 0),
      adminGet<any[]>('/api/news/admin/all').then(d => d.length).catch(() => 0),
      adminGet<any[]>('/api/team/all').then(d => d.length).catch(() => 0),
      adminGet<any[]>('/api/partners/all').then(d => d.length).catch(() => 0),
      adminGet<any[]>('/api/events/admin/all').then(d => d.length).catch(() => 0),
      adminGet<any[]>('/api/contact/messages').then(d => d.length).catch(() => 0),
      adminGet<any[]>('/api/news/admin/all').then(d => d.slice(0, 5)).catch(() => []),
    ]).then(([b, n, t, p, e, m, latest]) => { setCounts({ banners: b, news: n, team: t, partners: p, events: e, messages: m }); setRecentNews(latest); });
  }, []);

  const cards = [
    { label: 'Banner', count: counts.banners, href: '/admin/banners', icon: '🖼' },
    { label: '新聞', count: counts.news, href: '/admin/news', icon: '📰' },
    { label: '活動', count: counts.events, href: '/admin/events', icon: '📅' },
    { label: '團隊', count: counts.team, href: '/admin/team', icon: '👥' },
    { label: '會員', count: counts.partners, href: '/admin/members', icon: '🏢' },
    { label: '留言', count: counts.messages, href: '/admin/messages', icon: '✉' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 32 }}>儀表板</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <Link key={c.label} href={c.href} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, textDecoration: 'none', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{c.count}</div>
            <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>{c.label}</div>
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/admin/news" className="btn-accent" style={{ fontSize: 13 }}>+ 新增新聞</Link>
        <Link href="/admin/events" className="btn-secondary" style={{ fontSize: 13 }}>+ 新增活動</Link>
        <a href="/" target="_blank" className="btn-secondary" style={{ fontSize: 13 }}>查看前台 ↗</a>
      </div>
      {recentNews.length > 0 && (
        <div style={{ marginTop: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 14 }}>最近新聞</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentNews.map(item => (
              <Link key={item.id} href="/admin/news" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, textDecoration: 'none', fontSize: 13, color: '#a1a1aa', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                <span style={{ color: '#d4d4d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title_zh || item.title_en}</span>
                <span style={{ color: item.is_published ? '#22c55e' : '#f59e0b', flexShrink: 0 }}>{item.is_published ? '已發佈' : '草稿'}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
