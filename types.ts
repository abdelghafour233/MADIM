
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
  // Added price property to support e-commerce components like ProductDetail and Cart
  price?: number;
}

// Added CartItem interface to resolve the missing export error in components/Cart.tsx
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

export type View = 'home' | 'article' | 'category' | 'dashboard' | 'about' | 'privacy' | 'contact';
