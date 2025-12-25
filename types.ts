
export enum Category {
  TECH = 'تقنية وتكنولوجيا',
  MOROCCO = 'أخبار المغرب',
  LIFESTYLE = 'أسلوب حياة',
  PRODUCTIVITY = 'تطوير الذات',
  NEWS = 'أخبار عاجلة',
  REVIEWS = 'مراجعات وتقييمات'
}

export interface Comment {
  id: string;
  userName: string;
  text: string;
  date: string;
}

/* Fix: Added price property to Article interface to support ProductDetail and Cart components */
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
  price?: number;
}

/* Fix: Exporting CartItem interface which was missing and causing errors in components/Cart.tsx */
export interface CartItem extends Article {
  quantity: number;
}

export interface Settings {
  fbPixel: string;
  googleAnalytics: string;
  tiktokPixel: string;
  adsenseCode: string;
  ezoicCode?: string;
  adsTxt: string;
  domain: string;
  dashboardPassword?: string;
  siteName: string;
  siteDescription: string;
  affiliateTemuLink?: string;
}

export type View = 'home' | 'article' | 'category' | 'dashboard' | 'about' | 'privacy' | 'contact';
