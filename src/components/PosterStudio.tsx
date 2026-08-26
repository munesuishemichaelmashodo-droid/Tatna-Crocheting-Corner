import React, { useState } from 'react';
import { CrochetProduct, BusinessInfo, PosterTheme, PosterFormat, PosterSettings } from '../types';
import { BRAND_LOGO } from '../data/products';
import { 
  Printer, 
  Download, 
  Sparkles, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Check, 
  Copy, 
  Sliders, 
  Layout, 
  Palette, 
  QrCode,
  Tag,
  Eye
} from 'lucide-react';

interface PosterStudioProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
}

export const PosterStudio: React.FC<PosterStudioProps> = ({ products, businessInfo }) => {
  const [settings, setSettings] = useState<PosterSettings>({
    theme: 'editorial',
    format: 'a4',
    headline: 'Tatna Crocheting Corner',
    subheadline: 'Crochet with Tatna • Handcrafted Wear & Bespoke Gifts',
    announcement: 'All Items Available & Made to Order • Prices From $1 USD • Custom Colors Welcome 💕',
    showPrices: true,
    showQrCode: true,
    showPhones: true,
    showLocation: true,
    accentColor: '#C9A96E',
    selectedProductIds: products.map((p) => p.id),
  });

  const [copiedText, setCopiedText] = useState<boolean>(false);

  const selectedProducts = products.filter((p) => settings.selectedProductIds.includes(p.id));

  const handlePrint = () => {
    window.print();
  };

  const copyWhatsAppTextFlyer = () => {
    const text = `🌸 *TATNA CROCHETING CORNER* 🌸\n` +
      `✨ _Crochet with Tatna — Bespoke Handcrafted Wear & Gifts_\n\n` +
      `📌 *PRICE LIST / MENU:*\n` +
      selectedProducts.map(p => `• *${p.name}* — $${p.priceUSD} USD ✔`).join('\n') +
      `\n\n💕 *All available & custom colors made to order!*\n` +
      `📍 *Location:* ${businessInfo.location}\n\n` +
      `📞 *CONTACT / WHATSAPP:*\n` +
      businessInfo.phones.map(ph => `📲 ${ph}`).join('\n') +
      `\n\n_Send a message on WhatsApp to place your order today!_`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const toggleProduct = (id: string) => {
    setSettings(prev => ({
      ...prev,
      selectedProductIds: prev.selectedProductIds.includes(id)
        ? prev.selectedProductIds.filter(pid => pid !== id)
        : [...prev.selectedProductIds, id]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg no-print">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase block">
            Print & Social Media Suite
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fdfcfb]">
            Modern Poster & Flyer Studio
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1 font-light">
            Customize, print, or export modern, high-definition promo posters for Tatna&apos;s business.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="copy-whatsapp-text-btn"
            onClick={copyWhatsAppTextFlyer}
            className="px-4 py-2.5 rounded-xl bg-[#1a1a1e] hover:bg-[#26262b] text-[#fdfcfb] border border-[#27272a] hover:border-[#c5a059]/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            {copiedText ? <Check className="w-4 h-4 text-[#52B788]" /> : <Copy className="w-4 h-4 text-[#c5a059]" />}
            <span>{copiedText ? 'Copied WhatsApp Text!' : 'Copy WhatsApp Flyer'}</span>
          </button>

          <button
            id="print-poster-btn"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Printer className="w-4 h-4 text-[#0c0c0c]" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (Hidden on Print) */}
        <div className="lg:col-span-4 space-y-6 no-print">
          {/* Theme Selector */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#c5a059]" /> 1. Select Poster Aesthetic
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'editorial', label: 'Editorial Luxury', desc: 'Haute couture dark & gold' },
                { id: 'pastel', label: 'Pastel Chic', desc: 'Soft blush & floral warmth' },
                { id: 'streetwear', label: 'Modern Minimal', desc: 'Clean white & sharp typography' },
                { id: 'botanical', label: 'Warm Artisan', desc: 'Earthy terracotta & linen' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, theme: theme.id as PosterTheme })}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    settings.theme === theme.id
                      ? 'border-[#c5a059] bg-[#1e1e24] ring-1 ring-[#c5a059]'
                      : 'border-[#27272a] bg-[#18181b] hover:bg-[#202024]'
                  }`}
                >
                  <span className="block text-xs font-bold text-[#fdfcfb]">{theme.label}</span>
                  <span className="block text-[10px] text-[#a1a1aa] mt-0.5">{theme.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selector */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-[#c5a059]" /> 2. Poster Format
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'a4', label: 'A4 Flyer', sub: 'Print Poster' },
                { id: 'story', label: '9:16 Story', sub: 'WhatsApp Status' },
                { id: 'square', label: '1:1 Square', sub: 'Instagram Post' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, format: fmt.id as PosterFormat })}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    settings.format === fmt.id
                      ? 'border-[#c5a059] bg-[#c5a059] text-[#0c0c0c] shadow-md font-bold'
                      : 'border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:bg-[#202024]'
                  }`}
                >
                  <span className="block text-xs font-bold">{fmt.label}</span>
                  <span className={`block text-[9px] mt-0.5 ${settings.format === fmt.id ? 'text-[#0c0c0c]/80' : 'text-[#71717a]'}`}>
                    {fmt.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Inputs */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#c5a059]" /> 3. Poster Copy & Badges
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Headline</label>
              <input
                type="text"
                value={settings.headline}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] outline-none text-[#fdfcfb]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Sub-tagline</label>
              <input
                type="text"
                value={settings.subheadline}
                onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] outline-none text-[#fdfcfb]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Announcement Banner</label>
              <input
                type="text"
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] outline-none text-[#fdfcfb]"
              />
            </div>
          </div>

          {/* Products Included Toggle */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#c5a059]" /> 4. Items on Poster ({selectedProducts.length})
              </h3>
              <button
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  selectedProductIds: settings.selectedProductIds.length === products.length ? [] : products.map(p => p.id)
                })}
                className="text-[11px] text-[#c5a059] font-semibold hover:underline"
              >
                {settings.selectedProductIds.length === products.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {products.map((p) => {
                const isChecked = settings.selectedProductIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      isChecked ? 'bg-[#1e1e24] border-[#c5a059]/60' : 'bg-[#18181b] border-[#27272a] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProduct(p.id)}
                        className="rounded text-[#c5a059] focus:ring-[#c5a059] bg-[#141416] border-[#27272a]"
                      />
                      <span className="font-medium text-[#fdfcfb]">{p.name}</span>
                    </div>
                    <span className="font-bold text-[#c5a059]">${p.priceUSD}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Poster Preview Column */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-[#a1a1aa] no-print">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#c5a059]" /> Live HD Print & Display Canvas
            </span>
            <span className="font-medium bg-[#1a1a1e] px-2.5 py-1 rounded-full text-[#c5a059] border border-[#27272a]">
              Ready for Print & Social Export
            </span>
          </div>

          {/* Render Active Poster Frame */}
          <div 
            id="poster-render-target"
            className={`poster-print-surface transition-all duration-300 w-full rounded-3xl overflow-hidden shadow-2xl ${
              settings.format === 'story'
                ? 'max-w-[420px] aspect-[9/16]'
                : settings.format === 'square'
                ? 'max-w-[620px] aspect-square'
                : 'max-w-[780px] min-h-[920px]'
            }`}
          >
            {/* THEME 1: EDITORIAL LUXURY */}
            {settings.theme === 'editorial' && (
              <div className="w-full h-full bg-[#0c0c0c] text-[#fdfcfb] p-6 sm:p-9 flex flex-col justify-between relative border-4 border-[#c5a059]/40">
                {/* Decorative border frame */}
                <div className="absolute inset-3 border border-[#c5a059]/20 pointer-events-none rounded-2xl"></div>

                {/* Top Poster Header */}
                <div className="relative z-10 text-center pt-2">
                  <div className="inline-flex items-center gap-2 border-b border-[#c5a059]/40 pb-1 mb-2">
                    <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#c5a059] font-semibold">
                      Harare, Zimbabwe • Artisanal Collection
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#fdfcfb]">
                    {settings.headline}
                  </h1>

                  <p className="text-xs sm:text-sm text-[#a1a1aa] font-light italic mt-1 font-serif">
                    {settings.subheadline}
                  </p>

                  <div className="mt-3 inline-block bg-[#c5a059]/15 border border-[#c5a059]/40 px-4 py-1 rounded-full text-[11px] text-[#fdfcfb] tracking-wide font-medium">
                    {settings.announcement}
                  </div>
                </div>

                {/* Center Showcase Grid */}
                <div className="relative z-10 my-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {selectedProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#141416] rounded-2xl overflow-hidden border border-[#c5a059]/30 shadow-md flex flex-col justify-between group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#18181b]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-[#c5a059] text-[#0c0c0c] font-black text-xs px-2 py-0.5 rounded-md shadow-sm">
                          ${product.priceUSD}
                        </div>
                      </div>
                      <div className="p-2.5 text-center">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#fdfcfb] truncate">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-[#a1a1aa] block capitalize">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Footer Details */}
                <div className="relative z-10 pt-4 border-t border-[#c5a059]/30 bg-[#16161a]/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] text-[#c5a059] uppercase tracking-widest font-bold block">
                      Order & Inquiries
                    </span>
                    <div className="text-xs sm:text-sm font-semibold text-[#fdfcfb] mt-0.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      {businessInfo.phones.map((phone, i) => (
                        <span key={i} className="inline-flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#c5a059]" /> {phone}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#a1a1aa] flex items-center justify-center sm:justify-start gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#d48396]" /> {businessInfo.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#25D366]/20 border border-[#25D366]/40 px-3.5 py-1.5 rounded-xl">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider text-[#A8E6CF] font-bold block">
                        WhatsApp Active
                      </span>
                      <span className="text-xs font-bold text-white">Direct Orders</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* THEME 2: PASTEL BLUSH & ROSES */}
            {settings.theme === 'pastel' && (
              <div className="w-full h-full bg-[#1b1518] text-[#f7e8ec] p-6 sm:p-9 flex flex-col justify-between relative border-4 border-[#d48396]/50">
                {/* Header */}
                <div className="text-center pt-2">
                  <div className="inline-flex items-center gap-1.5 bg-[#d48396]/20 text-[#f5a3b7] px-3.5 py-1 rounded-full text-xs font-bold mb-2 border border-[#d48396]/40">
                    <Sparkles className="w-3.5 h-3.5" /> Made with Love in Marondera
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#f7e8ec] tracking-tight">
                    {settings.headline}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#d4a5b2] font-serif italic mt-1">
                    {settings.subheadline}
                  </p>
                  <div className="mt-3 inline-block bg-[#241a20] border border-[#d48396]/40 shadow-sm px-4 py-1 rounded-full text-xs text-[#f5a3b7] font-bold">
                    {settings.announcement}
                  </div>
                </div>

                {/* Grid */}
                <div className="my-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {selectedProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#241c21] rounded-2xl overflow-hidden border border-[#d48396]/30 shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-[#1a1418] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-[#d48396] text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow">
                          ${product.priceUSD}
                        </div>
                      </div>
                      <div className="p-2.5 text-center">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#f7e8ec] truncate">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-[#c49aa5] block">
                          Handmade to order
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#d48396]/30 bg-[#241c21] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f5a3b7] block">
                      Contact & Orders:
                    </span>
                    <div className="text-xs sm:text-sm font-bold text-[#f7e8ec] mt-0.5">
                      {businessInfo.phones.join(' • ')}
                    </div>
                    <span className="text-[11px] text-[#c49aa5] block mt-0.5">
                      📍 {businessInfo.location}
                    </span>
                  </div>

                  <div className="bg-[#25D366] text-white px-4 py-2 rounded-xl flex items-center gap-1.5 shadow">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-bold">WhatsApp Us</span>
                  </div>
                </div>
              </div>
            )}

            {/* THEME 3: MODERN MINIMAL */}
            {settings.theme === 'streetwear' && (
              <div className="w-full h-full bg-[#111113] text-[#fdfcfb] p-6 sm:p-9 flex flex-col justify-between relative border-4 border-[#333338]">
                {/* Top */}
                <div className="border-b-2 border-[#333338] pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] font-black uppercase text-[#c5a059] block">
                      Marondera, Zimbabwe / Knitwear
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#fdfcfb] tracking-tight">
                      {settings.headline}
                    </h1>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#c5a059] overflow-hidden hidden sm:block shrink-0">
                    <img src={BRAND_LOGO} alt="Tatna" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Sub */}
                <div className="py-2.5 bg-[#c5a059] text-[#0c0c0c] text-center text-xs font-black uppercase tracking-wider my-3 rounded-lg">
                  {settings.announcement}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 my-2">
                  {selectedProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#18181c] rounded-xl overflow-hidden border-2 border-[#333338] flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-[#141416]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 bg-[#c5a059] text-[#0c0c0c] text-xs font-black px-2 py-0.5 rounded">
                          ${product.priceUSD}
                        </span>
                      </div>
                      <div className="p-2 text-center bg-[#18181c] border-t-2 border-[#333338]">
                        <h4 className="font-bold text-xs text-[#fdfcfb] truncate">
                          {product.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom */}
                <div className="border-t-2 border-[#333338] pt-3 mt-3 flex flex-col sm:flex-row items-center justify-between text-xs font-bold gap-2 text-[#a1a1aa]">
                  <span>📞 {businessInfo.phones.join(' | ')}</span>
                  <span>📍 {businessInfo.location}</span>
                </div>
              </div>
            )}

            {/* THEME 4: WARM BOTANICAL ARTISAN */}
            {settings.theme === 'botanical' && (
              <div className="w-full h-full bg-[#1c1815] text-[#f5ebe3] p-6 sm:p-9 flex flex-col justify-between relative border-4 border-[#b88a60]/60">
                <div className="text-center pt-2">
                  <span className="text-[10px] tracking-[0.25em] font-semibold text-[#c5a059] uppercase block">
                    Bespoke Artisan Knitwear • Marondera
                  </span>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#f5ebe3]">
                    {settings.headline}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#c7b5a8] italic font-serif mt-1">
                    {settings.subheadline}
                  </p>
                </div>

                <div className="my-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {selectedProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#26201b] rounded-2xl overflow-hidden border border-[#b88a60]/40 shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-[#1a1613]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-[#b88a60] text-[#0c0c0c] font-bold text-xs px-2.5 py-0.5 rounded-full shadow">
                          ${product.priceUSD} USD
                        </div>
                      </div>
                      <div className="p-2.5 text-center">
                        <h4 className="font-serif font-bold text-xs text-[#f5ebe3] truncate">
                          {product.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#b88a60]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#c7b5a8] gap-2">
                  <div>
                    <strong className="text-[#f5ebe3]">Tatna Crocheting Corner</strong> • Marondera, Zimbabwe
                  </div>
                  <div>
                    <strong className="text-[#c5a059]">Order:</strong> {businessInfo.phones[0]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
