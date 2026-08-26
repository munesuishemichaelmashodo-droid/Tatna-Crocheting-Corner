import React, { useState, useRef, useEffect } from 'react';
import { CrochetProduct, BusinessInfo, PosterTheme, PosterFormat, PosterSettings } from '../types';
import { BRAND_LOGO } from '../data/products';
import { toPng, toBlob } from 'html-to-image';
import QRCode from 'qrcode';
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
  Eye,
  Globe,
  ExternalLink,
  Share2,
  Image as ImageIcon,
  Loader2,
  X,
  Maximize2
} from 'lucide-react';

interface PosterStudioProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
}

export const PosterStudio: React.FC<PosterStudioProps> = ({ products, businessInfo }) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<'all' | 'custom'>('all');
  
  const [settings, setSettings] = useState<PosterSettings>({
    theme: 'editorial',
    format: 'a4',
    headline: 'Tatna Crocheting Corner',
    subheadline: 'Artisanal Handcrafted Crochet Wear & Bespoke Gifts',
    announcement: 'All Items Available & Made to Order • Prices From $1 USD • Custom Colors Welcome 💕',
    showPrices: true,
    showQrCode: true,
    showPhones: true,
    showLocation: true,
    accentColor: '#C9A96E',
    selectedProductIds: products.map((p) => p.id),
  });

  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const websiteUrl = 'https://tatna-crocheting-corner.vercel.app';

  // Generate offline QR Code data URL
  useEffect(() => {
    QRCode.toDataURL(websiteUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [websiteUrl]);

  const displayedProducts = displayMode === 'all' 
    ? products 
    : products.filter((p) => settings.selectedProductIds.includes(p.id));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;
    try {
      setIsExporting(true);
      setExportError(null);

      // Render element to PNG data URL with optimized settings
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true, // Prevents external font CORS blocking
      });

      // Trigger automatic file download
      const link = document.createElement('a');
      link.download = `Tatna-Crochet-Flyer-${settings.theme}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      // Also set preview image for user convenience
      setPreviewImage(dataUrl);
    } catch (err: any) {
      console.error('Error generating flyer image:', err);
      setExportError('Unable to auto-save file directly. You can use Print PDF or view the poster preview below.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    if (!posterRef.current) return;
    try {
      setIsExporting(true);
      setExportError(null);

      const blob = await toBlob(posterRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
      });

      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'tatna-flyer.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'tatna-crochet-flyer.png', { type: 'image/png' });
        await navigator.share({
          title: 'Tatna Crocheting Corner Flyer',
          text: `Check out Tatna Crocheting Corner in Marondera! Handcrafted fashion & gifts from $1 USD: ${websiteUrl}`,
          files: [file],
        });
      } else {
        // Fallback to regular WhatsApp text share
        shareViaWhatsApp();
      }
    } catch (err) {
      console.error('Share error:', err);
      shareViaWhatsApp();
    } finally {
      setIsExporting(false);
    }
  };

  const copyWhatsAppTextFlyer = () => {
    const text = `🌸 *TATNA CROCHETING CORNER* 🌸\n` +
      `✨ _Artisanal Handcrafted Wear, Bags, Footwear & Everlasting Flowers_\n` +
      `🌐 *Browse Live Catalog:* ${websiteUrl}\n\n` +
      `📌 *OFFICIAL PRICE LIST / MENU:*\n` +
      displayedProducts.map(p => `• *${p.name}* — $${p.priceUSD} USD ✔`).join('\n') +
      `\n\n💕 *All available & custom colors made to order!*\n` +
      `📍 *Location:* ${businessInfo.location}\n\n` +
      `📞 *CONTACT / WHATSAPP:*\n` +
      businessInfo.phones.map(ph => `📲 ${ph}`).join('\n') +
      `\n\n_Send a message on WhatsApp or click our link to book your slot!_`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const text = `🌸 *TATNA CROCHETING CORNER* 🌸\n` +
      `✨ _Artisanal Handcrafted Wear, Bags, Footwear & Everlasting Flowers_\n` +
      `🌐 *Live Catalog & Booking:* ${websiteUrl}\n\n` +
      `📌 *OFFICIAL PRICE LIST:*\n` +
      displayedProducts.map(p => `• ${p.name} — $${p.priceUSD} USD`).join('\n') +
      `\n\n📍 *Location:* ${businessInfo.location}\n` +
      `📞 *WhatsApp / Calls:* ${businessInfo.phones.join(' • ')}\n\n` +
      `💕 *Prices starting from just $1 USD! Custom colors welcome.*`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyWebLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleProduct = (id: string) => {
    setDisplayMode('custom');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141416] p-5 sm:p-6 rounded-2xl border border-[#27272a] shadow-lg no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase block">
              Official Marketing Suite
            </span>
            <span className="bg-[#52B788]/20 text-[#52B788] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#52B788]/30">
              Ready for Clients
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fdfcfb] mt-0.5">
            Client Poster & Promo Flyer Generator
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1 font-light max-w-xl">
            Fully detailed marketing flyer with official logo badge, authentic product photos, verified prices from $1, Marondera location, contact phones, and live QR link.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="download-png-flyer-btn"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-[#0c0c0c]" /> : <Download className="w-4 h-4 text-[#0c0c0c]" />}
            <span>{isExporting ? 'Generating HD Flyer...' : 'Download PNG Flyer'}</span>
          </button>

          <button
            id="share-whatsapp-btn"
            onClick={handleNativeShare}
            className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>Send to Client</span>
          </button>

          <button
            id="print-poster-btn"
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-[#1a1a1e] hover:bg-[#26262b] text-[#fdfcfb] border border-[#27272a] hover:border-[#c5a059]/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#c5a059]" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {exportError && (
        <div className="bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs p-3.5 rounded-xl flex items-center justify-between no-print">
          <span>{exportError}</span>
          <button onClick={() => setExportError(null)} className="text-amber-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (Hidden on Print) */}
        <div className="lg:col-span-4 space-y-6 no-print">
          {/* Quick Actions Card */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#c5a059]" /> Quick Share Tools
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={copyWhatsAppTextFlyer}
                className="w-full p-2.5 rounded-xl bg-[#1a1a1e] hover:bg-[#222228] border border-[#27272a] text-left text-xs font-semibold text-[#fdfcfb] flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Copy Formatted Text Menu</span>
                </div>
                {copiedText && <span className="text-[10px] text-[#52B788] font-bold">Copied!</span>}
              </button>

              <button
                type="button"
                onClick={copyWebLink}
                className="w-full p-2.5 rounded-xl bg-[#1a1a1e] hover:bg-[#222228] border border-[#27272a] text-left text-xs font-semibold text-[#fdfcfb] flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Copy Official Website Link</span>
                </div>
                {copiedLink && <span className="text-[10px] text-[#52B788] font-bold">Copied!</span>}
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#c5a059]" /> 1. Poster Theme / Style
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'editorial', label: 'Haute Editorial', desc: 'Luxury black & gold foil' },
                { id: 'pastel', label: 'Pastel Boutique', desc: 'Soft blush & floral rose' },
                { id: 'streetwear', label: 'Modern Minimal', desc: 'Sharp contemporary dark' },
                { id: 'botanical', label: 'Warm Artisan', desc: 'Earth terracotta & knit' },
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

          {/* Catalog Layout Mode */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-[#c5a059]" /> 2. Items Display
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDisplayMode('all')}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                  displayMode === 'all'
                    ? 'border-[#c5a059] bg-[#c5a059] text-[#0c0c0c]'
                    : 'border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:bg-[#202024]'
                }`}
              >
                Complete Catalog ({products.length} Items)
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('custom')}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                  displayMode === 'custom'
                    ? 'border-[#c5a059] bg-[#c5a059] text-[#0c0c0c]'
                    : 'border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:bg-[#202024]'
                }`}
              >
                Custom Selection ({settings.selectedProductIds.length})
              </button>
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
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Subheadline</label>
              <input
                type="text"
                value={settings.subheadline}
                onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] outline-none text-[#fdfcfb]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Announcement Tag</label>
              <input
                type="text"
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#18181b] border border-[#27272a] rounded-xl focus:ring-2 focus:ring-[#c5a059] outline-none text-[#fdfcfb]"
              />
            </div>
          </div>

          {/* Products List Toggle (If custom mode) */}
          {displayMode === 'custom' && (
            <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#fdfcfb] flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#c5a059]" /> Select Products to Show
                </h3>
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
          )}
        </div>

        {/* Live Poster Preview Column */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-[#a1a1aa] no-print">
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4 text-[#c5a059]" /> High-Definition Client Flyer Canvas
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium bg-[#1a1a1e] px-2.5 py-1 rounded-full text-[#c5a059] border border-[#27272a] text-[11px]">
                {displayedProducts.length} Items Displayed
              </span>
            </div>
          </div>

          {/* Render Active Poster Frame */}
          <div 
            ref={posterRef}
            id="poster-render-target"
            className="poster-print-surface transition-all duration-300 w-full max-w-[820px] rounded-3xl overflow-hidden shadow-2xl bg-[#0c0c0c]"
          >
            {/* THEME 1: EDITORIAL LUXURY */}
            {settings.theme === 'editorial' && (
              <div className="w-full bg-[#0a0a0c] text-[#fdfcfb] p-6 sm:p-9 flex flex-col justify-between relative border-4 border-[#c5a059]/40">
                {/* Decorative golden border */}
                <div className="absolute inset-3 border border-[#c5a059]/25 pointer-events-none rounded-2xl"></div>

                {/* Top Poster Header */}
                <div className="relative z-10 text-center pt-2">
                  <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-3 mb-3">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-14 h-14 rounded-2xl border-2 border-[#c5a059] overflow-hidden shadow-md bg-black">
                        <img src={BRAND_LOGO} alt="Tatna Crochet Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a059] font-bold block">
                          Official Collection & Price List
                        </span>
                        <h1 className="text-xl sm:text-2xl font-serif font-black text-[#fdfcfb] tracking-tight">
                          {settings.headline}
                        </h1>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end text-right">
                      <span className="text-[10px] text-[#a1a1aa] font-medium">Order Online:</span>
                      <span className="text-xs font-bold text-[#c5a059] tracking-wide">{websiteUrl.replace('https://', '')}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#a1a1aa] font-light italic font-serif">
                    {settings.subheadline}
                  </p>

                  <div className="mt-3 inline-block bg-[#c5a059]/15 border border-[#c5a059]/40 px-4 py-1 rounded-full text-xs text-[#fdfcfb] tracking-wide font-semibold shadow-sm">
                    {settings.announcement}
                  </div>
                </div>

                {/* Center Showcase Grid */}
                <div className="relative z-10 my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
                  {displayedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#141418] rounded-xl overflow-hidden border border-[#c5a059]/30 shadow-md flex flex-col justify-between group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#18181e]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 right-1.5 bg-[#c5a059] text-[#0c0c0c] font-black text-[11px] px-2 py-0.5 rounded shadow-md">
                          ${product.priceUSD} USD
                        </div>
                      </div>
                      <div className="p-2 text-center bg-[#131316]">
                        <h4 className="font-serif font-bold text-xs text-[#fdfcfb] truncate">
                          {product.name}
                        </h4>
                        <span className="text-[9px] text-[#a1a1aa] block uppercase tracking-wider mt-0.5">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Footer Details */}
                <div className="relative z-10 pt-4 border-t border-[#c5a059]/30 bg-[#141418] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] text-[#c5a059] uppercase tracking-widest font-bold block">
                      📍 Location & Service Area
                    </span>
                    <p className="text-xs font-semibold text-[#fdfcfb]">
                      {businessInfo.location}
                    </p>
                    <div className="text-xs text-[#a1a1aa] flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                      {businessInfo.phones.map((phone, i) => (
                        <span key={i} className="inline-flex items-center gap-1 font-bold text-[#fdfcfb]">
                          <Phone className="w-3 h-3 text-[#c5a059]" /> {phone}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#0a0a0c] border border-[#c5a059]/40 p-2.5 rounded-xl shrink-0">
                    {qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="Catalog QR Code" 
                        className="w-14 h-14 rounded-lg bg-white p-0.5" 
                      />
                    ) : (
                      <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-black" />
                      </div>
                    )}
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider text-[#c5a059] font-bold block">
                        Scan or Visit Online
                      </span>
                      <span className="text-xs font-black text-white block">
                        tatna-crocheting-corner
                      </span>
                      <span className="text-[10px] text-[#a1a1aa]">
                        .vercel.app
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* THEME 2: PASTEL BLUSH & ROSES */}
            {settings.theme === 'pastel' && (
              <div className="w-full bg-[#1b1518] text-[#f7e8ec] p-6 sm:p-9 flex flex-col justify-between relative border-4 border-[#d48396]/50">
                {/* Header */}
                <div className="text-center pt-2">
                  <div className="flex items-center justify-between border-b border-[#d48396]/30 pb-3 mb-3">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-14 h-14 rounded-2xl border-2 border-[#d48396] overflow-hidden shadow bg-black">
                        <img src={BRAND_LOGO} alt="Tatna Crochet" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#f5a3b7] font-bold block">
                          Handmade with Love in Marondera
                        </span>
                        <h1 className="text-xl sm:text-2xl font-serif font-black text-[#f7e8ec] tracking-tight">
                          {settings.headline}
                        </h1>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <span className="text-xs font-bold text-[#f5a3b7]">tatna-crocheting-corner.vercel.app</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#d4a5b2] font-serif italic">
                    {settings.subheadline}
                  </p>
                  <div className="mt-3 inline-block bg-[#241a20] border border-[#d48396]/40 shadow px-4 py-1 rounded-full text-xs text-[#f5a3b7] font-bold">
                    {settings.announcement}
                  </div>
                </div>

                {/* Grid */}
                <div className="my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
                  {displayedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#241c21] rounded-xl overflow-hidden border border-[#d48396]/30 shadow flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-[#1a1418] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 right-1.5 bg-[#d48396] text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow">
                          ${product.priceUSD} USD
                        </div>
                      </div>
                      <div className="p-2 text-center bg-[#241c21]">
                        <h4 className="font-serif font-bold text-xs text-[#f7e8ec] truncate">
                          {product.name}
                        </h4>
                        <span className="text-[9px] text-[#c49aa5] block capitalize mt-0.5">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#d48396]/30 bg-[#241c21] rounded-2xl p-4 shadow flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f5a3b7] block">
                      📍 Orders & Inquiries:
                    </span>
                    <div className="text-xs sm:text-sm font-bold text-[#f7e8ec]">
                      {businessInfo.phones.join(' • ')}
                    </div>
                    <span className="text-[11px] text-[#c49aa5] block">
                      {businessInfo.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-[#1b1518] border border-[#d48396]/40 p-2.5 rounded-xl shrink-0">
                    {qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="Catalog QR Code" 
                        className="w-14 h-14 rounded-lg bg-white p-0.5" 
                      />
                    ) : (
                      <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-black" />
                      </div>
                    )}
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider text-[#f5a3b7] font-bold block">
                        Browse Online Catalog
                      </span>
                      <span className="text-xs font-bold text-white block">
                        tatna-crocheting-corner
                      </span>
                      <span className="text-[10px] text-[#d4a5b2]">
                        .vercel.app
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* THEME 3: MODERN MINIMAL */}
            {settings.theme === 'streetwear' && (
              <div className="w-full bg-[#111113] text-[#fdfcfb] p-6 sm:p-9 flex flex-col justify-between relative border-4 border-[#333338]">
                {/* Top */}
                <div className="border-b-2 border-[#333338] pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl border-2 border-[#c5a059] overflow-hidden bg-black shrink-0">
                      <img src={BRAND_LOGO} alt="Tatna" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.25em] font-black uppercase text-[#c5a059] block">
                        Marondera, Zimbabwe / Handcrafted
                      </span>
                      <h1 className="text-xl sm:text-3xl font-serif font-black text-[#fdfcfb] tracking-tight">
                        {settings.headline}
                      </h1>
                    </div>
                  </div>

                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] font-bold text-[#a1a1aa] block uppercase">Live Store:</span>
                    <span className="text-xs font-black text-[#c5a059]">tatna-crocheting-corner.vercel.app</span>
                  </div>
                </div>

                {/* Sub */}
                <div className="py-2 bg-[#c5a059] text-[#0c0c0c] text-center text-xs font-black uppercase tracking-wider my-4 rounded-lg">
                  {settings.announcement}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-2">
                  {displayedProducts.map((product) => (
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
                        <span className="absolute bottom-1 right-1 bg-[#c5a059] text-[#0c0c0c] text-xs font-black px-2 py-0.5 rounded shadow">
                          ${product.priceUSD} USD
                        </span>
                      </div>
                      <div className="p-2 text-center bg-[#18181c] border-t border-[#333338]">
                        <h4 className="font-bold text-xs text-[#fdfcfb] truncate">
                          {product.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom */}
                <div className="border-t-2 border-[#333338] pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-bold gap-3 text-[#a1a1aa]">
                  <div>
                    <span className="text-white block font-black">📞 {businessInfo.phones.join(' | ')}</span>
                    <span>📍 {businessInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#18181c] px-3 py-1.5 rounded-lg border border-[#333338]">
                    <Globe className="w-4 h-4 text-[#c5a059]" />
                    <span className="text-[#fdfcfb]">{websiteUrl}</span>
                  </div>
                </div>
              </div>
            )}

            {/* THEME 4: WARM BOTANICAL ARTISAN */}
            {settings.theme === 'botanical' && (
              <div className="w-full bg-[#1c1815] text-[#f5ebe3] p-6 sm:p-9 flex flex-col justify-between relative border-4 border-[#b88a60]/60">
                <div className="flex items-center justify-between border-b border-[#b88a60]/30 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl border-2 border-[#b88a60] overflow-hidden bg-black shrink-0">
                      <img src={BRAND_LOGO} alt="Tatna" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.25em] font-semibold text-[#c5a059] uppercase block">
                        Bespoke Artisan Knitwear • Marondera
                      </span>
                      <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ebe3]">
                        {settings.headline}
                      </h1>
                    </div>
                  </div>
                  <span className="text-xs font-serif text-[#c5a059] hidden sm:block">tatna-crocheting-corner.vercel.app</span>
                </div>

                <div className="text-center mb-3">
                  <p className="text-xs sm:text-sm text-[#c7b5a8] italic font-serif">
                    {settings.subheadline}
                  </p>
                  <div className="mt-2 inline-block bg-[#26201b] border border-[#b88a60]/40 px-3.5 py-1 rounded-full text-xs text-[#c5a059] font-bold">
                    {settings.announcement}
                  </div>
                </div>

                <div className="my-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {displayedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#26201b] rounded-xl overflow-hidden border border-[#b88a60]/40 shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-[#1a1613]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 right-1.5 bg-[#b88a60] text-[#0c0c0c] font-bold text-[11px] px-2 py-0.5 rounded shadow">
                          ${product.priceUSD} USD
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <h4 className="font-serif font-bold text-xs text-[#f5ebe3] truncate">
                          {product.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#b88a60]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#c7b5a8] gap-3">
                  <div>
                    <strong className="text-[#f5ebe3]">Tatna Crocheting Corner</strong> • Marondera, Zimbabwe
                    <div className="mt-0.5 font-bold text-[#c5a059]">📞 {businessInfo.phones.join(' • ')}</div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#26201b] p-2 rounded-xl border border-[#b88a60]/40">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="QR" className="w-10 h-10 rounded bg-white p-0.5" />
                    ) : (
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-black" />
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-[#f5ebe3]">tatna-crocheting-corner.vercel.app</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Preview for Saved Image */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#27272a] rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Your HD Flyer is Ready!</h3>
                <p className="text-xs text-[#a1a1aa]">You can save this image or send it directly to your clients.</p>
              </div>
              <button 
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-xl bg-[#1f1f24] hover:bg-[#27272e] text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#27272a] bg-black">
              <img src={previewImage} alt="Generated Flyer" className="w-full h-auto object-contain" />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <a
                href={previewImage}
                download={`Tatna-Crochet-Flyer-${Date.now()}.png`}
                className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] font-bold text-xs flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" /> Download Again
              </a>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2.5 rounded-xl bg-[#1f1f24] hover:bg-[#27272e] text-[#a1a1aa] font-semibold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
