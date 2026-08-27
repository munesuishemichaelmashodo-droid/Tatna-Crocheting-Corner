import React, { useState, useRef } from 'react';
import { CrochetProduct, BusinessInfo } from '../types';
import { CurrencyCode } from '../utils/currency';
import { BRAND_LOGO } from '../data/products';
import { toPng } from 'html-to-image';
import {
  Sparkles,
  Video,
  Instagram,
  MessageCircle,
  Copy,
  Download,
  Calendar,
  Layers,
  Wand2,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Share2,
  Lock,
  Unlock,
  ShieldCheck,
  Lightbulb,
  Clock,
  Music,
  Camera,
  Film,
  Flame,
  FileText,
  Palette,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface AdminContentStudioProps {
  products: CrochetProduct[];
  businessInfo: BusinessInfo;
  currency: CurrencyCode;
  isOwner: boolean;
  onOpenOwnerModal: () => void;
}

type StudioTab = 'video-scripts' | 'post-designer' | 'captions' | 'campaign-planner' | 'trend-ideas';

interface VideoScene {
  sceneNumber: number;
  timing: string;
  visual: string;
  textOnScreen: string;
  voiceoverOrAction: string;
}

interface VideoScriptData {
  title: string;
  hook: string;
  recommendedAudio: string;
  targetDuration: string;
  scenes: VideoScene[];
  caption: string;
  callToAction: string;
}

interface CaptionItem {
  angle: string;
  hook: string;
  body: string;
  hashtags: string[];
  whatsappSnippet: string;
}

interface CalendarDay {
  day: number;
  dayName: string;
  pillar: string;
  postType: string;
  productFocus: string;
  contentIdea: string;
  captionHook: string;
  bestPostingTime: string;
}

export const AdminContentStudio: React.FC<AdminContentStudioProps> = ({
  products,
  businessInfo,
  currency,
  isOwner,
  onOpenOwnerModal,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('video-scripts');
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);
  const selectedProduct = products[selectedProductIndex] || products[0];

  // Video Script State
  const [videoStyle, setVideoStyle] = useState<string>('aesthetic-asmr');
  const [videoSpecialNotes, setVideoSpecialNotes] = useState<string>('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoScript, setVideoScript] = useState<VideoScriptData | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);

  // Teleprompter / Practice Mode State
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlayingTimer, setIsPlayingTimer] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Captions State
  const [captionPlatform, setCaptionPlatform] = useState<string>('instagram');
  const [captionTone, setCaptionTone] = useState<string>('stylish');
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState<boolean>(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<CaptionItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Campaign Planner State
  const [plannerGoal, setPlannerGoal] = useState<string>('Drive WhatsApp orders & boost catalog views');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [campaignSchedule, setCampaignSchedule] = useState<CalendarDay[]>([]);
  const [campaignTheme, setCampaignTheme] = useState<string>('Handmade Warmth & Spring Stitches Collection');

  // Post Graphic Designer State
  const postGraphicRef = useRef<HTMLDivElement>(null);
  const [designerFormat, setDesignerFormat] = useState<'story-9-16' | 'square-1-1' | 'portrait-4-5'>('square-1-1');
  const [designerTheme, setDesignerTheme] = useState<'dark-gold' | 'rose-velvet' | 'sage-botanical' | 'clean-minimal'>('dark-gold');
  const [customHeadline, setCustomHeadline] = useState<string>('HANDMADE IN MARONDERA');
  const [customBadge, setCustomBadge] = useState<string>('✨ 100% Hand-Stitched');
  const [customPriceTag, setCustomPriceTag] = useState<string>('Custom Made to Order');
  const [isExportingDesign, setIsExportingDesign] = useState<boolean>(false);

  const websiteUrl = 'https://tatna-crocheting-corner.vercel.app';

  // Trigger Video Script Generation
  const handleGenerateVideoScript = async () => {
    setIsGeneratingVideo(true);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video-script',
          product: selectedProduct,
          options: {
            style: videoStyle,
            specialNotes: videoSpecialNotes,
          },
        }),
      });
      const data = await res.json();
      if (data?.result) {
        setVideoScript(data.result);
      }
    } catch (err) {
      console.error('Error generating video script:', err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Trigger Captions Generation
  const handleGenerateCaptions = async () => {
    setIsGeneratingCaptions(true);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'captions',
          product: selectedProduct,
          options: {
            platform: captionPlatform,
            tone: captionTone,
          },
        }),
      });
      const data = await res.json();
      if (data?.result?.captions) {
        setGeneratedCaptions(data.result.captions);
      }
    } catch (err) {
      console.error('Error generating captions:', err);
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  // Trigger 7-Day Campaign Planner
  const handleGenerateCampaignPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'campaign-plan',
          options: {
            days: 7,
            goal: plannerGoal,
            focusProduct: selectedProduct.name,
          },
        }),
      });
      const data = await res.json();
      if (data?.result?.schedule) {
        setCampaignSchedule(data.result.schedule);
        if (data.result.theme) setCampaignTheme(data.result.theme);
      }
    } catch (err) {
      console.error('Error generating campaign plan:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Download Post Graphic
  const handleDownloadGraphic = async () => {
    if (!postGraphicRef.current) return;
    try {
      setIsExportingDesign(true);
      const dataUrl = await toPng(postGraphicRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
      });
      const link = document.createElement('a');
      link.download = `Tatna-Post-${designerFormat}-${selectedProduct.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting graphic:', err);
    } finally {
      setIsExportingDesign(false);
    }
  };

  // Teleprompter Timer
  const toggleTeleprompterPlay = () => {
    if (isPlayingTimer) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlayingTimer(false);
    } else {
      setIsPlayingTimer(true);
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const resetTeleprompterTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlayingTimer(false);
    setTimerSeconds(0);
  };

  const copyToClipboard = (text: string, type: 'script' | 'caption' | number) => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    } else if (type === 'caption') {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } else {
      setCopiedIndex(type);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  // Auto initialize default script if empty
  React.useEffect(() => {
    if (!videoScript) {
      handleGenerateVideoScript();
    }
    if (generatedCaptions.length === 0) {
      handleGenerateCaptions();
    }
    if (campaignSchedule.length === 0) {
      handleGenerateCampaignPlan();
    }
  }, [selectedProductIndex]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Header Banner */}
      <div className="bg-[#141416] p-6 sm:p-7 rounded-3xl border border-[#27272a] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-widest text-[#c5a059] uppercase block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> AI Social Media & Video Content Studio
            </span>
            {isOwner ? (
              <span className="inline-flex items-center gap-1 bg-[#52B788]/20 text-[#52B788] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#52B788]/30">
                <ShieldCheck className="w-3 h-3" /> Owner Studio Unlocked
              </span>
            ) : (
              <button
                onClick={onOpenOwnerModal}
                className="inline-flex items-center gap-1 bg-[#c5a059]/15 text-[#c5a059] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#c5a059]/30 hover:bg-[#c5a059]/25 transition-all"
              >
                <Lock className="w-3 h-3" /> Tap to Enter Owner PIN
              </button>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcfb]">
            Admin Creative Content Generator
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1 font-light max-w-2xl leading-relaxed">
            Generate viral short-form video scripts (TikTok & Reels), multi-platform captions, custom social post graphics, and weekly posting calendars tailored to Marondera and Zimbabwean shoppers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={onOpenOwnerModal}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              isOwner
                ? 'bg-[#52B788]/15 border-[#52B788]/40 text-[#52B788]'
                : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white'
            }`}
          >
            {isOwner ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isOwner ? 'Owner Mode' : 'Admin Login (PIN 2026)'}</span>
          </button>
        </div>
      </div>

      {/* Global Product Selector Bar */}
      <div className="bg-[#141416] p-4 rounded-2xl border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">Active Product Focus:</span>
          <span className="text-xs font-bold text-[#c5a059]">{selectedProduct.name} (${selectedProduct.priceUSD} USD)</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedProductIndex}
            onChange={(e) => setSelectedProductIndex(Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-[#fdfcfb] font-medium focus:ring-1 focus:ring-[#c5a059] outline-none"
          >
            {products.map((p, idx) => (
              <option key={p.id} value={idx}>
                {p.name} — ${p.priceUSD} USD ({p.category})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedProductIndex((prev) => (prev - 1 + products.length) % products.length)}
              className="p-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white"
              title="Previous product"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProductIndex((prev) => (prev + 1) % products.length)}
              className="p-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white"
              title="Next product"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#27272a] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('video-scripts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'video-scripts'
              ? 'bg-[#c5a059] text-[#0c0c0c] shadow-md'
              : 'bg-[#141416] text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1e] border border-[#27272a]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>1. Reels & TikTok Video Scripts</span>
        </button>

        <button
          onClick={() => setActiveTab('post-designer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'post-designer'
              ? 'bg-[#c5a059] text-[#0c0c0c] shadow-md'
              : 'bg-[#141416] text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1e] border border-[#27272a]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>2. Post Graphic & Ad Designer</span>
        </button>

        <button
          onClick={() => setActiveTab('captions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'captions'
              ? 'bg-[#c5a059] text-[#0c0c0c] shadow-md'
              : 'bg-[#141416] text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1e] border border-[#27272a]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Viral Captions & WhatsApp Blasts</span>
        </button>

        <button
          onClick={() => setActiveTab('campaign-planner')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'campaign-planner'
              ? 'bg-[#c5a059] text-[#0c0c0c] shadow-md'
              : 'bg-[#141416] text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1e] border border-[#27272a]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>4. 7-Day Social Posting Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('trend-ideas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'trend-ideas'
              ? 'bg-[#c5a059] text-[#0c0c0c] shadow-md'
              : 'bg-[#141416] text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1e] border border-[#27272a]'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>5. Trending Product & Drop Ideas</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: REELS & TIKTOK VIDEO SCRIPTS */}
      {/* ======================================================== */}
      {activeTab === 'video-scripts' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Video Angle / Concept:</label>
                <select
                  value={videoStyle}
                  onChange={(e) => setVideoStyle(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-[#fdfcfb] font-medium focus:ring-1 focus:ring-[#c5a059] outline-none"
                >
                  <option value="aesthetic-asmr">✨ ASMR Yarn & Crochet Stitches</option>
                  <option value="styling-haul">👗 Styling 3 Ways (Outfit Inspiration)</option>
                  <option value="pack-order-with-me">📦 Pack an Order With Me (#Order104)</option>
                  <option value="price-guess-challenge">💰 Guess the Price / Handmade Luxury</option>
                  <option value="behind-the-scenes">⏳ Behind The Scenes (3-Hour Time-lapse)</option>
                  <option value="gift-reaction">🎁 Perfect Gift Idea / Unboxing Reaction</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Special Instructions / Custom Angle:</label>
                <input
                  type="text"
                  value={videoSpecialNotes}
                  onChange={(e) => setVideoSpecialNotes(e.target.value)}
                  placeholder="e.g. Mention Marondera pickup & nationwide courier"
                  className="px-3 py-2 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-[#fdfcfb] w-56 sm:w-72 focus:ring-1 focus:ring-[#c5a059] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateVideoScript}
                disabled={isGeneratingVideo}
                className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>{isGeneratingVideo ? 'Writing Viral Script...' : 'Generate New Script'}</span>
              </button>

              <button
                onClick={() => setIsTeleprompterOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-[#1e1e24] hover:bg-[#27272f] border border-[#27272a] text-[#fdfcfb] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Camera className="w-4 h-4 text-[#d48396]" />
                <span>Recording Mode</span>
              </button>
            </div>
          </div>

          {/* Script Output Cards */}
          {videoScript && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Structured Scene Breakdown */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-[#141416] p-5 sm:p-6 rounded-3xl border border-[#27272a] shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#27272a]">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#c5a059] block">
                        Target Duration: {videoScript.targetDuration || '20s'} • High Retention
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#fdfcfb]">
                        {videoScript.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(videoScript, null, 2), 'script')}
                        className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#d4d4d8] hover:text-white flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{copiedScript ? 'Copied All!' : 'Copy Script'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Hook Banner */}
                  <div className="bg-gradient-to-r from-[#c5a059]/20 to-[#d48396]/10 p-4 rounded-2xl border border-[#c5a059]/30 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#e89bae]" /> The 3-Second Scroll-Stopping Hook:
                    </span>
                    <p className="text-sm font-semibold text-white leading-snug">
                      &ldquo;{videoScript.hook}&rdquo;
                    </p>
                  </div>

                  {/* Audio recommendation */}
                  <div className="flex items-center gap-2 text-xs text-[#a1a1aa] bg-[#18181b] p-3 rounded-xl border border-[#27272a]">
                    <Music className="w-4 h-4 text-[#c5a059] shrink-0" />
                    <span><strong className="text-white">Recommended Sound:</strong> {videoScript.recommendedAudio}</span>
                  </div>

                  {/* Scenes List */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
                      Scene-by-Scene Shot List:
                    </h4>

                    {videoScript.scenes?.map((scene, idx) => (
                      <div
                        key={idx}
                        className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] hover:border-[#c5a059]/40 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-0.5 rounded-full border border-[#c5a059]/20">
                            Scene {scene.sceneNumber || idx + 1} ({scene.timing})
                          </span>
                          <span className="text-[10px] text-[#71717a]">Shot {idx + 1} of {videoScript.scenes.length}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="bg-[#141416] p-3 rounded-xl border border-[#27272a]/60 space-y-1">
                            <span className="text-[10px] font-semibold text-[#a1a1aa] uppercase flex items-center gap-1">
                              <Camera className="w-3 h-3 text-[#d48396]" /> Camera Visual Action:
                            </span>
                            <p className="text-white font-medium text-[11px] leading-relaxed">
                              {scene.visual}
                            </p>
                          </div>

                          <div className="bg-[#141416] p-3 rounded-xl border border-[#27272a]/60 space-y-1">
                            <span className="text-[10px] font-semibold text-[#a1a1aa] uppercase flex items-center gap-1">
                              <Film className="w-3 h-3 text-[#52B788]" /> Text on Screen:
                            </span>
                            <p className="text-amber-200 font-bold text-[11px]">
                              &ldquo;{scene.textOnScreen}&rdquo;
                            </p>
                          </div>
                        </div>

                        <div className="bg-[#141416]/50 p-2.5 rounded-xl text-[11px] text-[#d4d4d8] border border-[#27272a]/40">
                          <strong className="text-[#a1a1aa]">Voiceover / Cue:</strong> {scene.voiceoverOrAction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: Caption & Ready-to-Post Helper */}
              <div className="space-y-4">
                <div className="bg-[#141416] p-5 rounded-3xl border border-[#27272a] shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
                      <Instagram className="w-4 h-4 text-[#d48396]" /> Ready Post Caption
                    </h4>
                    <button
                      onClick={() => copyToClipboard(videoScript.caption, 'caption')}
                      className="text-xs text-[#c5a059] font-bold hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCaption ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="bg-[#18181b] p-3.5 rounded-2xl border border-[#27272a] text-xs text-[#d4d4d8] leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
                    {videoScript.caption}
                  </div>

                  <div className="p-3 bg-[#25D366]/10 rounded-2xl border border-[#25D366]/20 text-xs text-[#d4d4d8] space-y-2">
                    <span className="font-bold text-[#25D366] flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" /> Call to Action Prompt:
                    </span>
                    <p className="text-[11px] text-white">
                      {videoScript.callToAction}
                    </p>
                    <button
                      onClick={() => {
                        window.open(`https://wa.me/?text=${encodeURIComponent(videoScript.caption)}`, '_blank');
                      }}
                      className="w-full py-2 bg-[#25D366] text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-[#20BA5A] transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Send to WhatsApp
                    </button>
                  </div>
                </div>

                {/* Video filming checklist */}
                <div className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] text-xs text-[#a1a1aa] space-y-2">
                  <span className="font-bold text-white block text-xs">🎥 Creator Filming Tips:</span>
                  <ul className="space-y-1.5 text-[11px] list-disc list-inside">
                    <li>Film near a bright window for natural yarn texture.</li>
                    <li>Wipe your camera lens with a microfiber cloth.</li>
                    <li>Use 9:16 vertical video format in 4K / 1080p 60fps.</li>
                    <li>Keep scene 1 hook under 2.5 seconds to maximize loop count.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: POST GRAPHIC & AD DESIGNER */}
      {/* ======================================================== */}
      {activeTab === 'post-designer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Controls Column */}
          <div className="space-y-4">
            <div className="bg-[#141416] p-5 rounded-3xl border border-[#27272a] shadow-xl space-y-4">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#c5a059]" /> Graphic Customization
              </h3>

              {/* Format selection */}
              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1.5">Canvas Size / Platform:</label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#18181b] p-1 rounded-xl border border-[#27272a]">
                  <button
                    onClick={() => setDesignerFormat('square-1-1')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      designerFormat === 'square-1-1' ? 'bg-[#c5a059] text-[#0c0c0c]' : 'text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    Square 1:1
                  </button>
                  <button
                    onClick={() => setDesignerFormat('story-9-16')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      designerFormat === 'story-9-16' ? 'bg-[#c5a059] text-[#0c0c0c]' : 'text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    Story 9:16
                  </button>
                  <button
                    onClick={() => setDesignerFormat('portrait-4-5')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      designerFormat === 'portrait-4-5' ? 'bg-[#c5a059] text-[#0c0c0c]' : 'text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    Feed 4:5
                  </button>
                </div>
              </div>

              {/* Theme Palette */}
              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1.5">Color Palette:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'dark-gold', name: 'Dark & Gold' },
                    { id: 'rose-velvet', name: 'Rose Velvet' },
                    { id: 'sage-botanical', name: 'Sage Botanical' },
                    { id: 'clean-minimal', name: 'Clean Ivory' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setDesignerTheme(t.id as any)}
                      className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        designerTheme === t.id
                          ? 'bg-[#c5a059]/20 border-[#c5a059] text-white font-bold'
                          : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text fields */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Top Headline Banner:</label>
                  <input
                    type="text"
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Featured Sticker Badge:</label>
                  <input
                    type="text"
                    value={customBadge}
                    onChange={(e) => setCustomBadge(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Price Subtitle / Slot Tag:</label>
                  <input
                    type="text"
                    value={customPriceTag}
                    onChange={(e) => setCustomPriceTag(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-white outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <button
                onClick={handleDownloadGraphic}
                disabled={isExportingDesign}
                className="w-full py-3 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isExportingDesign ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Download High-Res Graphic</span>
              </button>
            </div>
          </div>

          {/* Graphic Canvas Output */}
          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-[#0e0e10] rounded-3xl border border-[#27272a]">
            <div
              ref={postGraphicRef}
              className={`relative overflow-hidden rounded-3xl shadow-2xl border-4 border-[#c5a059]/40 flex flex-col justify-between p-7 select-none transition-all ${
                designerFormat === 'square-1-1'
                  ? 'w-full max-w-[440px] aspect-square'
                  : designerFormat === 'story-9-16'
                  ? 'w-full max-w-[360px] aspect-[9/16]'
                  : 'w-full max-w-[390px] aspect-[4/5]'
              }`}
            >
              {/* Background Photo & Layer */}
              <div className="absolute inset-0 z-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div
                  className={`absolute inset-0 ${
                    designerTheme === 'dark-gold'
                      ? 'bg-gradient-to-b from-black/85 via-black/40 to-black/95'
                      : designerTheme === 'rose-velvet'
                      ? 'bg-gradient-to-b from-[#3a0d1b]/85 via-transparent to-[#140409]/95'
                      : designerTheme === 'sage-botanical'
                      ? 'bg-gradient-to-b from-[#14281f]/85 via-transparent to-[#08120e]/95'
                      : 'bg-gradient-to-b from-[#1c1c1c]/80 via-transparent to-[#0a0a0a]/95'
                  }`}
                ></div>
              </div>

              {/* Top Header Card */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={BRAND_LOGO}
                    alt="Logo"
                    className="w-10 h-10 rounded-full border-2 border-[#c5a059] shadow-md"
                  />
                  <div>
                    <h4 className="text-xs font-serif font-bold text-white tracking-wide leading-none">
                      {businessInfo.name}
                    </h4>
                    <span className="text-[9px] text-[#c5a059]">Marondera • Handcrafted</span>
                  </div>
                </div>

                <span className="text-[10px] bg-black/70 backdrop-blur-md text-[#c5a059] font-bold px-3 py-1 rounded-full border border-[#c5a059]/40 shadow-sm">
                  {customBadge}
                </span>
              </div>

              {/* Center Floating Slogan */}
              <div className="relative z-10 self-center text-center space-y-1">
                <span className="text-[9px] tracking-widest uppercase font-bold text-[#c5a059] bg-black/60 px-3 py-0.5 rounded-full border border-[#c5a059]/20">
                  {customHeadline}
                </span>
              </div>

              {/* Bottom Price & Callout */}
              <div className="relative z-10 bg-black/85 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold leading-tight text-[#fdfcfb]">
                      {selectedProduct.name}
                    </h3>
                    <span className="text-[10px] text-[#a1a1aa] block">{customPriceTag}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-black text-[#c5a059]">
                      ${selectedProduct.priceUSD} USD
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#d4d4d8]">
                  <span className="flex items-center gap-1 text-[#25D366] font-bold">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp: {businessInfo.phones[0]}
                  </span>
                  <span className="text-[#c5a059]">tatna-crocheting-corner.vercel.app</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: VIRAL CAPTIONS & WHATSAPP BLASTS */}
      {/* ======================================================== */}
      {activeTab === 'captions' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Target Platform:</label>
                <select
                  value={captionPlatform}
                  onChange={(e) => setCaptionPlatform(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-[#fdfcfb] font-medium outline-none focus:ring-1 focus:ring-[#c5a059]"
                >
                  <option value="instagram">📸 Instagram Post & Reel Caption</option>
                  <option value="tiktok">🎵 TikTok Caption & Trending SEO Tags</option>
                  <option value="whatsapp">💬 WhatsApp Status & Group Broadcast</option>
                  <option value="facebook">👥 Facebook Page Post</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Tone of Voice:</label>
                <select
                  value={captionTone}
                  onChange={(e) => setCaptionTone(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#18181b] border border-[#27272a] rounded-xl text-[#fdfcfb] font-medium outline-none focus:ring-1 focus:ring-[#c5a059]"
                >
                  <option value="stylish">🌸 Artisanal Luxury & Warm Elegance</option>
                  <option value="playful">✨ Playful, Trendy & Gen-Z Aesthetic</option>
                  <option value="urgency">⏳ Flash Sale & Limited Weekly Slots</option>
                  <option value="storytelling">🧵 Behind The Stitches & Craft Story</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateCaptions}
              disabled={isGeneratingCaptions}
              className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingCaptions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>{isGeneratingCaptions ? 'Crafting Captions...' : 'Generate 3 Angles'}</span>
            </button>
          </div>

          {/* Generated Captions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generatedCaptions.map((cap, idx) => (
              <div
                key={idx}
                className="bg-[#141416] p-5 rounded-3xl border border-[#27272a] hover:border-[#c5a059]/40 transition-all flex flex-col justify-between gap-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-0.5 rounded-full">
                      Angle {idx + 1}: {cap.angle}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cap.body + '\n\n' + cap.hashtags.join(' '), idx)}
                      className="text-xs text-[#c5a059] font-bold hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-xs font-bold text-white leading-snug">
                    {cap.hook}
                  </p>

                  <div className="text-xs text-[#d4d4d8] leading-relaxed whitespace-pre-line bg-[#18181b] p-3.5 rounded-2xl border border-[#27272a]/60">
                    {cap.body}
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] text-[#c5a059]">
                    {cap.hashtags?.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-[#18181b] px-2 py-0.5 rounded-md border border-[#27272a]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Status Short Snippet */}
                <div className="bg-[#25D366]/10 p-3 rounded-2xl border border-[#25D366]/20 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#25D366] uppercase flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> WhatsApp Status Quick Blast:
                  </span>
                  <p className="text-[11px] text-white">
                    {cap.whatsappSnippet}
                  </p>
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/?text=${encodeURIComponent(cap.whatsappSnippet)}`, '_blank');
                    }}
                    className="w-full py-1.5 bg-[#25D366] text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 hover:bg-[#20BA5A] transition-all"
                  >
                    Share Blast on WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: 7-DAY SOCIAL MEDIA POSTING CALENDAR */}
      {/* ======================================================== */}
      {activeTab === 'campaign-planner' && (
        <div className="space-y-6">
          <div className="bg-[#141416] p-5 rounded-2xl border border-[#27272a] shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider block">
                Campaign Theme:
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                {campaignTheme}
              </h3>
            </div>

            <button
              onClick={handleGenerateCampaignPlan}
              disabled={isGeneratingPlan}
              className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b76e] text-[#0c0c0c] text-xs font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>{isGeneratingPlan ? 'Re-Planning Schedule...' : 'Regenerate Weekly Plan'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {campaignSchedule.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#141416] p-4 rounded-2xl border border-[#27272a] hover:border-[#c5a059]/40 transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                    <span className="font-bold text-xs text-[#fdfcfb]">
                      Day {item.day || idx + 1}: {item.dayName}
                    </span>
                    <span className="text-[10px] text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded-full border border-[#c5a059]/20">
                      {item.postType}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#a1a1aa] space-y-1">
                    <strong className="text-white block">Focus: {item.productFocus}</strong>
                    <p className="text-[11px] text-[#d4d4d8] leading-relaxed">
                      💡 {item.contentIdea}
                    </p>
                  </div>

                  <div className="bg-[#18181b] p-2.5 rounded-xl border border-[#27272a] text-[10px] text-amber-200">
                    <strong>Caption Hook:</strong> &ldquo;{item.captionHook}&rdquo;
                  </div>
                </div>

                <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[10px] text-[#71717a]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#c5a059]" /> {item.bestPostingTime}
                  </span>
                  <span className="text-[#52B788] font-semibold">{item.pillar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: TRENDING PRODUCT & DROP IDEAS */}
      {/* ======================================================== */}
      {activeTab === 'trend-ideas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141416] p-6 rounded-3xl border border-[#27272a] space-y-4 shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Trending Yarn Palettes 2026
            </h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Top trending crochet colors capturing high engagement on TikTok & Instagram in Southern Africa:
            </p>
            <ul className="space-y-2 text-xs text-[#d4d4d8]">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E3A857]"></span>
                <span><strong>Butter Yellow & Warm Cream:</strong> Beanie & top bestsellers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8A9A5B]"></span>
                <span><strong>Sage Botanical Green:</strong> Market totes & cardigans</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D48396]"></span>
                <span><strong>Dusty Rose & Wine:</strong> Everlasting sunflower bouquets</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C19A6B]"></span>
                <span><strong>Espresso & Oat Neutral:</strong> Crochet slippers & slops</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#141416] p-6 rounded-3xl border border-[#27272a] space-y-4 shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-[#d48396]/10 border border-[#d48396]/30 text-[#d48396] flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              High-Demand Gift Bundles
            </h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Curated bundle offers that increase average order value from $5 to $25+ USD:
            </p>
            <ul className="space-y-2 text-xs text-[#d4d4d8]">
              <li className="p-2.5 bg-[#18181b] rounded-xl border border-[#27272a]">
                <strong>🌸 &ldquo;Forever Bloom&rdquo; Bundle:</strong> 3-Stem Rose Bouquet + Mini Lavender Sprig ($10 USD)
              </li>
              <li className="p-2.5 bg-[#18181b] rounded-xl border border-[#27272a]">
                <strong>🧶 &ldquo;Cozy Season&rdquo; Duo:</strong> Slouchy Beanie + Matching Fingerless Gloves ($14 USD)
              </li>
              <li className="p-2.5 bg-[#18181b] rounded-xl border border-[#27272a]">
                <strong>👶 &ldquo;Newborn Welcome&rdquo; Pack:</strong> Baby Booties + Rattle + Soft Bonnet ($12 USD)
              </li>
            </ul>
          </div>

          <div className="bg-[#141416] p-6 rounded-3xl border border-[#27272a] space-y-4 shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-[#52B788]/10 border border-[#52B788]/30 text-[#52B788] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              WhatsApp Conversion Secrets
            </h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Proven tactics used by top handmade brands in Zimbabwe to close customer inquiries on WhatsApp:
            </p>
            <ul className="space-y-2 text-xs text-[#d4d4d8]">
              <li>• Reply with your live catalog link so clients view all color options with verified prices.</li>
              <li>• Always specify turnaround days (e.g. &ldquo;Ready in 2-3 days for Marondera pickup&rdquo;).</li>
              <li>• Send a photo of yarn skeins ready for their order to build trust and excitement.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RECORDING / TELEPROMPTER MODAL */}
      {/* ======================================================== */}
      {isTeleprompterOpen && videoScript && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-[#141416] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#27272a] shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059]">
                  Reels & TikTok Teleprompter Practice Mode
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  {videoScript.title}
                </h3>
              </div>

              <button
                onClick={() => setIsTeleprompterOpen(false)}
                className="p-2 rounded-full bg-[#18181b] text-[#a1a1aa] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Timer & Controls */}
            <div className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-mono font-bold text-[#c5a059]">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
                <span className="text-xs text-[#a1a1aa]">/ {videoScript.targetDuration || '20s'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTeleprompterPlay}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isPlayingTimer ? 'bg-[#e89bae] text-[#0c0c0c]' : 'bg-[#c5a059] text-[#0c0c0c]'
                  }`}
                >
                  {isPlayingTimer ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingTimer ? 'Pause' : 'Start Timer'}</span>
                </button>
                <button
                  onClick={resetTeleprompterTimer}
                  className="p-2 rounded-xl bg-[#27272a] text-[#d4d4d8] hover:text-white"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Current Active Scene Focus */}
            <div className="bg-[#0c0c0c] p-6 rounded-3xl border-2 border-[#c5a059] space-y-3 text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] bg-[#c5a059]/15 px-3 py-1 rounded-full border border-[#c5a059]/30 inline-block">
                Scene {activeSceneIndex + 1} of {videoScript.scenes.length} ({videoScript.scenes[activeSceneIndex]?.timing})
              </span>

              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                &ldquo;{videoScript.scenes[activeSceneIndex]?.voiceoverOrAction}&rdquo;
              </h4>

              <div className="pt-2 text-xs text-[#a1a1aa] flex items-center justify-center gap-2">
                <Camera className="w-4 h-4 text-[#d48396]" />
                <span>Action: {videoScript.scenes[activeSceneIndex]?.visual}</span>
              </div>
            </div>

            {/* Scene navigator */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSceneIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeSceneIndex === 0}
                className="px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs text-white disabled:opacity-40"
              >
                Previous Scene
              </button>

              <div className="flex gap-1.5">
                {videoScript.scenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSceneIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeSceneIndex === idx ? 'bg-[#c5a059] scale-125' : 'bg-[#27272a]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveSceneIndex((prev) => Math.min(videoScript.scenes.length - 1, prev + 1))}
                disabled={activeSceneIndex === videoScript.scenes.length - 1}
                className="px-4 py-2 rounded-xl bg-[#c5a059] text-[#0c0c0c] font-bold text-xs disabled:opacity-40"
              >
                Next Scene
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
