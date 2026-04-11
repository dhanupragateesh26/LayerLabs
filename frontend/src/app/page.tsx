'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ChevronRight, UploadCloud, Settings, Package } from 'lucide-react';

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

const TiltImage = ({ src, alt, priority, active, accent }: { src: string, alt: string, priority: boolean, active: boolean, accent: string }) => {
  return (
    <div className="relative w-full aspect-[4/3] bg-gray-900 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover origin-bottom transition-all duration-700 ease-out ${active ? 'scale-100' : 'scale-105'}`}
        style={{
          boxShadow: active ? `inset 0 -20px 40px -10px ${accent}20` : 'none'
        }}
      />
    </div>
  );
};

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
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400 font-semibold">
            Materialize Your Vision
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Gallery & Capabilities
          </h2>
        </motion.div>

        {/* Navigation arrows */}
        <div className="flex gap-3 relative z-10">
          <button
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 hover:pl-0.5 transition-all"
            aria-label="Previous image"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={() => scrollTo(Math.min(PRODUCTS.length - 1, activeIndex + 1))}
            disabled={activeIndex === PRODUCTS.length - 1}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 hover:pr-0.5 transition-all"
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
            className={`relative min-w-[85vw] sm:min-w-[65vw] md:min-w-[50vw] lg:min-w-[400px] max-w-xl snap-center flex flex-col bg-gray-950/80 rounded-3xl overflow-hidden border border-gray-800 transition-all duration-500 will-change-transform ${i === activeIndex ? 'shadow-[0_0_40px_rgba(168,85,247,0.15)] scale-100' : 'shadow-sm scale-[0.98]'
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
              <p className="text-xs uppercase tracking-[0.18em] text-brand-secondary font-semibold mb-3">
                {product.label}
              </p>
              <h3 className="text-2xl font-bold text-white mb-4 whitespace-pre-line">
                {product.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 grow">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <Link
                  href="/order"
                  className="btn-outline text-sm px-6 py-2.5"
                >
                  {product.cta}
                </Link>
                <div className="text-xs font-semibold text-gray-500 tabular-nums">
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

export default function Home() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="flex flex-col w-full text-gray-100 bg-transparent">
      {/* 1. Hero Section */}
      <section className="relative flex items-center justify-center min-h-[75vh] px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-4xl max-auto space-y-8 z-10"
        >
          <div className="inline-block py-1 px-3 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-secondary text-sm font-semibold tracking-wider uppercase mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-md">
            Next-Gen Manufacturing
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl">
            Bring Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-primary">Ideas to Life</span> in 3D
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto drop-shadow-md">
            High-quality custom 3D printing at your fingertips. From prototype to production, we deliver excellence.
          </p>
          <div className="pt-8">
            <Link href="/order" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              Start Printing
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Product Showcase */}
      <ProductShowcase />

      {/* 2. How It Works */}
      <section className="py-24 bg-transparent border-t border-brand-primary/20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg pt-2">Three simple steps to hold your creativity in your hands.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-10 relative z-10"
          >
            {/* Step 1 */}
            <motion.div variants={fadeUp} className="card bg-gray-950/80 p-10 flex flex-col items-center text-center space-y-5 hover:-translate-y-2 hover:border-brand-secondary transition-all duration-300 hover:shadow-[0_10px_40px_rgba(192,132,252,0.15)]">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-secondary/20 to-transparent flex items-center justify-center text-brand-secondary mb-4 ring-1 ring-brand-secondary/30 shadow-[0_0_30px_rgba(192,132,252,0.15)]">
                <UploadCloud className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold">1. Upload your STL</h3>
              <p className="text-gray-400 text-base leading-relaxed">Drag and drop your 3D model. We instantly visualize your creation right in your browser securely.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeUp} className="card bg-gray-950/80 p-10 flex flex-col items-center text-center space-y-5 hover:-translate-y-2 hover:border-brand-primary transition-all duration-300 hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)]">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-transparent flex items-center justify-center text-brand-primary mb-4 ring-1 ring-brand-primary/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <Settings className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold">2. Configure Print</h3>
              <p className="text-gray-400 text-base leading-relaxed">Select the perfect material, infill, and finishing for your project to get an approx weight estimate.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeUp} className="card bg-gray-950/80 p-10 flex flex-col items-center text-center space-y-5 hover:-translate-y-2 hover:border-purple-500 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(147,51,234,0.15)]">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent flex items-center justify-center text-purple-400 mb-4 ring-1 ring-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.15)]">
                <Package className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold">3. We print & deliver</h3>
              <p className="text-gray-400 text-base leading-relaxed">We use state-of-the-art 3D printers to bring your ideas to life.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* 3. Materials & Pricing */}
      <section className="py-24 bg-transparent" id="materials">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Materials & Pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg pt-2">We offer premium materials designed for strength, precision, and flexibility.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center relative z-10"
          >
            <motion.div variants={fadeUp} className="card bg-gray-950/80 p-8 border-brand-secondary/20 hover:border-brand-secondary transition-colors">
              <h3 className="text-2xl font-bold mb-2 text-white">PLA</h3>
              <p className="text-brand-secondary font-semibold text-xl mb-4">₹2.5 <span className="text-sm font-normal text-gray-500">/ gram</span></p>
              <p className="text-gray-400 text-sm mb-6 h-16">Ideal for detailed prototypes, structural components, and miniatures.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="card bg-gray-950/80 p-8 border-brand-primary/20 hover:border-brand-primary transition-colors">
              <h3 className="text-2xl font-bold mb-2 text-white">PETG</h3>
              <p className="text-brand-primary font-semibold text-xl mb-4">₹3.5 <span className="text-sm font-normal text-gray-500">/ gram</span></p>
              <p className="text-gray-400 text-sm mb-6 h-16">Durable, strong layer adhesion. Great for mechanical parts.</p>
            </motion.div>

            {/* </motion.div> <motion.div variants={fadeUp} className="card bg-gray-950/80 p-8 border-purple-500/20 hover:border-purple-500 transition-colors"> */}
            <motion.div variants={fadeUp} className="card bg-gray-950/40 p-8 opacity-60 grayscale border-gray-800">
              <div className="flex justify-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-gray-900 text-gray-300 px-3 py-1 rounded-full border border-gray-800">Coming Soon</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-400 mt-2">TPU</h3>
              <p className="text-purple-400 font-semibold text-xl mb-4">₹5 <span className="text-sm font-normal text-gray-500">/ gram</span></p>
              <p className="text-gray-400 text-sm mb-6 h-16">Flexible, rubber-like material perfect for wearables and seals.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="card bg-gray-950/40 p-8 opacity-60 grayscale border-gray-800">
              <div className="flex justify-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-gray-900 text-gray-300 px-3 py-1 rounded-full border border-gray-800">Coming Soon</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-400 mt-2">ABS</h3>
              <p className="text-gray-500 font-medium text-lg mb-4">₹5 <span className="text-sm font-normal text-gray-600">/ gram</span></p>
              <p className="text-gray-500 text-sm h-16">High impact resistance and high temperature tolerance.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
