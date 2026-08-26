import React, { useState, useMemo } from 'react';
import { CrochetProduct, BusinessInfo, ProductCategory } from '../types';
import { CurrencyCode, formatPrice } from '../utils/currency';
import { ProductCard } from './ProductCard';
import { FeaturedProducts } from './FeaturedProducts';
import { BrandLogoShowcase } from './BrandLogoShowcase';
import { 
  Sparkles, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Tag, 
  Heart, 
  SlidersHorizontal,
  ChevronRight,
  Printer,
  Crown,
  Palette,
  Layers,
  Calendar
} from 'lucide-react';

interface DigitalCatalogProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
  onOpenDetails: (product: CrochetProduct) => void;
  onAddToCart: (product: CrochetProduct) => void;
  onGoToPoster: () => void;
  onGoToBooking?: () => void;
}

const CATEGORIES: { id: ProductCategory; label: string; countHint?: string }[] = [
  { id: 'all', label: 'All Creations' },
  { id: 'hats', label: 'Beanies & Hats' },
  { id: 'bags', label: 'Bags & Totes' },
  { id: 'footwear', label: 'Ruffle Slops' },
  { id: 'accessories', label: 'Hair Accessories' },
  { id: 'bouquets', label: 'Flower Bouquets' },
  { id: 'apparel', label: 'Knit Tops & Polos' },
];

export const DigitalCatalog: React.FC<DigitalCatalogProps> = ({
  products,
  businessInfo,
  currency,
  onOpenDetails,
  onAddToCart,
  onGoToPoster,
  onGoToBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.availableColors.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
        if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-12">
      {/* Brand Logo Showcase Modal */}
      <BrandLogoShowcase
        businessInfo={businessInfo}
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18181c] via-[#121215] to-[#09090b] text-[#fdfcfb] p-6 sm:p-10 md:p-14 shadow-2xl border border-[#27272a]">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 bg-[#c5a059]/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-[#c5a059] border border-[#c5a059]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Tatna Crocheting Corner • Marondera, Zimbabwe</span>
            </div>

            <span className="inline-flex items-center gap-1.5 bg-[#52B788]/15 text-[#52B788] px-3 py-1 rounded-full text-xs font-bold border border-[#52B788]/30">
              Pricing Starts From $2 USD
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#fdfcfb] leading-tight">
            Handcrafted with love. <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#c5a059]">Worn with timeless pride.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#a1a1aa] leading-relaxed max-w-2xl font-light">
            Discover Tatna&apos;s bespoke crochet collection in Marondera, Zimbabwe. Custom handcrafted fashion, trendy beanies, statement bags, ruffled footwear, and forever flower bouquets starting from just $2.
          </p>

          {/* Quick Info & Actions */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            {onGoToBooking && (
              <button
                id="hero-book-slot-btn"
                onClick={onGoToBooking}
                className="px-5 py-3 rounded-full bg-[#c5a059] hover:bg-[#d6b26b] text-[#0c0c0c] text-xs sm:text-sm font-serif font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Custom Slot</span>
              </button>
            )}

            <a
              id="hero-whatsapp-chat"
              href={`https://wa.me/${businessInfo.primaryPhone.replace(/[\s+]/g, '')}?text=${encodeURIComponent('Hi Tatna! I want to inquire about your crochet collection (pricing from $2).')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              id="hero-open-poster-btn"
              onClick={onGoToPoster}
              className="px-5 py-3 rounded-full bg-[#18181b] hover:bg-[#222226] text-[#fdfcfb] text-xs sm:text-sm font-semibold flex items-center gap-2 border border-[#27272a] transition-all"
            >
              <Printer className="w-4 h-4 text-[#c5a059]" />
              <span>Poster Studio</span>
            </button>

            <button
              id="hero-view-logo-btn"
              onClick={() => setIsLogoModalOpen(true)}
              className="px-4 py-3 rounded-full bg-[#18181b] hover:bg-[#222226] text-[#c5a059] text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-[#27272a] transition-all"
            >
              <Crown className="w-4 h-4 text-[#c5a059]" />
              <span>Brand Logo</span>
            </button>
          </div>

          {/* Location and contacts pill */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-[#a1a1aa]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d48396]" />
              <span>{businessInfo.location}</span>
            </div>
            <span className="opacity-30">•</span>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{businessInfo.phones.join(' / ')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Price Highlights Bar (Featuring $2 Start Point) */}
      <section className="bg-[#141416] rounded-2xl p-4 sm:p-5 border border-[#27272a] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#c5a059]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb]">
              Transparent Price Menu (Starting from $2 USD)
            </h2>
          </div>
          <span className="text-[11px] text-[#a1a1aa]">Custom colors & tailored sizing available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center">
          <div className="bg-[#1a1a1e] p-2.5 rounded-xl border border-[#c5a059]/40 relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#52B788] text-[#0c0c0c] text-[9px] font-extrabold px-2 py-0.2 rounded-full uppercase">
              From $2
            </span>
            <span className="text-[11px] text-[#a1a1aa] block font-medium mt-1">Scrunchies</span>
            <span className="text-sm font-bold font-serif text-[#c5a059]">$2 USD</span>
          </div>

          <div className="bg-[#1a1a1e] p-2.5 rounded-xl border border-[#27272a]">
            <span className="text-[11px] text-[#a1a1aa] block font-medium">Hair Bow Clips</span>
            <span className="text-sm font-bold font-serif text-[#c5a059]">$3 USD</span>
          </div>

          <div className="bg-[#1a1a1e] p-2.5 rounded-xl border border-[#27272a]">
            <span className="text-[11px] text-[#a1a1aa] block font-medium">Slouchy Beanie</span>
            <span className="text-sm font-bold font-serif text-[#c5a059]">$5 USD</span>
          </div>

          <div className="bg-[#1a1a1e] p-2.5 rounded-xl border border-[#27272a]">
            <span className="text-[11px] text-[#a1a1aa] block font-medium">Ruffle Slops</span>
            <span className="text-sm font-bold font-serif text-[#c5a059]">$5 USD</span>
          </div>

          <div className="bg-[#1a1a1e] p-2.5 rounded-xl border border-[#27272a]">
            <span className="text-[11px] text-[#a1a1aa] block font-medium">Ruffle Bucket Hat</span>
            <span className="text-sm font-bold font-serif text-[#c5a059]">$7 USD</span>
          </div>

          <div className="bg-[#1a1a1e] p-2.5 rounded-xl border border-[#27272a]">
            <span className="text-[11px] text-[#a1a1aa] block font-medium">Artisan Bow Bag</span>
            <span className="text-sm font-bold font-serif text-[#c5a059]">$10 USD</span>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION (Requested 3-4 Best Items Spotlight) */}
      <FeaturedProducts
        products={products}
        businessInfo={businessInfo}
        currency={currency}
        onOpenDetails={onOpenDetails}
        onAddToCart={onAddToCart}
      />

      {/* Full Catalog Filter and Search Section */}
      <section className="space-y-6 pt-4 border-t border-[#27272a]">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#fdfcfb]">
            Explore Complete Lookbook & Catalog
          </h3>
          <p className="text-xs sm:text-sm text-[#a1a1aa] font-light mt-1">
            Browse all categories, search specific designs, and select your favorite colorways.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`category-tab-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                    : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a] hover:text-white border border-[#27272a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search beanies, bags..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#141416] border border-[#27272a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c5a059] placeholder-[#71717a] text-[#fdfcfb]"
              />
            </div>

            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs bg-[#141416] border border-[#27272a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c5a059] text-[#fdfcfb] font-medium"
            >
              <option value="featured" className="bg-[#141416] text-[#fdfcfb]">✨ Featured</option>
              <option value="price-asc" className="bg-[#141416] text-[#fdfcfb]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#141416] text-[#fdfcfb]">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#a1a1aa] px-1">
          <span>Showing <strong className="text-[#fdfcfb]">{filteredProducts.length}</strong> handcrafted designs</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#c5a059] font-semibold hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      </section>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              businessInfo={businessInfo}
              currency={currency}
              onOpenDetails={onOpenDetails}
              onAddToCart={onAddToCart}
              isFavorited={favorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#141416] rounded-3xl p-12 text-center border border-[#27272a] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1a1a1e] text-[#c5a059] flex items-center justify-center mx-auto border border-[#27272a]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#fdfcfb]">No items found</h3>
          <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
            We couldn&apos;t find any crochet designs matching &ldquo;{searchQuery}&rdquo;. Try another keyword or browse all items.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-[#c5a059] text-[#0c0c0c] font-bold rounded-full text-xs mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

