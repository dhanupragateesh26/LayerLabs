'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { name: 'How it Works', path: '/#how-it-works', anchor: 'how-it-works' },
  { name: 'Materials',    path: '/#materials',    anchor: 'materials' },
  { name: 'Order Now',    path: '/order',          anchor: null },
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
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl
        border rounded-full px-2 py-1.5 transition-all duration-300
        ${scrolled
          ? 'bg-white/95 backdrop-blur-2xl border-stone-200 shadow-md shadow-stone-200/60'
          : 'bg-white/80 backdrop-blur-xl border-stone-200/70 shadow-sm'
        }`}
    >
      <div className="flex justify-between items-center h-11 px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
          <div className="p-[6px] bg-stone-900 rounded-full text-white
            group-hover:bg-stone-700 transition-colors duration-200">
            <Box size={18} />
          </div>
          <span className="text-base font-bold text-stone-900 tracking-tight hidden sm:block">
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
              className={`transition-all font-medium text-sm px-4 py-2 rounded-full ${
                link.path === '/order'
                  ? 'bg-stone-900 text-white hover:bg-stone-700 shadow-sm'
                  : isActive(link)
                    ? 'bg-stone-100 text-stone-900 font-semibold'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden mt-1 mb-1 mx-2 flex flex-col gap-1 border-t border-stone-100 pt-3 pb-2 px-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={(e) => handleAnchorClick(e, link)}
              className={`block font-medium text-sm px-4 py-2.5 rounded-full transition-all ${
                link.path === '/order'
                  ? 'bg-stone-900 text-white text-center'
                  : isActive(link)
                    ? 'bg-stone-100 text-stone-900 font-semibold'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
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
