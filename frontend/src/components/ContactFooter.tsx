'use client';

import Link from 'next/link';
import {
  Phone, User, Camera, XIcon, Globe,
  MapPin, Box, Printer, Clock, ArrowUpRight,
} from 'lucide-react';

const QUICK_LINKS = [
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Materials & Pricing', href: '/#materials' },
  { label: 'Start an Order', href: '/order' },
];

const MATERIALS = ['PLA', 'PETG', 'TPU (coming soon)', 'ABS (coming soon)'];



const SOCIALS = [
  { icon: Camera, href: '#', label: 'Instagram', hoverClass: 'hover:text-pink-400 hover:border-pink-400 hover:bg-pink-400/10' },
  { icon: XIcon, href: '#', label: 'Twitter / X', hoverClass: 'hover:text-sky-400 hover:border-sky-400 hover:bg-sky-400/10' },
  { icon: Globe, href: '#', label: 'Website', hoverClass: 'hover:text-gray-200 hover:border-gray-400 hover:bg-gray-400/10' },
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
    <footer className="w-full bg-gray-950 border-t border-gray-900 mt-auto relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />

      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-1/2 h-40 bg-brand-primary/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-brand-secondary/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand column */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-xl text-white shadow-lg shadow-brand-primary/20
                group-hover:scale-105 group-hover:rotate-6 transition-transform duration-200">
                <Box size={22} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-primary tracking-wide">
                LayerLabs
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
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
                  className={`w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center
                    text-gray-400 transition-all duration-200 ${hoverClass}`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={(e) => handleAnchorClick(e, href)}
                    className="group flex items-center gap-1.5 text-gray-400 hover:text-brand-secondary transition-colors text-sm"
                  >
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2 space-y-2">
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest mt-4">Materials</h3>
              {MATERIALS.map(m => (
                <p key={m} className="text-gray-500 text-sm">{m}</p>
              ))}
            </div>
          </div>

          {/* Service Hours */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest">Service Hours</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-gray-900 text-brand-secondary shrink-0">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-gray-200 text-sm font-medium">Mon – Sat</p>
                  <p className="text-gray-500 text-sm">9:00 AM – 10:00 PM IST</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-gray-900 text-brand-secondary shrink-0">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-gray-200 text-sm font-medium">Sunday</p>
                  <p className="text-gray-500 text-sm">9:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-4 flex items-start gap-3 bg-gray-900/50 border border-gray-800 rounded-xl p-3">
              <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-gray-200 text-sm font-medium">Based in Chennai, TN</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">Shipping across Tamil Nadu </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-5">
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest">Contact Us</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Dhanu', phone: '+91 98402 74943' },
                { name: 'Muthiah Karthik', phone: '+91 88382 96344' },
              ].map(({ name, phone }) => (
                <div key={name}
                  className="flex items-center gap-4 bg-gray-900/60 border border-gray-800 rounded-xl p-4
                    hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-200 group">
                  <div className="p-2.5 rounded-full bg-brand-secondary/10 text-brand-secondary group-hover:bg-brand-secondary/20 transition-colors shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-100 text-base">{name}</p>
                    <a href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-gray-400 text-sm mt-0.5 hover:text-brand-secondary transition-colors flex items-center gap-1.5">
                      <Phone size={13} className="inline" /> {phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/order"
              className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-brand-secondary to-brand-primary
                text-white text-sm font-semibold px-5 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]
                hover:-translate-y-0.5 transition-all duration-200"
            >
              <Printer size={15} />
              Start a Print
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} LayerLabs. All rights reserved..
          </p>
          <div className="flex items-center gap-5 text-xs">
            <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</a>
            <span className="text-gray-800">·</span>
            <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">Terms of Service</a>
            <span className="text-gray-800">·</span>
            <a href="mailto:layerlabs.org@gmail.com" className="text-gray-600 hover:text-gray-400 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
