import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ContactFooter from '@/components/ContactFooter';
import InteractiveBackground from '@/components/InteractiveBackground';

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
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-black text-gray-100 flex flex-col relative`}>
        <InteractiveBackground />
        <Navbar />
        {/* Added padding top to account for floating navbar */}
        <main className="flex-1 flex flex-col pt-28">
          {children}
        </main>
        <ContactFooter />
      </body>
    </html>
  );
}
