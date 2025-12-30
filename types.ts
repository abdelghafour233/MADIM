
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
  name?: string; 
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
  isProduct?: boolean; 
  price?: number;
  marketPrice?: number; // السعر الأصلي في السوق المحلي للمقارنة
}

export interface CartItem extends Article {
  quantity: number;
}

export interface Settings {
  siteName: string;
  adsenseCode: string;
  alternativeAdsCode: string; // Adsterra Native Banner
  globalAdsCode: string; // Adsterra Social Bar / Popunder Script
  directLinkCode: string; // Adsterra Direct Link (e.g. your ID 5500631)
  dashboardPassword?: string;
  totalVisits: number;
  whatsappNumber: string;
}

export type View = 'home' | 'post' | 'admin' | 'privacy' | 'about' | 'contact' | 'terms' | 'checkout' | 'store' | 'product';
