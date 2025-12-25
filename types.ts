
export enum Category {
  TECH = 'تقنية وتكنولوجيا',
  MOROCCO = 'أخبار المغرب',
  LIFESTYLE = 'أسلوب حياة',
  PRODUCTIVITY = 'تطوير الذات',
  REVIEWS = 'مراجعات وتقييمات',
  STORE = 'المتجر'
}

export interface Article {
  id: string;
  name: string;
  content: string;
  image: string;
  category: Category;
  rating: number;
  price?: number; // للمنتجات
  views?: number;
  author?: string;
  date?: string;
  isProduct?: boolean;
}

export interface CartItem extends Article {
  quantity: number;
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

export type View = 'home' | 'article' | 'product' | 'category' | 'dashboard' | 'about' | 'privacy' | 'contact' | 'checkout';
