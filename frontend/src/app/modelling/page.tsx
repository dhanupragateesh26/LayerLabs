'use client';

import React, { useState } from 'react';
import { CheckCircle, Send, MessageCircle } from 'lucide-react';

export default function ModellingPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !details.trim()) return;
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi LayerLabs! I'd like to request a 3D Modelling project.\n\nName: ${name || 'Customer'}\nContact: ${contact || 'Not provided'}\nDetails: ${details || 'Discussing my project'}`
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center py-8">
      <div className="inline-block py-1 px-3 rounded-full bg-[#ecf0e6] border border-[#4f6b43]/30 text-[#4f6b43] text-sm font-semibold tracking-wider uppercase mb-4 shadow-sm">
        3D Modelling Service
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6">
        Turn your sketches into <span className="text-[#4f6b43]">3D Models</span>
      </h1>
      <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
        Our expert designers transform your concepts, hand drawings, and 2D sketches into production-ready 3D models.
      </p>

      <div className="card p-8 max-w-xl w-full text-left bg-white/70 backdrop-blur-xl border border-stone-200 shadow-sm rounded-2xl">
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-[#ecf0e6] text-[#4f6b43] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={30} />
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Request Received!</h2>
            <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-stone-800">{name}</strong>. We&apos;ve logged your 3D modelling request and our design team will reach out to you via <strong className="text-stone-800">{contact}</strong> shortly.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/919840274943?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1ebd5a] transition-all shadow-sm"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp Directly</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setContact('');
                  setDetails('');
                }}
                className="py-3 px-5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-all"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Request Modelling</h2>
            <p className="text-xs text-stone-500 mb-6">Tell us about your part or concept, and we&apos;ll prepare a personalized quote and timeline.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Alex Miller"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number or Email *</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="input-field"
                  placeholder="+91 98402 74943 or email@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Project Details *</label>
                <textarea
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="input-field min-h-[110px]"
                  placeholder="Describe dimensions, intended application, reference drawings or components..."
                />
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-md"
                >
                  <Send size={15} />
                  <span>Submit Request</span>
                </button>
                <a
                  href={`https://wa.me/919840274943?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle size={16} className="text-[#25D366]" />
                  <span>Quick WhatsApp</span>
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
