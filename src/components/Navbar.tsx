import React from 'react';
import { BusinessInfo, CartItem } from '../types';
import { CurrencyCode } from '../utils/currency';
import { BRAND_LOGO } from '../data/products';
import { 
  Sparkles, 
  ShoppingBag, 
  Printer, 
  FileText, 
  Phone, 
  MessageCircle, 
  Share2, 
  Palette,
  Layers,
  Calendar,
  Lock,
  Unlock,
  Instagram
} from 'lucide-react';

interface NavbarProps {
  businessInfo: BusinessInfo;
  activeTab: 'catalog' | 'booking' | 'poster' | 'quote' | 'stories' | 'content-studio' | 'about';
  setActiveTab: (tab: 'catalog' | 'booking' | 'poster' | 'quote' | 'stories' | 'content-studio' | 'about') => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  isOwner?: boolean;
  onOpenOwnerModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  businessInfo,
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  cartItems,
  setIsCartOpen,
  isOwner = false,
  onOpenOwnerModal,
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-[#27272a] transition-all">
      {/* Top Notification Bar */}
      <div className="bg-[#141416] text-[#e4e4e7] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-between border-b border-[#222226] no-print">
        <div className="hidden sm:flex items-center gap-2 mx-auto">
          <span className="inline-block w-2 h-2 rounded-full bg-[#52B788] animate-pulse"></span>
          <span>📍 Handcrafted in Marondera, Zimbabwe — Serving Harare & Nationwide (Prices from $2 USD)</span>
        </div>
        <div className="flex items-center gap-3 sm:ml-auto mx-auto sm:mx-0">
          <a
            href={`tel:${businessInfo.primaryPhone}`}
            className="hover:text-[#c5a059] transition-colors flex items-center gap-1 text-[#a1a1aa]"
          >
            <Phone className="w-3 h-3 text-[#c5a059]" />
            <span>{businessInfo.phones[0]}</span>
          </a>
          <span className="opacity-30">|</span>
          <a
            href={`https://wa.me/${businessInfo.primaryPhone.replace(/[\s+]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#52B788] transition-colors flex items-center gap-1 font-semibold text-[#52B788]"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp Order</span>
          </a>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Title */}
          <div 
            id="brand-header-badge" 
            onClick={() => setActiveTab('catalog')} 
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#c5a059]/70 shadow-sm group-hover:scale-105 transition-transform">
              <img 
                src={BRAND_LOGO} 
                alt="Tatna Crocheting Corner" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#c5a059] block">
                Artisanal Knitwear & Gifts
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#fdfcfb] tracking-tight group-hover:text-[#c5a059] transition-colors">
                {businessInfo.name}
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#16161a] p-1.5 rounded-full border border-[#27272a] text-sm">
            <button
              id="nav-catalog-btn"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#222226]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Digital Lookbook</span>
            </button>

            <button
              id="nav-booking-btn"
              onClick={() => setActiveTab('booking')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'booking'
                  ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#222226]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#e89bae]" />
              <span>Book Slot</span>
              <span className="text-[9px] bg-[#d48396]/20 text-[#f5a3b7] border border-[#d48396]/40 px-1.5 py-0.5 rounded-full font-bold">
                NEW
              </span>
            </button>

            <button
              id="nav-poster-btn"
              onClick={() => setActiveTab('poster')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'poster'
                  ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#222226]'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Poster Studio</span>
              <span className="text-[10px] bg-[#d48396] text-white px-1.5 py-0.5 rounded-full font-bold">
                HD
              </span>
            </button>

            <button
              id="nav-quote-btn"
              onClick={() => setActiveTab('quote')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'quote'
                  ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#222226]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Custom Quote</span>
            </button>

            <button
              id="nav-stories-btn"
              onClick={() => setActiveTab('stories')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'stories'
                  ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#222226]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Status Cards</span>
            </button>

            <button
              id="nav-content-studio-btn"
              onClick={() => setActiveTab('content-studio')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'content-studio'
                  ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#222226]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#d48396]" />
              <span>AI Content Studio</span>
              <span className="text-[9px] bg-gradient-to-r from-[#833ab4] to-[#fd1d1d] text-white px-1.5 py-0.5 rounded-full font-bold">
                PRO
              </span>
            </button>

            <button
              id="nav-about-btn"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'about'
                  ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#222226]'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>About & Location</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Owner Access PIN Button */}
            {onOpenOwnerModal && (
              <button
                id="navbar-owner-mode-btn"
                onClick={onOpenOwnerModal}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                  isOwner
                    ? 'bg-[#52B788]/20 border-[#52B788]/50 text-[#52B788] hover:bg-[#52B788]/30'
                    : 'bg-[#16161a] border-[#27272a] text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#202026]'
                }`}
                title={isOwner ? 'Owner Mode Active' : 'Owner Admin Login'}
              >
                {isOwner ? <Unlock className="w-3.5 h-3.5 text-[#52B788]" /> : <Lock className="w-3.5 h-3.5 text-[#c5a059]" />}
                <span className="hidden sm:inline">{isOwner ? 'Owner' : 'Owner PIN'}</span>
              </button>
            )}

            {/* USD Currency Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#16161a] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-[#c5a059] font-bold shadow-xs">
              <span>$ USD</span>
              <span className="text-[10px] text-[#a1a1aa] font-normal">Pricing</span>
            </div>

            {/* Cart / Order Inquiry Drawer Toggle */}
            <button
              id="order-inquiry-bag-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#1a1a1e] hover:bg-[#26262b] text-[#fdfcfb] border border-[#27272a] hover:border-[#c5a059]/50 transition-all flex items-center gap-2"
              title="View Order Inquiries"
            >
              <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#d48396] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalCartCount}
                </span>
              )}
              <span className="hidden md:inline text-xs font-semibold">
                Inquiry Bag {totalCartCount > 0 ? `(${totalCartCount})` : ''}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-2 border-t border-[#27272a] no-scrollbar">
          <button
            id="mobile-nav-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#c5a059] text-[#0c0c0c] font-bold'
                : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Lookbook
          </button>
          <button
            id="mobile-nav-booking"
            onClick={() => setActiveTab('booking')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'booking'
                ? 'bg-[#c5a059] text-[#0c0c0c] font-bold'
                : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#e89bae]" />
            Book Slot
          </button>
          <button
            id="mobile-nav-poster"
            onClick={() => setActiveTab('poster')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'poster'
                ? 'bg-[#c5a059] text-[#0c0c0c] font-bold'
                : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            Poster Studio
          </button>
          <button
            id="mobile-nav-quote"
            onClick={() => setActiveTab('quote')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quote'
                ? 'bg-[#c5a059] text-[#0c0c0c] font-bold'
                : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Order Quote
          </button>
          <button
            id="mobile-nav-stories"
            onClick={() => setActiveTab('stories')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'stories'
                ? 'bg-[#c5a059] text-[#0c0c0c] font-bold'
                : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Status Cards
          </button>
          <button
            id="mobile-nav-content-studio"
            onClick={() => setActiveTab('content-studio')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'content-studio'
                ? 'bg-[#c5a059] text-[#0c0c0c] font-bold'
                : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d48396]" />
            AI Creator
          </button>
          <button
            id="mobile-nav-about"
            onClick={() => setActiveTab('about')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-[#c5a059] text-[#0c0c0c] font-bold'
                : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            About & Location
          </button>
        </div>
      </div>
    </header>
  );
};
