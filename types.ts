
export enum Category {
  REVIEWS = 'مراجعات المنتجات',
  BEST_OFFERS = 'أفضل العروض',
  GUIDES = 'أدلة الشراء',
  TECH = 'تقنية'
}

export interface Article {
  id: string;
  name: string;
  price: number;
  content: string;
  image: string;
  category: Category;
  rating: number;
}

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
  adsenseCode: string;
  adsTxt: string;
  domain: string;
  dashboardPassword?: string;
  siteName: string;
  siteDescription: string;
}

export type View = 'home' | 'category' | 'article' | 'dashboard';
