'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeOutfit } from '@/lib/api';
import SneakerCard from '@/components/SneakerCard';
import Link from 'next/link';

export default function OutfitAnalysisPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResults(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await analyzeOutfit(file);
      setResults(data);
    } catch (error) {
      console.error('Error analyzing outfit:', error);
      alert('Failed to analyze outfit. Make sure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        <div className="mb-6">
            <Link href="/recommend" className="text-dark-300 hover:text-white transition-colors text-sm flex items-center gap-2">
                <span>&larr;</span> Back to Quiz
            </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <span className="text-xl">📸</span>
            <span className="text-xs font-medium text-accent-cyan tracking-widest uppercase">SneakAI Vision</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl mb-4">AI Outfit Analyzer</h1>
          <p className="text-dark-200 text-sm max-w-2xl mx-auto leading-relaxed">
            Upload a photo of your outfit or the vibe you&apos;re going for. Our vision models will extract the color palette, determine the aesthetic, and recommend the perfect heat to complete the look.
          </p>
        </motion.div>

        {!results && !loading && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
            <div 
                className="glass rounded-3xl p-8 border-2 border-dashed border-dark-400 hover:border-primary-500/50 transition-colors duration-300 text-center cursor-pointer relative overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
                />

                {previewUrl ? (
                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Outfit Preview" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent flex flex-col justify-end p-4">
                       <p className="text-white font-medium shadow-sm">Click or drag a different image</p>
                    </div>
                </div>
                ) : (
                <div className="py-12 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl opacity-50">📤</span>
                    </div>
                    <p className="font-display font-semibold text-lg mb-2">Drop your image here</p>
                    <p className="text-dark-300 text-sm">Supports JPG, PNG, WEBP</p>
                </div>
                )}
            </div>

            <div className="mt-8 text-center">
                <button 
                onClick={handleAnalyze} 
                disabled={!file}
                className="btn-primary w-full sm:w-auto px-12 py-4 text-lg"
                >
                Analyze Outfit ✨
                </button>
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 glass rounded-3xl max-w-xl mx-auto">
            <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-t-2 border-r-2 border-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-b-2 border-l-2 border-accent-cyan rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">👁️</div>
            </div>
            <h2 className="font-display font-bold text-2xl mb-3 text-gradient">Extracting Aesthetic Vectors...</h2>
            <p className="text-sm text-dark-300">Processing colors and stylistic elements</p>
          </motion.div>
        )}

        <AnimatePresence>
            {results && !loading && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    
                    {/* Insights Panel */}
                    <div className="glass p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full" />
                         
                         <div>
                            <h3 className="font-display font-bold text-2xl mb-6">Vision Insights</h3>
                            
                            <div className="mb-6">
                                <p className="text-xs text-dark-300 uppercase tracking-wider font-semibold mb-3">Dominant Colors</p>
                                <div className="flex gap-3">
                                    {results.detected_colors.map((hex, i) => (
                                        <div key={i} className="group relative">
                                            <div 
                                                className="w-12 h-12 rounded-full shadow-inner border border-white/10"
                                                style={{ backgroundColor: hex }}
                                            />
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-800 text-xs px-2 py-1 rounded">
                                                {hex}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-xs text-dark-300 uppercase tracking-wider font-semibold mb-2">Detected Style Profile</p>
                                <div className="inline-block px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 font-display font-bold text-lg text-primary-300 capitalize">
                                    {results.predicted_style.replace('_', ' ')}
                                </div>
                            </div>
                         </div>

                         {previewUrl && (
                             <div className="flex justify-center md:justify-end">
                                 <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/50">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={previewUrl} alt="Uploaded outfit" className="object-cover w-full h-full" />
                                 </div>
                             </div>
                         )}
                    </div>

                    {/* Recommendations Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display font-bold text-3xl">Perfect Matches</h2>
                            <button onClick={() => { setResults(null); setFile(null); setPreviewUrl(null); }} className="text-sm font-medium text-dark-200 hover:text-white transition-colors">
                                Upload Another
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {results.recommendations.map((sneaker, i) => (
                                <motion.div key={sneaker.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                                    <SneakerCard sneaker={sneaker} index={i} />
                                </motion.div>
                            ))}
                        </div>
                        
                        {(!results.recommendations || results.recommendations.length === 0) && (
                            <div className="text-center py-12 glass rounded-2xl">
                                <p className="text-dark-300">No matching sneakers found in our catalog.</p>
                            </div>
                        )}
                    </div>

                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}
