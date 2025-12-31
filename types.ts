
export enum Category {
  TEMU = 'عروض تيمو',
  AMAZON = 'عروض أمازون',
  TECH_REVIEWS = 'مراجعات تقنية',
  MOROCCO_NEWS = 'أخبار المغرب',
  DEALS = 'هميزات اليوم',
  COUPONS = 'كوبونات حصرية'
}

export interface Reward {
  id: string;
  title: string;
  code: string;
  description: string;
  image: string;
  type: 'coupon' | 'gift';
  store?: string;
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
  marketPrice?: number; 
}

export interface CartItem extends Article {
  quantity: number;
}

export interface Settings {
  siteName: string;
  adsenseCode: string;
  alternativeAdsCode: string; 
  globalAdsCode: string; 
  directLinkCode: string; 
  popunderCode?: string;
  nativeAdCode?: string;
  dashboardPassword?: string;
  totalVisits: number;
  totalEarnings: number;
  whatsappNumber: string;
  facebookLink?: string;
  instagramLink?: string;
  telegramLink?: string;
}

export type View = 'home' | 'post' | 'admin' | 'privacy' | 'about' | 'contact' | 'terms' | 'checkout' | 'store' | 'product';
