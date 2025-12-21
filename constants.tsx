
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'هاتف ذكي ألترا برو',
    price: 8500,
    description: 'أحدث هاتف ذكي بمواصفات عالمية وكاميرا احترافية.',
    image: 'https://picsum.photos/seed/phone/400/400',
    category: Category.ELECTRONICS
  },
  {
    id: '2',
    name: 'خلاط كهربائي حديث',
    price: 450,
    description: 'قوي وسهل الاستخدام لجميع احتياجات المطبخ.',
    image: 'https://picsum.photos/seed/mixer/400/400',
    category: Category.HOME
  },
  {
    id: '3',
    name: 'سيارة سيدان اقتصادية 2024',
    price: 185000,
    description: 'سيارة عائلية مريحة مع استهلاك منخفض للوقود.',
    image: 'https://picsum.photos/seed/car/400/400',
    category: Category.CARS
  },
  {
    id: '4',
    name: 'سماعات لاسلكية عازلة للضوضاء',
    price: 1200,
    description: 'تجربة صوتية نقية مع تقنية إلغاء الضجيج المتطورة.',
    image: 'https://picsum.photos/seed/buds/400/400',
    category: Category.ELECTRONICS
  },
  {
    id: '5',
    name: 'مكنسة كهربائية ذكية',
    price: 2100,
    description: 'تنظيف ذاتي وتحكم كامل عبر الهاتف الذكي.',
    image: 'https://picsum.photos/seed/vaccum/400/400',
    category: Category.HOME
  }
];

export const CITIES = [
  'الدار البيضاء', 'الرباط', 'مراكش', 'طنجة', 'فاس', 'أكادير', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان'
];
