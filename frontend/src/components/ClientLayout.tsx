'use client';
import { ReactNode } from 'react';
import { LangProvider } from '@/lib/useLang';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: ReactNode }) {
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
