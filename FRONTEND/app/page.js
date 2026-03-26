'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { sneakers as staticSneakers } from '@/data/sneakers';
import { fetchSneakers } from '@/lib/api';
import SneakerCard from '@/components/SneakerCard';
import { SkeletonGrid } from '@/components/Skeleton';
import HeroSneaker3D from '@/components/HeroSneaker3D';

/* ─── Data Hook (API → fallback to static) ────── */
function useSneakerData() {
  const [sneakers, setSneakers] = useState(staticSneakers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSneakers({ limit: 40 })
      .then((data) => {
        if (data?.sneakers?.length > 0) {
          // Normalize MongoDB docs — use _id as id
          setSneakers(data.sneakers.map(s => ({ ...s, id: s._id || s.id })));
        }
      })
      .catch(() => {
        // Silently fall back to static data
      })
      .finally(() => setLoading(false));
  }, []);

  return { sneakers, loading };
}

/* ─── Hero ────────────────────────────────────── */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[60vh] h-[60vh] bg-primary-600/10 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vh] h-[50vh] bg-accent-purple/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '64px 64px'
      }} />

      <motion.div style={{ y, opacity }} className="w-full flex-1 flex items-center justify-center -mt-10">
        <HeroSneaker3D />
      </motion.div>

      <motion.div 
        style={{ y, opacity }} 
        className="absolute z-30 max-w-6xl w-full px-4 text-center top-1/2 -translate-y-1/2 pointer-events-none"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 lg:mb-8 pointer-events-auto"
        >
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-xs font-medium text-dark-100">AI-Powered Discovery Engine</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-[140px] leading-[0.85] tracking-tighter mb-4 text-white uppercase opacity-90 drop-shadow-2xl"
        >
          SNEAK<span className="text-gradient drop-shadow-none">AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base sm:text-lg text-dark-100 max-w-xl mx-auto mb-8 leading-relaxed font-medium mt-auto lg:mt-6 backdrop-blur-md bg-dark-900/30 p-4 rounded-2xl hidden md:block border border-white/5"
        >
          Discover sneakers tailored to your style with our AI recommendation engine.
          Explore in immersive 3D. Shop the future of footwear.
        </motion.p>
      </motion.div>

      {/* Bottom Panel / CTAs / Stats */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-30 w-full max-w-5xl mx-auto px-4 pb-8 mt-auto flex flex-col lg:flex-row items-center justify-between gap-6 pointer-events-auto"
      >
        <div className="flex items-center gap-4 w-full justify-center lg:justify-start">
          <Link href="/recommend" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 flex items-center gap-2 shadow-glow w-full sm:w-auto justify-center">
            <span className="text-lg">✨</span> AI Discovery
          </Link>
          <Link href="/sneakers" className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3.5 w-full sm:w-auto justify-center text-center">
            Browse All
          </Link>
        </div>

        <div className="flex items-center gap-6 sm:gap-10 border-t border-white/10 lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-10 w-full justify-center lg:justify-end">
          {[
            { value: '100+', label: 'Sneakers' },
            { value: '3D', label: 'Models' },
            { value: 'INR', label: 'Pricing' },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-display font-bold text-2xl text-gradient-cyan leading-none">{stat.value}</p>
              <p className="text-[10px] text-dark-200 uppercase tracking-widest mt-1 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Featured Sneakers ───────────────────────── */
function FeaturedSection({ sneakers, loading }) {
  const featured = sneakers.filter((s) => s.isNew).slice(0, 4);

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs font-medium text-primary-400 uppercase tracking-widest mb-2">Just Dropped</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">New Arrivals</h2>
          </div>
          <Link href="/sneakers?filter=new" className="text-sm text-dark-200 hover:text-white transition-colors flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </motion.div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((sneaker, i) => (
              <SneakerCard key={sneaker.id} sneaker={sneaker} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Trending Carousel ───────────────────────── */
function TrendingSection({ sneakers, loading }) {
  const trending = sneakers.filter((s) => s.isTrending);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium text-accent-orange uppercase tracking-widest mb-2">🔥 Hot Right Now</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl">Trending Sneakers</h2>
        </motion.div>
      </div>

      {/* Horizontal scroll */}
      <div className="relative">
        <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-6 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          <div className="flex-shrink-0 w-[max(0px,calc((100vw-1280px)/2))]" />
          {trending.map((sneaker, i) => (
            <div key={sneaker.id} className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start">
              <SneakerCard sneaker={sneaker} index={i} />
            </div>
          ))}
          <div className="flex-shrink-0 w-4" />
        </div>
        {/* Fade edges */}
        <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-dark-900 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-dark-900 to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}

/* ─── AI CTA Section ──────────────────────────── */
function AICTASection() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary-600/10 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-cyan">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-xs font-medium text-accent-cyan">Powered by Machine Learning</span>
        </div>

        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl mb-6">
          Let AI Find Your
          <br />
          <span className="text-gradient">Dream Sneakers</span>
        </h2>

        <p className="text-lg text-dark-200 max-w-xl mx-auto mb-10">
          Tell us your style, budget, and preferences. Our recommendation engine analyzes hundreds of sneakers to find your perfect match.
        </p>

        <Link
          href="/recommend"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-600 via-accent-purple to-accent-pink text-white font-bold text-lg rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] animated-gradient"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
          Start AI Discovery
        </Link>
      </motion.div>
    </section>
  );
}

/* ─── All Sneakers Grid ───────────────────────── */
function AllSneakersSection({ sneakers, loading }) {
  const displaySneakers = sneakers.slice(0, 8);

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs font-medium text-accent-green uppercase tracking-widest mb-2">Explore</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">All Sneakers</h2>
          </div>
          <Link href="/sneakers" className="text-sm text-dark-200 hover:text-white transition-colors flex items-center gap-1">
            See All <span>→</span>
          </Link>
        </motion.div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {displaySneakers.map((sneaker, i) => (
              <SneakerCard key={sneaker.id} sneaker={sneaker} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/sneakers" className="btn-secondary inline-flex items-center gap-2">
            Browse All Sneakers
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Brand Logos ──────────────────────────────── */
function BrandsSection() {
  const brandList = ['Nike', 'Adidas', 'New Balance', 'Asics', 'HOKA', 'Salomon', 'Puma', 'On', 'Converse', 'Vans'];

  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs text-dark-300 uppercase tracking-widest mb-8">Featuring Top Brands</p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {brandList.map((brand) => (
            <motion.span
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl font-display font-bold text-dark-400 hover:text-white transition-colors duration-500 cursor-default"
            >
              {brand}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Homepage ────────────────────────────────── */
export default function HomePage() {
  const { sneakers, loading } = useSneakerData();

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <BrandsSection />
      <FeaturedSection sneakers={sneakers} loading={loading} />
      <TrendingSection sneakers={sneakers} loading={loading} />
      <AICTASection />
      <AllSneakersSection sneakers={sneakers} loading={loading} />
    </div>
  );
}
