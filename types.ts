
export enum Category {
  TEMU = 'عروض تيمو',
  AMAZON = 'عروض أمازون',
  TECH_REVIEWS = 'مراجعات تقنية',
  MOROCCO_NEWS = 'أخبار المغرب',
  DEALS = 'هميزات اليوم'
}

export interface Article {
  id: string;
  title: string;
  name?: string; // التوافق مع النسخ السابقة
  excerpt: string;
  content: string;
  image: string;
  category: Category;
  date: string;
  views: number;
  author: string;
  affiliateLink?: string;
  couponCode?: string;
  isTrending?: boolean;
  isProduct?: boolean; // للمحافظة على التوافق البرمجي
  price?: number;
}

/**
 * Interface for items stored in the shopping cart, extending Article with quantity.
 */
export interface CartItem extends Article {
  quantity: number;
}

export interface Settings {
  siteName: string;
  adsenseCode: string;
  alternativeAdsCode: string; // Adsterra Native Banner
  globalAdsCode: string; // Adsterra Social Bar Script
  dashboardPassword?: string;
  totalVisits: number;
  whatsappNumber: string;
}

export type View = 'home' | 'post' | 'admin' | 'privacy' | 'about' | 'contact' | 'terms' | 'checkout' | 'store' | 'product';
