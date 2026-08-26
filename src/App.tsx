import React, { useState } from 'react';
import { CrochetProduct, BusinessInfo, CartItem } from './types';
import { CurrencyCode } from './utils/currency';
import { INITIAL_PRODUCTS, INITIAL_BUSINESS_INFO, BRAND_LOGO } from './data/products';
import { Navbar } from './components/Navbar';
import { DigitalCatalog } from './components/DigitalCatalog';
import { BookingSystem } from './components/BookingSystem';
import { PosterStudio } from './components/PosterStudio';
import { QuoteBuilder } from './components/QuoteBuilder';
import { StoryCardExporter } from './components/StoryCardExporter';
import { AboutContact } from './components/AboutContact';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { 
  Heart, 
  Sparkles, 
  Phone, 
  MapPin, 
  MessageCircle, 
  ShoppingBag, 
  Printer, 
  Layers,
  ArrowUp,
  Calendar
} from 'lucide-react';

export function App() {
  const [businessInfo] = useState<BusinessInfo>(INITIAL_BUSINESS_INFO);
  const [products] = useState<CrochetProduct[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'catalog' | 'booking' | 'poster' | 'quote' | 'stories' | 'about'>('catalog');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<CrochetProduct | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // Slouchy Beanie
      quantity: 1,
      selectedColor: 'Monochrome Black & White',
    },
    {
      product: INITIAL_PRODUCTS[3], // Ruffle Slops
      quantity: 1,
      selectedColor: 'Black & Bright Pink',
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: CrochetProduct, selectedColor?: string, quantity: number = 1) => {
    const colorToUse = selectedColor || product.availableColors[0] || 'Default';
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === colorToUse
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: colorToUse,
        },
      ];
    });
    showToast(`Added "${product.name}" (${colorToUse}) to Quote Bag!`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#fdfcfb] flex flex-col justify-between selection:bg-[#c5a059]/30 selection:text-[#fdfcfb]">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161618] text-[#fdfcfb] px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#c5a059]/50 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#c5a059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        businessInfo={businessInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {activeTab === 'catalog' && (
          <DigitalCatalog
            products={products}
            businessInfo={businessInfo}
            currency={currency}
            onOpenDetails={(p) => setSelectedDetailProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onGoToBooking={() => {
              setActiveTab('booking');
              scrollToTop();
            }}
            onGoToPoster={() => {
              setActiveTab('poster');
              scrollToTop();
            }}
          />
        )}

        {activeTab === 'booking' && (
          <BookingSystem
            products={products}
            businessInfo={businessInfo}
            onOpenProductDetail={(p) => setSelectedDetailProduct(p)}
          />
        )}

        {activeTab === 'poster' && (
          <PosterStudio
            products={products}
            businessInfo={businessInfo}
          />
        )}

        {activeTab === 'quote' && (
          <QuoteBuilder
            products={products}
            businessInfo={businessInfo}
            currency={currency}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}

        {activeTab === 'stories' && (
          <StoryCardExporter
            products={products}
            businessInfo={businessInfo}
            currency={currency}
          />
        )}

        {activeTab === 'about' && (
          <AboutContact
            businessInfo={businessInfo}
          />
        )}
      </main>

      {/* Product Zoom & Order Modal */}
      <ProductDetailModal
        product={selectedDetailProduct}
        businessInfo={businessInfo}
        currency={currency}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={(p, color, qty) => handleAddToCart(p, color, qty)}
      />

      {/* Cart & Quote Inquiry Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        businessInfo={businessInfo}
        currency={currency}
        onGoToQuote={() => {
          setIsCartOpen(false);
          setActiveTab('quote');
        }}
      />

      {/* Footer */}
      <footer className="bg-[#080808] text-[#e4e4e7] border-t border-[#27272a] mt-20 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={BRAND_LOGO}
                  alt="Logo"
                  className="w-11 h-11 rounded-full border border-[#c5a059]/60 shadow-sm"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {businessInfo.name}
                  </h3>
                  <span className="text-xs text-[#c5a059] block font-medium">
                    Handcrafted in Marondera, Zimbabwe
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-md font-light">
                {businessInfo.description}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`https://wa.me/${businessInfo.primaryPhone.replace(/[\s+]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] text-white rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-[#20BA5A] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Order
                </a>
                <a
                  href={`tel:${businessInfo.primaryPhone}`}
                  className="px-4 py-2 bg-white/10 text-white rounded-full text-xs font-medium hover:bg-white/20 transition-colors"
                >
                  Call {businessInfo.phones[0]}
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
                Catalog Suite
              </h4>
              <ul className="space-y-1.5 text-xs text-[#a1a1aa]">
                <li>
                  <button onClick={() => { setActiveTab('catalog'); scrollToTop(); }} className="hover:text-white transition-colors">
                    Digital Lookbook & Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('booking'); scrollToTop(); }} className="hover:text-white transition-colors text-[#c5a059] font-medium">
                    Bespoke Slot Booking (New)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('poster'); scrollToTop(); }} className="hover:text-white transition-colors">
                    Printable Poster & Flyer Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('quote'); scrollToTop(); }} className="hover:text-white transition-colors">
                    Custom Quote & Order Estimator
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('stories'); scrollToTop(); }} className="hover:text-white transition-colors">
                    WhatsApp Status Cards
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('about'); scrollToTop(); }} className="hover:text-white transition-colors">
                    Marondera Contacts & Story
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact & Pickup */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
                Contact & Pickup
              </h4>
              <div className="space-y-1.5 text-xs text-[#a1a1aa]">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e89bae] shrink-0 mt-0.5" />
                  <span>Marondera, Zimbabwe (Studio Pickups & Deliveries to Harare / Nationwide)</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>{businessInfo.phones[0]}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>{businessInfo.phones[1]}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>{businessInfo.phones[2]}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717a] gap-4">
            <p>© {new Date().getFullYear()} Tatna Crocheting Corner. All rights reserved.</p>
            <div className="flex items-center gap-1 text-[#c5a059]">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 fill-current text-[#e89bae]" />
              <span>in Marondera, Zimbabwe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
