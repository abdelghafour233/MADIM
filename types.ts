
export enum Category {
  REVIEWS = 'مراجعات المنتجات',
  BEST_OFFERS = 'أفضل العروض',
  GUIDES = 'أدلة الشراء',
  TECH = 'تقنية'
}

export interface Article {
  id: string;
  // Renamed from title to name to fix errors in constants.tsx and components
  name: string;
  price: number;
  content: string;
  image: string;
  category: Category;
  affiliateLink: string;
  rating: number;
}

// Added missing Product interface required by Cart and ProductDetail components
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface Settings {
  fbPixel: string;
  googleAnalytics: string;
  tiktokPixel: string;
  domain: string;
  dashboardPassword?: string;
  siteName: string;
  siteDescription: string;
}

export type View = 'home' | 'category' | 'article' | 'dashboard';