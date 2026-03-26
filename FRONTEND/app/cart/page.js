'use client';

import { useEffect, useState } from 'react';
import { formatINR } from "@/lib/currency";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';

export default function CartPage() {
  const { items, hydrate, removeItem, updateQuantity, getTotal, clearCart, isHydrated } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  if (!mounted || !isHydrated) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const total = getTotal();
  const shipping = total > 15000 ? 0 : 499;
  const tax = total * 0.08;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-7xl mb-6">🛒</p>
          <h1 className="font-display font-bold text-3xl mb-3">Your cart is empty</h1>
          <p className="text-dark-200 mb-8">Find something you love and add it to your cart.</p>
          <Link href="/sneakers" className="btn-primary inline-block">Start Shopping</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-3xl sm:text-4xl mb-8 pt-4"
        >
          Shopping Cart <span className="text-dark-300 text-2xl">({items.length})</span>
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="glass rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6"
                >
                  {/* Product image placeholder */}
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${item.colorHex}22, transparent)` }}
                  >
                    <span className="text-5xl">👟</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-dark-300 uppercase tracking-wider">{item.brand}</p>
                        <h3 className="font-semibold text-base sm:text-lg">{item.name}</h3>
                        <p className="text-xs text-dark-200 mt-0.5">{item.color} · Size {item.size}</p>
                      </div>
                      <p className="font-display font-bold text-lg">{formatINR(item.price * item.quantity)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-dark-600 hover:bg-dark-500 flex items-center justify-center text-white transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-dark-600 hover:bg-dark-500 flex items-center justify-center text-white transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-xs text-dark-300 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-2 14H7L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button onClick={clearCart} className="text-xs text-dark-300 hover:text-red-400 transition-colors mt-4">
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-dark-200">
                  <span>Subtotal</span>
                  <span className="text-white">{formatINR(total)}</span>
                </div>
                <div className="flex justify-between text-dark-200">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-accent-green' : 'text-white'}>
                    {shipping === 0 ? 'Free' : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-dark-200">
                  <span>Tax (est.)</span>
                  <span className="text-white">{formatINR(tax)}</span>
                </div>
                <hr className="border-dark-400" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatINR(total + shipping + tax)}</span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="mt-4 px-3 py-2 rounded-lg bg-accent-green/10 text-accent-green text-xs font-medium">
                  ✓ Free shipping on orders over {formatINR(15000)}
                </div>
              )}

              <Link href="/checkout" className="btn-primary w-full text-center mt-6 block text-base">
                Proceed to Checkout
              </Link>

              <Link href="/sneakers" className="block text-center text-sm text-dark-200 hover:text-white transition-colors mt-4">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
