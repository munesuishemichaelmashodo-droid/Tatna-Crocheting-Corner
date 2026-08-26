import React, { useState } from 'react';
import { BusinessInfo } from '../types';
import { BRAND_LOGO, ORIGINAL_BRAND_LOGO } from '../data/products';
import { 
  Sparkles, 
  Palette, 
  Layers, 
  CheckCircle2, 
  X, 
  Download, 
  Eye, 
  Heart,
  Award,
  Crown
} from 'lucide-react';

interface BrandLogoShowcaseProps {
  businessInfo: BusinessInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const BrandLogoShowcase: React.FC<BrandLogoShowcaseProps> = ({
  businessInfo,
  isOpen,
  onClose,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<'modern' | 'original'>('modern');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141416] border border-[#27272a] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1e1e24] text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#27272a] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#c5a059]/10 text-[#c5a059] px-3 py-1 rounded-full text-xs font-bold border border-[#c5a059]/30 mb-2">
            <Crown className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Official Brand Identity & Logo Design</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcfb]">
            Tatna Crocheting Corner Logo
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] font-light mt-1">
            A bespoke, elegant visual identity crafted specifically for Tatna&apos;s Marondera artisanal crocheting studio.
          </p>
        </div>

        {/* Main Logo Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Logo Emblem Presentation */}
          <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#18181b] to-[#0c0c0c] rounded-2xl border border-[#27272a] shadow-inner text-center relative group">
            <div className="w-56 h-56 rounded-full p-1.5 bg-gradient-to-tr from-[#c5a059]/40 via-[#27272a] to-[#c5a059]/60 shadow-2xl mb-4 relative">
              <img
                src={selectedVariant === 'modern' ? BRAND_LOGO : ORIGINAL_BRAND_LOGO}
                alt="Tatna Crocheting Corner Logo"
                className="w-full h-full object-cover rounded-full shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-full border-2 border-[#c5a059]/30 pointer-events-none"></div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setSelectedVariant('modern')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  selectedVariant === 'modern'
                    ? 'bg-[#c5a059] text-[#0c0c0c]'
                    : 'bg-[#1e1e24] text-[#a1a1aa] border border-[#27272a]'
                }`}
              >
                Modern Emblem
              </button>
              <button
                onClick={() => setSelectedVariant('original')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  selectedVariant === 'original'
                    ? 'bg-[#c5a059] text-[#0c0c0c]'
                    : 'bg-[#1e1e24] text-[#a1a1aa] border border-[#27272a]'
                }`}
              >
                Original Photo Badge
              </button>
            </div>
          </div>

          {/* Design System & Symbolism Breakdown */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#fdfcfb] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a059]" /> Design Rationale & Symbolism
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a]">
                <h4 className="font-bold text-[#c5a059] mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 1. Intertwined Yarn & Hook Emblem
                </h4>
                <p className="text-[#a1a1aa] font-light leading-relaxed">
                  A golden yarn ball seamlessly weaves into a sleek, minimalist crochet hook and delicate openwork crochet lace loops, representing precision, endless creative flow, and bespoke tailoring.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a]">
                <h4 className="font-bold text-[#c5a059] mb-1 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> 2. Sophisticated Color Palette
                </h4>
                <div className="flex items-center gap-2 mt-1 mb-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#c5a059] border border-white/20 shadow-xs" title="Warm Gold (#C5A059)"></span>
                  <span className="w-4 h-4 rounded-full bg-[#e8dfc8] border border-white/20 shadow-xs" title="Champagne Silk (#E8DFC8)"></span>
                  <span className="w-4 h-4 rounded-full bg-[#0c0c0c] border border-white/20 shadow-xs" title="Obsidian Noir (#0C0C0C)"></span>
                  <span className="w-4 h-4 rounded-full bg-[#e06c75] border border-white/20 shadow-xs" title="Blush Rose Accent"></span>
                  <span className="text-[10px] text-[#71717a] font-mono">Gold • Champagne • Noir</span>
                </div>
                <p className="text-[#a1a1aa] font-light">
                  Metallic warm gold and champagne convey premium artisan craftsmanship, paired with rich noir for timeless luxury.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a]">
                <h4 className="font-bold text-[#c5a059] mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> 3. Brand Promise: Pricing from $2
                </h4>
                <p className="text-[#a1a1aa] font-light">
                  Positioning Tatna Crocheting Corner as an accessible yet high-fashion luxury studio in Marondera, Zimbabwe—delivering handcrafted perfection from $2 hair accessories up to bespoke $25 apparel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#a1a1aa]">
            Used across the digital lookbook, flyer studio, and WhatsApp story cards.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold transition-all shadow-md"
          >
            Done Viewing
          </button>
        </div>
      </div>
    </div>
  );
};
