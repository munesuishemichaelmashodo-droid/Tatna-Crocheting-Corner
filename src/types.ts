export type ProductCategory = 
  | 'all' 
  | 'hats' 
  | 'bags' 
  | 'footwear' 
  | 'accessories' 
  | 'apparel' 
  | 'bouquets';

export interface CrochetProduct {
  id: string;
  name: string;
  category: 'hats' | 'bags' | 'footwear' | 'accessories' | 'apparel' | 'bouquets';
  priceUSD: number;
  originalPriceUSD?: number;
  description: string;
  image: string;
  availableColors: string[];
  materials: string;
  leadTime: string;
  careInstructions: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  featuredInPoster?: boolean;
}

export interface BusinessInfo {
  name: string;
  owner: string;
  tagline: string;
  description: string;
  location: string;
  phones: string[];
  primaryPhone: string;
  instagram: string;
  whatsappMessage: string;
  currencyRates?: {
    USD: number;
  };
}

export type PosterTheme = 'editorial' | 'pastel' | 'streetwear' | 'botanical';
export type PosterFormat = 'a4' | 'story' | 'square' | 'banner';

export interface PosterSettings {
  theme: PosterTheme;
  format: PosterFormat;
  headline: string;
  subheadline: string;
  announcement: string;
  showPrices: boolean;
  showQrCode: boolean;
  showPhones: boolean;
  showLocation: boolean;
  accentColor: string;
  selectedProductIds: string[];
}

export interface CartItem {
  product: CrochetProduct;
  quantity: number;
  selectedColor: string;
  customNotes?: string;
}

export type OrderPriority = 'standard' | 'priority' | 'rush';

export type BookingServiceType =
  | 'custom-piece'
  | 'bouquet-gift'
  | 'wearable-polo'
  | 'bridal-party-set'
  | 'alteration-repair'
  | 'bulk-wholesale';

export interface BookingOrder {
  id: string;
  bookingCode: string;
  serviceType: BookingServiceType;
  serviceName: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  deliveryLocation: string;
  targetDate: string;
  priority: OrderPriority;
  selectedProducts: {
    productId: string;
    productName: string;
    quantity: number;
    colorway: string;
    unitPriceUSD: number;
  }[];
  customDimensions?: string;
  colorPaletteDescription: string;
  giftCardMessage?: string;
  specialRequests?: string;
  estimatedTotalUSD: number;
  depositRequiredUSD: number;
  status: 'pending_confirmation' | 'confirmed' | 'in_progress' | 'ready_for_pickup';
  createdAt: string;
}

