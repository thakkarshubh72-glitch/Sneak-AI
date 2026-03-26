'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { formatINR } from "@/lib/currency";
import { motion } from 'framer-motion';
import { sneakers as staticSneakers } from '@/data/sneakers';
import { fetchSneakers } from '@/lib/api';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';
import SneakerCard from '@/components/SneakerCard';
import { SkeletonProductDetail } from '@/components/Skeleton';

const SneakerViewer3D = lazy(() => import('@/components/SneakerViewer3D'));

export default function ProductPage({ params }) {
  const [sneaker, setSneaker] = useState(null);
  const [allSneakers, setAllSneakers] = useState(staticSneakers);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCartStore();

  // Find sneaker from static data first, then try API
  useEffect(() => {
    // Immediate: try static data
    const staticMatch = staticSneakers.find((s) => s.id === params.id);
    if (staticMatch) {
      setSneaker(staticMatch);
      setLoading(false);
    }

    // Then try API data
    fetchSneakers({ limit: 120 })
      .then((data) => {
        if (data?.sneakers?.length > 0) {
          const normalized = data.sneakers.map(s => ({ ...s, id: s._id || s.id }));
          setAllSneakers(normalized);
          const apiMatch = normalized.find((s) => s.id === params.id || s._id === params.id);
          if (apiMatch) setSneaker(apiMatch);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <SkeletonProductDetail />;

  if (!sneaker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😞</p>
          <h1 className="font-display font-bold text-2xl mb-2">Sneaker not found</h1>
          <Link href="/sneakers" className="btn-primary mt-4 inline-block">Browse Sneakers</Link>
        </div>
      </div>
    );
  }

  const currentVariant = sneaker.colorVariants?.[selectedVariant] || sneaker.colorVariants?.[0];
  const related = allSneakers.filter((s) => s.id !== sneaker.id && (s.brand === sneaker.brand || s.style === sneaker.style)).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(sneaker, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-dark-300 mb-6 pt-4"
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/sneakers" className="hover:text-white transition-colors">Sneakers</Link>
          <span>/</span>
          <span className="text-dark-100">{sneaker.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left - 3D Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Suspense fallback={
              <div className="aspect-square rounded-2xl bg-dark-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-dark-300">Loading 3D viewer...</p>
                </div>
              </div>
            }>
              <SneakerViewer3D
                color={currentVariant?.hex || sneaker.colorHex}
                secondaryColor={currentVariant?.secondary || '#ffffff'}
                modelUrl={sneaker.model3d || sneaker.model_3d_url || sneaker.modelUrl || null}
              />
            </Suspense>

            {/* Color variants as thumbnails */}
            <div className="flex gap-3 mt-4">
              {sneaker.colorVariants?.map((variant, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedVariant(i)}
                  className={`w-16 h-16 rounded-xl border-2 transition-all duration-300 flex items-center justify-center
                    ${selectedVariant === i ? 'border-primary-500 shadow-glow' : 'border-dark-400 hover:border-dark-200'}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${variant.hex} 50%, ${variant.secondary} 50%)`,
                    }}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Brand + badges */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-primary-400">{sneaker.brand}</span>
              {sneaker.isNew && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-accent-cyan/15 text-accent-cyan rounded-md">New</span>
              )}
              {sneaker.isTrending && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-accent-orange/15 text-accent-orange rounded-md">Trending</span>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">{sneaker.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(sneaker.rating) ? 'text-amber-400' : 'text-dark-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-dark-200">{sneaker.rating} ({sneaker.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display font-bold text-3xl">{formatINR(sneaker.price)}</span>
              {sneaker.originalPrice && (
                <span className="text-lg text-dark-300 line-through">{formatINR(sneaker.originalPrice)}</span>
              )}
              {sneaker.originalPrice && (
                <span className="px-2 py-1 text-xs font-bold text-accent-green bg-accent-green/10 rounded-lg">
                  Save {formatINR(sneaker.originalPrice - sneaker.price)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {sneaker.stock !== undefined && (
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${sneaker.stock > 20 ? 'bg-accent-green' : sneaker.stock > 0 ? 'bg-accent-orange' : 'bg-red-500'}`} />
                <span className="text-xs text-dark-200">
                  {sneaker.stock > 20 ? 'In Stock' : sneaker.stock > 0 ? `Only ${sneaker.stock} left` : 'Out of Stock'}
                </span>
              </div>
            )}

            {/* Color variant name */}
            <div className="mb-4">
              <p className="text-sm text-dark-200 mb-2">
                Color: <span className="text-white font-medium">{currentVariant?.name || sneaker.color}</span>
              </p>
              <div className="flex gap-2">
                {sneaker.colorVariants?.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300
                      ${selectedVariant === i ? 'border-primary-500 scale-110' : 'border-dark-400 hover:scale-105'}`}
                    style={{ backgroundColor: variant.hex }}
                    title={variant.name}
                  />
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-dark-200">Select Size (US)</p>
                <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {sneaker.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${selectedSize === size
                        ? 'bg-primary-600 text-white shadow-glow'
                        : 'bg-dark-600 text-dark-100 hover:bg-dark-500 hover:text-white border border-dark-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-xs text-accent-orange mt-2">Please select a size</p>
              )}
            </div>

            {/* Add to cart */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`flex-1 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2
                  ${addedToCart
                    ? 'bg-accent-green text-white'
                    : selectedSize
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow hover:shadow-glow-lg'
                      : 'bg-dark-500 text-dark-300 cursor-not-allowed'
                  }`}
              >
                {addedToCart ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                    Add to Cart
                  </>
                )}
              </motion.button>
              <button className="w-14 h-14 rounded-xl glass flex items-center justify-center hover:bg-dark-500 transition-colors group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark-200 group-hover:text-accent-pink transition-colors">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-sm mb-3">About this sneaker</h3>
              <p className="text-sm text-dark-200 leading-relaxed">{sneaker.description}</p>
            </div>

            {/* Features */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {sneaker.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-dark-200">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-green flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Sneakers */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display font-bold text-2xl mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((s, i) => (
                <SneakerCard key={s.id} sneaker={s} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
