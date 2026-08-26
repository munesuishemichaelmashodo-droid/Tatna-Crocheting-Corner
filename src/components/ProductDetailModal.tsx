import React, { useState } from 'react';
import { CrochetProduct, BusinessInfo } from '../types';
import { CurrencyCode, formatPrice } from '../utils/currency';
import { createDirectOrderWhatsAppUrl } from '../utils/whatsapp';
import { 
  X, 
  MessageCircle, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Clock, 
  ShieldCheck, 
  Tag, 
  Palette, 
  MapPin,
  Share2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: CrochetProduct | null;
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (product: CrochetProduct, selectedColor: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  businessInfo,
  currency,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<string>(product.availableColors[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const directWhatsAppUrl = createDirectOrderWhatsAppUrl(
    product,
    businessInfo.primaryPhone,
    selectedColor,
    quantity
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} — Tatna Crocheting Corner`,
        text: `Check out the ${product.name} from Tatna Crocheting Corner in Marondera for $${product.priceUSD}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${product.name} by Tatna Crocheting Corner - $${product.priceUSD} USD. Contact: ${businessInfo.phones[0]}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        id="product-detail-modal"
        className="bg-[#141416] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#27272a] flex flex-col md:flex-row relative max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1e1e24]/90 text-[#fdfcfb] hover:bg-[#c5a059] hover:text-[#0c0c0c] transition-all shadow-md border border-[#27272a]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-[#0c0c0c] relative flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[420px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Location watermark */}
          <div className="absolute bottom-3 left-3 bg-[#0c0c0c]/85 backdrop-blur-md text-[#fdfcfb] text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#27272a]">
            <MapPin className="w-3 h-3 text-[#c5a059]" />
            <span>Marondera, Zimbabwe Made</span>
          </div>
        </div>

        {/* Right: Details & Order Controls */}
        <div className="md:w-1/2 p-6 sm:p-7 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059] bg-[#1a1a1e] border border-[#27272a] px-2.5 py-0.5 rounded-md">
                {product.category}
              </span>
              <button
                onClick={handleShare}
                className="text-xs text-[#a1a1aa] hover:text-[#fdfcfb] flex items-center gap-1 bg-[#1a1a1e] border border-[#27272a] px-2.5 py-0.5 rounded-md transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcfb] leading-tight">
              {product.name}
            </h2>

            {/* Price display */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#c5a059]">
                {formatPrice(product.priceUSD * quantity, currency, businessInfo.currencyRates)}
              </span>
              {currency !== 'USD' && (
                <span className="text-sm text-[#a1a1aa]">
                  (${product.priceUSD * quantity} USD)
                </span>
              )}
            </div>

            <p className="text-sm text-[#a1a1aa] mt-3 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Palette Selector */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-[#fdfcfb] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#c5a059]" /> Select Colorway:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
                      selectedColor === color
                        ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                        : 'bg-[#1a1a1e] text-[#a1a1aa] border border-[#27272a] hover:text-[#fdfcfb] hover:bg-[#222228]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb]">Quantity:</span>
              <div className="flex items-center border border-[#27272a] rounded-xl bg-[#18181b] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#27272a] transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-bold text-[#fdfcfb]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#27272a] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Product Specifications Badge list */}
            <div className="mt-5 space-y-2 text-xs text-[#a1a1aa] bg-[#18181b] p-3.5 rounded-2xl border border-[#27272a]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span><strong className="text-[#fdfcfb]">Turnaround / Lead Time:</strong> {product.leadTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span><strong className="text-[#fdfcfb]">Materials:</strong> {product.materials}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span><strong className="text-[#fdfcfb]">Care:</strong> {product.careInstructions}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-[#27272a] space-y-2.5">
            <a
              id="modal-direct-whatsapp-btn"
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Order on WhatsApp (Direct to Tatna)</span>
            </a>

            <button
              id="modal-add-to-quote-btn"
              onClick={() => {
                onAddToCart(product, selectedColor, quantity);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-[#1e1e24] hover:bg-[#27272f] border border-[#27272a] hover:border-[#c5a059]/50 text-[#fdfcfb] font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
              <span>Add to Quote Inquiry Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
