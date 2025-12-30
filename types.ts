
export enum Category {
  TEMU = 'عروض تيمو',
  AMAZON = 'عروض أمازون',
  ALIEXPRESS = 'علي إكسبريس',
  TECH_REVIEWS = 'مراجعات تقنية',
  COUPONS = 'كوبونات خصم',
  STORE = 'المتجر المباشر'
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
  oldPrice?: number;
  isProduct?: boolean;
  rating?: number;
  isTrending?: boolean;
  affiliateLink?: string; // رابط الأفلييت (تيمو، أمازون...)
  couponCode?: string;    // كود الخصم المخصص
  inStock?: boolean;
}

export interface Settings {
  dashboardPassword?: string;
  siteName: string;
  adsenseCode: string;
  alternativeAdsCode?: string;
  globalAdsCode?: string;
  totalVisits?: number;
  whatsappNumber?: string;
}

export interface CartItem extends Article {
  quantity: number;
}

export type View = 'home' | 'store' | 'post' | 'product' | 'cart' | 'checkout' | 'admin' | 'about' | 'privacy' | 'contact' | 'terms';
