
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

export type View = 'home' | 'article' | 'category' | 'dashboard';
