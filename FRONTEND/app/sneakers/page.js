'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sneakers as staticSneakers, brands as staticBrands, styles as staticStyles } from '@/data/sneakers';
import { fetchSneakers, filterSneakers } from '@/lib/api';
import { formatINR } from '@/lib/currency';
import SneakerCard from '@/components/SneakerCard';
import { SkeletonGrid } from '@/components/Skeleton';

export default function SneakersPage() {
  const [sneakers, setSneakers] = useState(staticSneakers);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilters, setMobileFilters] = useState(false);

  const brands = staticBrands;
  const styles = staticStyles;

  // Fetch from API on mount
  useEffect(() => {
    fetchSneakers({ limit: 120 })
      .then((data) => {
        if (data?.sneakers?.length > 0) {
          setSneakers(data.sneakers.map(s => ({ ...s, id: s._id || s.id })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Client-side filtering (works with both API and static data)
  const filtered = useMemo(() => {
    let result = sneakers;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) =>
        s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.color?.toLowerCase().includes(q)
      );
    }
    if (selectedBrand) result = result.filter((s) => s.brand === selectedBrand);
    if (selectedStyle) result = result.filter((s) => s.style === selectedStyle);
    if (maxPrice < 100000) result = result.filter((s) => s.price <= maxPrice);

    switch (sortBy) {
      case 'price-low': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-high': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'newest': result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }

    return result;
  }, [sneakers, search, selectedBrand, selectedStyle, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedStyle('');
    setMaxPrice(100000);
    setSortBy('featured');
  };

  const hasFilters = search || selectedBrand || selectedStyle || maxPrice < 100000;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pt-4">
          <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">Discover Sneakers</h1>
          <p className="text-dark-200 text-sm">
            {loading ? 'Loading...' : `${filtered.length} sneaker${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </motion.div>

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search sneakers, brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-full sm:w-48">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilters(!mobileFilters)}
            className="sm:hidden btn-secondary flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/></svg>
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${mobileFilters ? 'fixed inset-0 z-50 bg-dark-900/95 p-6 overflow-auto' : 'hidden'} sm:block sm:static sm:w-56 sm:flex-shrink-0`}>
            {mobileFilters && (
              <div className="flex items-center justify-between mb-4 sm:hidden">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setMobileFilters(false)} className="text-dark-200">✕</button>
              </div>
            )}

            <div className="space-y-5">
              {/* Brand */}
              <div>
                <p className="text-xs uppercase tracking-wider text-dark-300 mb-2">Brand</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                      className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors
                        ${selectedBrand === brand ? 'bg-primary-600/20 text-primary-300' : 'text-dark-200 hover:text-white hover:bg-dark-700'}`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="text-xs uppercase tracking-wider text-dark-300 mb-2">Style</p>
                <div className="space-y-1.5">
                  {styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                      className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg capitalize transition-colors
                        ${selectedStyle === style ? 'bg-primary-600/20 text-primary-300' : 'text-dark-200 hover:text-white hover:bg-dark-700'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs uppercase tracking-wider text-dark-300 mb-2">Max Price</p>
                <input
                  type="range" min="4000" max="100000" step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <p className="text-sm text-dark-200 mt-1">{maxPrice === 100000 ? 'Any' : formatINR(maxPrice)}</p>
              </div>

              {/* Clear */}
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-accent-pink hover:text-white transition-colors">
                  Clear all filters
                </button>
              )}

              {mobileFilters && (
                <button onClick={() => setMobileFilters(false)} className="btn-primary w-full mt-4 sm:hidden">
                  Show {filtered.length} results
                </button>
              )}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <SkeletonGrid count={12} />
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="text-4xl mb-4">😞</p>
                <p className="text-lg font-semibold mb-2">No sneakers found</p>
                <p className="text-sm text-dark-300 mb-4">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-secondary text-sm">Clear Filters</button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((sneaker, i) => (
                    <motion.div
                      key={sneaker.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    >
                      <SneakerCard sneaker={sneaker} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
