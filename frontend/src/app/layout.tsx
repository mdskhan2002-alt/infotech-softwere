import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ChatbotWidget } from '@/components/ui/ChatbotWidget';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Infotech Software | Next-Gen AI & Full-Stack Engineering Agency',
  description: 'Infotech Software engineers high-performance web applications, autonomous AI agents, enterprise SaaS, and cloud infrastructure. Founded by Mohammad Shahabuddin.',
  keywords: ['Software Agency', 'Full-Stack Development', 'FastAPI', 'Next.js', 'AI Agents', 'Mohammad Shahabuddin', 'Cloud DevOps', 'Flutter Development'],
  authors: [{ name: 'Mohammad Shahabuddin', url: 'https://www.linkedin.com/in/mohammad-shahabuddin-887832343' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-brand-dark text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}
