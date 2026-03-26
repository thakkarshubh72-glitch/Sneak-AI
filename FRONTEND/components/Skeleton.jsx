'use client';

import { motion } from 'framer-motion';

export function SkeletonCard() {
  return (
    <div className="card-premium animate-pulse">
      <div className="aspect-square bg-dark-700 rounded-t-2xl" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-dark-600 rounded" />
        <div className="h-4 w-32 bg-dark-600 rounded" />
        <div className="flex gap-1.5 mt-2">
          <div className="w-3.5 h-3.5 rounded-full bg-dark-600" />
          <div className="w-3.5 h-3.5 rounded-full bg-dark-600" />
          <div className="w-3.5 h-3.5 rounded-full bg-dark-600" />
        </div>
        <div className="flex gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-dark-600 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="min-h-screen pt-24 pb-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-3 w-48 bg-dark-700 rounded mb-6 mt-4" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="aspect-square bg-dark-700 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-3 w-16 bg-dark-700 rounded" />
            <div className="h-8 w-64 bg-dark-700 rounded" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 bg-dark-700 rounded" />)}
            </div>
            <div className="h-8 w-32 bg-dark-700 rounded" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => <div key={i} className="w-8 h-8 rounded-full bg-dark-700" />)}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-dark-700" />)}
            </div>
            <div className="h-14 w-full bg-dark-700 rounded-xl mt-4" />
            <div className="h-32 w-full bg-dark-700 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ width = 'w-32', height = 'h-4' }) {
  return <div className={`${width} ${height} bg-dark-700 rounded animate-pulse`} />;
}
