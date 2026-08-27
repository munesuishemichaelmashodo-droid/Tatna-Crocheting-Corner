import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// AI Content Generation Endpoint (Captions, Video Scripts, Marketing Plans)
app.post('/api/generate-content', async (req, res) => {
  try {
    const { type, product, options } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return high quality intelligent fallback generation if API key is not configured
      const fallback = generateFallbackContent(type, product, options);
      return res.json({ result: fallback, source: 'smart-template' });
    }

    let prompt = '';
    let systemInstruction = `You are the Lead Creative Director & Social Media Strategist for "Tatna Crocheting Corner", a luxury handmade crochet brand based in Marondera, Zimbabwe.
The brand handcrafts premium crochet wear (crop tops, beanies, sweaters, swimwear, skirts), cute footwear (slops, baby booties), bags (totes, market nets), and everlasting crochet flower bouquets (roses, sunflowers, lavender).
Pricing is in USD (e.g. $1 to $25 USD).
Tone: Warm, artisanal, stylish, engaging, culturally authentic to Zimbabwe with global appeal. Mention WhatsApp ordering and catalog link (https://tatna-crocheting-corner.vercel.app).`;

    if (type === 'video-script') {
      const style = options?.style || 'aesthetic-asmr';
      prompt = `Create a viral short-form video script (15-30 seconds for Instagram Reels / TikTok / WhatsApp Status) for the following product:
Product: ${product?.name || 'Crochet Collection'}
Category: ${product?.category || 'Fashion'}
Price: $${product?.priceUSD || 10} USD
Colors: ${product?.availableColors?.join(', ') || 'Custom colors'}
Video Concept / Style: ${style}
Special details: ${options?.specialNotes || 'Focus on handmade craftsmanship, texture, and styling in Zimbabwe'}

Format your response cleanly in JSON with the following structure:
{
  "title": "Short catchy video title",
  "hook": "Spoken or text-on-screen hook for the first 2-3 seconds that stops scrolling",
  "recommendedAudio": "Type of trending music / sound (e.g. Chill Amapiano beat, Soft Lofi Yarn ASMR, Upbeat Afrobeats)",
  "targetDuration": "20s",
  "scenes": [
    {
      "sceneNumber": 1,
      "timing": "0:00 - 0:03",
      "visual": "Exact camera shot description (e.g. Close-up macro of yarn needle pulling through)",
      "textOnScreen": "Text banner to display",
      "voiceoverOrAction": "What to say or do in this shot"
    }
  ],
  "caption": "Complete ready-to-post Instagram & TikTok caption with hashtags",
  "callToAction": "Clear instruction for the viewer (e.g. DM to order or tap link in bio)"
}`;
    } else if (type === 'captions') {
      const platform = options?.platform || 'instagram';
      const tone = options?.tone || 'stylish';
      prompt = `Generate 3 distinct high-converting social media captions for:
Product: ${product?.name || 'Handcrafted Crochet Wear'}
Price: $${product?.priceUSD || 10} USD
Platform: ${platform} (e.g. Instagram, TikTok, WhatsApp Broadcast, Facebook)
Tone: ${tone} (e.g. Artisanal Luxury, Fun & Relatable, Flash Sale Urgency, Behind-The-Scenes Story)
Location: Marondera & Harare, Zimbabwe
Website: https://tatna-crocheting-corner.vercel.app

Format your response in JSON:
{
  "captions": [
    {
      "angle": "Name of the angle (e.g. Luxury Artisanal Hook, Problem & Solution, Urgency/Limited Slots)",
      "hook": "First line to hook readers",
      "body": "Full caption text with emojis and formatting",
      "hashtags": ["#TatnaCrochet", "#HandmadeInZimbabwe", ...],
      "whatsappSnippet": "Short 2-line WhatsApp status version"
    }
  ]
}`;
    } else if (type === 'campaign-plan') {
      const days = options?.days || 7;
      prompt = `Generate a comprehensive ${days}-Day Social Media Content Calendar for Tatna Crocheting Corner featuring our product catalog:
Focus Products: ${options?.focusProduct || 'Full Collection (Wear, Bags, Flowers, Footwear)'}
Goal: ${options?.goal || 'Drive WhatsApp orders & website catalog visits from Marondera and nationwide'}

Format as JSON:
{
  "theme": "Overall campaign theme (e.g. 'Cozy Stitches & Everlasting Blooms')",
  "schedule": [
    {
      "day": 1,
      "dayName": "Monday",
      "pillar": "Behind The Scenes / Craftsmanship",
      "postType": "Reels / TikTok (9:16)",
      "productFocus": "Beanie or Top",
      "contentIdea": "Time-lapse of stitching row 1 to finish",
      "captionHook": "Did you know it takes over 3 hours to hand-stitch this?",
      "bestPostingTime": "12:30 PM & 6:30 PM CAT"
    }
  ]
}`;
    } else {
      prompt = `Write promotional marketing copy for Tatna Crocheting Corner for ${product?.name || 'Crochet items'}. Include headline, 3 selling points, and CTA. Return as JSON: { "headline": "", "sellingPoints": [], "callToAction": "" }`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch {
      parsedResult = { rawText: text };
    }

    res.json({ result: parsedResult, source: 'gemini' });
  } catch (error: any) {
    console.error('Gemini content generation error:', error);
    // Graceful fallback on any API error
    const fallback = generateFallbackContent(req.body.type, req.body.product, req.body.options);
    res.json({ result: fallback, source: 'fallback', message: error.message });
  }
});

// Helper for offline / fallback generation
function generateFallbackContent(type: string, product: any, options: any) {
  const pName = product?.name || 'Handcrafted Crochet Piece';
  const pPrice = product?.priceUSD || 10;
  const pColors = product?.availableColors?.join(', ') || 'Custom Pastel & Neutral Shades';

  if (type === 'video-script') {
    return {
      title: `Making the Viral ${pName} in Marondera`,
      hook: `Stop scrolling if you love handmade fashion that lasts forever 🧶✨`,
      recommendedAudio: 'Soft Instrumental Acoustic / Warm Chill Afro-Lofi',
      targetDuration: '22s',
      scenes: [
        {
          sceneNumber: 1,
          timing: '0:00 - 0:03',
          visual: 'Extreme close-up: Fast hook motion pulling soft yarn through loops with tactile ASMR sound',
          textOnScreen: `How we make the ${pName} from scratch ✨`,
          voiceoverOrAction: 'Here is what goes into making one of our most requested custom orders in Marondera...'
        },
        {
          sceneNumber: 2,
          timing: '0:03 - 0:08',
          visual: 'Medium shot showing color selection: displaying ' + pColors,
          textOnScreen: `Available in ${pColors}`,
          voiceoverOrAction: 'Every single stitch is hand-woven with premium soft yarn, completely customized to your exact measurements.'
        },
        {
          sceneNumber: 3,
          timing: '0:08 - 0:15',
          visual: 'Finished product styling reveal: Model turning or shaking the item gently in natural sunlight',
          textOnScreen: `Only $${pPrice} USD • Custom Made`,
          voiceoverOrAction: 'The final result? An iconic handcrafted staple that never goes out of style.'
        },
        {
          sceneNumber: 4,
          timing: '0:15 - 0:22',
          visual: 'Packing the order neatly into branded packaging with a handwritten thank-you tag',
          textOnScreen: 'Tap link in bio / WhatsApp to order! 🌸',
          voiceoverOrAction: 'Tap our website link or send us a DM on WhatsApp to claim your booking slot today!'
        }
      ],
      caption: `✨ Handcrafted with pure love right here in Marondera! The ${pName} is now open for custom color orders ($${pPrice} USD). 🧶\n\n🎨 Colors available: ${pColors}\n⏳ Turnaround: 2-4 days\n📍 Marondera collection & courier nationwide\n\n📲 Tap the link in our bio to browse the live catalog or DM us on WhatsApp! 🌸\n\n#TatnaCrochet #Marondera #ZimbabweHandmade #CrochetFashion #HandmadeWithLove`,
      callToAction: `Send a WhatsApp message to book your slot for the ${pName}!`
    };
  }

  if (type === 'captions') {
    return {
      captions: [
        {
          angle: 'Artisanal Craft & Luxury Value',
          hook: `Why buy mass-produced when you can wear wearable art made just for you? 🌸`,
          body: `Meet our signature ${pName} ($${pPrice} USD). Every row is hand-stitched in Marondera using ultra-soft, breathable yarn tailored to your unique aesthetic.\n\n✨ Made to order in ${pColors}\n✨ Custom fit guaranteed\n✨ Available for collection in Marondera or courier delivery\n\nTap our bio link to view all 17 items on our live digital menu!`,
          hashtags: ['#TatnaCrochet', '#MaronderaCrochet', '#ZimHandmade', '#CrochetStyle', '#ShopLocalZim'],
          whatsappSnippet: `🌸 *${pName}* now available for custom order! Only *$${pPrice} USD*. Tap to view catalog: https://tatna-crocheting-corner.vercel.app`
        },
        {
          angle: 'Gift Idea / Everlasting Beauty',
          hook: `Looking for a thoughtful, personalized gift that won't end up in the back of a closet? 🎁`,
          body: `Our ${pName} is one of our top customer favorites! Whether you're treating yourself or surprising someone special, this handcrafted piece adds instant charm and warmth.\n\n💰 Price: $${pPrice} USD\n🎨 Choose your favorite color palette\n📍 Handcrafted in Marondera, Zimbabwe\n\n📲 Send us a DM or WhatsApp message to reserve your production slot!`,
          hashtags: ['#ZimGiftIdeas', '#HandmadeGifts', '#CrochetMarondera', '#TatnaCorner'],
          whatsappSnippet: `🎁 Surprise someone with our handcrafted *${pName}* ($${pPrice} USD). WhatsApp us to order!`
        },
        {
          angle: 'Limited Weekly Slots Urgency',
          hook: `Only 4 custom booking slots left for this week's batch! ⏳🧶`,
          body: `Because every single ${pName} is 100% handmade by one pair of hands, our weekly slots fill up fast.\n\nGrab yours before the weekend rush for only $${pPrice} USD.\n\n👉 Browse full pricing & color swatches on our website or tap WhatsApp to secure your piece today!`,
          hashtags: ['#TatnaCrochetCorner', '#HandmadeFashion', '#MaronderaCreatives'],
          whatsappSnippet: `⏳ Limited handcrafted slots for *${pName}* ($${pPrice} USD). Secure yours on WhatsApp now!`
        }
      ]
    };
  }

  // Fallback 7-day schedule
  return {
    theme: 'Artisanal Warmth & Spring Crochet Collection',
    schedule: [
      {
        day: 1,
        dayName: 'Monday',
        pillar: 'Behind The Scenes',
        postType: 'Reels / Video (9:16)',
        productFocus: 'Slouchy Beanie or Top',
        contentIdea: 'Macro ASMR video of yarn needle and tension check',
        captionHook: 'Starting the week with fresh yarn and endless possibilities 🧶✨',
        bestPostingTime: '12:30 PM & 6:00 PM CAT'
      },
      {
        day: 2,
        dayName: 'Tuesday',
        pillar: 'Styling Inspiration',
        postType: 'Carousel Post (1:1 / 4:5)',
        productFocus: 'Crochet Slops & Bags',
        contentIdea: '3 ways to style handmade crochet footwear and tote bags',
        captionHook: 'Which colorway is your favorite? 1, 2, or 3? 👇',
        bestPostingTime: '1:00 PM & 7:00 PM CAT'
      },
      {
        day: 3,
        dayName: 'Wednesday',
        pillar: 'Product Spotlight',
        postType: 'Story Series + WhatsApp Status',
        productFocus: 'Sunflower & Rose Bouquets',
        contentIdea: 'Everlasting flowers that never wilt - price breakdown from $1 USD',
        captionHook: 'Real flowers fade in a week. These blooms last forever 🌻💕',
        bestPostingTime: '11:00 AM & 5:30 PM CAT'
      },
      {
        day: 4,
        dayName: 'Thursday',
        pillar: 'Customer Proof & Packing',
        postType: 'Short Video / Reel',
        productFocus: 'Custom Order Delivery',
        contentIdea: 'Pack an order with me: folding, tag attaching, and wrapping',
        captionHook: 'Packing this beauty heading to its new home today! 📦✨',
        bestPostingTime: '2:00 PM & 6:30 PM CAT'
      },
      {
        day: 5,
        dayName: 'Friday',
        pillar: 'Weekend Outfit Drop',
        postType: 'High-Res Photo & Status Card',
        productFocus: 'Bralette / Crop Top Collection',
        contentIdea: 'Golden hour model shoot or clean flatlay with gold jewelry',
        captionHook: 'Weekend plans sorted with the perfect handmade piece ✨',
        bestPostingTime: '3:30 PM & 7:30 PM CAT'
      },
      {
        day: 6,
        dayName: 'Saturday',
        pillar: 'Engagement / Poll',
        postType: 'Interactive Story Polls',
        productFocus: 'New Yarn Color Swatches',
        contentIdea: 'Help me choose next week yarn palette (Sage Green vs Butter Yellow)',
        captionHook: 'Vote on our story: which shade should we make next? 🎨',
        bestPostingTime: '10:00 AM & 4:00 PM CAT'
      },
      {
        day: 7,
        dayName: 'Sunday',
        pillar: 'Weekly Slot Booking Reminder',
        postType: 'Official Price List Poster Export',
        productFocus: 'Full Menu & Custom Orders',
        contentIdea: 'Official weekly menu recap: prices from $1 USD with direct WhatsApp link',
        captionHook: 'Booking slots for next week are now open! Reserve yours early 🗓️',
        bestPostingTime: '5:00 PM & 8:00 PM CAT'
      }
    ]
  };
}

// Start development or production server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tatna Crocheting Corner server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
