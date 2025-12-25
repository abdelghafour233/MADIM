
export enum Category {
  TECH = 'تقنية وتكنولوجيا',
  MOROCCO = 'أخبار المغرب',
  LIFESTYLE = 'أسلوب حياة',
  PRODUCTIVITY = 'تطوير الذات',
  NEWS = 'أخبار عاجلة',
  REVIEWS = 'مراجعات وتقييمات',
  STORE = 'المتجر الإلكتروني'
}

export interface Comment {
  id: string;
  userName: string;
  text: string;
  date: string;
}

export interface Article {
  id: string;
  name: string;
  content: string;
  image: string;
  category: Category;
  rating: number;
  likes?: number;
  views?: number;
  comments?: Comment[];
  author?: string;
  date?: string;
  price?: number; // السعر بالدرهم المغربي
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
  ezoicCode?: string;
  taboolaCode?: string;
  propellerCode?: string;
  adsTxt: string;
  domain: string;
  dashboardPassword?: string;
  siteName: string;
  siteDescription: string;
  affiliateTemuLink?: string;
  affiliateAmazonLink?: string;
}

export type View = 'home' | 'article' | 'category' | 'dashboard' | 'about' | 'privacy' | 'contact' | 'store' | 'cart';
