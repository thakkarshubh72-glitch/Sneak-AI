'use client';

import { useState, useEffect } from 'react';
import { formatINR } from "@/lib/currency";
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, hydrate, getTotal, clearCart, isHydrated } = useCartStore();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
    cardNumber: '', expiry: '', cvc: '', cardName: '',
  });

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  if (!mounted || !isHydrated) {
    return <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="font-display font-bold text-2xl mb-3">Nothing to checkout</h1>
          <Link href="/sneakers" className="btn-primary inline-block mt-4">Browse Sneakers</Link>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const shipping = total > 15000 ? 0 : 499;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-6"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-green">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h1 className="font-display font-bold text-3xl mb-3">Order Confirmed!</h1>
          <p className="text-dark-200 mb-2">Order #SNK-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
          <p className="text-sm text-dark-300 mb-8">We&apos;ll send a confirmation email with tracking details shortly.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sneakers" className="btn-primary">Continue Shopping</Link>
            <Link href="/" className="btn-secondary">Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Review' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-3xl mb-8 pt-4"
        >
          Checkout
        </motion.h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${step >= s.num ? 'bg-primary-600 text-white' : 'bg-dark-600 text-dark-300'}`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-white' : 'text-dark-300'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${step > s.num ? 'bg-primary-600' : 'bg-dark-600'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 space-y-4">
                <h2 className="font-semibold text-lg mb-4">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-dark-200 mb-1 block">First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleInput} className="input-field" placeholder="John" />
                  </div>
                  <div>
                    <label className="text-xs text-dark-200 mb-1 block">Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleInput} className="input-field" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-dark-200 mb-1 block">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleInput} className="input-field" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-xs text-dark-200 mb-1 block">Address</label>
                  <input name="address" value={form.address} onChange={handleInput} className="input-field" placeholder="123 Main Street" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-dark-200 mb-1 block">City</label>
                    <input name="city" value={form.city} onChange={handleInput} className="input-field" placeholder="New York" />
                  </div>
                  <div>
                    <label className="text-xs text-dark-200 mb-1 block">State</label>
                    <input name="state" value={form.state} onChange={handleInput} className="input-field" placeholder="NY" />
                  </div>
                  <div>
                    <label className="text-xs text-dark-200 mb-1 block">ZIP Code</label>
                    <input name="zip" value={form.zip} onChange={handleInput} className="input-field" placeholder="10001" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full mt-4">Continue to Payment</button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 space-y-4">
                <h2 className="font-semibold text-lg mb-4">Payment Details</h2>
                <div className="px-4 py-3 rounded-xl bg-primary-600/10 border border-primary-500/20 text-xs text-primary-300 mb-4">
                  🔒 Payments are processed securely via Stripe. This is a demo checkout.
                </div>
                <div>
                  <label className="text-xs text-dark-200 mb-1 block">Cardholder Name</label>
                  <input name="cardName" value={form.cardName} onChange={handleInput} className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs text-dark-200 mb-1 block">Card Number</label>
                  <input name="cardNumber" value={form.cardNumber} onChange={handleInput} className="input-field" placeholder="4242 4242 4242 4242" maxLength={19} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-dark-200 mb-1 block">Expiry Date</label>
                    <input name="expiry" value={form.expiry} onChange={handleInput} className="input-field" placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div>
                    <label className="text-xs text-dark-200 mb-1 block">CVC</label>
                    <input name="cvc" value={form.cvc} onChange={handleInput} className="input-field" placeholder="123" maxLength={4} />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">Review Order</button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 py-3 border-b border-dark-400 last:border-0">
                      <div className="w-12 h-12 rounded-lg bg-dark-600 flex items-center justify-center text-2xl">👟</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-dark-300">Size {item.size} · Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="text-sm space-y-2 mb-6">
                  <p className="text-dark-200">Shipping to: <span className="text-white">{form.address}, {form.city} {form.state} {form.zip}</span></p>
                  <p className="text-dark-200">Payment: <span className="text-white">•••• {form.cardNumber.slice(-4) || '4242'}</span></p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                  <button onClick={handlePlaceOrder} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    Place Order — {formatINR(grandTotal)}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="glass rounded-2xl p-6 h-fit sticky top-24">
            <h3 className="font-semibold text-sm mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-dark-200"><span>{items.length} item(s)</span><span>{formatINR(total)}</span></div>
              <div className="flex justify-between text-dark-200"><span>Shipping</span><span className={shipping === 0 ? 'text-accent-green' : ''}>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
              <div className="flex justify-between text-dark-200"><span>Tax</span><span>{formatINR(tax)}</span></div>
              <hr className="border-dark-400" />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatINR(grandTotal)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
