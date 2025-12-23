
export enum Category {
  TECH = 'تقنية وتكنولوجيا',
  BUSINESS = 'ريادة أعمال',
  LIFESTYLE = 'أسلوب حياة',
  PRODUCTIVITY = 'تطوير الذات',
  NEWS = 'أخبار حصرية',
  REVIEWS = 'مراجعات المنتجات'
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
  price: number;
  content: string;
  image: string;
  category: Category;
  rating: number;
  likes?: number;
  views?: number;
  comments?: Comment[];
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
