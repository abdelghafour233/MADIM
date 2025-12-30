
import { Article, Category } from './types';

export const INITIAL_POSTS: Article[] = [
  {
    id: 'temu-deal-1',
    title: 'أقوى تخفيضات تيمو (Temu) في المغرب: سماعات لاسلكية بـ 19 درهم فقط!',
    excerpt: 'استفد من عرض المستخدم الجديد على تيمو واحصل على شحن مجاني لجميع المدن المغربية.',
    content: `تيمو تكتسح السوق المغربي بعروض لا تصدق. قمنا بتجربة هذه السماعات وكانت النتيجة مذهلة بالنسبة للسعر.
    
    مميزات العرض الحالي:
    - خصم 90% للمستخدمين الجدد.
    - شحن مجاني عبر Speedaf لجميع المدن المغربية.
    - الدفع عند الاستلام متاح.
    
    خطوات الاستفادة:
    1. حمل تطبيق تيمو من الرابط أدناه.
    2. استعمل كود الخصم الخاص بنا epm88.
    3. استمتع بشحن مجاني وضمان استرجاع الأموال.`,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200',
    category: Category.TEMU,
    date: '05 أبريل 2025',
    views: 8500,
    author: 'عبدو الأفلييت',
    affiliateLink: 'https://temu.to/k/example',
    couponCode: 'epm88',
    isTrending: true
  },
  {
    id: 'amazon-deal-1',
    title: 'أفضل 3 ملحقات للقيمنق من أمازون تشحن مباشرة للمغرب بدون جمارك',
    excerpt: 'قائمة مختارة بعناية للمنتجات التي تدعم الشحن المباشر "Shipped to Morocco" لتجنب مشاكل الجمارك.',
    content: `الشراء من أمازون أصبح سهلاً بفضل نظام الشحن المباشر الذي يتكفل بمصاريف الجمارك مسبقاً.
    
    الاختيار الأول: ماوس قيمنق Razer DeathAdder
    الاختيار الثاني: لوحة مفاتيح ميكانيكية
    الاختيار الثالث: سماعات HyperX Cloud II
    
    كل هذه المنتجات تم التحقق من أنها تشحن للمغرب وتصل في غضون 10 أيام.`,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    category: Category.AMAZON,
    date: '04 أبريل 2025',
    views: 4200,
    author: 'عبدو التقني',
    affiliateLink: 'https://amzn.to/example'
  }
];

export const CITIES = [
  'الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان'
];
