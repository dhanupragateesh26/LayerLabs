'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { name: 'How it Works', path: '/#how-it-works', anchor: 'how-it-works' },
  { name: 'Materials', path: '/#materials', anchor: 'materials' },
  { name: 'Order Now', path: '/order', anchor: null },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll depth to enhance backdrop on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight nav items based on visible section via IntersectionObserver
  useEffect(() => {
    if (pathname !== '/') { setActiveAnchor(null); return; }
    const anchors = NAV_LINKS.map(l => l.anchor).filter(Boolean) as string[];
    const observers: IntersectionObserver[] = [];

    anchors.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveAnchor(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [pathname]);

  const isActive = (link: typeof NAV_LINKS[0]) => {
    if (link.path === '/order') return pathname === '/order';
    return activeAnchor === link.anchor;
  };

  // Smooth-scroll within the same page; navigate first otherwise
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: typeof NAV_LINKS[0]
  ) => {
    setMobileOpen(false);
    if (!link.anchor) return;
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById(link.anchor)?.scrollIntoView({ behavior: 'smooth' });
    }
    // If on another page, let Next.js navigate normally to /#anchor
  };

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl
        border border-gray-800 rounded-full px-2 py-2 transition-all duration-300
        ${scrolled
          ? 'bg-gray-950/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)]'
          : 'bg-gray-950/80 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.08)]'
        }`}
    >
      <div className="flex justify-between items-center h-12 px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <div className="p-[6px] bg-gradient-to-br from-brand-secondary to-brand-primary rounded-full text-white
            group-hover:scale-105 group-hover:rotate-12 transition-transform shadow-lg shadow-brand-primary/20">
            <Box size={20} />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r
            from-brand-secondary to-brand-primary tracking-wide hidden sm:block">
            LayerLabs
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={(e) => handleAnchorClick(e, link)}
              className={`transition-all font-semibold text-sm px-3 py-2 rounded-full ${link.path === '/order'
                  ? isActive(link)
                    ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    : 'bg-gradient-to-r from-brand-secondary to-brand-primary text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-0.5'
                  : isActive(link)
                    ? 'bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/50'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden mt-2 mb-1 mx-2 flex flex-col gap-1 border-t border-gray-800 pt-3 pb-2 px-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={(e) => handleAnchorClick(e, link)}
              className={`block font-semibold text-sm px-4 py-2.5 rounded-full transition-all ${link.path === '/order'
                  ? 'bg-gradient-to-r from-brand-secondary to-brand-primary text-white text-center'
                  : isActive(link)
                    ? 'bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/50'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
