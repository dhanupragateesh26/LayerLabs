'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Menu, X, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { name: 'Contact', path: '/#contact', anchor: 'contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, totalCount } = useCart();
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
        border border-stone-200 rounded-full px-2 py-2 transition-all duration-300
        ${scrolled
          ? 'bg-white/40 backdrop-blur-xl shadow-md shadow-stone-200/50'
          : 'bg-white/60 backdrop-blur-md shadow-sm'
        }`}
    >
      <div className="flex justify-between items-center h-12 px-5 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <div className="p-[6px] bg-stone-900 rounded-full text-white
            group-hover:scale-105 group-hover:rotate-12 transition-transform shadow-lg shadow-stone-200">
            <Box size={20} />
          </div>
          <span className="text-lg font-bold text-stone-900 tracking-wide hidden sm:block">
            LayerLabs
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={(e) => handleAnchorClick(e, link)}
              className={`transition-all font-semibold text-sm px-3.5 py-2 rounded-full ${isActive(link)
                ? 'bg-stone-100 text-stone-900 ring-1 ring-stone-200'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/order"
            className="ml-1 transition-all font-bold text-sm px-4 py-2 rounded-full bg-stone-900 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg"
          >
            Get a Quote
          </Link>

          {/* Cart Icon Trigger */}
          <button
            onClick={openCart}
            className="relative p-2 ml-1 text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 rounded-full transition-all"
            aria-label="Open Cart"
          >
            <ShoppingBag size={20} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4f6b43] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-200">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile items: Cart + Hamburger */}
        <div className="sm:hidden flex items-center gap-1">
          <button
            onClick={openCart}
            className="relative p-2 text-stone-700 hover:text-stone-950 rounded-full"
            aria-label="Open Cart"
          >
            <ShoppingBag size={20} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4f6b43] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalCount}
              </span>
            )}
          </button>
          <button
            className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden mt-2 mb-1 mx-2 flex flex-col gap-1 border-t border-stone-200 pt-3 pb-2 px-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={(e) => handleAnchorClick(e, link)}
              className={`block font-semibold text-sm px-4 py-2.5 rounded-full transition-all ${isActive(link)
                ? 'bg-stone-100 text-stone-900 ring-1 ring-stone-200'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/order"
            className="block mt-2 font-bold text-sm px-4 py-2.5 rounded-full transition-all bg-stone-900 text-white text-center shadow-md"
            onClick={() => setMobileOpen(false)}
          >
            Get a Quote
          </Link>
        </div>
      )}
    </nav>
  );
}
