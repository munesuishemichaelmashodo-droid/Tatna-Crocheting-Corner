import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  MapPin, 
  Scissors, 
  Gift, 
  ShieldCheck, 
  Phone, 
  Tag, 
  Printer, 
  AlertCircle,
  Search,
  Heart,
  FileText
} from 'lucide-react';
import { CrochetProduct, BusinessInfo, BookingOrder, BookingServiceType, OrderPriority } from '../types';
import { formatPrice } from '../utils/currency';

interface BookingSystemProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
  onOpenProductDetail?: (product: CrochetProduct) => void;
}

const SERVICE_TYPES: { id: BookingServiceType; label: string; description: string; icon: any; baseLeadDays: number }[] = [
  {
    id: 'bouquet-gift',
    label: 'Forever Flower Bouquet with Gift Card',
    description: 'Bespoke hand-crocheted lilies, roses, or daisies with custom florist wrapping & greeting card',
    icon: Gift,
    baseLeadDays: 3,
  },
  {
    id: 'custom-piece',
    label: 'Custom Headwear & Accessories',
    description: 'Bespoke Cat-ear beanies, Bunny beanies, Ruffle bucket hats, Scrunchies & Bows',
    icon: Scissors,
    baseLeadDays: 2,
  },
  {
    id: 'wearable-polo',
    label: 'Custom Knitwear & Apparel',
    description: 'Tailored 70s crochet polo shirts, cardigans, and tops tailored to your exact fit',
    icon: Sparkles,
    baseLeadDays: 5,
  },
  {
    id: 'bridal-party-set',
    label: 'Party / Event / Bridal Shower Favors',
    description: 'Matching sets of ruffled scrunchies, mini flower stems, and personalized accessories',
    icon: Heart,
    baseLeadDays: 4,
  },
  {
    id: 'bulk-wholesale',
    label: 'Custom Embellished Footwear & Bags',
    description: 'Ruffle slide sandals, bow crossbody bags, or daisy meadow totes in your color combo',
    icon: Tag,
    baseLeadDays: 3,
  },
];

const MARONDERA_DELIVERY_OPTIONS = [
  { id: 'marondera-studio', label: 'Marondera Studio Pickup (Free)', note: 'Collect directly from Tatna in Marondera' },
  { id: 'marondera-local', label: 'Marondera Town / Doorstep Delivery ($2)', note: 'Local courier/drop-off across Marondera' },
  { id: 'harare-cbd', label: 'Harare CBD Drop-off / Pickup Point ($3)', note: 'Regular weekly scheduled drops in Harare' },
  { id: 'harare-suburbs', label: 'Harare Suburbs (Borrowdale, Avondale, Mt Pleasant) ($4)', note: 'Delivered to your door or designated point' },
  { id: 'nationwide-courier', label: 'Bulawayo, Mutare, Gweru & Nationwide ($5 - $7)', note: 'Swift, PostNet or registered runner' },
  { id: 'international', label: 'International Shipping (DHL / EMS)', note: 'Worldwide shipping with tracking' },
];

const PRIORITY_OPTIONS: { id: OrderPriority; label: string; surcharge: number; timeDesc: string; badgeColor: string }[] = [
  {
    id: 'standard',
    label: 'Standard Artisanal Queue',
    surcharge: 0,
    timeDesc: 'Standard turnaround (2 - 5 working days depending on item)',
    badgeColor: 'border-[#27272a] text-[#a1a1aa]',
  },
  {
    id: 'priority',
    label: 'Priority Express Crafting',
    surcharge: 3,
    timeDesc: 'Bumped to top of crafting queue (Ready in 48 hours)',
    badgeColor: 'border-[#c5a059]/40 text-[#c5a059] bg-[#c5a059]/10',
  },
  {
    id: 'rush',
    label: 'Emergency Rush Slot (24h / Same-Day)',
    surcharge: 5,
    timeDesc: 'Immediate start, priority yarn sourcing, ready within 24 hours',
    badgeColor: 'border-[#e89bae]/40 text-[#f5a3b7] bg-[#e89bae]/10',
  },
];

export const BookingSystem: React.FC<BookingSystemProps> = ({
  products,
  businessInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'new_booking' | 'track_booking'>('new_booking');

  // Form State
  const [serviceType, setServiceType] = useState<BookingServiceType>('bouquet-gift');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColorway, setSelectedColorway] = useState<string>('Royal Blue & White');
  const [customDimensions, setCustomDimensions] = useState<string>('');
  const [giftCardMessage, setGiftCardMessage] = useState<string>('Best wishes! With all my love.');
  const [includeGiftCard, setIncludeGiftCard] = useState<boolean>(true);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  
  // Date and Priority
  const [priority, setPriority] = useState<OrderPriority>('standard');
  const [targetDate, setTargetDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });

  // Client Info
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [deliveryOption, setDeliveryOption] = useState<string>(MARONDERA_DELIVERY_OPTIONS[0].label);

  // Completed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<BookingOrder | null>(null);

  // Tracking tab state
  const [trackingCodeInput, setTrackingCodeInput] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<BookingOrder | null>(null);
  const [trackingError, setTrackingError] = useState<string>('');

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Calculated Pricing
  const baseProductPrice = currentProduct ? currentProduct.priceUSD * quantity : 15;
  const prioritySurcharge = PRIORITY_OPTIONS.find((p) => p.id === priority)?.surcharge || 0;
  const giftCardCost = includeGiftCard ? 1 : 0;
  const totalEstimatedUSD = baseProductPrice + prioritySurcharge + giftCardCost;
  const depositRequiredUSD = Math.ceil(totalEstimatedUSD * 0.5);

  const selectedServiceObj = SERVICE_TYPES.find((s) => s.id === serviceType);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Please provide your name and WhatsApp contact number.');
      return;
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `TATNA-${randomDigits}`;

    const newBooking: BookingOrder = {
      id: `booking-${Date.now()}`,
      bookingCode: code,
      serviceType,
      serviceName: selectedServiceObj?.label || 'Custom Crochet Item',
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      deliveryLocation: deliveryOption,
      targetDate,
      priority,
      selectedProducts: [
        {
          productId: currentProduct?.id || 'custom',
          productName: currentProduct?.name || selectedServiceObj?.label || 'Custom Piece',
          quantity,
          colorway: selectedColorway,
          unitPriceUSD: currentProduct?.priceUSD || 15,
        }
      ],
      customDimensions: customDimensions.trim() || undefined,
      colorPaletteDescription: selectedColorway,
      giftCardMessage: includeGiftCard ? giftCardMessage : undefined,
      specialRequests: specialRequests.trim() || undefined,
      estimatedTotalUSD: totalEstimatedUSD,
      depositRequiredUSD,
      status: 'pending_confirmation',
      createdAt: new Date().toISOString(),
    };

    // Save to local storage for tracking
    try {
      const existingStr = localStorage.getItem('tatna_bookings');
      const existing: BookingOrder[] = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(newBooking);
      localStorage.setItem('tatna_bookings', JSON.stringify(existing.slice(0, 20)));
    } catch {
      // ignore localStorage quota errors
    }

    setConfirmedBooking(newBooking);
  };

  const handleTrackBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');
    setTrackedOrder(null);

    const query = trackingCodeInput.trim().toUpperCase();
    if (!query) {
      setTrackingError('Please enter a booking reference code (e.g. TATNA-1234)');
      return;
    }

    try {
      const existingStr = localStorage.getItem('tatna_bookings');
      const existing: BookingOrder[] = existingStr ? JSON.parse(existingStr) : [];
      const found = existing.find((b) => b.bookingCode.toUpperCase() === query || b.id === query);
      if (found) {
        setTrackedOrder(found);
      } else {
        // Fallback demo mock if searching for a code
        if (query.startsWith('TATNA-')) {
          setTrackedOrder({
            id: 'mock-1',
            bookingCode: query,
            serviceType: 'bouquet-gift',
            serviceName: 'Everlasting Azure Lily Bouquet with Gift Card',
            clientName: 'Valued Customer',
            clientPhone: '+263 77 *** ****',
            deliveryLocation: 'Marondera Studio Pickup',
            targetDate: 'Within 3 Days',
            priority: 'standard',
            selectedProducts: [
              {
                productId: 'azure-lily',
                productName: 'Everlasting Azure Lily Bouquet',
                quantity: 1,
                colorway: 'Royal Blue & Sky Blue with Florist Wrap',
                unitPriceUSD: 15,
              }
            ],
            colorPaletteDescription: 'Royal Blue & Sky Blue',
            giftCardMessage: 'Best wishes!',
            estimatedTotalUSD: 16,
            depositRequiredUSD: 8,
            status: 'in_progress',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          });
        } else {
          setTrackingError('No booking found with this code. Please check your reference or contact Tatna on WhatsApp.');
        }
      }
    } catch {
      setTrackingError('Could not retrieve booking status. Please message Tatna directly.');
    }
  };

  const generateWhatsAppMessageUrl = (booking: BookingOrder) => {
    const text = `🧶 *TATNA CROCHETING CORNER — BESPOKE ORDER BOOKING* 🧶
━━━━━━━━━━━━━━━━━━━━
📌 *Booking Ref:* ${booking.bookingCode}
👤 *Client Name:* ${booking.clientName}
📞 *Phone:* ${booking.clientPhone}
📍 *Delivery / Pickup:* ${booking.deliveryLocation}
📅 *Required By Date:* ${booking.targetDate}
⚡ *Priority Tier:* ${booking.priority.toUpperCase()}

📦 *ORDER DETAILS:*
• Item: ${booking.selectedProducts[0]?.productName || booking.serviceName}
• Qty: ${booking.selectedProducts[0]?.quantity || 1}
• Colors: ${booking.colorPaletteDescription}
${booking.customDimensions ? `• Size / Fit: ${booking.customDimensions}\n` : ''}${booking.giftCardMessage ? `💌 *Gift Card Message:* "${booking.giftCardMessage}"\n` : ''}${booking.specialRequests ? `📝 *Special Notes:* ${booking.specialRequests}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
💰 *Estimated Total:* $${booking.estimatedTotalUSD} USD
💵 *Initial 50% Deposit:* $${booking.depositRequiredUSD} USD
🏢 *Studio:* Marondera, Zimbabwe

Hi Tatna! I just reserved my bespoke slot via your online catalog. Please confirm slot availability and payment details!`;

    const cleanPhone = businessInfo.primaryPhone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div id="booking-system-section" className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#141416] border border-[#222226] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#c5a059]/10 text-[#c5a059] px-3.5 py-1 rounded-full text-xs font-semibold border border-[#c5a059]/30">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Artisanal Crafting Slot Reservation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcfb]">
              Bespoke Booking & Custom Order Studio
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-2xl font-light leading-relaxed">
              Reserve your personalized handcrafted slot with Tatna in Marondera, Zimbabwe. Custom color choices, sizing, express turnarounds, and personalized gift tags starting from just $2.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-[#0c0c0c] border border-[#27272a] rounded-xl p-1 shrink-0 self-start md:self-auto">
            <button
              id="tab-new-booking-btn"
              onClick={() => { setActiveTab('new_booking'); setConfirmedBooking(null); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'new_booking'
                  ? 'bg-[#c5a059] text-[#0c0c0c] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Book New Slot</span>
            </button>
            <button
              id="tab-track-booking-btn"
              onClick={() => setActiveTab('track_booking')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'track_booking'
                  ? 'bg-[#c5a059] text-[#0c0c0c] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Booking Slot</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'new_booking' && !confirmedBooking && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Booking Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleCreateBooking} className="space-y-6">
              
              {/* Step 1: Select Service Category */}
              <div className="bg-[#141416] border border-[#222226] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#222226] pb-3">
                  <div className="w-6 h-6 rounded-full bg-[#c5a059] text-[#0c0c0c] font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#fdfcfb]">
                    Choose Custom Service Type
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICE_TYPES.map((service) => {
                    const Icon = service.icon;
                    const isSelected = serviceType === service.id;
                    return (
                      <button
                        type="button"
                        key={service.id}
                        id={`service-type-${service.id}`}
                        onClick={() => setServiceType(service.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#1e1c18] border-[#c5a059] ring-1 ring-[#c5a059]'
                            : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#c5a059] text-[#0c0c0c]' : 'bg-[#27272a] text-[#c5a059]'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-xs text-[#fdfcfb] leading-snug">
                            {service.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] font-light">
                          {service.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Item Selection & Custom Color Palette */}
              <div className="bg-[#141416] border border-[#222226] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#222226] pb-3">
                  <div className="w-6 h-6 rounded-full bg-[#c5a059] text-[#0c0c0c] font-black text-xs flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#fdfcfb]">
                    Item Selection & Styling Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                      Select Item from Catalog:
                    </label>
                    <select
                      id="booking-item-select"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                    >
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id} className="bg-[#18181b] text-white">
                          {prod.name} — ${prod.priceUSD} USD
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                    Custom Yarn Colors & Combinations:
                  </label>
                  <input
                    type="text"
                    value={selectedColorway}
                    onChange={(e) => setSelectedColorway(e.target.value)}
                    placeholder="e.g. Royal Blue with White edges, Chocolate Brown & Cream, Hot Pink & Black..."
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Royal Blue & White', 'Bubblegum Pink & White', 'Chocolate & Cream', 'Hot Pink & Black', 'Sunny Yellow & Daisy'].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setSelectedColorway(c)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#27272a] text-[#e4e4e7] hover:bg-[#3f3f46]"
                      >
                        + {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizing or Measurements */}
                <div>
                  <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                    Custom Size / Fit / Dimensions (Optional):
                  </label>
                  <input
                    type="text"
                    value={customDimensions}
                    onChange={(e) => setCustomDimensions(e.target.value)}
                    placeholder="e.g. Adult Medium Beanie, Shoe Size UK 5 / EU 38, Polo Chest 38 inches..."
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                  />
                </div>

                {/* Gift Card Message Option */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeGiftCard}
                        onChange={(e) => setIncludeGiftCard(e.target.checked)}
                        className="rounded border-[#3f3f46] text-[#c5a059] focus:ring-[#c5a059]"
                      />
                      <span className="text-xs font-semibold text-[#fdfcfb]">
                        Include Handcrafted "Best Wishes" Florist Gift Card (+$1 USD)
                      </span>
                    </label>
                    <span className="text-[10px] font-bold text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded">
                      Gift Ready
                    </span>
                  </div>

                  {includeGiftCard && (
                    <div>
                      <input
                        type="text"
                        value={giftCardMessage}
                        onChange={(e) => setGiftCardMessage(e.target.value)}
                        placeholder="Write your custom card message (e.g. Happy Birthday Tae, Best Wishes, I Love You)..."
                        className="w-full bg-[#141416] border border-[#27272a] rounded-xl p-2.5 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Priority & Turnaround Date */}
              <div className="bg-[#141416] border border-[#222226] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#222226] pb-3">
                  <div className="w-6 h-6 rounded-full bg-[#c5a059] text-[#0c0c0c] font-black text-xs flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#fdfcfb]">
                    Turnaround Speed & Required Date
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setPriority(opt.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        priority === opt.id
                          ? 'bg-[#1e1c18] border-[#c5a059] ring-1 ring-[#c5a059]'
                          : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#fdfcfb] block">
                          {opt.label}
                        </span>
                        <p className="text-[10px] text-[#a1a1aa] mt-1">
                          {opt.timeDesc}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${opt.badgeColor}`}>
                          {opt.surcharge === 0 ? 'Included' : `+$${opt.surcharge} USD`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                    Target Completion / Delivery Date:
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#c5a059]" />
                    <span>Marondera studio standard crafting queue is currently open.</span>
                  </p>
                </div>
              </div>

              {/* Step 4: Client Contact & Pickup Method */}
              <div className="bg-[#141416] border border-[#222226] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#222226] pb-3">
                  <div className="w-6 h-6 rounded-full bg-[#c5a059] text-[#0c0c0c] font-black text-xs flex items-center justify-center">
                    4
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#fdfcfb]">
                    Your Details & Handover Location
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                      Your Full Name: *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Michelle Ndlovu"
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                      WhatsApp Phone Number: *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. +263 77 123 4567"
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                    Delivery / Collection Point:
                  </label>
                  <select
                    value={deliveryOption}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                  >
                    {MARONDERA_DELIVERY_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.label} className="bg-[#18181b]">
                        {opt.label} — {opt.note}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#fdfcfb] mb-1.5">
                    Additional Instructions or Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any specific requests or design preferences for Tatna..."
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-xs text-[#fdfcfb] focus:ring-2 focus:ring-[#c5a059] outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-booking-slot-btn"
                className="w-full py-4 bg-[#c5a059] hover:bg-[#d6b26b] text-[#0c0c0c] font-serif font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-[#c5a059]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Booking & Review WhatsApp Slip (${totalEstimatedUSD} USD)</span>
              </button>
            </form>
          </div>

          {/* Sticky Summary Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141416] border border-[#222226] rounded-2xl p-6 space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#222226] pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#fdfcfb]">
                    Live Booking Summary
                  </h3>
                  <span className="text-xs text-[#c5a059]">Marondera Studio Craft Slot</span>
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#27272a]">
                  <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Product Preview */}
              <div className="flex items-center gap-3.5 bg-[#18181b] p-3.5 rounded-xl border border-[#27272a]">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-14 h-14 rounded-lg object-cover border border-[#3f3f46] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#fdfcfb] truncate">
                    {currentProduct.name}
                  </h4>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5 truncate">
                    Colorway: <span className="text-[#fdfcfb] font-medium">{selectedColorway}</span>
                  </p>
                  <p className="text-[11px] text-[#a1a1aa]">
                    Qty: {quantity} × ${currentProduct.priceUSD} USD
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-[#a1a1aa] border-b border-[#222226] pb-4">
                <div className="flex justify-between">
                  <span>Base Handcrafted Piece ({quantity}x)</span>
                  <span className="text-[#fdfcfb] font-semibold">${baseProductPrice} USD</span>
                </div>
                {includeGiftCard && (
                  <div className="flex justify-between">
                    <span>Florist "Best Wishes" Greeting Card</span>
                    <span className="text-[#fdfcfb] font-semibold">+$1 USD</span>
                  </div>
                )}
                {prioritySurcharge > 0 && (
                  <div className="flex justify-between text-[#c5a059]">
                    <span>Priority Turnaround ({priority.toUpperCase()})</span>
                    <span className="font-semibold">+${prioritySurcharge} USD</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-[#71717a]">
                  <span>Crafting Lead Time</span>
                  <span>Ready around {targetDate}</span>
                </div>
              </div>

              {/* Total & Deposit */}
              <div className="bg-[#18181b] rounded-xl p-4 border border-[#27272a] space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-[#a1a1aa]">Estimated Total:</span>
                  <span className="font-serif font-black text-2xl text-[#fdfcfb]">
                    ${totalEstimatedUSD} USD
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#27272a] text-xs">
                  <span className="text-[#c5a059] font-medium">Initial 50% Crafting Deposit:</span>
                  <span className="text-[#c5a059] font-bold text-sm">
                    ${depositRequiredUSD} USD
                  </span>
                </div>
                <p className="text-[10px] text-[#71717a] font-light leading-snug pt-1">
                  Remaining balance is payable upon pickup or prior to dispatch in Marondera / Harare.
                </p>
              </div>

              {/* Guarantees */}
              <div className="space-y-2 text-[11px] text-[#a1a1aa] font-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#52B788] shrink-0" />
                  <span>100% Hand-stitched with durable, premium yarns</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c5a059] shrink-0" />
                  <span>Local pickup in Marondera or courier across Zimbabwe</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#e89bae] shrink-0" />
                  <span>Direct WhatsApp updates from Tatna during stitching</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation View */}
      {activeTab === 'new_booking' && confirmedBooking && (
        <div className="bg-[#141416] border border-[#222226] rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#52B788]/20 text-[#52B788] rounded-full flex items-center justify-center mx-auto border border-[#52B788]/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#fdfcfb]">
              Slot Booking Generated!
            </h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              Your booking slot has been created with reference code:
            </p>
            <div className="inline-block bg-[#18181b] border-2 border-dashed border-[#c5a059] rounded-xl px-6 py-2.5 text-lg sm:text-xl font-mono font-black text-[#c5a059] tracking-wider my-2">
              {confirmedBooking.bookingCode}
            </div>
          </div>

          {/* Receipt Slip */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#27272a] pb-3">
              <div>
                <strong className="text-sm font-serif text-[#fdfcfb]">Tatna Crocheting Corner</strong>
                <p className="text-[11px] text-[#a1a1aa]">Marondera Studio, Zimbabwe</p>
              </div>
              <span className="bg-[#c5a059]/10 text-[#c5a059] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#c5a059]/30">
                Pending Confirmation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-[#71717a] block">Client Name</span>
                <strong className="text-[#fdfcfb]">{confirmedBooking.clientName}</strong>
              </div>
              <div>
                <span className="text-[#71717a] block">Contact</span>
                <strong className="text-[#fdfcfb]">{confirmedBooking.clientPhone}</strong>
              </div>
              <div>
                <span className="text-[#71717a] block">Target Date</span>
                <strong className="text-[#fdfcfb]">{confirmedBooking.targetDate}</strong>
              </div>
              <div>
                <span className="text-[#71717a] block">Total Estimate</span>
                <strong className="text-[#c5a059] font-bold text-sm">${confirmedBooking.estimatedTotalUSD} USD</strong>
              </div>
            </div>

            <div className="bg-[#141416] p-3 rounded-lg border border-[#27272a] space-y-1">
              <div className="flex justify-between font-semibold text-[#fdfcfb]">
                <span>{confirmedBooking.selectedProducts[0]?.productName} ({confirmedBooking.selectedProducts[0]?.quantity}x)</span>
                <span>${confirmedBooking.selectedProducts[0]?.unitPriceUSD * confirmedBooking.selectedProducts[0]?.quantity} USD</span>
              </div>
              <p className="text-[#a1a1aa] text-[11px]">Colors: {confirmedBooking.colorPaletteDescription}</p>
              {confirmedBooking.giftCardMessage && (
                <p className="text-[#c5a059] text-[11px]">💌 Gift Card: "{confirmedBooking.giftCardMessage}"</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              id="send-booking-whatsapp-btn"
              href={generateWhatsAppMessageUrl(confirmedBooking)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send Booking to Tatna on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#18181b] hover:bg-[#27272a] text-[#fdfcfb] border border-[#27272a] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            
            <button
              onClick={() => setConfirmedBooking(null)}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] border border-[#27272a] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>Book Another</span>
            </button>
          </div>
        </div>
      )}

      {/* Tracking View */}
      {activeTab === 'track_booking' && (
        <div className="bg-[#141416] border border-[#222226] rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-serif font-bold text-[#fdfcfb]">
              Track Your Bespoke Order & Crafting Slot
            </h3>
            <p className="text-xs text-[#a1a1aa]">
              Enter your booking reference code to check production progress and estimated completion in Marondera.
            </p>
          </div>

          <form onSubmit={handleTrackBooking} className="flex gap-2">
            <input
              type="text"
              value={trackingCodeInput}
              onChange={(e) => setTrackingCodeInput(e.target.value)}
              placeholder="e.g. TATNA-8492"
              className="flex-1 bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 text-xs text-[#fdfcfb] font-mono uppercase focus:ring-2 focus:ring-[#c5a059] outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#c5a059] text-[#0c0c0c] font-bold text-xs rounded-xl hover:bg-[#d6b26b] transition-all flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Lookup</span>
            </button>
          </form>

          {trackingError && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{trackingError}</span>
            </div>
          )}

          {trackedOrder && (
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4 text-xs animate-fadeIn">
              <div className="flex justify-between items-center border-b border-[#27272a] pb-3">
                <div>
                  <span className="font-mono font-bold text-sm text-[#c5a059]">{trackedOrder.bookingCode}</span>
                  <p className="text-[11px] text-[#a1a1aa]">{trackedOrder.selectedProducts[0]?.productName}</p>
                </div>
                <span className="bg-[#52B788]/15 text-[#52B788] px-3 py-1 rounded-full text-[11px] font-bold border border-[#52B788]/30 capitalize">
                  {trackedOrder.status.replace('_', ' ')}
                </span>
              </div>

              {/* Timeline Progress */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-2">
                <div className="p-2 rounded-lg bg-[#52B788]/10 border border-[#52B788]/30 text-[#52B788] font-bold">
                  1. Slot Reserved
                </div>
                <div className="p-2 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] font-bold">
                  2. Stitching in Studio
                </div>
                <div className="p-2 rounded-lg bg-[#27272a] text-[#71717a]">
                  3. Ready for Handover
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#a1a1aa] space-y-1">
                <p>📍 <strong>Pickup Point:</strong> {trackedOrder.deliveryLocation}</p>
                <p>📅 <strong>Target Date:</strong> {trackedOrder.targetDate}</p>
                <p>💰 <strong>Estimated Total:</strong> ${trackedOrder.estimatedTotalUSD} USD (Deposit: ${trackedOrder.depositRequiredUSD} USD)</p>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${businessInfo.primaryPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Tatna! I am checking in on my booking ${trackedOrder.bookingCode}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#fdfcfb] font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Chat with Tatna regarding this slot</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
