'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronRight, ArrowRight, Printer, PenTool, Zap, CheckCircle } from 'lucide-react';
import { products } from '../data/products';

/* ─── Components ─────────────────────────────────────────── */

function Counter({ from, to, duration = 2 }: { from: number, to: number, duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

function Marquee() {
  const brands = ["Bambu Lab", "Creality", "Prusa", "Elegoo", "Anycubic", "Raise3D"];
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <div className="w-full overflow-hidden bg-[#fafaf9] py-8 border-y border-stone-200 mt-12 relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fafaf9] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fafaf9] to-transparent z-10"></div>

      <div className="text-center mb-6">
        <p className="text-xs font-semibold text-stone-500 tracking-[0.2em] uppercase">Powered by industry-leading 3D printing technology</p>
      </div>

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1035] }}
        transition={{ ease: "linear", duration: 20, repeat: Infinity }}
      >
        {duplicatedBrands.map((brand, idx) => (
          <div key={idx} className="flex-none mx-12 text-2xl md:text-3xl font-bold text-stone-200 uppercase tracking-widest">
            {brand}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ServicesSection() {
  const services = [
    {
      id: "printing",
      title: "Custom 3D Printing",
      num: "01",
      desc: "We will print your model on advanced equipment with high precision. Support PLA, PETG, ABS and other materials.",
      img: "/services/3d_printing.jpg",
      link: "/order",
    },
    {
      id: "modelling",
      title: "3D Modeling",
      num: "02",
      desc: "We can help you create a 3D model from scratch based on your drawing, photo or idea. We work in Blender, Fusion 360 and SolidWorks.",
      img: "/services/3d_modeling.jpg",
      link: "/modelling",
    },
    {
      id: "prototyping",
      title: "Prototyping",
      num: "03",
      desc: "We produce working prototypes and mockups for testing, presentations and startups. Fast, accurate, affordable.",
      img: "/services/prototyping.jpg",
      link: "/prototyping",
    },
    {
      id: "postprocessing",
      title: "Post-Processing And Painting",
      num: "04",
      desc: "Sanding, priming, painting and assembly of printed parts. Improving the appearance and functionality of the models.",
      img: "/services/post_processing.jpg",
      link: "/#contact",
    }
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6" id="services">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 uppercase">OUR <span className="text-[#4f6b43]">SERVICES</span></h2>
        <p className="text-stone-500 text-lg max-w-2xl"><span className="text-[#4f6b43] font-medium">Custom solutions</span> for your ideas — from 3D model to finished product</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((svc, idx) => (
          <Link
            href={svc.link}
            key={svc.id}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col p-8 rounded-2xl border border-stone-200 bg-[#F8F5F0] hover:border-stone-300 hover:shadow-[0_12px_40px_#4f6b4333] hover:-translate-y-1.5 transition-all duration-300 h-full cursor-pointer"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-32 h-20 md:w-40 md:h-24 rounded-xl overflow-hidden shadow-sm">
                  <img src={svc.img} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-4xl font-bold text-[#4f6b43]">
                  {svc.num}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-[#4f6b43] transition-colors">
                {svc.title}
              </h3>
              <p className="text-stone-500 mb-2 leading-relaxed">{svc.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ prod, index }: { prod: typeof products[0], index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.1 }}
      className="group relative rounded-2xl border border-stone-200 bg-[#F7F5F0] hover:border-stone-300 shadow-sm hover:shadow-[0_12px_40px_#4f6b4333] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front of Card (Dictates Height) */}
        <div className="backface-hidden flex flex-col overflow-hidden rounded-2xl bg-[#F7F5F0]">
          <div className="relative aspect-square overflow-hidden bg-white/50 rounded-t-2xl">
            <img src={prod.img} alt={prod.title} className="w-full h-full object-cover transition-transform duration-700 ease-out" />
          </div>
          <div className="p-4 flex flex-col grow justify-center items-center">
            <h3 className="text-base font-bold text-stone-900 group-hover:text-[#4f6b43] transition-colors leading-tight text-center mb-2">{prod.title}</h3>

            <div className="flex flex-wrap gap-1.5 justify-center">
              {(prod.badges || []).slice(0, 3).map((badge, idx) => (
                <span key={idx} className={`text-[10px] font-bold px-2 py-0.5 rounded ${idx === 0 ? 'bg-[#ecf0e6] text-[#4f6b43]' : 'bg-white border border-stone-200 text-stone-500'}`}>
                  {badge}
                </span>
              ))}
            </div>

            <span className="text-[10px] text-stone-400 mt-3 uppercase tracking-widest font-bold">Click to read more</span>
          </div>
        </div>

        {/* Back of Card (Flipped) */}
        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-[#4f6b43] text-white p-6 flex flex-col justify-center items-center text-center overflow-hidden rounded-2xl border border-[#3c5233]">
          <h3 className="text-xl font-black mb-4 tracking-tight">{prod.title}</h3>
          <p className="text-sm text-stone-200 leading-relaxed">{prod.desc}</p>
          <span className="text-[10px] text-white/50 mt-6 uppercase tracking-widest font-bold">Click to flip back</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PopularProducts() {
  const [expanded, setExpanded] = useState(false);
  const visibleProducts = expanded ? products : products.slice(0, 3);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6" id="popular-products">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 uppercase">POPULAR <span className="text-[#4f6b43]">PRODUCTS</span></h2>
        <p className="text-stone-500 text-lg">Our <span className="text-[#4f6b43] font-medium">best-selling</span> 3D creations loved by our customers.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {visibleProducts.map((prod, i) => (
          <ProductCard key={prod.id} prod={prod} index={i} />
        ))}
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {!expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="px-8 py-3 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            See More
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setExpanded(false);
                // Scroll back to the top of the section slightly when collapsing
                const el = document.getElementById("popular-products");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              Show Less
            </button>
            <Link href="/order" className="px-8 py-3 rounded-xl bg-stone-900 text-white font-semibold hover:-translate-y-0.5 hover:shadow-lg shadow-md transition-all">
              Order a Custom Part
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-20 border-y border-stone-200 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        <div>
          <div className="text-5xl md:text-6xl font-black text-[#4f6b43] mb-2 tracking-tighter">
            <Counter from={0} to={500} />+
          </div>
          <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">Prints Completed</div>
        </div>
        <div>
          <div className="text-5xl md:text-6xl font-black text-[#4f6b43] mb-2 tracking-tighter">
            <Counter from={0} to={50} />+
          </div>
          <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">Custom Projects</div>
        </div>
        <div>
          <div className="text-5xl md:text-6xl font-black text-[#4f6b43] mb-2 tracking-tighter">
            <Counter from={0} to={10} />+
          </div>
          <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">Material Options</div>
        </div>
        <div>
          <div className="text-5xl md:text-6xl font-black text-[#4f6b43] mb-2 tracking-tighter">
            <Counter from={0} to={99} />%
          </div>
          <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">Satisfaction</div>
        </div>
      </div>
    </section>
  );
}

function DotRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i < rating ? 'bg-[#4f6b43]' : 'bg-stone-200'}`} />
      ))}
    </div>
  );
}

function MaterialsSection() {
  return (
    <section className="py-32 max-w-7xl mx-auto px-6 overflow-visible" id="materials">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 uppercase">OUR <span className="text-[#4f6b43]">MATERIALS</span></h2>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">We offer premium materials designed for strength, precision, and flexibility.</p>
      </div>

      <div className="flex justify-center items-center h-[380px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group relative w-[260px] h-[340px] flex justify-center items-center cursor-pointer perspective-[1200px]"
        >

          {/* Card 1 (Far Left) - TPU */}
          <div className="absolute inset-0 bg-white border border-stone-200 rounded-[2rem] shadow-sm flex flex-col justify-center items-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-10 -rotate-[8deg] -translate-x-5 translate-y-2 group-hover:-rotate-12 group-hover:-translate-x-[150%] group-hover:translate-y-8 origin-bottom group-hover:shadow-[0_12px_40px_#4f6b4315]">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-400 px-3 py-1 rounded-full mb-3">Coming Soon</span>
            <h3 className="text-3xl font-black text-stone-300 tracking-tight">TPU</h3>
          </div>

          {/* Card 2 (Mid Left) - PETG */}
          <div className="absolute inset-0 bg-[#f4f3f1] border border-stone-200 rounded-[2rem] shadow-sm flex flex-col justify-center items-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20 -rotate-[4deg] -translate-x-2.5 translate-y-1 group-hover:-rotate-6 group-hover:-translate-x-[80%] group-hover:translate-y-3 origin-bottom group-hover:shadow-[0_12px_40px_#4f6b4315]">
            <h3 className="text-3xl font-black text-stone-800 tracking-tight">PETG</h3>
          </div>

          {/* Card 4 (Far Right) - ABS */}
          <div className="absolute inset-0 bg-white border border-stone-200 rounded-[2rem] shadow-sm flex flex-col justify-center items-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-10 rotate-[8deg] translate-x-5 translate-y-2 group-hover:rotate-12 group-hover:translate-x-[150%] group-hover:translate-y-8 origin-bottom group-hover:shadow-[0_12px_40px_#4f6b4315]">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-400 px-3 py-1 rounded-full mb-3">Coming Soon</span>
            <h3 className="text-3xl font-black text-stone-300 tracking-tight">ABS</h3>
          </div>

          {/* Card 3 (Mid Right) - PLA */}
          <div className="absolute inset-0 bg-[#f4f3f1] border border-stone-200 rounded-[2rem] shadow-sm flex flex-col justify-center items-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20 rotate-[4deg] translate-x-2.5 translate-y-1 group-hover:rotate-6 group-hover:translate-x-[80%] group-hover:translate-y-3 origin-bottom group-hover:shadow-[0_12px_40px_#4f6b4315]">
            <h3 className="text-3xl font-black text-stone-800 tracking-tight">PLA</h3>
          </div>

          {/* Center Card (Hover to Explore) */}
          <div className="absolute inset-0 bg-[#4f6b43] border border-[#3c5233] rounded-[2rem] shadow-lg flex flex-col justify-center items-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-30 group-hover:scale-105 group-hover:shadow-[0_20px_60px_#4f6b4340] group-hover:-translate-y-4">
            <h3 className="text-3xl font-black text-white mb-6 text-center px-4 tracking-tight">Materials</h3>
            <div className="bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors shadow-sm">
              Hover to explore
            </div>
          </div>

        </motion.div>
      </div>

      {/* Material Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-32 max-w-4xl mx-auto"
      >
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight uppercase">FIND YOUR <span className="text-[#4f6b43]">MATERIAL</span></h3>
        </div>

        <div className="bg-white/30 backdrop-blur-xl border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr>
                <th className="pb-6 w-1/4"></th>
                <th className="pb-6 w-1/4 text-center font-bold text-xl text-stone-900">PLA</th>
                <th className="pb-6 w-1/4 text-center font-bold text-xl text-stone-900">PETG</th>
                <th className="pb-6 w-1/4 text-center font-bold text-xl text-stone-900">TPU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-6 font-semibold text-stone-700 pl-4">Strength</td>
                <td className="py-"><div className="flex justify-center"><DotRating rating={3} /></div></td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={4} /></div></td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={1} /></div></td>
              </tr>
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-6 font-semibold text-stone-700 pl-4">Flexibility</td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={1} /></div></td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={2} /></div></td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={5} /></div></td>
              </tr>
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-6 font-semibold text-stone-700 pl-4">Durability</td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={3} /></div></td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={4} /></div></td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={2} /></div></td>
              </tr>
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-6 font-semibold text-stone-700 pl-4">Ease of print</td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={5} /></div></td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={4} /></div></td>
                <td className="py-6"><div className="flex justify-center"><DotRating rating={3} /></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="flex flex-col w-full text-stone-900 bg-transparent overflow-hidden">

      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-10">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 z-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.1]">
              TURN YOUR <span className="text-[#4f6b43] drop-shadow-sm">IDEAS</span> <br />
              INTO REALITY.
            </h1>
            <p className="text-xl text-stone-500 font-light max-w-xl">
              From digital models to physical parts, LayerLabs delivers precision 3D printing for creators, engineers, makers and businesses.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/order" className="btn-primary flex items-center gap-2">
                Get a Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/#services" className="px-6 py-3 font-semibold text-stone-900 hover:text-[#4f6b43] transition-colors border-b border-transparent hover:border-[#4f6b43]">
                Explore Services
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[400px] lg:h-[600px] w-full lg:scale-110 xl:scale-125 z-0 flex items-center justify-center"
          >
            <motion.img
              src="/3dmodelimage.png"
              alt="Detailed 3D printed sculpture"
              className="relative z-10 w-full h-full object-contain drop-shadow-xl hover:drop-shadow-[0_4px_24px_rgba(79,107,67,0.2)] transition-all duration-500"
            />
          </motion.div>

        </div>
      </section>

      {/* 2. Marquee */}
      <Marquee />

      {/* 3. Our Services */}
      <ServicesSection />

      {/* 4. Popular Products */}
      <PopularProducts />

      {/* Materials Section */}
      <MaterialsSection />

      {/* 5. Stats Section */}
      <StatsSection />

    </div>
  );
}
