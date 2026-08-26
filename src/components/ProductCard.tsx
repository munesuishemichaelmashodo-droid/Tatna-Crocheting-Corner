import React from 'react';
import { CrochetProduct, BusinessInfo } from '../types';
import { CurrencyCode, formatPrice } from '../utils/currency';
import { createDirectOrderWhatsAppUrl } from '../utils/whatsapp';
import { MessageCircle, ShoppingBag, Eye, Sparkles, Check, Heart } from 'lucide-react';

interface ProductCardProps {
  product: CrochetProduct;
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
  onOpenDetails: (product: CrochetProduct) => void;
  onAddToCart: (product: CrochetProduct) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  businessInfo,
  currency,
  onOpenDetails,
  onAddToCart,
  isFavorited = false,
  onToggleFavorite,
}) => {
  const directWhatsAppUrl = createDirectOrderWhatsAppUrl(
    product,
    businessInfo.primaryPhone,
    product.availableColors[0]
  );

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-[#141416] rounded-2xl overflow-hidden border border-[#27272a] hover:border-[#c5a059]/70 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] bg-[#1a1a1e] overflow-hidden cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#0c0c0c]/90 backdrop-blur-md text-[#fdfcfb] text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-[#c5a059]/40">
              <Sparkles className="w-3 h-3 text-[#c5a059]" /> Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#d48396] text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              New Design
            </span>
          )}
        </div>

        {/* Favorite & Quick View Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onToggleFavorite && (
            <button
              id={`fav-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorited 
                  ? 'bg-[#d48396] text-white' 
                  : 'bg-black/60 text-[#d4d4d8] hover:bg-black/80 hover:text-white border border-white/10'
              }`}
              title="Save favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          )}

          <button
            id={`quickview-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-[#d4d4d8] hover:bg-black/80 hover:text-[#c5a059] transition-all shadow-sm border border-white/10"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Category & Lead time tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-[#e4e4e7] text-[10px] px-2.5 py-0.5 rounded-full font-medium border border-white/10">
          Ready in {product.leadTime}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Title */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]"></span>
              <span className="text-[11px] text-[#52B788] font-semibold">Available</span>
            </div>
          </div>

          <h3 
            onClick={() => onOpenDetails(product)}
            className="font-serif text-lg font-bold text-[#fdfcfb] hover:text-[#c5a059] cursor-pointer transition-colors leading-tight"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#a1a1aa] mt-1.5 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color previews */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#71717a] font-medium mr-1">Colors:</span>
            {product.availableColors.slice(0, 3).map((col, idx) => (
              <span 
                key={idx} 
                className="text-[10px] bg-[#1c1c22] text-[#d4d4d8] px-2 py-0.5 rounded-md font-medium border border-[#2e2e38]"
              >
                {col}
              </span>
            ))}
            {product.availableColors.length > 3 && (
              <span className="text-[10px] text-[#c5a059] font-semibold">
                +{product.availableColors.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-[#27272a]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-bold font-serif text-[#fdfcfb]">
                {formatPrice(product.priceUSD, currency, businessInfo.currencyRates)}
              </span>
              {currency !== 'USD' && (
                <span className="text-xs text-[#71717a] ml-1.5 font-sans">
                  (${product.priceUSD} USD)
                </span>
              )}
            </div>
            {product.originalPriceUSD && (
              <span className="text-xs text-[#71717a] line-through">
                ${product.originalPriceUSD} USD
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              id={`whatsapp-order-btn-${product.id}`}
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="py-2.5 px-3 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#0c0c0c]" />
              <span>+ Add Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
