import React, { useState } from 'react';
import { CrochetProduct, BusinessInfo, CartItem } from '../types';
import { CurrencyCode, formatPrice } from '../utils/currency';
import { createCartOrderWhatsAppUrl } from '../utils/whatsapp';
import { 
  FileText, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Calculator, 
  MapPin, 
  Check, 
  Sparkles, 
  Truck,
  Phone
} from 'lucide-react';

interface QuoteBuilderProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const MARONDERA_LOCATIONS = [
  'Marondera / Studio Pick up',
  'Marondera Central & Surrounding',
  'Harare CBD / Pick-up points',
  'Harare (Borrowdale, Avondale, Mt Pleasant, Eastlea)',
  'Chitungwiza / Ruwa / Norton',
  'Bulawayo (Courier / Runner)',
  'Mutare (Courier)',
  'Gweru / Kwekwe / Masvingo',
  'Nationwide Zimbabwe Courier (Swift / PostNet)',
  'International Shipping (DHL / EMS)',
  'Other / Custom Delivery',
];

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  products,
  businessInfo,
  currency,
  cartItems,
  setCartItems,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedColor, setSelectedColor] = useState<string>(products[0]?.availableColors[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState<string>(MARONDERA_LOCATIONS[0]);
  const [customNotes, setCustomNotes] = useState<string>('');

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod && prod.availableColors.length > 0) {
      setSelectedColor(prod.availableColors[0]);
    }
  };

  const handleAddItem = () => {
    if (!currentProduct) return;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === currentProduct.id && item.selectedColor === selectedColor
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product: currentProduct,
            quantity,
            selectedColor,
            customNotes,
          },
        ];
      }
    });

    setCustomNotes('');
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const totalUSD = cartItems.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);

  const whatsAppOrderUrl = createCartOrderWhatsAppUrl(
    cartItems,
    businessInfo.primaryPhone,
    customerName,
    deliveryLocation,
    customNotes
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-[#141416] p-6 sm:p-8 rounded-3xl border border-[#27272a] shadow-lg">
        <div className="inline-flex items-center gap-1.5 bg-[#1e1e24] text-[#c5a059] px-3 py-1 rounded-full text-xs font-bold mb-2 border border-[#27272a]">
          <Calculator className="w-3.5 h-3.5" />
          <span>Real-time Order & Price Estimator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcfb]">
          Custom Order & Instant Quote Calculator
        </h2>
        <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1 font-light">
          Select multiple handcrafted crochet pieces, choose custom color combinations, set your Marondera, Harare, or Zimbabwe delivery area, and send directly to Tatna on WhatsApp with one click!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Item Picker & Configuration */}
        <div className="lg:col-span-6 bg-[#141416] p-6 sm:p-7 rounded-3xl border border-[#27272a] shadow-lg space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#c5a059]" /> 1. Select & Customize Item
          </h3>

          {/* Product Select */}
          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5">Crochet Design</label>
            <select
              id="quote-product-select"
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full text-xs p-3 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] font-medium text-[#fdfcfb] outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#18181b] text-[#fdfcfb]">
                  {p.name} — ${p.priceUSD} USD
                </option>
              ))}
            </select>
          </div>

          {/* Selected Product Preview Card */}
          {currentProduct && (
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#18181b] border border-[#27272a]">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#27272a]"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#c5a059] block tracking-wide">
                  {currentProduct.category}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#fdfcfb] truncate">
                  {currentProduct.name}
                </h4>
                <div className="text-xs font-bold text-[#c5a059] mt-0.5">
                  {formatPrice(currentProduct.priceUSD, currency, businessInfo.currencyRates)}
                  <span className="text-[10px] text-[#a1a1aa] ml-1 font-normal">
                    (Ready in {currentProduct.leadTime})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Color choice */}
          {currentProduct && (
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5">Colorway</label>
              <div className="flex flex-wrap gap-1.5">
                {currentProduct.availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
                      selectedColor === color
                        ? 'bg-[#c5a059] text-[#0c0c0c] font-bold shadow-md'
                        : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a] hover:bg-[#202026] hover:text-[#fdfcfb]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-[#a1a1aa]">Quantity</span>
            <div className="flex items-center border border-[#27272a] rounded-xl bg-[#18181b]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-sm font-bold text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#27272a] rounded-l-xl transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1 text-xs font-bold text-[#fdfcfb]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-sm font-bold text-[#a1a1aa] hover:text-[#fdfcfb] hover:bg-[#27272a] rounded-r-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button
            id="quote-add-item-btn"
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add this Item to Quote</span>
          </button>
        </div>

        {/* Right: Order Summary & WhatsApp Submission */}
        <div className="lg:col-span-6 bg-[#141416] p-6 sm:p-7 rounded-3xl border border-[#27272a] shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c5a059]" /> 2. Order Summary ({cartItems.length} items)
              </h3>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCartItems([])}
                  className="text-[11px] text-[#e06c75] hover:underline font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Item list */}
            {cartItems.length === 0 ? (
              <div className="py-8 text-center bg-[#18181b] rounded-2xl border border-dashed border-[#27272a] p-4">
                <p className="text-xs text-[#a1a1aa]">Your quote is currently empty.</p>
                <p className="text-[11px] text-[#71717a] mt-1 font-light">Select an item on the left and click &ldquo;Add this Item to Quote&rdquo;.</p>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#18181b] border border-[#27272a]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#27272a]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <h5 className="text-xs font-bold text-[#fdfcfb] truncate">
                          {item.product.name}
                        </h5>
                        <span className="text-[10px] text-[#a1a1aa] block">
                          Color: {item.selectedColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-[#27272a] rounded-lg bg-[#141416]">
                        <button
                          onClick={() => handleUpdateQty(idx, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#a1a1aa] hover:text-[#fdfcfb]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#fdfcfb]">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(idx, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#a1a1aa] hover:text-[#fdfcfb]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#c5a059] min-w-[50px] text-right">
                        ${item.product.priceUSD * item.quantity}
                      </span>

                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-[#e06c75] hover:bg-[#e06c75]/20 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Customer Name & Location info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g., Tendai / Chipo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] outline-none text-[#fdfcfb]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#c5a059]" /> Delivery Area
                </label>
                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] outline-none text-[#fdfcfb]"
                >
                  {MARONDERA_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#18181b] text-[#fdfcfb]">{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                Custom Stitch / Sizing / Specific Requests (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g., I need the bunny beanie in black & red for a birthday gift next Friday..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] outline-none resize-none text-[#fdfcfb]"
              />
            </div>
          </div>

          {/* Pricing Total & WhatsApp Order Button */}
          <div className="pt-4 border-t border-[#27272a] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#a1a1aa] block">Estimated Total:</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#c5a059]">
                  {formatPrice(totalUSD, currency, businessInfo.currencyRates)}
                </span>
                {currency !== 'USD' && (
                  <span className="text-xs text-[#a1a1aa] ml-2">(${totalUSD} USD)</span>
                )}
              </div>
              <span className="text-[11px] text-[#52B788] font-semibold bg-[#52B788]/15 border border-[#52B788]/30 px-2.5 py-1 rounded-full">
                ✓ Free consultation
              </span>
            </div>

            <a
              id="send-whatsapp-order-btn"
              href={cartItems.length > 0 ? whatsAppOrderUrl : '#'}
              target={cartItems.length > 0 ? '_blank' : '_self'}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (cartItems.length === 0) {
                  e.preventDefault();
                  alert('Please add at least one item to your quote first!');
                }
              }}
              className={`w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                cartItems.length > 0
                  ? 'bg-[#25D366] hover:bg-[#20BA5A] hover:shadow-lg cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Custom Order via WhatsApp to Tatna</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
