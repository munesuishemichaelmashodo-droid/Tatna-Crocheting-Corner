import React, { useState, useRef } from 'react';
import { CrochetProduct, BusinessInfo } from '../types';
import { CurrencyCode, formatPrice } from '../utils/currency';
import { BRAND_LOGO } from '../data/products';
import { toPng } from 'html-to-image';
import { 
  Layers, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Download, 
  Share2, 
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface StoryCardExporterProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
}

export const StoryCardExporter: React.FC<StoryCardExporterProps> = ({
  products,
  businessInfo,
  currency,
}) => {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [styleMode, setStyleMode] = useState<'minimal' | 'editorial' | 'cute'>('editorial');

  const currentProduct = products[currentIndex] || products[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleDownloadStory = async () => {
    if (!storyCardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(storyCardRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
      });

      const link = document.createElement('a');
      link.download = `Tatna-Story-${currentProduct.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting story image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="bg-[#141416] p-6 rounded-3xl border border-[#27272a] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase block">
            Social Media & Status Cards
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#fdfcfb]">
            WhatsApp Status & Instagram Story Cards
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1 font-light">
            Browse high-resolution 9:16 story cards formatted with price tags and contact info ready to post.
          </p>
        </div>

        {/* Style switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadStory}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isExporting ? 'Saving HD...' : 'Download Card'}</span>
          </button>

          <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-2xl border border-[#27272a]">
            {(['editorial', 'minimal', 'cute'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setStyleMode(mode)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  styleMode === mode
                    ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-sm'
                    : 'text-[#a1a1aa] hover:text-[#fdfcfb]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Carousel & Canvas */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Navigation Controls */}
        <div className="flex lg:flex-col items-center gap-3 order-2 lg:order-1">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-[#141416] border border-[#27272a] text-[#fdfcfb] hover:bg-[#1e1e24] shadow-sm transition-all"
            title="Previous item"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-[#c5a059]">
            {currentIndex + 1} / {products.length}
          </span>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-[#141416] border border-[#27272a] text-[#fdfcfb] hover:bg-[#1e1e24] shadow-sm transition-all"
            title="Next item"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 9:16 Vertical Story Card */}
        <div 
          ref={storyCardRef}
          className="order-1 lg:order-2 w-full max-w-[360px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl relative select-none border-4 border-[#c5a059]/30 flex flex-col justify-between p-6"
        >
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute inset-0 ${
              styleMode === 'editorial' 
                ? 'bg-gradient-to-b from-black/80 via-transparent to-black/95' 
                : styleMode === 'cute'
                ? 'bg-gradient-to-b from-[#4a1525]/80 via-transparent to-[#1a080e]/95'
                : 'bg-gradient-to-b from-black/70 via-transparent to-black/90'
            }`}></div>
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={BRAND_LOGO}
                alt="Logo"
                className="w-9 h-9 rounded-full border border-white/40 shadow-sm"
              />
              <div>
                <h4 className="text-xs font-serif font-bold text-white tracking-wide leading-none">
                  {businessInfo.name}
                </h4>
                <span className="text-[9px] text-[#c5a059] font-light">Marondera, Zimbabwe</span>
              </div>
            </div>

            <span className="text-[10px] bg-white/20 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wider">
              {currentProduct.category}
            </span>
          </div>

          {/* Center Floating Price Badge */}
          <div className="relative z-10 self-end">
            <div className="bg-[#0c0c0c]/85 backdrop-blur-md border border-[#c5a059] px-4 py-2 rounded-2xl text-right shadow-lg">
              <span className="text-[9px] text-[#a1a1aa] block uppercase tracking-wider font-semibold">Special Order</span>
              <span className="text-2xl font-serif font-black text-[#c5a059]">
                ${currentProduct.priceUSD} USD
              </span>
            </div>
          </div>

          {/* Bottom Info & Order Callout */}
          <div className="relative z-10 bg-[#0c0c0c]/80 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-white space-y-2">
            <h3 className="font-serif text-lg font-bold leading-tight">
              {currentProduct.name}
            </h3>

            <p className="text-[11px] text-[#a1a1aa] line-clamp-2 font-light">
              {currentProduct.description}
            </p>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-[#25D366] font-bold">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {businessInfo.phones[0]}</span>
              </div>
              <span className="text-[#c5a059] font-medium text-[10px]">Marondera & Delivery</span>
            </div>
          </div>
        </div>

        {/* Quick Item Picker list */}
        <div className="order-3 w-full lg:w-64 bg-[#141416] p-4 rounded-3xl border border-[#27272a] shadow-lg max-h-[500px] overflow-y-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] block mb-2">
            Select Story Card
          </span>
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-all ${
                currentIndex === idx
                  ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-sm'
                  : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#202026] hover:text-[#fdfcfb]'
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-8 h-8 rounded-lg object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="truncate flex-1">{p.name}</span>
              <span className="text-[11px] opacity-80">${p.priceUSD}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
