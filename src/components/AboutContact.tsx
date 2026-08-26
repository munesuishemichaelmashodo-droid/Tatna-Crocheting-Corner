import React from 'react';
import { BusinessInfo } from '../types';
import { BRAND_LOGO } from '../data/products';
import { 
  Phone, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Heart, 
  HelpCircle,
  Truck,
  Check
} from 'lucide-react';

interface AboutContactProps {
  businessInfo: BusinessInfo;
}

export const AboutContact: React.FC<AboutContactProps> = ({ businessInfo }) => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Brand Intro Header */}
      <div className="bg-[#141416] rounded-3xl p-8 sm:p-12 border border-[#27272a] shadow-lg text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full border-4 border-[#c5a059] shadow-md overflow-hidden mx-auto mb-4">
          <img src={BRAND_LOGO} alt="Tatna" className="w-full h-full object-cover" />
        </div>

        <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#c5a059] block mb-1">
          The Story Behind the Stitches
        </span>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#fdfcfb]">
          {businessInfo.name}
        </h2>

        <p className="text-sm sm:text-base text-[#a1a1aa] max-w-2xl mx-auto mt-4 leading-relaxed font-light">
          Founded and crafted by <strong className="text-[#fdfcfb]">Tatna (Tae)</strong> in Marondera, Zimbabwe. Tatna Crocheting Corner blends contemporary youth streetwear aesthetics with timeless artisan crochet craftsmanship. Every beanie, ruffle hat, handbag, slide, and floral bouquet is individually crafted stitch-by-stitch to celebrate uniqueness and personal style.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://wa.me/${businessInfo.primaryPhone.replace(/[\s+]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat directly with Tatna on WhatsApp</span>
          </a>

          <a
            href={`tel:${businessInfo.primaryPhone}`}
            className="px-6 py-3 rounded-full bg-[#1e1e24] hover:bg-[#26262d] border border-[#27272a] text-[#fdfcfb] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <Phone className="w-4 h-4 text-[#c5a059]" />
            <span>Call {businessInfo.phones[0]}</span>
          </a>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141416] p-6 rounded-3xl border border-[#27272a] shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1e1e24] text-[#c5a059] flex items-center justify-center border border-[#27272a]">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#fdfcfb]">Direct Contacts</h3>
          <p className="text-xs text-[#a1a1aa]">Call or message on any of our lines:</p>
          <div className="space-y-1 text-xs font-bold text-[#c5a059]">
            {businessInfo.phones.map((p, idx) => (
              <a
                key={idx}
                href={`tel:${p}`}
                className="block hover:text-[#d8b76e] transition-colors"
              >
                📲 {p}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-[#141416] p-6 rounded-3xl border border-[#27272a] shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#52B788]/15 text-[#52B788] flex items-center justify-center border border-[#52B788]/30">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#fdfcfb]">Location & Deliveries</h3>
          <p className="text-xs text-[#a1a1aa]">Based in Marondera with nationwide reach:</p>
          <div className="text-xs font-semibold text-[#fdfcfb] space-y-1">
            <p>📍 Marondera, Zimbabwe (Studio & Local Pickups)</p>
            <p>📍 Regular Drop-offs & Deliveries to Harare</p>
            <p className="text-[#a1a1aa]">📦 Fast Courier to Bulawayo, Mutare, Gweru & Nationwide</p>
          </div>
        </div>

        <div className="bg-[#141416] p-6 rounded-3xl border border-[#27272a] shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#e06c75]/15 text-[#e06c75] flex items-center justify-center border border-[#e06c75]/30">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#fdfcfb]">Turnaround & Hours</h3>
          <p className="text-xs text-[#a1a1aa]">Handmade order lead times:</p>
          <div className="text-xs font-semibold text-[#fdfcfb] space-y-1">
            <p>⚡ Scrunchies & Beanies: 1 - 2 Days</p>
            <p>👜 Bow Bags & Ruffle Hats: 2 - 3 Days</p>
            <p>💐 Bouquets & Polos: 3 - 5 Days</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-[#141416] p-6 sm:p-8 rounded-3xl border border-[#27272a] shadow-lg space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#fdfcfb] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#c5a059]" /> Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs text-[#a1a1aa]">
          <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a]">
            <h4 className="font-bold text-[#fdfcfb] text-sm mb-1">
              Can I request custom colors or specific size measurements?
            </h4>
            <p className="font-light">
              Yes, absolutely! All crochet items are made to order. You can request any color combinations (split two-tone, custom stripes, monochrome, or pastel themes) when placing your WhatsApp order.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a]">
            <h4 className="font-bold text-[#fdfcfb] text-sm mb-1">
              What payment methods do you accept in Zimbabwe?
            </h4>
            <p className="font-light">
              We accept USD Cash, EcoCash (at prevailing rate), Innbucks, and ZIPIT bank transfers upon order confirmation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a]">
            <h4 className="font-bold text-[#fdfcfb] text-sm mb-1">
              How should I wash and care for my crochet items?
            </h4>
            <p className="font-light">
              We recommend gentle hand washing in cool or lukewarm water with mild soap. Never wring or twist vigorously. Lay flat on a towel in the shade to maintain the stitch structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
