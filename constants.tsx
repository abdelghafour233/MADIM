
import { Category, Article } from './types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    name: 'مراجعة هاتف آيفون 15 برو: هل يستحق الشراء؟',
    price: 12000,
    content: 'يعتبر آيفون 15 برو قفزة نوعية في عالم الهواتف الذكية بفضل معالج A17 Pro الجديد وتصميمه من التيتانيوم...',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000',
    category: Category.REVIEWS,
    links: [
      { label: 'أمازون (Amazon)', url: 'https://amazon.com' },
      { label: 'جوميا (Jumia)', url: 'https://jumia.com' }
    ],
    rating: 5
  },
  {
    id: '2',
    name: 'أفضل 5 قلايات هوائية في السوق المغربي لعام 2024',
    price: 1500,
    content: 'إذا كنت تبحث عن طعام صحي ومقرمش، فإن القلاية الهوائية هي خيارك الأمثل. في هذا المقال نستعرض أفضل الأنواع...',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1000',
    category: Category.BEST_OFFERS,
    links: [
      { label: 'اشتري من أمازون', url: 'https://amazon.com' }
    ],
    rating: 4.5
  }
];

export const CITIES = [
  'الدار البيضاء', 'الرباط', 'مراكش', 'طنجة', 'فاس', 'أكادير', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان',
  'تمارة', 'آسفي', 'المحمدية', 'خريبكة', 'الجديدة', 'بني ملال', 'الناظور', 'تازة'
];
