
export enum Category {
  ELECTRONICS = 'الإلكترونيات',
  HOME = 'المنتجات المنزلية',
  CARS = 'السيارات'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
}

export interface Order {
  id: string;
  customerName: string;
  city: string;
  phone: string;
  items: { productId: string; quantity: number; name: string; price: number }[];
  total: number;
  date: string;
  status: 'pending' | 'completed';
}

export interface Settings {
  fbPixel: string;
  googleAnalytics: string;
  tiktokPixel: string;
  googleSheetsWebhook: string;
  domain: string;
  nameServer: string;
  dashboardPassword?: string;
}

export type View = 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'dashboard';
