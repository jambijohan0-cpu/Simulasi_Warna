/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  Save, 
  RotateCcw, 
  History, 
  Heart, 
  Plus, 
  Trash2, 
  Zap,
  ChevronRight, 
  ChevronDown,
  Layers,
  Palette,
  Share2,
  Info,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { BRANDS, CATEGORIES, ColorData, BrandData } from './constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to convert HEX to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Helper to convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Helper to convert RGB to RYB (Red, Yellow, Blue) for realistic paint mixing
const rgbToRyb = (r: number, g: number, b: number) => {
  // Remove white from the color
  const w = Math.min(r, g, b);
  r -= w;
  g -= w;
  b -= w;

  const mg = Math.max(r, g, b);

  // Get the red component
  let y = Math.min(r, g);
  r -= y;

  // Get the blue component
  if (b > 0 && g > 0) {
    b /= 2;
    g /= 2;
  }

  y += g;
  let b_out = b;
  let r_out = r;

  const my = Math.max(r_out, y, b_out);
  if (my > 0) {
    const n = mg / my;
    r_out *= n;
    y *= n;
    b_out *= n;
  }

  return { r: r_out + w, y: y + w, b: b_out + w };
};

// Helper to convert RYB back to RGB
const rybToRgb = (r: number, y: number, b: number) => {
  // Remove white
  const w = Math.min(r, y, b);
  r -= w;
  y -= w;
  b -= w;

  const my = Math.max(r, y, b);

  // Get the green component
  let g = Math.min(y, b);
  y -= g;
  b -= g;

  if (b > 0 && g > 0) {
    b *= 2;
    g *= 2;
  }

  // Get the red component
  let r_out = r + y;
  let g_out = g + y;
  let b_out = b;

  const mg = Math.max(r_out, g_out, b_out);
  if (mg > 0) {
    const n = my / mg;
    r_out *= n;
    g_out *= n;
    b_out *= n;
  }

  return { r: Math.round(r_out + w), g: Math.round(g_out + w), b: Math.round(b_out + w) };
};

// Helper to convert RGB to CMYK string for display
const rgbToCmyk = (r: number, g: number, b: number) => {
  const r_norm = r / 255;
  const g_norm = g / 255;
  const b_norm = b / 255;
  const k = 1 - Math.max(r_norm, g_norm, b_norm);
  if (k === 1) return "0, 0, 0, 100";
  const c = Math.round(((1 - r_norm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g_norm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b_norm - k) / (1 - k)) * 100);
  return `${c}, ${m}, ${y}, ${Math.round(k * 100)}`;
};

interface MixedColor extends ColorData {
  weight: number;
}

export default function App() {
  const [selectedBrand, setSelectedBrand] = useState<BrandData>(BRANDS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Neutral");
  const [selectedColors, setSelectedColors] = useState<MixedColor[]>([]);
  const [resultColor, setResultColor] = useState<ColorData | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isMixing, setIsMixing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [customColor, setCustomColor] = useState("#00FFFF");
  const [customName, setCustomName] = useState("My Custom Color");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load history and favorites from localStorage and cloud
  useEffect(() => {
    const savedHistory = localStorage.getItem('colorMixHistory');
    const savedFavorites = localStorage.getItem('colorMixFavorites');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    
    // Fetch all history from cloud on load
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const cloudHistory = await response.json();
        if (Array.isArray(cloudHistory) && cloudHistory.length > 0) {
          // Merge with local history, avoiding duplicates by ref
          setHistory(prev => {
            const combined = [...cloudHistory, ...prev];
            const unique = combined.filter((item, index, self) =>
              index === self.findIndex((t) => t.ref === item.ref)
            );
            return unique.slice(0, 100); // Keep more items for cloud history
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch cloud history:", error);
    }
  };

  // Save history and favorites to localStorage
  useEffect(() => {
    localStorage.setItem('colorMixHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('colorMixFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleAddColor = (color: ColorData) => {
    if (selectedColors.length >= 20) return;
    setSelectedColors([...selectedColors, { ...color, weight: 1 }]);
  };

  const handleRemoveColor = (index: number) => {
    const newColors = [...selectedColors];
    newColors.splice(index, 1);
    setSelectedColors(newColors);
  };

  const handleWeightChange = (index: number, weight: number) => {
    const newColors = [...selectedColors];
    newColors[index].weight = weight;
    setSelectedColors(newColors);
  };

  const handlePercentageChange = (index: number, newP: number) => {
    if (selectedColors.length <= 1) {
      const newColors = [...selectedColors];
      newColors[0].weight = 100;
      setSelectedColors(newColors);
      return;
    }

    const p = Math.max(0, Math.min(100, newP));
    const newColors = [...selectedColors];
    
    // Calculate current total weight
    const totalWeight = selectedColors.reduce((sum, c) => sum + c.weight, 0);
    // Current percentage of the one being changed
    const currentP = (selectedColors[index].weight / totalWeight) * 100;
    
    if (p === 100) {
      newColors.forEach((c, i) => {
        newColors[i].weight = i === index ? 100 : 0.0001;
      });
    } else {
      const remainingP = 100 - p;
      const otherColorsTotalWeight = totalWeight - selectedColors[index].weight;
      
      if (otherColorsTotalWeight === 0) {
        // If others were 0, distribute remaining equally
        const share = remainingP / (selectedColors.length - 1);
        newColors.forEach((c, i) => {
          newColors[i].weight = i === index ? p : share;
        });
      } else {
        // Adjust others proportionally
        // new_weight_i = (p * other_sum) / (100 - p)
        const newWeightForTarget = (p * otherColorsTotalWeight) / (100 - p);
        newColors[index].weight = newWeightForTarget;
      }
    }
    
    setSelectedColors(newColors);
  };

  const processMixing = async () => {
    if (selectedColors.length === 0) return;

    setIsMixing(true);
    setTimeout(() => setIsMixing(false), 2000);

    let totalWeight = selectedColors.reduce((sum, c) => sum + c.weight, 0);
    let r_avg = 0, y_avg = 0, b_avg = 0;

    selectedColors.forEach(color => {
      const rgb = hexToRgb(color.hex);
      const ryb = rgbToRyb(rgb.r, rgb.g, rgb.b);
      const ratio = color.weight / totalWeight;
      
      r_avg += ryb.r * ratio;
      y_avg += ryb.y * ratio;
      b_avg += ryb.b * ratio;
    });

    const mixedRgb = rybToRgb(r_avg, y_avg, b_avg);
    const r = mixedRgb.r;
    const g = mixedRgb.g;
    const b = mixedRgb.b;

    const hex = rgbToHex(r, g, b);
    const cmykStr = rgbToCmyk(r, g, b);

    const result: any = {
      name: `Mix Result ${history.length + 1}`,
      hex,
      rgb: `${r}, ${g}, ${b}`,
      cmyk: cmykStr,
      ref: `MIX-${Date.now().toString().slice(-6)}`,
      colors: [...selectedColors]
    };

    setResultColor(result);
    const newHistoryItem = { ...result, timestamp: new Date().toISOString() };
    setHistory([newHistoryItem, ...history].slice(0, 50));

    // Auto-save to cloud
    await saveToCloud(result);
  };

  const handleReset = () => {
    setSelectedColors([]);
    setResultColor(null);
  };

  const saveToCloud = async (result: any) => {
    if (!result) return;

    setIsSaving(true);
    try {
      // 1. Generate Image on Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Clear canvas
          ctx.fillStyle = '#111';
          ctx.fillRect(0, 0, 500, 800);
          
          // Top Part: Result Color
          ctx.fillStyle = result.hex;
          ctx.fillRect(0, 0, 500, 350);
          
          // Result Info Overlay
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(0, 280, 500, 70);
          
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 32px Inter';
          ctx.fillText(result.name, 20, 325);
          
          // Middle Part: Metadata
          ctx.fillStyle = '#222';
          ctx.fillRect(0, 350, 500, 150);
          
          ctx.fillStyle = '#00FFFF';
          ctx.font = 'bold 24px Inter';
          ctx.fillText('FINAL COMPOSITION', 20, 390);
          
          ctx.fillStyle = '#fff';
          ctx.font = '20px JetBrains Mono';
          ctx.fillText(`HEX: ${result.hex}`, 20, 425);
          ctx.fillText(`RGB: ${result.rgb}`, 20, 455);
          ctx.fillText(`REF: ${result.ref}`, 20, 485);
          
          // Bottom Part: Composition Breakdown
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(0, 500, 500, 300);
          
          ctx.fillStyle = '#00FF00';
          ctx.font = 'bold 20px Inter';
          ctx.fillText('COMPOSITION BREAKDOWN', 20, 535);
          
          const totalWeight = result.colors.reduce((sum: number, c: any) => sum + c.weight, 0);
          result.colors.forEach((color: any, index: number) => {
            if (index < 6) { // Limit to 6 colors for display
              const y = 575 + (index * 35);
              const percentage = Math.round((color.weight / totalWeight) * 100);
              
              // Color Swatch
              ctx.fillStyle = color.hex;
              ctx.beginPath();
              ctx.roundRect(20, y - 18, 25, 25, 5);
              ctx.fill();
              
              // Color Info
              ctx.fillStyle = '#eee';
              ctx.font = '16px Inter';
              ctx.fillText(`${color.name} (${color.hex})`, 60, y);
              
              // Percentage
              ctx.fillStyle = '#00FFFF';
              ctx.font = 'bold 16px JetBrains Mono';
              ctx.textAlign = 'right';
              ctx.fillText(`${percentage}%`, 480, y);
              ctx.textAlign = 'left';
            }
          });
        }
      }

      const base64Image = canvas?.toDataURL('image/png');
      const mixDetails = result.colors.map((c: any) => `${c.name} (${Math.round((c.weight / result.colors.reduce((s: number, curr: any) => s + curr.weight, 0)) * 100)}%)`).join(', ');

      // 2. Call Proxy Endpoint
      const response = await fetch('/api/uploadAndSave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image,
          fileName: `${result.ref}.png`,
          brand: selectedBrand.name,
          category: selectedCategory,
          mixDetails,
          resultHex: result.hex,
          resultRgb: result.rgb,
          resultCmyk: result.cmyk
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log('Successfully saved to Google Sheets and Drive!');
        // Refresh history from cloud after saving
        fetchHistory();
      } else {
        console.error('Failed to save to cloud:', data.error);
      }
    } catch (error) {
      console.error('Save Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFavorite = (color: ColorData) => {
    const isFav = favorites.some(f => f.hex === color.hex);
    if (isFav) {
      setFavorites(favorites.filter(f => f.hex !== color.hex));
    } else {
      setFavorites([...favorites, color]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-40 scale-110 blur-[2px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/40 to-[#050505]/90" />
      </div>

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <canvas ref={canvasRef} width={500} height={800} className="hidden" />

      {/* Paint Splash Animation */}
      <AnimatePresence>
        {isMixing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 2, 4],
                  x: (Math.random() - 0.5) * 1000,
                  y: (Math.random() - 0.5) * 1000,
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-20 h-20 rounded-full blur-2xl"
                style={{ 
                  backgroundColor: selectedColors[i % selectedColors.length]?.hex || '#00FFFF',
                  filter: 'blur(40px)'
                }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 2], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1 }}
              className="w-96 h-96 rounded-full bg-white/20 blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <Droplets className="text-white w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-sm md:text-xl font-bold tracking-tight uppercase relative group">
                Simulasi Warna <span className="text-cyan-400">Techno Mixer</span>
                {/* Dripping Paint Animation */}
                <div className="absolute -bottom-4 left-0 w-full flex justify-around pointer-events-none overflow-hidden h-8">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: [0, 15, 10, 20, 0],
                        opacity: [0, 1, 1, 1, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        delay: i * 0.8,
                        ease: "easeInOut"
                      }}
                      className="w-1 rounded-full bg-gradient-to-b from-cyan-400 to-transparent"
                    />
                  ))}
                </div>
              </h1>
              <p className="text-[7px] md:text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono">Professional Paint Simulation v2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors relative"
            >
              <History className="w-5 h-5 text-white/60" />
              {history.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-500 rounded-full" />}
            </button>
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 relative z-10">
        
        {/* Left Column: Catalog */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-4 space-y-6 md:space-y-8"
        >
          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-5 md:p-6 space-y-4 backdrop-blur-md hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] md:text-sm font-mono uppercase tracking-widest text-white/40">Catalog Selection</h2>
              <Palette className="w-3 h-3 md:w-4 md:h-4 text-white/20" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/30 ml-1">Brand</label>
                <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                  {BRANDS.map(brand => (
                    <motion.button
                      key={brand.name}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 211, 238, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedBrand(brand);
                        const firstCat = Object.keys(brand.categories)[0];
                        setSelectedCategory(firstCat);
                      }}
                      className={cn(
                        "px-2 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border text-[10px] md:text-sm font-medium transition-all text-left relative overflow-hidden group",
                        selectedBrand.name === brand.name 
                          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                      )}
                    >
                      <span className="relative z-10 truncate block">{brand.name}</span>
                      {selectedBrand.name === brand.name && (
                        <motion.div 
                          layoutId="brand-glow"
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/30 ml-1">Category</label>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {Object.keys(selectedBrand.categories).map(cat => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-2 py-0.5 md:px-3 md:py-1.5 rounded-full border text-[8px] md:text-[11px] font-mono uppercase tracking-wider transition-all",
                        selectedCategory === cat 
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                          : "bg-transparent border-white/10 text-white/40 hover:border-white/30"
                      )}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 ml-1">Available Colors</h3>
              <span className="text-[9px] md:text-[10px] font-mono text-white/20">{selectedBrand.categories[selectedCategory]?.length || 0} items</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 md:gap-3 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedBrand.categories[selectedCategory]?.map((color, idx) => (
                <motion.div
                  key={color.ref}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white/5 border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  onClick={() => handleAddColor(color)}
                >
                  <div className="flex items-center gap-2 md:gap-4">
                    <div 
                      className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl shadow-inner border border-white/10 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] md:text-sm font-semibold truncate">{color.name}</h4>
                      <p className="text-base md:text-xl font-mono text-cyan-400 font-black uppercase tracking-tight drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">{color.hex}</p>
                      <p className="text-[7px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest truncate">{color.ref}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Plus className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>

        {/* Middle Column: Mixing Lab */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 space-y-6 md:space-y-8"
        >
          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-5 md:p-6 space-y-4 backdrop-blur-md hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] md:text-sm font-mono uppercase tracking-widest text-white/40">Custom Color Picker</h2>
              <Palette className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            </div>
            <div className="flex gap-2 md:gap-4">
              <div className="relative group shrink-0">
                <input 
                  type="color" 
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-transparent border-none cursor-pointer"
                />
                <div 
                  className="absolute inset-0 rounded-lg md:rounded-xl pointer-events-none border-2 border-white/10 group-hover:border-white/30 transition-all"
                  style={{ backgroundColor: customColor }}
                />
              </div>
              <div className="flex-1 space-y-1.5 md:space-y-2">
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Color Name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 py-1 md:px-4 md:py-2 text-[10px] md:text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button 
                  onClick={() => {
                    const rgb = hexToRgb(customColor);
                    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
                    handleAddColor({
                      name: customName || "Custom Color",
                      hex: customColor,
                      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
                      cmyk,
                      ref: `CUSTOM-${Math.floor(Math.random() * 10000)}`
                    });
                  }}
                  className="w-full py-1.5 md:py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-lg md:rounded-xl transition-all"
                >
                  Add Custom Color
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-5 md:p-8 space-y-6 md:space-y-8 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 md:opacity-10">
              <Layers className="w-16 h-16 md:w-24 md:h-24 animate-pulse" />
            </div>

            <div className="relative">
              <h2 className="text-[10px] md:text-sm font-mono uppercase tracking-widest text-white/40 mb-4 md:mb-6 flex items-center gap-2">
                <Droplets className="w-3 h-3 md:w-4 md:h-4" /> Mixing Lab
              </h2>

              {selectedColors.length === 0 ? (
                <div className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 md:w-8 md:h-8 text-white/20" />
                  </div>
                  <div className="px-4">
                    <p className="text-white/40 text-xs md:text-sm">No colors selected</p>
                    <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/20 mt-1">Select colors from the catalog to begin</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3 md:space-y-4 max-h-[350px] md:max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {selectedColors.map((color, idx) => (
                        <motion.div
                          key={`${color.ref}-${idx}`}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4"
                        >
                          <div className="w-6 h-6 md:w-10 md:h-10 rounded-md md:rounded-lg shrink-0 border border-white/10" style={{ backgroundColor: color.hex }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 md:mb-2">
                              <div className="flex flex-col min-w-0">
                                <span className="text-[9px] md:text-xs font-semibold truncate">{color.name}</span>
                                <span className="text-sm md:text-2xl font-mono text-cyan-400 font-black drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">{color.hex}</span>
                              </div>
                              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                                <input 
                                  type="number"
                                  value={Math.round((color.weight / selectedColors.reduce((s, c) => s + c.weight, 0)) * 100)}
                                  onChange={(e) => handlePercentageChange(idx, parseInt(e.target.value) || 0)}
                                  className="w-10 md:w-16 bg-white/10 border border-white/20 rounded-lg px-1 py-0.5 md:px-2 md:py-1 text-right font-mono text-fuchsia-400 font-black text-xs md:text-xl focus:outline-none focus:border-fuchsia-500/50 transition-all"
                                />
                                <span className="text-[8px] md:text-sm font-mono text-fuchsia-400/40 font-bold">%</span>
                              </div>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={Math.round((color.weight / selectedColors.reduce((s, c) => s + c.weight, 0)) * 100)}
                              onChange={(e) => handlePercentageChange(idx, parseInt(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                          </div>
                          <button 
                            onClick={() => handleRemoveColor(idx)}
                            className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-lg transition-colors group shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/20 group-hover:text-red-400" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="pt-4 md:pt-6 border-t border-white/10 flex items-center gap-3 md:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={processMixing}
                      disabled={selectedColors.length < 2 || isSaving}
                      className="flex-1 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-white/5 disabled:to-white/5 disabled:text-white/20 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                      {isSaving ? (
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                      )}
                      {isSaving ? "Saving..." : "Process Mixing"}
                    </motion.button>
                    <motion.button
                      whileHover={{ rotate: -180 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      onClick={handleReset}
                      className="p-3 md:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl md:rounded-2xl transition-all"
                    >
                      <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </motion.div>

        {/* Right Column: Result */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="lg:col-span-3 space-y-6 md:space-y-8"
        >
          <section className="space-y-4 md:space-y-6">
            <h2 className="text-[10px] md:text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">Result Preview</h2>
            
            <AnimatePresence mode="wait">
              {resultColor ? (
                <motion.div
                  key={resultColor.hex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="aspect-square rounded-[1.5rem] md:rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/20 relative overflow-hidden group"
                    style={{ backgroundColor: resultColor.hex }}
                  >
                    {/* Dripping Paint on Result Card */}
                    <div className="absolute top-0 left-0 w-full flex justify-around pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: [0, 40, 30, 60, 0] }}
                          transition={{ 
                            duration: 5, 
                            repeat: Infinity, 
                            delay: i * 0.5,
                            ease: "easeInOut"
                          }}
                          className="w-2 rounded-b-full opacity-30"
                          style={{ backgroundColor: resultColor.hex, filter: 'brightness(1.2)' }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 space-y-2 md:space-y-4">
                      <div className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full">
                        <p className="text-[8px] md:text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Final Composition</p>
                      </div>
                      <div className="space-y-0.5 md:space-y-1">
                        <h3 className="text-xl md:text-4xl font-black truncate tracking-tighter leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{resultColor.name}</h3>
                        <p className="text-3xl md:text-6xl font-mono font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] tracking-tighter">{resultColor.hex}</p>
                        <p className="text-base md:text-2xl font-mono font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)] tracking-tighter uppercase">{resultColor.ref}</p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-2 md:gap-3">
                    <div className="bg-white/5 border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4">
                      <p className="text-[7px] md:text-[10px] font-mono uppercase text-white/40 mb-2 md:mb-3">Composition Breakdown</p>
                      <div className="space-y-1 md:space-y-2">
                        {(resultColor as any).colors?.map((c: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-[9px] md:text-xs font-mono">
                            <div className="flex items-center gap-1 md:gap-2 min-w-0">
                              <div className="w-1 h-1 md:w-2 md:h-2 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
                              <span className="text-white/60 truncate">{c.name}</span>
                              <span className="text-cyan-400 font-bold shrink-0">({c.hex})</span>
                            </div>
                            <span className="text-fuchsia-400 font-bold shrink-0 ml-2">{Math.round((c.weight / (resultColor as any).colors.reduce((s: number, curr: any) => s + curr.weight, 0)) * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl md:rounded-2xl p-2.5 md:p-4 flex items-center justify-between">
                      <span className="text-[7px] md:text-[10px] font-mono uppercase text-white/40">HEX</span>
                      <span className="text-lg md:text-3xl font-mono font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">{resultColor.hex}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl md:rounded-2xl p-2.5 md:p-4 flex items-center justify-between">
                      <span className="text-[7px] md:text-[10px] font-mono uppercase text-white/40">RGB</span>
                      <span className="text-base md:text-2xl font-mono font-black text-fuchsia-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">{resultColor.rgb}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl md:rounded-2xl p-2.5 md:p-4 flex items-center justify-between">
                      <span className="text-[7px] md:text-[10px] font-mono uppercase text-white/40">CMYK</span>
                      <span className="text-base md:text-2xl font-mono font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">{resultColor.cmyk}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl md:rounded-2xl p-2.5 md:p-4 flex items-center justify-between">
                      <span className="text-[7px] md:text-[10px] font-mono uppercase text-white/40">Reference</span>
                      <span className="text-xs md:text-base font-mono font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">{resultColor.ref}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(resultColor)}
                      className={cn(
                        "flex-1 p-4 rounded-2xl border transition-all flex items-center justify-center gap-3",
                        favorites.some(f => f.hex === resultColor.hex)
                          ? "bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                          : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", favorites.some(f => f.hex === resultColor.hex) && "fill-current")} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {favorites.some(f => f.hex === resultColor.hex) ? "Favorited" : "Add to Favorites"}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="aspect-square rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8">
                  <Palette className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-white/20 text-xs uppercase tracking-widest">Awaiting Mix Process</p>
                </div>
              )}
            </AnimatePresence>
          </section>
        </motion.div>
      </main>

      {/* Donation Section */}
      <footer className="max-w-7xl mx-auto px-4 pb-12 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-cyan-500/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 blur-[100px] -ml-32 -mb-32 group-hover:bg-fuchsia-500/20 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="space-y-3 md:space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                <Heart className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" /> Support Project
              </div>
              <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-white">
                TRAKTIR KOPI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-glow">BIAR MAKIN GACOR!</span>
              </h3>
              <p className="text-white/40 max-w-md text-xs md:text-base font-medium leading-relaxed">
                Support kreator biar makin semangat update fitur-fitur gokil lainnya! Donasi seikhlasnya buat beli kopi biar mata melek pas ngoding. Thank you, bosku! 🤟
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1 md:pt-2">
                {['Shopee', 'OVO', 'GoPay', 'Dana'].map((wallet) => (
                  <div key={wallet} className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-white/5 border border-white/5 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/20 transition-all">
                    {wallet}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4 md:gap-6">
              <div className="text-center md:text-right">
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white/30 mb-0.5 md:mb-1">Nomor E-Wallet</p>
                <p className="text-xl md:text-3xl font-mono font-black text-white tracking-tighter">0813-41-300-100</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                <motion.a
                  href="https://wa.me/6281341300100"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 md:px-8 md:py-4 bg-white text-black rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Person
                </motion.a>
                
                <motion.div
                  className="px-6 py-3 md:px-8 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] text-white/60 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  Verified Project
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/10">
            © 2026 NEON TECHNO COLOR MIXER • BUILT WITH PASSION
          </p>
        </div>
      </footer>

      {/* Overlays */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex justify-end"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#0a0a0a] border-l border-white/10 h-full p-8 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight">Mix History</h2>
                  <button 
                    onClick={fetchHistory}
                    className="p-2 hover:bg-white/5 rounded-full text-cyan-400 transition-all active:rotate-180 duration-500"
                    title="Refresh History"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {history.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-white/20">
                  <History className="w-12 h-12 mb-4" />
                  <p className="text-sm uppercase tracking-widest">No history yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {history.map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border border-white/10" style={{ backgroundColor: item.hex }} />
                        <div>
                          <h4 className="text-sm font-bold">{item.name}</h4>
                          <p className="text-[10px] font-mono text-white/40 uppercase">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.colors?.map((c: any, i: number) => (
                          <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: c.hex }} title={c.name} />
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedColors(item.colors);
                          setResultColor(item);
                          setShowHistory(false);
                        }}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all"
                      >
                        Restore Mix
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {showFavorites && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex justify-end"
            onClick={() => setShowFavorites(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#0a0a0a] border-l border-white/10 h-full p-8 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight">Favorites</h2>
                <button onClick={() => setShowFavorites(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {favorites.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-white/20">
                  <Heart className="w-12 h-12 mb-4" />
                  <p className="text-sm uppercase tracking-widest">No favorites yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {favorites.map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 group">
                      <div className="aspect-square rounded-xl border border-white/10 shadow-inner" style={{ backgroundColor: item.hex }} />
                      <div>
                        <h4 className="text-xs font-bold truncate">{item.name}</h4>
                        <p className="text-xs font-mono text-cyan-400 font-bold uppercase">{item.hex}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAddColor(item)}
                          className="flex-1 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => toggleFavorite(item)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.3);
        }
      `}</style>
    </div>
  );
}
