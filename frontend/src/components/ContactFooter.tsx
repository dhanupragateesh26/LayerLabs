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
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest">Contact Us</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              For personalised orders, feel free to reach out directly on the numbers below.
            </p>
            <div className="space-y-3">
              {[
                { name: 'Dhanu ', phone: '+91 98402 74943' },
                { name: 'Muthiah Karthik', phone: '+91 88382 96344' },
              ].map(({ name, phone }) => (
                <div key={name} className="flex items-start gap-3 group">
                  <div className="mt-0.5 p-1.5 rounded-full bg-gray-900 text-brand-secondary group-hover:bg-brand-primary/20 transition-colors shrink-0">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200 text-sm">{name}</p>
                    <a href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-gray-400 text-sm mt-0.5 hover:text-brand-secondary transition-colors flex items-center gap-1">
                      <Phone size={12} className="inline" /> {phone}
                    </a>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 group">
                <div className="mt-0.5 p-1.5 rounded-full bg-gray-900 text-brand-secondary group-hover:bg-brand-primary/20 transition-colors shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="font-medium text-gray-200 text-sm">Email Support</p>
                  <a href="mailto:layerlabs.org@gmail.com"
                    className="text-gray-400 text-sm mt-0.5 hover:text-brand-secondary transition-colors break-all">
                    layerlabs.org@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/order"
              className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-brand-secondary to-brand-primary
                text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]
                hover:-translate-y-0.5 transition-all duration-200"
            >
              <Printer size={14} />
              Start a Print
            </Link>
          </div>
        </div>

        {/* ── Personalised Orders Banner ── */}
        <div className="relative mb-10 rounded-2xl overflow-hidden border border-brand-primary/25 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
          {/* Glow layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/10 pointer-events-none" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-primary/15 blur-[60px] pointer-events-none" />

          <div className="relative z-10 px-8 py-10 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-secondary font-semibold mb-3">
              Personalised Orders
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
              Got something specific in mind?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-xl mx-auto">
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
                  className="group flex items-center gap-4 bg-black/40 border border-gray-800 hover:border-brand-primary/60
                    hover:bg-brand-primary/10 rounded-xl px-6 py-4 transition-all duration-200
                    hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] w-full sm:w-auto"
                >
                  <div className="p-2 rounded-full bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/20 transition-colors shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-400 text-xs font-medium">{name}</p>
                    <p className="text-white text-xl sm:text-2xl font-bold tracking-wide group-hover:text-brand-secondary transition-colors">
                      {phone}
                    </p>
                  </div>
                </a>
              ))}
            </div>
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
