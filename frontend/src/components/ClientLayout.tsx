'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LangProvider } from '@/lib/useLang';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <LangProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ paddingTop: 64, flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </LangProvider>
  );
}
