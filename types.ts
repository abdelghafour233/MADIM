
export enum Category {
  TECH = 'تقنية',
  NEWS = 'أخبار المغرب',
  REVIEWS = 'مراجعات',
  TIPS = 'نصائح وحلول',
  AI = 'ذكاء اصطناعي'
}

// Fixed: Added optional properties used by products and different component versions (title vs name, rating, price, etc.)
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
}

// Fixed: Added Settings interface used in Dashboard and ArticleDetail
export interface Settings {
  dashboardPassword?: string;
  siteName: string;
  adsenseCode: string;
}

// Fixed: Added CartItem interface used in Cart component
export interface CartItem extends Article {
  quantity: number;
}

export type View = 'home' | 'post' | 'admin';
