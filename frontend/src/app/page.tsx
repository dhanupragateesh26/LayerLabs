'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ChevronRight, UploadCloud, Settings, Package } from 'lucide-react';

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

            <motion.div variants={fadeUp} className="card bg-gray-950/80 p-8 border-purple-500/20 hover:border-purple-500 transition-colors">
              <h3 className="text-2xl font-bold mb-2 text-white">TPU</h3>
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
