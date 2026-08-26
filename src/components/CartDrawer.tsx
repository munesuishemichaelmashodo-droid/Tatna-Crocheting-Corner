import React from 'react';
import { CartItem, BusinessInfo } from '../types';
import { CurrencyCode, formatPrice } from '../utils/currency';
import { createCartOrderWhatsAppUrl } from '../utils/whatsapp';
import { X, Trash2, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
  onGoToQuote: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  setCartItems,
  businessInfo,
  currency,
  onGoToQuote,
}) => {
  if (!isOpen) return null;

  const totalUSD = cartItems.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);

  const handleRemove = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(prev => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const whatsAppUrl = createCartOrderWhatsAppUrl(
    cartItems,
    businessInfo.primaryPhone,
    '',
    'Marondera, Zimbabwe'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#141416] h-full shadow-2xl flex flex-col justify-between p-6 overflow-hidden border-l border-[#27272a]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
            <h3 className="font-serif font-bold text-lg text-[#fdfcfb]">
              Order Inquiry Bag ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fdfcfb] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#18181b] text-[#c5a059] flex items-center justify-center mx-auto border border-[#27272a]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#fdfcfb]">Your inquiry bag is empty</p>
              <p className="text-xs text-[#a1a1aa] font-light">Browse the lookbook and click &ldquo;+ Add Quote&rdquo; to add items.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#18181b] rounded-2xl border border-[#27272a] shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-[#fdfcfb] truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-[#a1a1aa] block">Color: {item.selectedColor}</span>
                    <span className="text-xs font-bold text-[#c5a059] block mt-0.5">
                      ${item.product.priceUSD * item.quantity} USD
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#27272a] rounded-lg bg-[#141416]">
                    <button
                      onClick={() => handleUpdateQty(idx, item.quantity - 1)}
                      className="px-2 py-0.5 text-xs font-bold text-[#a1a1aa] hover:text-[#fdfcfb]"
                    >
                      -
                    </button>
                    <span className="px-1.5 text-xs font-semibold text-[#fdfcfb]">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(idx, item.quantity + 1)}
                      className="px-2 py-0.5 text-xs font-bold text-[#a1a1aa] hover:text-[#fdfcfb]"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(idx)}
                    className="p-1 text-[#e06c75] hover:bg-[#e06c75]/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#27272a] pt-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#a1a1aa]">Total Estimate:</span>
              <span className="text-xl font-serif font-bold text-[#c5a059]">
                {formatPrice(totalUSD, currency, businessInfo.currencyRates)}
              </span>
            </div>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Order to Tatna on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onGoToQuote();
              }}
              className="w-full py-2.5 rounded-2xl bg-[#1e1e24] hover:bg-[#26262d] border border-[#27272a] text-[#fdfcfb] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Customize Harare Delivery Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
