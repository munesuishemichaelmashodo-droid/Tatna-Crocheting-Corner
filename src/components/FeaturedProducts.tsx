import React, { useState } from 'react';
import { CrochetProduct, BusinessInfo } from '../types';
import { CurrencyCode, formatPrice } from '../utils/currency';
import { 
  Sparkles, 
  ShoppingBag, 
  Eye, 
  Clock, 
  Palette, 
  CheckCircle2, 
  ArrowRight, 
  Heart,
  MessageCircle,
  Star,
  Award
} from 'lucide-react';

interface FeaturedProductsProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
  onOpenDetails: (product: CrochetProduct) => void;
  onAddToCart: (product: CrochetProduct) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  businessInfo,
  currency,
  onOpenDetails,
  onAddToCart,
}) => {
  // Curate 4 top signature pieces
  const featuredIds = ['ruffle-hat', 'bow-bag', 'slouchy-beanie', 'lily-flower-bouquet'];
  const featuredItems = featuredIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is CrochetProduct => Boolean(p));

  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const activeProduct = featuredItems[activeItemIndex] || featuredItems[0];

  // Specific craft highlight descriptions
  const craftHighlights: Record<string, { badge: string; highlight: string; technique: string }> = {
    'ruffle-hat': {
      badge: 'Bestselling Headwear',
      highlight: 'Sculpted with layered spiral ruffles that maintain their bounce and shape while offering UV sun protection with high-street flair.',
      technique: 'Continuous spiral double-crochet with flared edge expansion',
    },
    'bow-bag': {
      badge: 'Signature Accessory',
      highlight: 'Crafted from heavy-gauge structured yarn with a reinforced base and a hand-formed 3D statement bow that elevates any outfit.',
      technique: 'Dense single-crochet structural weave with metallic eyelet anchor',
    },
    'slouchy-beanie': {
      badge: 'Streetwear Icon',
      highlight: 'Engineered with relaxed ribbed wave spirals for the ultimate drape, snug breathable crown, and effortless casual versatility.',
      technique: 'Back-loop ribbed wave stitching with elastic tension recovery',
    },
    'lily-flower-bouquet': {
      badge: 'Forever Keepsake',
      highlight: 'Intricately constructed botanical lilies and bud accents supported by internal wire stems, wrapped in florist paper with satin ribbon.',
      technique: 'Fine mercerized yarn wire-wrapped petaling with realistic shading',
    },
  };

  return (
    <section className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#27272a] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#c5a059]/10 text-[#c5a059] px-3 py-1 rounded-full text-xs font-bold border border-[#c5a059]/25 mb-2">
            <Award className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Curated Artisan Showcase • Prices from $2</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcfb]">
            Featured Creations & Masterpieces
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] font-light mt-1 max-w-2xl">
            A spotlight on Tatna&apos;s most celebrated handcrafted pieces—each stitch sculpted by hand in Marondera with premium yarns, custom colorways, and timeless durability.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#a1a1aa] hidden md:inline">Quick Jump:</span>
          <div className="flex gap-1.5">
            {featuredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveItemIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeItemIndex === idx
                    ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                    : 'bg-[#18181b] text-[#a1a1aa] hover:text-[#fdfcfb] border border-[#27272a]'
                }`}
              >
                {idx + 1}. {item.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Featured Showcase (Active Selected Item Spotlight) */}
      {activeProduct && (
        <div className="bg-gradient-to-br from-[#18181c] via-[#141416] to-[#0f0f11] rounded-3xl p-6 sm:p-8 border border-[#27272a] shadow-xl relative overflow-hidden">
          {/* Subtle gold glow behind active product */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Image Spotlight with badges */}
            <div className="lg:col-span-5 relative group">
              <div className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-[#1f1f24] border-2 border-[#27272a] shadow-2xl relative">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>

                {/* Craftsmanship Badge */}
                <div className="absolute top-3 left-3 bg-[#0c0c0c]/85 backdrop-blur-md px-3 py-1 rounded-full border border-[#c5a059]/40 flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span className="text-[11px] font-bold text-[#c5a059]">
                    {craftHighlights[activeProduct.id]?.badge || 'Featured Creation'}
                  </span>
                </div>

                {/* Price tag */}
                <div className="absolute bottom-3 right-3 bg-[#0c0c0c]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#c5a059]/60 shadow-lg text-right">
                  <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider block font-medium">Bespoke Price</span>
                  <span className="text-xl font-serif font-black text-[#c5a059]">
                    {formatPrice(activeProduct.priceUSD, currency, businessInfo.currencyRates)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Details & Craftsmanship Insights */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-bold block mb-1">
                  Handmade Masterpiece • {activeProduct.category.toUpperCase()}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcfb]">
                  {activeProduct.name}
                </h3>
                <p className="text-sm text-[#e4e4e7] mt-2 font-light leading-relaxed">
                  {craftHighlights[activeProduct.id]?.highlight || activeProduct.description}
                </p>
              </div>

              {/* Craftsmanship Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#18181b]/80 p-3.5 rounded-xl border border-[#27272a]">
                  <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Artisan Technique</span>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] font-light">
                    {craftHighlights[activeProduct.id]?.technique || 'Hand-crocheted custom tension weave'}
                  </p>
                </div>

                <div className="bg-[#18181b]/80 p-3.5 rounded-xl border border-[#27272a]">
                  <div className="flex items-center gap-2 text-[#c5a059] text-xs font-bold mb-1">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Creation Turnaround</span>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] font-light">
                    Ready in {activeProduct.leadTime} in Marondera
                  </p>
                </div>
              </div>

              {/* Color Options Preview */}
              <div>
                <span className="text-xs font-semibold text-[#a1a1aa] block mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Available Color Combinations:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProduct.availableColors.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-[11px] font-medium bg-[#1e1e24] text-[#fdfcfb] rounded-lg border border-[#27272a]"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onAddToCart(activeProduct)}
                  className="px-5 py-3 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Order Quote Bag</span>
                </button>

                <button
                  onClick={() => onOpenDetails(activeProduct)}
                  className="px-4 py-3 rounded-xl bg-[#1e1e24] hover:bg-[#26262d] text-[#fdfcfb] text-xs font-semibold flex items-center gap-2 border border-[#27272a] transition-all"
                >
                  <Eye className="w-4 h-4 text-[#c5a059]" />
                  <span>View Full Specs & Zoom</span>
                </button>

                <a
                  href={`https://wa.me/${businessInfo.primaryPhone.replace(/[\s+]/g, '')}?text=${encodeURIComponent(`Hi Tatna! I want to order the featured ${activeProduct.name} ($${activeProduct.priceUSD} USD).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp Order</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4-Item Featured Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveItemIndex(idx)}
            className={`cursor-pointer rounded-2xl p-4 transition-all border flex flex-col justify-between ${
              activeItemIndex === idx
                ? 'bg-[#1a1a1e] border-[#c5a059] shadow-lg ring-1 ring-[#c5a059]/40'
                : 'bg-[#141416] border-[#27272a] hover:border-[#3f3f46] hover:bg-[#18181b]'
            }`}
          >
            <div>
              {/* Image thumbnail */}
              <div className="aspect-square rounded-xl overflow-hidden bg-[#1f1f24] relative mb-3 border border-[#27272a]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-[#c5a059] border border-[#c5a059]/30">
                  {craftHighlights[item.id]?.badge || 'Top Pick'}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/85 px-2 py-0.5 rounded-md text-xs font-bold font-serif text-[#fdfcfb]">
                  ${item.priceUSD} USD
                </div>
              </div>

              <h4 className="font-serif font-bold text-sm text-[#fdfcfb] line-clamp-1">
                {item.name}
              </h4>
              <p className="text-[11px] text-[#a1a1aa] line-clamp-2 mt-1 font-light leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-[#27272a] flex items-center justify-between">
              <span className="text-[10px] text-[#c5a059] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> {item.leadTime}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item);
                }}
                className="text-[11px] font-bold text-[#fdfcfb] hover:text-[#c5a059] flex items-center gap-1 transition-colors"
              >
                <span>+ Add</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
