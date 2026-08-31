'use client';

import Link from 'next/link';
import {
  Mail, Phone, User, Camera, XIcon, Globe,
  MapPin, Box, Printer,
} from 'lucide-react';

export default function ContactFooter() {
  return (
    <footer id="contact" className="w-full bg-white/40 backdrop-blur-3xl border-t border-white/50 mt-auto relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4f6b43]/30 to-transparent" />

      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-1/2 h-40 bg-[#4f6b43]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-[#d4cbb8]/20 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">

        {/* ── Personalised Orders Banner ── */}
        <div className="relative mb-10 rounded-3xl overflow-hidden border border-[#d4cbb8] bg-[#d4cbb8]/40 shadow-sm">
          <div className="relative z-10 px-8 py-10 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#4f6b43] font-bold mb-3">
              Personalised Orders
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight mb-2">
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
                  className="group flex items-center gap-4 bg-white/60 border border-white/50 backdrop-blur-md hover:border-white hover:bg-white/80 rounded-xl px-6 py-4 transition-all duration-200 hover:shadow-sm w-full sm:w-auto"
                >
                  <div className="p-2 rounded-full bg-[#ecf0e6] text-[#4f6b43] group-hover:bg-[#e1e6d7] transition-colors shrink-0">
                    <Phone size={20} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">

          {/* Brand column */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="p-2 bg-[#4f6b43] rounded-xl text-white shadow-md group-hover:scale-105 group-hover:rotate-6 transition-transform duration-200">
                <Box size={22} />
              </div>
              <span className="text-xl font-bold text-stone-900 tracking-wide">
                LayerLabs
              </span>
            </Link>
            <p className="text-stone-500 leading-relaxed text-sm max-w-xs">
              High-quality custom 3D printing. From rapid prototypes to production runs, we bring your digital ideas into the physical world with precision and speed.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://www.instagram.com/layerlabs.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-10 py-2 rounded-lg bg-gradient-to-r from-stone-300/10 to-stone-100/10 border border-stone-400 text-stone-600 hover:bg-pink-200/80 hover:border-white/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                <Camera size={18} />
                <span className="text-sm font-bold tracking-wide">Instagram</span>
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="w-10 h-10 rounded-lg bg-white/50 border border-white/60 flex items-center justify-center text-stone-500 transition-all duration-300 hover:text-sky-500 hover:border-sky-500/30 hover:bg-sky-500/10 hover:-translate-y-0.5"
              >
                <XIcon size={18} />
              </a>
              <a
                href="#"
                aria-label="Website"
                className="w-10 h-10 rounded-lg bg-white/50 border border-white/60 flex items-center justify-center text-stone-500 transition-all duration-300 hover:text-stone-900 hover:border-stone-300 hover:bg-stone-200/50 hover:-translate-y-0.5"
              >
                <Globe size={18} />
              </a>
            </div>

            {/* Location */}
            <div className="mt-6 inline-flex items-start gap-3 bg-white/40 border border-white/60 rounded-xl p-3 pr-6">
              <div className="p-1.5 rounded-lg bg-[#e8e4db] text-[#6b6255] shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-stone-700 text-sm font-medium">Based in Chennai, TN</p>
                <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">Pan India Shipping</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-stone-900 font-semibold text-sm uppercase tracking-widest">Contact Us</h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              For personalised orders, feel free to reach out directly on the numbers below.
            </p>
            <div className="space-y-3">
              {[
                { name: 'Dhanu ', phone: '+91 98402 74943' },
                { name: 'Muthiah Karthik', phone: '+91 88382 96344' },
              ].map(({ name, phone }) => (
                <div key={name} className="flex items-start gap-3 group">
                  <div className="mt-0.5 p-1.5 rounded-full bg-white/50 text-[#8b7355] group-hover:bg-[#f5f1e8] border border-white/60 transition-colors shrink-0">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-stone-700 text-sm">{name}</p>
                    <a href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-stone-700 text-sm mt-0.5 hover:text-stone-900 transition-colors flex items-center gap-1">
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
                    className="text-stone-700 text-sm mt-0.5 hover:text-stone-900 transition-colors break-all">
                    layerlabs.org@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/order"
              className="mt-4 inline-flex items-center gap-2 bg-[#4f6b43] text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#394f30] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_12px_rgba(79,107,67,0.2)]"
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
