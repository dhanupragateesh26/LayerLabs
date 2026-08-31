'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, UploadCloud, Settings, Package, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

/* ─── Tilt Image Component ────────────────────────────────────────────── */
function TiltImage({ src, alt, priority, active, accent }: { src: string, alt: string, priority: boolean, active: boolean, accent: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative w-full aspect-[4/3] overflow-hidden transition-[filter] duration-700 rounded-t-3xl ${active ? 'grayscale-0' : 'grayscale-[40%]'
        }`}
      style={{
        background: accent,
        perspective: 1200, // CSS perspective
      }}
    >
      <motion.div
        className="w-full h-full relative origin-center"
        style={{
          rotateX,
          rotateY,
          scale: 1.06, // Slightly scaled so borders don't show when rotating
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100 mix-blend-overlay bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 400px"
          priority={priority}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Animation variants ────────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

/* ─── Product showcase data ─────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'pla',
    label: 'Material — PLA',
    title: 'Precision\nPrototyping',
    description:
      'Our PLA prints deliver exceptional detail resolution, perfect for architectural models, visual prototypes, and intricate miniatures. Clean surface finish, consistent dimensions.',
    cta: 'Order in PLA',
    image: '/showcase_pla.png',
    accent: '#e7e5e4', // stone-200
  },
  {
    id: 'petg',
    label: 'Material — PETG',
    title: 'Built to\nLast',
    description:
      'PETG combines the ease of PLA with the toughness of engineering plastics. Ideal for functional brackets, jigs, housings, and parts that need to survive real-world use.',
    cta: 'Order in PETG',
    image: '/showcase_petg.png',
    accent: '#d6d3d1', // stone-300
  },
  {
    id: 'custom',
    label: 'Service — Custom',
    title: 'Your Vision,\nMade Real',
    description:
      'Have something specific in mind? We handle bespoke runs — personalised gifts, product mockups, replacement components, and anything in between. Just send us your file.',
    cta: 'Request Custom Print',
    image: '/showcase_custom.png',
    accent: '#c4bfb9',
  },
];

function ProductShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync dot indicator with scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      // Find the card closest to the center
      const cards = Array.from(track.children) as HTMLElement[];
      const trackCenter = track.scrollLeft + track.clientWidth / 2;

      let closestIdx = 0;
      let minDiff = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const diff = Math.abs(trackCenter - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });
      setActiveIndex(closestIdx);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    // Initial calculation
    onScroll();
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards[idx]) {
      const cardCenter = cards[idx].offsetLeft + cards[idx].clientWidth / 2;
      const scrollPos = cardCenter - track.clientWidth / 2;
      track.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-28 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400 font-semibold">
            Materialize Your Vision
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
            Gallery & Capabilities
          </h2>
        </motion.div>

        {/* Navigation arrows */}
        <div className="flex gap-3 relative z-10">
          <button
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 hover:pl-0.5 transition-all"
            aria-label="Previous image"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={() => scrollTo(Math.min(PRODUCTS.length - 1, activeIndex + 1))}
            disabled={activeIndex === PRODUCTS.length - 1}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 hover:pr-0.5 transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none px-6 md:px-12 lg:px-[max(1.5rem,calc((100vw-80rem)/2))] gap-6 pb-8 pt-4 -mt-4 items-stretch"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PRODUCTS.map((product, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            key={product.id}
            className={`relative min-w-[85vw] sm:min-w-[65vw] md:min-w-[50vw] lg:min-w-[400px] max-w-xl snap-center flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200 transition-all duration-500 will-change-transform ${i === activeIndex ? 'shadow-xl scale-100' : 'shadow-sm scale-[0.98] opacity-80'
              }`}
          >
            {/* Image panel */}
            <TiltImage
              src={product.image}
              alt={product.title.replace('\n', ' ')}
              priority={i === 0}
              active={i === activeIndex}
              accent={product.accent}
            />

            {/* Text panel */}
            <div className="flex flex-col p-8 sm:p-10 grow">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">
                {product.label}
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mb-4 whitespace-pre-line">
                {product.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8 grow">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <Link
                  href="/order"
                  className="btn-outline text-sm px-6 py-2.5"
                >
                  {product.cta}
                </Link>
                <div className="text-xs font-semibold text-stone-300 tabular-nums">
                  {String(i + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Spacer to allow final card to center */}
        <div className="min-w-[max(0px,calc((100vw-1.5rem-400px)/2))] lg:min-w-[max(0px,calc((100vw-max(1.5rem,calc((100vw-80rem)/2))*2-400px)/2))] shrink-0" aria-hidden="true" />
      </div>

    </section>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="flex flex-col w-full text-stone-900">

      {/* ── 1. Hero ───────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center min-h-[78vh] px-6 text-center bg-transparent">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-4xl mx-auto space-y-7 z-10"
        >
          {/* Eyebrow */}
          <p className="inline-block text-xs uppercase tracking-[0.2em] text-stone-400 font-semibold">
            Next-Gen Manufacturing · Chennai, TN
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-stone-900 leading-[1.04]">
            {[
              { text: "Bring Your Ideas ", em: false },
              { text: "to Life", em: true },
              { text: " in 3D", em: false }
            ].map((seg, i) => (
              <span key={i} className={seg.em ? "not-italic border-b-[6px] border-[#b4c4ab] relative inline-block leading-[1.1]" : ""}>
                {seg.text.split(/( )/).map((token, tIdx) => {
                  if (token === " ") return <span key={tIdx}>&nbsp;</span>;
                  return (
                    <span key={tIdx} className="inline-block whitespace-nowrap">
                      {token.split("").map((char, cIdx) => (
                        <motion.span
                          key={cIdx}
                          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{
                            delay: (seg.text === "to Life" ? 17 : seg.text === " in 3D" ? 24 : 0) * 0.04 + (token === "Your" ? 6 : token === "Ideas" ? 11 : token === "Life" ? 3 : token === "in" ? 1 : token === "3D" ? 4 : 0) * 0.04 + cIdx * 0.04,
                            ease: "easeOut",
                            duration: 0.3
                          }}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ delay: 1.5, duration: 0.8, ease: "circOut" }}
            className="text-xl md:text-2xl text-stone-500 font-light max-w-2xl mx-auto leading-relaxed"
          >
            High-quality custom 3D printing at your fingertips. From prototype to production, we deliver excellence.
          </motion.p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/order" className="btn-primary text-base px-8 py-4 group">
              Start Printing
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline text-base px-8 py-4"
            >
              See How It Works
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── 2. Product Showcase (horizontal scroll) ───────────────────── */}
      <ProductShowcase />

      {/* ── 3. How It Works ───────────────────────────────────────────── */}
      <section className="py-28 bg-white/30 backdrop-blur-3xl border-t border-white/50 relative overflow-hidden" id="how-it-works">
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="text-center space-y-3 mb-20"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400 font-semibold">Process</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">How It Works</h2>
            <p className="text-stone-500 max-w-xl mx-auto text-lg pt-1">
              Three simple steps to hold your creativity in your hands.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 relative z-10"
          >
            {/* Step 1 */}
            <motion.div
              variants={fadeUp}
              className="card p-10 flex flex-col items-start text-left space-y-4
                         hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ecf0e6] flex items-center justify-center text-[#4f6b43] shadow-[0_0_20px_rgba(79,107,67,0.15)] mb-2">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Step 01</p>
              <h3 className="text-xl font-bold text-stone-900">Upload your STL</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Drag and drop your 3D model. We instantly visualise your creation right in the browser, securely.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeUp}
              className="card p-10 flex flex-col items-start text-left space-y-4
                         hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#f5f1e8] flex items-center justify-center text-[#8b7355] shadow-[0_0_20px_rgba(139,115,85,0.15)] mb-2">
                <Settings className="w-7 h-7" />
              </div>
              <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Step 02</p>
              <h3 className="text-xl font-bold text-stone-900">Configure Print</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Select the perfect material, infill, and finishing for your project.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeUp}
              className="card p-10 flex flex-col items-start text-left space-y-4
                         hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e8e4db] flex items-center justify-center text-[#6b6255] shadow-[0_0_20px_rgba(107,98,85,0.15)] mb-2">
                <Package className="w-7 h-7" />
              </div>
              <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Step 03</p>
              <h3 className="text-xl font-bold text-stone-900">We Print &amp; Deliver</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                We use state-of-the-art 3D printers to bring your ideas to life and ship them right to you.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Materials & Pricing ────────────────────────────────────── */}
      <section className="py-28 bg-transparent" id="materials">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="text-center space-y-3 mb-16"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400 font-semibold">Materials</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
              Materials &amp; Pricing
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto text-lg pt-1">
              Premium materials designed for strength, precision, and flexibility.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 text-left relative z-10"
          >
            {/* PLA */}
            <motion.div
              variants={fadeUp}
              className="card p-8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-extrabold text-stone-900">PLA</h3>
                <span className="text-xs bg-[#ecf0e6] text-[#4f6b43] font-semibold px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(79,107,67,0.1)]">Available</span>
              </div>
              <p className="text-2xl font-bold text-stone-900 mb-1">
                ₹2.5 <span className="text-sm font-normal text-stone-400">/ gram</span>
              </p>
              <p className="text-stone-500 text-sm leading-relaxed mt-4">
                Ideal for detailed prototypes, structural components, and miniatures.
              </p>
            </motion.div>

            {/* PETG */}
            <motion.div
              variants={fadeUp}
              className="card p-8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-extrabold text-stone-900">PETG</h3>
                <span className="text-xs bg-[#ecf0e6] text-[#4f6b43] font-semibold px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(79,107,67,0.1)]">Available</span>
              </div>
              <p className="text-2xl font-bold text-stone-900 mb-1">
                ₹3.5 <span className="text-sm font-normal text-stone-400">/ gram</span>
              </p>
              <p className="text-stone-500 text-sm leading-relaxed mt-4">
                Durable, strong layer adhesion. Great for mechanical and functional parts.
              </p>
            </motion.div>

            {/* TPU — coming soon */}
            <motion.div
              variants={fadeUp}
              className="card p-8 opacity-60 grayscale border-stone-100"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-extrabold text-stone-400">TPU</h3>
                <span className="text-xs bg-[#f5f1e8] text-[#8b7355] font-semibold px-2.5 py-1 rounded-full">Coming Soon</span>
              </div>
              <p className="text-2xl font-bold text-stone-400 mb-1">
                ₹5 <span className="text-sm font-normal text-stone-300">/ gram</span>
              </p>
              <p className="text-stone-400 text-sm leading-relaxed mt-4">
                Flexible, rubber-like material perfect for wearables and seals.
              </p>
            </motion.div>

            {/* ABS — coming soon */}
            <motion.div
              variants={fadeUp}
              className="card p-8 opacity-60 grayscale border-stone-100"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-extrabold text-stone-400">ABS</h3>
                <span className="text-xs bg-[#f5f1e8] text-[#8b7355] font-semibold px-2.5 py-1 rounded-full">Coming Soon</span>
              </div>
              <p className="text-2xl font-bold text-stone-400 mb-1">
                ₹5 <span className="text-sm font-normal text-stone-300">/ gram</span>
              </p>
              <p className="text-stone-400 text-sm leading-relaxed mt-4">
                High impact resistance and high temperature tolerance.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
