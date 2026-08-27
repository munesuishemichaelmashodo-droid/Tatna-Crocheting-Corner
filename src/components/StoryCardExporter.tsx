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
  Loader2,
  Instagram,
  Lock,
  Unlock,
  ExternalLink,
  ShieldCheck,
  Copy,
  Eye
} from 'lucide-react';

interface StoryCardExporterProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
  isOwner?: boolean;
  onOpenOwnerModal?: () => void;
}

type SocialFormat = 'story-9-16' | 'square-1-1' | 'portrait-4-5';

export const StoryCardExporter: React.FC<StoryCardExporterProps> = ({
  products,
  businessInfo,
  currency,
  isOwner = false,
  onOpenOwnerModal,
}) => {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [styleMode, setStyleMode] = useState<'minimal' | 'editorial' | 'cute' | 'dark-gold'>('editorial');
  const [format, setFormat] = useState<SocialFormat>('story-9-16');
  const [includeCustomText, setIncludeCustomText] = useState<boolean>(false);
  const [customTagline, setCustomTagline] = useState<string>('Custom colors & sizes made to order');

  const [copiedStatusLink, setCopiedStatusLink] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [exportedPreviewUrl, setExportedPreviewUrl] = useState<string | null>(null);

  const websiteUrl = 'https://tatna-crocheting-corner.vercel.app';
  const currentProduct = products[currentIndex] || products[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const copyStatusLink = () => {
    const text = `🌸 *${currentProduct.name}* — $${currentProduct.priceUSD} USD\n✨ Order & customize at Tatna Crocheting Corner:\n${websiteUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedStatusLink(true);
    setTimeout(() => setCopiedStatusLink(false), 2500);
  };

  const copyInstagramCaption = () => {
    const caption = `✨ ${currentProduct.name.toUpperCase()} ✨\n` +
      `Handcrafted with love in Marondera, Zimbabwe 🌸\n\n` +
      `💰 Price: $${currentProduct.priceUSD} USD\n` +
      `🎨 Colors: ${currentProduct.availableColors.join(', ')}\n` +
      `⏳ Lead time: ${currentProduct.leadTime}\n\n` +
      `🛍️ Order via WhatsApp or tap link in bio:\n` +
      `📲 WhatsApp: ${businessInfo.phones[0]}\n` +
      `🌐 Catalog & slot booking: ${websiteUrl}\n\n` +
      `#TatnaCrochet #Marondera #ZimbabweCrochet #HandmadeInZimbabwe #CrochetFashion #HandmadeWithLove`;

    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const shareProductWhatsApp = () => {
    const text = `🌸 *TATNA CROCHETING CORNER* 🌸\n` +
      `✨ *${currentProduct.name}*\n` +
      `💰 *Price:* $${currentProduct.priceUSD} USD\n` +
      `📍 *Location:* ${businessInfo.location}\n` +
      `🌐 *Order online / browse full collection:* ${websiteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
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

      setExportedPreviewUrl(dataUrl);

      const link = document.createElement('a');
      link.download = `Tatna-${format}-${currentProduct.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting story image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Dynamic aspect ratio styling
  const getFormatClasses = () => {
    switch (format) {
      case 'story-9-16':
        return 'w-full max-w-[360px] aspect-[9/16]';
      case 'square-1-1':
        return 'w-full max-w-[420px] aspect-square';
      case 'portrait-4-5':
        return 'w-full max-w-[380px] aspect-[4/5]';
      default:
        return 'w-full max-w-[360px] aspect-[9/16]';
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="bg-[#141416] p-6 rounded-3xl border border-[#27272a] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase block">
              Social Media Publishing Suite
            </span>
            {isOwner ? (
              <span className="inline-flex items-center gap-1 bg-[#52B788]/20 text-[#52B788] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#52B788]/30">
                <ShieldCheck className="w-3 h-3" /> Owner Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-[#27272a] text-[#a1a1aa] text-[10px] font-medium px-2 py-0.5 rounded-full">
                Customer Sharing Mode
              </span>
            )}
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#fdfcfb] flex items-center gap-2">
            <Instagram className="w-6 h-6 text-[#d48396]" />
            <span>Instagram & WhatsApp Post Creator</span>
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1 font-light">
            Generate pixel-perfect Instagram Stories (9:16), Feed Square Posts (1:1), and Portrait Cards (4:5) with verified pricing.
          </p>
        </div>

        {/* Action Controls & Owner Lock Button */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenOwnerModal && (
            <button
              onClick={onOpenOwnerModal}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isOwner
                  ? 'bg-[#52B788]/15 border-[#52B788]/40 text-[#52B788] hover:bg-[#52B788]/25'
                  : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#202026]'
              }`}
            >
              {isOwner ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isOwner ? 'Owner Mode' : 'Owner PIN'}</span>
            </button>
          )}

          <button
            onClick={copyInstagramCaption}
            className="px-3.5 py-2 rounded-xl bg-[#1a1a1e] hover:bg-[#222228] border border-[#27272a] text-[#fdfcfb] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-[#d48396]" />
            <span>{copiedCaption ? 'Copied Caption! 📋' : 'Copy IG Caption'}</span>
          </button>

          <button
            onClick={copyStatusLink}
            className="px-3.5 py-2 rounded-xl bg-[#c5a059]/15 hover:bg-[#c5a059]/25 border border-[#c5a059]/40 text-[#fdfcfb] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{copiedStatusLink ? 'Copied Link!' : 'Status Link ✏️'}</span>
          </button>

          <button
            onClick={shareProductWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadStory}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isExporting ? 'Generating...' : 'Download Image'}</span>
          </button>
        </div>
      </div>

      {/* Format & Style Customization Bar */}
      <div className="bg-[#141416] p-4 rounded-2xl border border-[#27272a] flex flex-wrap items-center justify-between gap-4">
        {/* Aspect Ratio Format Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">Size Format:</span>
          <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-xl border border-[#27272a]">
            <button
              onClick={() => setFormat('story-9-16')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === 'story-9-16' ? 'bg-[#c5a059] text-[#0c0c0c] font-bold' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Story 9:16
            </button>
            <button
              onClick={() => setFormat('square-1-1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === 'square-1-1' ? 'bg-[#c5a059] text-[#0c0c0c] font-bold' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Post Square 1:1
            </button>
            <button
              onClick={() => setFormat('portrait-4-5')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === 'portrait-4-5' ? 'bg-[#c5a059] text-[#0c0c0c] font-bold' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Portrait 4:5
            </button>
          </div>
        </div>

        {/* Style mode */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">Visual Style:</span>
          <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-xl border border-[#27272a]">
            {(['editorial', 'cute', 'dark-gold', 'minimal'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setStyleMode(mode)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  styleMode === mode ? 'bg-[#c5a059] text-[#0c0c0c] font-bold' : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                {mode.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Owner Only: Custom announcement tagline */}
        {isOwner && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={customTagline}
              onChange={(e) => setCustomTagline(e.target.value)}
              placeholder="Custom Banner / Slogan"
              className="px-3 py-1.5 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-[#fdfcfb] focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
            />
          </div>
        )}
      </div>

      {/* Main Canvas & Carousel */}
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

        {/* Social Card Output Canvas */}
        <div 
          ref={storyCardRef}
          className={`order-1 lg:order-2 ${getFormatClasses()} rounded-3xl overflow-hidden shadow-2xl relative select-none border-4 border-[#c5a059]/30 flex flex-col justify-between p-6 transition-all duration-300`}
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
                ? 'bg-gradient-to-b from-black/85 via-transparent to-black/95' 
                : styleMode === 'cute'
                ? 'bg-gradient-to-b from-[#4a1525]/85 via-transparent to-[#1a080e]/95'
                : styleMode === 'dark-gold'
                ? 'bg-gradient-to-b from-[#1c180d]/90 via-transparent to-[#0a0905]/95'
                : 'bg-gradient-to-b from-black/75 via-transparent to-black/90'
            }`}></div>
          </div>

          {/* Top Brand Header & Instagram sticker */}
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

            <div className="flex items-center gap-1.5">
              <span className="text-[9px] bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                Instagram Link in Bio
              </span>
              <span className="text-[10px] bg-white/20 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                {currentProduct.category}
              </span>
            </div>
          </div>

          {/* Center Floating Price & Tagline */}
          <div className="relative z-10 self-end space-y-2 text-right">
            {customTagline && (
              <span className="inline-block text-[10px] bg-black/70 backdrop-blur-md text-amber-200 px-2.5 py-1 rounded-full border border-amber-400/30 font-medium shadow-md">
                ✨ {customTagline}
              </span>
            )}
            <div className="bg-[#0c0c0c]/90 backdrop-blur-md border border-[#c5a059] px-4 py-2 rounded-2xl shadow-xl inline-block">
              <span className="text-[9px] text-[#a1a1aa] block uppercase tracking-wider font-semibold">Special Order</span>
              <span className="text-2xl sm:text-3xl font-serif font-black text-[#c5a059]">
                ${currentProduct.priceUSD} USD
              </span>
            </div>
          </div>

          {/* Bottom Info & Order Callout */}
          <div className="relative z-10 bg-[#0c0c0c]/85 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-white space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base sm:text-lg font-bold leading-tight">
                {currentProduct.name}
              </h3>
              <span className="text-[10px] bg-[#52B788]/20 text-[#52B788] font-bold px-2 py-0.5 rounded-full border border-[#52B788]/30">
                Turnaround: {currentProduct.leadTime}
              </span>
            </div>

            <p className="text-[11px] text-[#a1a1aa] line-clamp-2 font-light">
              {currentProduct.description}
            </p>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-[#25D366] font-bold">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {businessInfo.phones[0]}</span>
              </div>
              <span className="text-[#c5a059] font-medium text-[10px] truncate max-w-[140px]">
                tatna-crocheting-corner.vercel.app
              </span>
            </div>
          </div>
        </div>

        {/* Item Picker & Instagram Tips */}
        <div className="order-3 w-full lg:w-72 space-y-4">
          <div className="bg-[#141416] p-4 rounded-3xl border border-[#27272a] shadow-lg max-h-[360px] overflow-y-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] block mb-2">
              Select Item Card
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

          <div className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] text-xs text-[#a1a1aa] space-y-2">
            <span className="font-bold text-white block flex items-center gap-1.5 text-xs">
              <Instagram className="w-3.5 h-3.5 text-[#d48396]" /> Instagram Story Tip
            </span>
            <p className="text-[11px] leading-relaxed">
              When posting to Instagram Stories, use the <strong>&quot;Link&quot; sticker</strong> in Instagram and paste your catalog link:
              <br />
              <code className="text-[#c5a059] block mt-1 break-all bg-black/40 p-1.5 rounded text-[10px]">
                {websiteUrl}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
