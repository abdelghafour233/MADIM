
export enum Category {
  MOROCCO_NEWS = 'أخبار المغرب',
  TECH = 'التقنية',
  SELF_DEV = 'تطوير الذات',
  REVIEWS = 'تقييم المنتجات'
}

export interface Article {
  id: string;
  title?: string;
  name?: string;
  excerpt?: string;
  content: string;
  image: string;
  category: Category;
  date: string;
  views: number;
  author: string;
  price?: number;
  isProduct?: boolean;
  rating?: number;
  isTrending?: boolean;
}

export interface Settings {
  dashboardPassword?: string;
  siteName: string;
  adsenseCode: string;
  totalVisits?: number;
}

export interface CartItem extends Article {
  quantity: number;
}

export type View = 'home' | 'post' | 'product' | 'cart' | 'checkout' | 'admin' | 'about' | 'privacy' | 'contact';
