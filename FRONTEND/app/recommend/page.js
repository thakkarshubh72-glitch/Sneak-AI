'use client';

import { useState } from 'react';
import { formatINR } from "@/lib/currency";
import { motion, AnimatePresence } from 'framer-motion';
import { sneakers as staticSneakers, brands, styles } from '@/data/sneakers';
import { getAIRecommendations } from '@/lib/api';
import SneakerCard from '@/components/SneakerCard';
import Link from 'next/link';

export default function RecommendPage() {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({
    brands: [],
    colors: [],
    styles: [],
    budget: 25000,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const colorOptions = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Red', hex: '#cc0000' },
    { name: 'Blue', hex: '#1a3cc7' },
    { name: 'Green', hex: '#34d399' },
    { name: 'Grey', hex: '#8a8a8a' },
    { name: 'Purple', hex: '#7c3aed' },
    { name: 'Orange', hex: '#fb923c' },
  ];

  const togglePref = (category, value) => {
    setPrefs((prev) => {
      const arr = prev[category];
      return { ...prev, [category]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  // Color similarity helper for fallback mode
  function isColorSimilar(colorName, hex) {
    const colorMap = {
      Black: ['#1a1a1a', '#0a0a0a', '#000000', '#2d2d2d'],
      White: ['#ffffff', '#f5f5f0', '#f0f0f0', '#e8e4df', '#f5f0e6', '#f5f0e0'],
      Red: ['#cc0000', '#ff4444', '#8b0000', '#e25822'],
      Blue: ['#1a3cc7', '#4263eb', '#0047ab', '#4a6fa5', '#0055a4', '#87ceeb'],
      Green: ['#34d399', '#2d5016', '#556b2f', '#00ffcc'],
      Grey: ['#8a8a8a', '#c0c0c0', '#b0b0b0', '#555555', '#899499'],
      Purple: ['#7c3aed', '#a78bfa', '#cc66cc'],
      Orange: ['#fb923c', '#e8a317', '#ff6600'],
    };
    return colorMap[colorName]?.some((c) => c.toLowerCase() === hex?.toLowerCase());
  }

  const getRecommendations = async () => {
    setLoading(true);

    try {
      // Try AI service first
      const aiResults = await getAIRecommendations({
        brands: prefs.brands,
        colors: prefs.colors,
        styles: prefs.styles,
        budget: prefs.budget,
        top_n: 5,
      });

      if (Array.isArray(aiResults) && aiResults.length > 0) {
        setResults(aiResults.map(s => ({ ...s, id: s._id || s.id })));
        setLoading(false);
        setStep(4);
        return;
      }
    } catch {
      // Fall through to client-side
    }

    // Client-side fallback
    await new Promise((r) => setTimeout(r, 1200));

    const scored = staticSneakers
      .filter((s) => s.price <= prefs.budget)
      .map((sneaker) => {
        let score = 0;
        if (prefs.brands.length === 0 || prefs.brands.includes(sneaker.brand)) score += 3;
        if (prefs.styles.length === 0 || prefs.styles.includes(sneaker.style)) score += 3;
        prefs.colors.forEach((color) => {
          if (sneaker.color?.toLowerCase().includes(color.toLowerCase())) score += 2;
          if (isColorSimilar(color, sneaker.colorHex)) score += 1;
        });
        if (sneaker.rating >= 4.5) score += 1;
        if (sneaker.isTrending) score += 0.5;
        return { ...sneaker, score, similarity_score: score / 10 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setResults(scored);
    setLoading(false);
    setStep(4);
  };

  const questions = [
    {
      title: 'What brands do you love?',
      subtitle: 'Select your favorites (or skip for all)',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {brands.slice(0, 12).map((brand) => (
            <button key={brand} onClick={() => togglePref('brands', brand)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${prefs.brands.includes(brand) ? 'bg-primary-600/20 text-primary-300 border border-primary-500/40 shadow-glow' : 'bg-dark-600 text-dark-200 border border-dark-400 hover:border-dark-200 hover:text-white'}`}
            >{brand}</button>
          ))}
        </div>
      ),
    },
    {
      title: 'What colors catch your eye?',
      subtitle: 'Pick your preferred colors',
      content: (
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((color) => (
            <button key={color.name} onClick={() => togglePref('colors', color.name)}
              className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-all duration-300
                ${prefs.colors.includes(color.name) ? 'bg-primary-600/10 border border-primary-500/40' : 'bg-dark-600 border border-dark-400 hover:border-dark-200'}`}
            >
              <div className={`w-8 h-8 rounded-full border-2 transition-transform duration-300
                ${prefs.colors.includes(color.name) ? 'border-primary-400 scale-110' : 'border-dark-300'}`} style={{ backgroundColor: color.hex }} />
              <span className="text-xs text-dark-200">{color.name}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your style?",
      subtitle: 'Choose sneaker styles you prefer',
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[{ name: 'street', icon: '🛹', label: 'Street', desc: 'Urban, bold, cultural' },
            { name: 'sport', icon: '🏃', label: 'Sport', desc: 'Performance, comfort' },
            { name: 'casual', icon: '☕', label: 'Casual', desc: 'Everyday, versatile' },
            { name: 'luxury', icon: '💎', label: 'Luxury', desc: 'Premium, designer' }
          ].map((style) => (
            <button key={style.name} onClick={() => togglePref('styles', style.name)}
              className={`p-5 rounded-2xl text-left transition-all duration-300
                ${prefs.styles.includes(style.name) ? 'bg-primary-600/15 border border-primary-500/40 shadow-glow' : 'bg-dark-600 border border-dark-400 hover:border-dark-200'}`}
            >
              <span className="text-3xl">{style.icon}</span>
              <p className="font-semibold text-base mt-2">{style.label}</p>
              <p className="text-xs text-dark-300 mt-0.5">{style.desc}</p>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your budget?",
      subtitle: 'Set your maximum price',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <span className="font-display font-bold text-5xl text-gradient">{formatINR(prefs.budget)}</span>
          </div>
          <input type="range" min="4000" max="100000" step="1000" value={prefs.budget}
            onChange={(e) => setPrefs({ ...prefs, budget: parseInt(e.target.value) })}
            className="w-full accent-primary-500 h-2" />
          <div className="flex justify-between text-xs text-dark-300"><span>{formatINR(4000)}</span><span>{formatINR(50000)}</span><span>{formatINR(100000)}+</span></div>
          <div className="flex gap-2 justify-center">
            {[10000, 15000, 25000, 50000].map((v) => (
              <button key={v} onClick={() => setPrefs({ ...prefs, budget: v })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${prefs.budget === v ? 'bg-primary-600/20 text-primary-300' : 'bg-dark-600 text-dark-200 hover:text-white'}`}
              >{formatINR(v)}</button>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-cyan">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-xs font-medium text-accent-cyan">AI Style Quiz</span>
            </div>
            <Link href="/recommend/outfit" className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass bg-primary-600/10 hover:bg-primary-600/30 border border-primary-500/30 transition-all duration-300 group">
                <span className="text-sm">📸</span>
                <span className="text-xs font-medium text-primary-300 group-hover:text-white transition-colors">Try Outfit Scanner</span>
                <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity ml-1">&rarr;</span>
            </Link>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">Find Your Perfect Pair</h1>
          <p className="text-dark-200 text-sm">Answer a few questions and our AI will find your ideal sneakers</p>
        </motion.div>

        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-primary-500' : 'bg-dark-600'}`} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step < 4 && !loading && (
            <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}
              className="glass rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl mb-1">{questions[step].title}</h2>
              <p className="text-sm text-dark-300 mb-6">{questions[step].subtitle}</p>
              {questions[step].content}
              <div className="flex gap-3 mt-8">
                {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">Back</button>}
                <button onClick={() => step === 3 ? getRecommendations() : setStep(step + 1)} className="btn-primary flex-1">
                  {step === 3 ? 'Get Recommendations ✨' : 'Next'}
                </button>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="font-display font-bold text-xl mb-2">Analyzing your preferences...</h2>
              <p className="text-sm text-dark-300">Our AI is finding the perfect sneakers for you</p>
            </motion.div>
          )}

          {step === 4 && results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="text-center mb-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="text-5xl mb-4">✨</motion.div>
                <h2 className="font-display font-bold text-2xl mb-2">Your AI-Curated Collection</h2>
                <p className="text-sm text-dark-300">Top {results.length} picks based on your preferences</p>
              </div>

              <div className="space-y-4 max-w-3xl mx-auto">
                {results.map((sneaker, i) => (
                  <motion.div key={sneaker.id || i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4">
                    <span className="font-display font-bold text-2xl text-dark-400 w-8 flex-shrink-0">#{i + 1}</span>
                    <div className="flex-1">
                      <SneakerCard sneaker={sneaker} index={i} />
                    </div>
                    {sneaker.similarity_score !== undefined && (
                      <div className="hidden sm:flex flex-col items-center flex-shrink-0">
                        <span className="text-xs text-dark-300">Match</span>
                        <span className="font-display font-bold text-primary-400">{Math.round(sneaker.similarity_score * 100)}%</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button onClick={() => { setStep(0); setResults(null); }} className="btn-secondary">Try Again</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
