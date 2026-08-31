import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ContactFooter from '@/components/ContactFooter';
import InteractiveBackground from '@/components/InteractiveBackground';
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LayerLabs | 3D Printing Service',
  description: 'High-quality custom 3D printing at your fingertips. Upload your STL and bring your ideas to life.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen bg-[#e8e4db] text-stone-900 flex flex-col relative antialiased`}>
        <CustomCursor />
        <ScrollProgress />
        <InteractiveBackground />
        <Navbar />
        {/* Padding accounts for floating navbar height */}
        <main className="flex-1 flex flex-col pt-24">
          {children}
        </main>
        <ContactFooter />
      </body>
    </html>
  );
}
