'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    alert('Demo registration — backend integration required. Check backend/README for setup.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent-cyan/8 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-primary-600/8 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-primary-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 18L7 12L2 6" />
                <path d="M7 18L22 12L7 6" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-2xl mb-1">Create Account</h1>
            <p className="text-sm text-dark-200">Join SneakAI and discover your style</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-dark-200 mb-1.5 block font-medium">Full Name</label>
              <input name="name" value={form.name} onChange={handleInput} className="input-field" placeholder="John Doe" required />
            </div>
            <div>
              <label className="text-xs text-dark-200 mb-1.5 block font-medium">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleInput} className="input-field" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="text-xs text-dark-200 mb-1.5 block font-medium">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleInput} className="input-field" placeholder="••••••••" required minLength={6} />
            </div>
            <div>
              <label className="text-xs text-dark-200 mb-1.5 block font-medium">Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleInput} className="input-field" placeholder="••••••••" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-300">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
