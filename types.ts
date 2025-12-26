
export enum Category {
  TECH = 'تقنية',
  NEWS = 'أخبار المغرب',
  REVIEWS = 'مراجعات',
  TIPS = 'نصائح وحلول'
}

/**
 * Article interface updated to support both blog posts and product items.
 * Fields like name, price, and isProduct are added for shop functionality.
 * title and excerpt are made optional to accommodate product-only entries.
 */
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

/**
 * CartItem extends Article with quantity for shopping cart functionality.
 */
export interface CartItem extends Article {
  quantity: number;
}

/**
 * Settings interface for site-wide configuration and security.
 */
export interface Settings {
  dashboardPassword?: string;
  siteName: string;
  adsenseCode: string;
}

export type View = 'home' | 'post' | 'admin';
