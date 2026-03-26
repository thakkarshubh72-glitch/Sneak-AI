'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatINR } from '@/lib/currency';

export default function SneakerCard({ sneaker, index = 0 }) {
  const getGradient = (hex) => {
    return `linear-gradient(135deg, ${hex}22 0%, transparent 60%)`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/sneakers/${sneaker.id}`} className="group block">
        <div className="card-premium relative">
          {/* Image area */}
          <div
            className="relative aspect-square overflow-hidden"
            style={{ background: getGradient(sneaker.colorHex) }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${sneaker.colorHex}40 0%, transparent 70%)`,
              }}
            />

            {/* Sneaker image or emoji placeholder */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              {sneaker.image_urls?.[0] || sneaker.images?.[0] ? (
                <motion.div
                  className="w-full h-full relative"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Image 
                    src={sneaker.image_urls?.[0] || sneaker.images?.[0]} 
                    alt={sneaker.name} 
                    fill 
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="text-7xl md:text-8xl select-none"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  👟
                </motion.div>
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {sneaker.isNew && (
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent-cyan/20 text-accent-cyan rounded-lg backdrop-blur-md">
                  New
                </span>
              )}
              {sneaker.isTrending && (
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent-orange/20 text-accent-orange rounded-lg backdrop-blur-md">
                  Trending
                </span>
              )}
            </div>

            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
              <span className="px-4 py-2 glass rounded-full text-xs font-medium text-white backdrop-blur-xl">
                View Details →
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-dark-200 uppercase tracking-wider mb-0.5">
                  {sneaker.brand}
                </p>
                <h3 className="font-semibold text-sm text-white truncate group-hover:text-primary-300 transition-colors duration-300">
                  {sneaker.name}
                </h3>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm text-white">{formatINR(sneaker.price)}</p>
                {sneaker.originalPrice && (
                  <p className="text-[11px] text-dark-300 line-through">{formatINR(sneaker.originalPrice)}</p>
                )}
              </div>
            </div>

            {/* Color dots */}
            <div className="flex items-center gap-1.5 mt-2.5">
              {sneaker.colorVariants?.slice(0, 4).map((variant, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-white/10 transition-transform duration-300 hover:scale-125"
                  style={{ backgroundColor: variant.hex }}
                  title={variant.name}
                />
              ))}
              {sneaker.colorVariants?.length > 4 && (
                <span className="text-[10px] text-dark-300 ml-0.5">+{sneaker.colorVariants.length - 4}</span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(sneaker.rating) ? 'text-amber-400' : 'text-dark-400'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-dark-300">({sneaker.reviews})</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
