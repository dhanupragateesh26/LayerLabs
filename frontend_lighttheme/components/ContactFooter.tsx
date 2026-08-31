'use client';

import Link from 'next/link';
import {
  Mail, Phone, User, Camera, XIcon, Globe,
  MapPin, Box, Printer, Clock, ArrowUpRight,
} from 'lucide-react';

const QUICK_LINKS = [
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Materials & Pricing', href: '/#materials' },
  { label: 'Start an Order', href: '/order' },
];

const MATERIALS = ['PLA', 'PETG', 'TPU (coming soon)', 'ABS (coming soon)'];

const SOCIALS = [
  { icon: Camera, href: '#', label: 'Instagram', hoverClass: 'hover:text-[#4f6b43] hover:border-white hover:bg-white/90' },
  { icon: XIcon,   href: '#', label: 'Twitter / X', hoverClass: 'hover:text-[#4f6b43] hover:border-white hover:bg-white/90' },
  { icon: Globe,   href: '#', label: 'Website', hoverClass: 'hover:text-[#4f6b43] hover:border-white hover:bg-white/90' },
];

export default function ContactFooter() {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.startsWith('/#') ? href.slice(2) : null;
    if (!hash) return;
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white/40 backdrop-blur-3xl border-t border-white/50 mt-auto">

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* ── Personalised Orders Banner ── */}
        <div className="mb-12 rounded-3xl border border-[#d4cbb8] bg-[#d4cbb8]/40 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-8 py-10 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">
              Personalised Orders
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight mb-2 tracking-tight">
              Got something specific in mind?
            </h2>
            <p className="text-stone-500 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Reach out directly — we&apos;ll craft the perfect print for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {[
                { name: 'Dhanu', phone: '+91 98402 74943' },
                { name: 'Muthiah Karthik', phone: '+91 88382 96344' },
              ].map(({ name, phone }) => (
                <a
                  key={name}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="group flex items-center gap-4 bg-white/60 border border-white/50 backdrop-blur-md
                    hover:border-white hover:bg-white/80 hover:shadow-sm
                    rounded-xl px-6 py-4 transition-all duration-200 w-full sm:w-auto"
                >
                  <div className="p-2 rounded-full bg-[#ecf0e6] text-[#4f6b43] group-hover:bg-[#e1e6d7] transition-colors shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-stone-500 text-xs font-medium">{name}</p>
                    <p className="text-stone-900 text-xl sm:text-2xl font-bold tracking-wide">
                      {phone}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand column */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="p-2 bg-[#4f6b43] rounded-xl text-white
                group-hover:bg-[#394f30] transition-colors duration-200">
                <Box size={20} />
              </div>
              <span className="text-xl font-bold text-stone-900 tracking-tight">
                LayerLabs
              </span>
            </Link>
            <p className="text-stone-500 leading-relaxed text-sm max-w-xs">
              High-quality custom 3D printing. From rapid prototypes to production runs, we bring your digital ideas into the physical world with precision and speed.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map(({ icon: Icon, href, label, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  className={`w-9 h-9 rounded-full bg-white/50 border border-white/60 flex items-center justify-center
                    text-stone-500 transition-all duration-200 ${hoverClass}`}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-stone-900 font-semibold text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={(e) => handleAnchorClick(e, href)}
                    className="group flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors text-sm"
                  >
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2 space-y-2">
              <h3 className="text-stone-900 font-semibold text-sm uppercase tracking-widest mt-4">Materials</h3>
              {MATERIALS.map(m => (
                <p key={m} className="text-stone-400 text-sm">{m}</p>
              ))}
            </div>
          </div>

          {/* Service Hours */}
          <div className="space-y-4">
            <h3 className="text-stone-900 font-semibold text-sm uppercase tracking-widest">Service Hours</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-white/50 border border-white/60 text-[#8b7355] shrink-0">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-stone-700 text-sm font-medium">Mon – Sat</p>
                  <p className="text-stone-400 text-sm">9:00 AM – 10:00 PM IST</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-white/50 border border-white/60 text-[#8b7355] shrink-0">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-stone-700 text-sm font-medium">Sunday</p>
                  <p className="text-stone-400 text-sm">9:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-4 flex items-start gap-3 bg-white/40 border border-white/60 rounded-xl p-3">
              <div className="p-1.5 rounded-lg bg-[#e8e4db] text-[#6b6255] shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-stone-700 text-sm font-medium">Based in Chennai, TN</p>
                <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">Shipping across Tamil Nadu</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-stone-900 font-semibold text-sm uppercase tracking-widest">Contact Us</h3>
            <p className="text-stone-400 text-xs leading-relaxed">
              For personalised orders, feel free to reach out directly on the numbers below.
            </p>
            <div className="space-y-3">
              {[
                { name: 'Dhanu', phone: '+91 98402 74943' },
                { name: 'Muthiah Karthik', phone: '+91 88382 96344' },
              ].map(({ name, phone }) => (
                <div key={name} className="flex items-start gap-3 group">
                  <div className="mt-0.5 p-1.5 rounded-full bg-white/50 text-[#8b7355] group-hover:bg-[#f5f1e8] border border-white/60 transition-colors shrink-0">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-stone-700 text-sm">{name}</p>
                    <a href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-stone-400 text-sm mt-0.5 hover:text-stone-900 transition-colors flex items-center gap-1">
                      <Phone size={12} className="inline" /> {phone}
                    </a>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 group">
                <div className="mt-0.5 p-1.5 rounded-full bg-white/50 text-[#8b7355] group-hover:bg-[#f5f1e8] border border-white/60 transition-colors shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="font-medium text-stone-700 text-sm">Email Support</p>
                  <a href="mailto:layerlabs.org@gmail.com"
                    className="text-stone-400 text-sm mt-0.5 hover:text-stone-900 transition-colors break-all">
                    layerlabs.org@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/order"
              className="mt-2 inline-flex items-center gap-2 bg-[#4f6b43]
                text-white text-sm font-semibold px-4 py-2.5 rounded-full
                hover:bg-[#394f30] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_12px_rgba(79,107,67,0.2)]"
            >
              <Printer size={14} />
              Start a Print
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t border-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-400 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} LayerLabs. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs">
            <a href="#" className="text-stone-400 hover:text-stone-700 transition-colors">Privacy Policy</a>
            <span className="text-stone-200">·</span>
            <a href="#" className="text-stone-400 hover:text-stone-700 transition-colors">Terms of Service</a>
            <span className="text-stone-200">·</span>
            <a href="mailto:layerlabs.org@gmail.com" className="text-stone-400 hover:text-stone-700 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
