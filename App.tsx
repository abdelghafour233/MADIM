
import React, { useState, useEffect } from 'react';
import { View, Article, Category, Settings, CartItem } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './components/Checkout.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';
import LegalPage from './components/LegalPage.tsx';

const INITIAL_SETTINGS: Settings = {
  siteName: 'عبدو ويب',
  adsenseCode: 'ca-pub-5578524966832192',
  dashboardPassword: '1234',
  totalVisits: 0
};

const INITIAL_DATA: Article[] = [
  {
    id: 'olive-oil-crisis-morocco-2025',
    title: 'أزمة أسعار زيت الزيتون بالمغرب: الأسباب والحلول وتوقعات الموسم القادم',
    excerpt: 'تحليل معمق للارتفاع غير المسبوق في أسعار زيت الزيتون بالمغرب وتأثير الجفاف على الإنتاج الوطني لعام 2025.',
    content: `تعتبر مادة زيت الزيتون ركيزة أساسية في المائدة المغربية، إلا أن الموسمين الأخيرين شهدا طفرة غير مسبوقة في الأسعار أثارت قلق المستهلكين. يعود السبب الرئيسي لهذا الارتفاع إلى توالي سنوات الجفاف وتأثر حقينات السدود، مما أدى إلى تراجع الإنتاج في مناطق رئيسية مثل قلعة السراغنة ووزان. تتدخل الحكومة حالياً عبر تقييد التصدير لضمان تزويد السوق الوطنية بأسعار معقولة، وسط توقعات ببدء استقرار الأسعار مع تحسن التساقطات المطرية الأخيرة. ننصح المستهلكين بالتحقق من جودة الزيت وتجنب الاقتناء من مصادر غير موثوقة لضمان السلامة الصحية.`,
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '22 مارس 2025',
    views: 85200,
    author: 'عبدو المحلل',
    isTrending: true
  },
  {
    id: 'cnss-amo-morocco-2025-guide',
    title: 'دليل التغطية الصحية AMO في المغرب: كيف تستفيد من التعويضات؟',
    excerpt: 'كل ما تحتاج معرفته عن نظام التأمين الإجباري عن المرض وكيفية تسجيل أفراد أسرتك وتتبع ملفاتك.',
    content: `يشهد المغرب ثورة اجتماعية حقيقية عبر تعميم التغطية الصحية الإجبارية (AMO). في هذا المقال، نشرح للعمال غير الأجراء والأشخاص الذين كانوا يستفيدون من "راميد" سابقاً، كيفية تفعيل حساباتهم في الصندوق الوطني للضمان الاجتماعي (CNSS). تتيح البوابة الإلكترونية "MaCNSS" تتبع التعويضات عن الأدوية والعمليات الجراحية بكل سهولة، مما يضمن كرامة صحية لكل مواطن مغربي.`,
    image: 'https://images.unsplash.com/photo-1505751172107-5972297c3377?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '25 مارس 2025',
    views: 41200,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'make-money-online-morocco-2025',
    title: 'أفضل طرق الربح من الإنترنت في المغرب 2025: دليل شامل للمبتدئين',
    excerpt: 'اكتشف كيف يمكنك تحقيق دخل إضافي بالدرهم من خلال العمل الحر، التجارة الإلكترونية، وصناعة المحتوى.',
    content: `الربح من الإنترنت في المغرب لم يعد مجرد حلم، بل أصبح واقعاً يعيشه آلاف الشباب. في هذا الدليل، نستعرض أكثر الطرق فعالية: أولاً، العمل الحر (Freelancing) في مجالات البرمجة والتصميم عبر منصات عالمية. ثانياً، التجارة الإلكترونية المحلية بنظام الدفع عند الاستلام (COD). ثالثاً، صناعة المحتوى على يوتيوب وتيك توك. السر يكمن في التخصص والصبر والتعلم المستمر.`,
    image: 'https://images.unsplash.com/photo-1591115765373-5a9214194c97?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '23 مارس 2025',
    views: 92400,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'argan-oil-future-morocco',
    title: 'مستقبل زيت الأركان المغربي: الذهب السائل بين تحديات المناخ والطلب العالمي',
    excerpt: 'تحليل لوضعية شجرة الأركان بالمغرب وكيف تساهم التعاونيات النسائية في حماية هذا الموروث العالمي.',
    content: `يظل زيت الأركان فخراً مغربياً خالصاً، لكنه يواجه تحديات بيئية كبيرة. التغيرات المناخية أثرت على مردودية الغابات بسوس وماسة، مما دفع الدولة لإطلاق مشاريع غرس آلاف الهكتارات الجديدة. الطلب العالمي المتزايد في قطاع التجميل يجعل من الضروري تثمين المنتج محلياً لضمان استفادة الساكنة المحلية والتعاونيات من هذه الثروة الطبيعية الفريدة.`,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '26 مارس 2025',
    views: 15600,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'morocco-dirham-float-2025-deep-analysis',
    title: 'تعويم الدرهم المغربي في 2025: هل تنجح المملكة في تحقيق التوازن المالي؟',
    excerpt: 'دراسة اقتصادية حول مسار مرونة سعر صرف الدرهم وتأثيراته على القدرة الشرائية والميزان التجاري.',
    content: `يواصل المغرب نهج سياسة التعويم التدريجي للدرهم بخطى ثابتة ومدروسة من طرف بنك المغرب. يهدف هذا الإصلاح الهيكلي إلى جعل الاقتصاد الوطني أكثر قدرة على امتصاص الصدمات الخارجية وتعزيز التنافسية الدولية للصادرات المغربية. رغم المخاوف من تأثير تقلبات العملة على أسعار المواد المستوردة، إلا أن المؤشرات الحالية تؤكد توفر المغرب على احتياطات كافية من العملة الصعبة لضمان استقرار نسبي. إن الانتقال من نظام صرف ثابت إلى مرن هو رحلة ضرورية للاندماج الكامل في الاقتصاد العالمي.`,
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '21 مارس 2025',
    views: 42300,
    author: 'عبدو الاقتصادي',
    isTrending: false
  },
  {
    id: 'most-demanded-jobs-morocco-2025',
    title: 'أكثر 10 وظائف مطلوبة في المغرب لعام 2025: أين يوجه الشباب طموحاتهم؟',
    excerpt: 'تحليل لسوق الشغل المغربي والمهن التي تضمن دخلاً مرتفعاً في قطاعات التكنولوجيا والهندسة والخدمات.',
    content: `يتغير سوق الشغل في المغرب بسرعة مذهلة. المهن المرتبطة بتطوير البرمجيات، الأمن السيبراني، والطاقات المتجددة تتصدر القائمة. كما أن قطاع صناعة السيارات والطيران يطلب كفاءات تقنية عالية بشكل مستمر. ننصح الشباب بالتركيز على اللغات والمهارات الناعمة (Soft Skills) بجانب تخصصاتهم التقنية لضمان التميز في المقابلات الوظيفية.`,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '27 مارس 2025',
    views: 38900,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: '5g-network-morocco-updates',
    title: 'شبكة 5G في المغرب: متى ستصبح متاحة للجميع وما هي المدن الأولى؟',
    excerpt: 'توقعات انتشار الجيل الخامس بالمغرب وتأثيره على سرعة الإنترنت والتحول الرقمي للمقاولات.',
    content: `تستعد شركات الاتصالات المغربية لإطلاق خدمة 5G تزامناً مع استعدادات المملكة لاحتضان تظاهرات كبرى. المدن الكبرى مثل الدار البيضاء، الرباط، وطنجة ستكون أول المستفيدين. ستوفر هذه التقنية سرعات خيالية وتفتح الباب أمام تطبيقات "إنترنت الأشياء" والمدن الذكية، مما سيعطي دفعة قوية للاقتصاد الرقمي الوطني.`,
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '28 مارس 2025',
    views: 29400,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'student-success-tips-morocco',
    title: '10 نصائح ذهبية لطلاب البكالوريا في المغرب: كيف تنظم وقتك وتتفوق؟',
    excerpt: 'دليل شامل لطلاب الثانية باك حول كيفية التعامل مع ضغط الامتحانات والحصول على ميزة تنافسية.',
    content: `امتحانات البكالوريا هي محطة فارقة في مسار كل طالب مغربي. للنجاح بامتياز، يجب أولاً وضع جدول زمني واقعي يوازن بين المواد العلمية والأدبية. ثانياً، التركيز على حل النماذج السابقة للامتحانات الوطنية. ثالثاً، العناية بالصحة النفسية والنوم الكافي. تذكر أن التحضير الجيد يبدأ من الآن وليس في اللحظات الأخيرة.`,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '24 مارس 2025',
    views: 31200,
    author: 'عبدو الموجه',
    isTrending: false
  },
  {
    id: 'moroccan-handicrafts-global-market',
    title: 'الصناعة التقليدية المغربية في الأسواق العالمية: كيف تبيع منتجاتك على Etsy؟',
    excerpt: 'دليل الحرفيين المغاربة للوصول إلى الزبناء الدوليين وبيع الزرابي والجلد والخزف باحترافية.',
    content: `المنتج المغربي التقليدي يحظى بتقدير كبير في أوروبا وأمريكا. منصات مثل Etsy وShopify تفتح أبواباً واسعة للصناع التقليديين المغاربة لبيع إبداعاتهم بأسعار مجزية. السر يكمن في التصوير الاحترافي، وصف المنتج بلغة إنجليزية واضحة، والالتزام بمواعيد الشحن الدولي عبر البريد المضمون.`,
    image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '29 مارس 2025',
    views: 12300,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'best-laptops-for-students-2025',
    title: 'أفضل 5 حواسيب محمولة للطلبة في المغرب لعام 2025: الجودة مقابل السعر',
    excerpt: 'مراجعة لأفضل أجهزة اللابتوب المناسبة للدراسة والبرمجة مع مراعاة الميزانية المتوسطة.',
    content: `اختيار حاسوب للدراسة يتطلب توازناً بين الأداء والمتانة. نرشح لكم في هذا المقال أجهزة مثل MacBook Air M2 للباحثين عن الاستقرار، وHP Pavilion للطلبة التقنيين، وLenovo IdeaPad كخيار اقتصادي ممتاز. تأكد دائماً من وجود معالج حديث وذاكرة رام لا تقل عن 8 جيجابايت لضمان سلاسة العمل.`,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '20 مارس 2025',
    views: 45600,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'morocco-vs-zambia-can-2025-hype',
    title: 'مواجهة الحسم: أسود الأطلس ضد زامبيا في ليلة العبور نحو المجد الأفريقي',
    excerpt: 'تتجه الأنظار صوب الملعب الكبير لمتابعة مباراة المنتخب المغربي الحاسمة ضد زامبيا في الكان.',
    content: `يعيش الشارع الرياضي المغربي حالة من الترقب الكبير لمباراة المنتخب الوطني ضد زامبيا. كتيبة وليد الركراكي تدخل المباراة بكامل نجومها، مع طموح كبير لتأكيد الريادة الأفريقية. التحضيرات التقنية والذهنية في أعلى مستوياتها، والجمهور المغربي يستعد للتنقل بكثافة لمساندة الأسود.`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '20 مارس 2025',
    views: 125400,
    author: 'عبدو الرياضي',
    isTrending: false
  },
  {
    id: 'startup-funding-morocco-2025',
    title: 'كيف تحصل على تمويل لمشروعك الناشئ في المغرب؟ دليلك للمقاولين الشباب',
    excerpt: 'استعراض لأهم برامج الدعم الحكومي والتمويل الخاص المتاحة للشركات الناشئة المغربية.',
    content: `برامج مثل "فرصة" و"انطلاقة" فتحت آفاقاً جديدة للمقاولين الشباب في المغرب. للحصول على تمويل، يجب أن تمتلك نموذج عمل واضحاً ودراسة جدوى دقيقة. كما أن المشاركة في مسابقات الابتكار تفتح لك أبواب المستثمرين الملائكة (Angel Investors).`,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '19 مارس 2025',
    views: 22100,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'mediterranean-diet-morocco',
    title: 'النظام الغذائي المتوسطي: سر الصحة والنشاط في الثقافة المغربية',
    excerpt: 'لماذا يعتبر المطبخ المغربي أحد أصح الأنظمة الغذائية في العالم؟ تحليل للمكونات والفوائد.',
    content: `الكسكس، الطاجن، زيت الزيتون، والقطاني هي أعمدة التغذية المغربية. هذا النظام الغني بالألياف والدهون الصحية يقلل من مخاطر أمراض القلب ويزيد من متوسط العمر. العودة للأكل الطبيعي "ديال الدار" هي أفضل استثمار في صحتك.`,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '18 مارس 2025',
    views: 19800,
    author: 'عبدو الموجه',
    isTrending: false
  },
  {
    id: 'ai-tools-for-students-2025',
    title: 'أفضل 5 أدوات ذكاء اصطناعي للطلبة في المغرب: كيف تدرس بذكاء؟',
    excerpt: 'دليل شامل لأدوات تقنية ستساعدك في البحث العلمي وكتابة الأطروحات وتلخيص الدروس باحترافية.',
    content: `لم يعد الذكاء الاصطناعي مجرد رفاهية، بل أصبح ضرورة للطلبة والباحثين. في هذا المقال نستعرض أدوات مثل ChatGPT للتلخيص، وPerplexity للبحث الموثق، وGrammarly لتحسين الكتابة بالإنجليزية. هذه التقنيات تساعد الطالب المغربي على توفير الوقت والتركيز على الإبداع والتحليل بدلاً من المهام الروتينية.`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '19 مارس 2025',
    views: 33100,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'electric-cars-morocco-2025',
    title: 'السيارات الكهربائية في المغرب: هل البنية التحتية جاهزة لهذا التحول؟',
    excerpt: 'مراجعة لواقع محطات الشحن وأسعار السيارات الكهربائية في السوق المغربية لعام 2025.',
    content: `يشهد المغرب طفرة في استيراد السيارات الكهربائية، لكن التحدي يظل في توفر محطات الشحن السريع على الطرق السيار. الحكومة تعمل على تحفيز هذا القطاع عبر إعفاءات ضريبية، مما يجعلها خياراً جذاباً للمستقبل البيئي والاقتصادي للمملكة.`,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '17 مارس 2025',
    views: 27300,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'casablanca-finance-city-update',
    title: 'قطب الدار البيضاء المالي: كيف أصبح المغرب بوابة الاستثمار في أفريقيا؟',
    excerpt: 'تحليل لمكانة Casablanca Finance City كأول مركز مالي في القارة الأفريقية وتأثيره على الاقتصاد الوطني.',
    content: `نجح المغرب في جلب مئات الشركات العالمية بفضل الامتيازات التي يقدمها القطب المالي للدار البيضاء. هذا المركز لا يوفر فقط وظائف عالية القيمة، بل يعزز من إشعاع المملكة كمنصة لا غنى عنها للاستثمارات العابرة للحدود.`,
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '16 مارس 2025',
    views: 34100,
    author: 'عبدو الاقتصادي',
    isTrending: false
  },
  {
    id: 'e-commerce-success-morocco',
    title: 'دليل النجاح في التجارة الإلكترونية بالمغرب: كيف تبدأ من الصفر؟',
    excerpt: 'خطوات عملية لإنشاء مشروعك الخاص في الدفع عند الاستلام (COD) بالسوق المغربية.',
    content: `التجارة الإلكترونية في المغرب تعيش عصرها الذهبي. للبدء، تحتاج أولاً لاختيار "نيش" مطلوب، ثم إنشاء متجر بسيط، والتعاقد مع شركة توصيل موثوقة. التركيز على جودة المنتج وخدمة العملاء هو السر الحقيقي للنمو والاستدامة في هذا المجال التنافسي.`,
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '18 مارس 2025',
    views: 29800,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'mental-health-tech-age',
    title: 'الصحة النفسية في عصر الشاشات: كيف تحافظ على هدوئك الرقمي؟',
    excerpt: 'نصائح عملية للتخلص من إدمان الهاتف والتعامل مع ضغوط منصات التواصل الاجتماعي.',
    content: `نقضي ساعات طويلة أمام الشاشات مما يؤثر على جودة نومنا وتركيزنا. الصيام الرقمي لمدة ساعة يومياً قبل النوم، وتعطيل الإشعارات غير الضرورية، وممارسة التأمل هي خطوات بسيطة لاستعادة السلام النفسي والتحكم في وقتنا الثمين.`,
    image: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '17 مارس 2025',
    views: 18400,
    author: 'عبدو الموجه',
    isTrending: false
  },
  {
    id: 'iphone-16-pro-max-morocco-price',
    title: 'آيفون 16 برو ماكس: السعر في المغرب ومراجعة الأداء الفعلي',
    excerpt: 'هل يستحق الهاتف سعره الحالي في الأسواق المغربية؟ تحليل للكاميرا والبطارية.',
    content: `يأتي آيفون 16 برو ماكس بمواصفات مبهرة، خاصة في تصوير الفيديو. في المغرب، تتراوح الأسعار حسب الموزعين. الهاتف يقدم أداءً استثنائياً بفضل معالج A18 Pro، لكن إذا كنت تملك النسخة السابقة، فقد لا تحتاج للترقية الفورية.`,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '16 مارس 2025',
    views: 55200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'morning-routine-high-performance',
    title: 'الروتين الصباحي للناجحين: كيف تبدأ يومك بطاقة متجددة؟',
    excerpt: 'عادات صباحية بسيطة طبقها مشاهير رواد الأعمال لتحسين إنتاجيتهم وصحتهم البدنية.',
    content: `الاستيقاظ الباكر، شرب الماء، ممارسة الرياضة الخفيفة، والقراءة. هذه العادات تشكل فارقاً كبيراً في أدائك اليومي. السر ليس في كثرة المهام بل في جودة البداية والالتزام بالاستمرارية.`,
    image: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '15 مارس 2025',
    views: 21600,
    author: 'عبدو الموجه',
    isTrending: false
  },
  {
    id: 'morocco-tourism-2025-records',
    title: 'السياحة في المغرب 2025: أرقام قياسية ووجهات جديدة تخطف الأنظار',
    excerpt: 'كيف تحول المغرب إلى الوجهة الأولى في أفريقيا بفضل استراتيجية الترويج الجديدة؟',
    content: `تشهد مدن مراكش، أكادير، وشفشاون تدفقاً سياحياً غير مسبوق. الاستثمارات في البنية التحتية والفنادق بدأت تؤتي ثمارها، مما يعزز مكانة المغرب كقبلة عالمية للسياح الباحثين عن الأصالة والحداثة.`,
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '14 مارس 2025',
    views: 39400,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'samsung-s25-ultra-leaks',
    title: 'تسريبات سامسونج S25 ألترا: الوحش القادم الذي سيغير قواعد اللعبة',
    excerpt: 'كل ما نعرفه عن تصميم وكاميرا هاتف سامسونج القادم لمنافسة آيفون.',
    content: `تشير التسريبات إلى تغيير جذري في التصميم ليصبح أكثر راحة في اليد، مع مستشعرات كاميرا هي الأقوى في تاريخ الهواتف الذكية. سامسونج تراهن على الذكاء الاصطناعي المدمج بشكل كامل في النظام.`,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '13 مارس 2025',
    views: 47200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'freelance-market-morocco-2025',
    title: 'سوق العمل الحر بالمغرب: أفضل المجالات المطلوبة للعمل من المنزل',
    excerpt: 'دليل البرمجة، التصميم، وكتابة المحتوى للشباب المغربي الباحث عن دخل إضافي.',
    content: `العمل الحر (Freelance) أصبح ملاذاً للكثير من الشباب المغربي. البرمجة بلغة Python، تصميم واجهة المستخدم UI/UX، والتسويق الرقمي هي أكثر المجالات طلباً حالياً على منصات مثل Upwork وخمسات.`,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '12 مارس 2025',
    views: 31200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'casablanca-metro-project-updates',
    title: 'مترو الدار البيضاء: هل يقترب الحلم من التحقق في 2025؟',
    excerpt: 'آخر أخبار مشاريع النقل الكبرى في العاصمة الاقتصادية وتأثيرها على حركة السير.',
    content: `تتواصل الأشغال في خطوط الترامواي والحافلات عالية الجودة بالدار البيضاء، وسط نقاشات حول إمكانية إنشاء خط مترو مستقبلي لتخفيف الضغط المروري الخانق. العاصمة الاقتصادية تستعد لثورة في قطاع النقل.`,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '11 مارس 2025',
    views: 28400,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'fast-learning-hacks-2025',
    title: 'تعلم أي مهارة في 20 ساعة فقط: تقنيات التعلم السريع للمغاربة',
    excerpt: 'كيف تكتسب مهارة جديدة بسرعة فائقة وتنافس في سوق الشغل المتغير باستمرار.',
    content: `السر ليس في الموهبة بل في تفكيك المهارة إلى أجزاء صغيرة. ركز على 20% من المهارة التي تعطيك 80% من النتائج. تدرب بذكاء، صحح أخطاءك فوراً، وابتعد عن المشتتات خلال جلسات التعلم المكثفة.`,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '10 مارس 2025',
    views: 25100,
    author: 'عبدو الموجه',
    isTrending: false
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View | 'about' | 'privacy' | 'contact'>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedItem, setSelectedItem] = useState<Article | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('abdou_settings_v3');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedCart = localStorage.getItem('abdou_cart_v3');
    if (savedCart) setCart(JSON.parse(savedCart));

    const consent = localStorage.getItem('abdou_cookie_consent');
    if (consent) setCookieConsent(true);

    const savedPostsRaw = localStorage.getItem('abdou_blog_v3');
    let currentPosts: Article[] = savedPostsRaw ? JSON.parse(savedPostsRaw) : [];

    let mergedPosts = [...currentPosts];
    let changed = false;

    INITIAL_DATA.forEach(initialPost => {
      const existingIndex = mergedPosts.findIndex(p => p.id === initialPost.id);
      if (existingIndex === -1) {
        mergedPosts = [initialPost, ...mergedPosts];
        changed = true;
      } else {
        if (
          mergedPosts[existingIndex].image !== initialPost.image || 
          mergedPosts[existingIndex].title !== initialPost.title ||
          mergedPosts[existingIndex].content !== initialPost.content ||
          mergedPosts[existingIndex].excerpt !== initialPost.excerpt
        ) {
          mergedPosts[existingIndex] = { ...mergedPosts[existingIndex], ...initialPost };
          changed = true;
        }
      }
    });

    const sortedPosts = [...mergedPosts].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    setPosts(sortedPosts);
    if (changed || !savedPostsRaw) {
      localStorage.setItem('abdou_blog_v3', JSON.stringify(sortedPosts));
    }
  }, []);

  const handleItemClick = (p: Article) => {
    const updatedPosts = posts.map(item => 
      item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item
    );
    setPosts(updatedPosts);
    localStorage.setItem('abdou_blog_v3', JSON.stringify(updatedPosts));
    setSelectedItem({ ...p, views: (p.views || 0) + 1 });
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  const filteredPosts = posts.filter(p => 
    (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view as any}
        setView={setView as any}
        siteName={settings.siteName}
        onSearch={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setShowCart(true)}
      />

      {showCart && (
        <Cart 
          items={cart} 
          onClose={() => setShowCart(false)} 
          onRemove={(id) => setCart(cart.filter(i => i.id !== id))}
          onUpdateQuantity={(id, q) => setCart(cart.map(i => i.id === id ? {...i, quantity: q} : i))}
          onCheckout={() => { setView('checkout'); setShowCart(false); }}
          darkMode={darkMode}
        />
      )}

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && <Home posts={filteredPosts} onPostClick={handleItemClick} darkMode={darkMode} />}
        {view === 'post' && selectedItem && <PostDetail post={selectedItem} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedItem && <ProductDetail product={selectedItem} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} onBack={() => setView('home')} darkMode={darkMode} />}
        {view === 'checkout' && <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={() => { alert('تم الطلب!'); setCart([]); setView('home'); }} />}
        
        {(view === 'privacy' || view === 'about' || view === 'contact') && (
          <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />
        )}

        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_blog_v3', JSON.stringify(newPosts));}}
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_settings_v3', JSON.stringify(s));}}
            onLogout={() => setIsAuth(false)}
            darkMode={darkMode}
          />
        )}
      </main>

      <footer className={`mt-20 py-12 border-t ${darkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-black mb-4 tracking-tighter">{settings.siteName}</h3>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              وجهتكم المغربية الموثوقة لأخبار التكنولوجيا، تطوير الذات، والتحليلات الاقتصادية والرياضية الحصرية. نحن نحدث المحتوى يومياً لنقدم لكم الأفضل.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-4">أقسام الموقع</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm opacity-80">
              <li><button onClick={() => setView('home')} className="hover:text-emerald-500">الرئيسية</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-emerald-500">من نحن</button></li>
              <li><button onClick={() => setView('privacy')} className="hover:text-emerald-500">سياسة الخصوصية</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-emerald-500">اتصل بنا</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-4">أدسنس 2025</h4>
            <p className="text-xs opacity-50 mb-4">الموقع يضم حالياً 25 مقالاً حصرياً مكتوباً باحترافية لتلائم شروط القبول.</p>
            <div className="flex gap-4">
               <span className="opacity-40 text-[10px] font-black uppercase">© 2025 Abdou Web - جميع الحقوق محفوظة</span>
            </div>
          </div>
        </div>
      </footer>

      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-[300] bg-emerald-600 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <p className="text-sm font-bold">نستخدم ملفات تعريف الارتباط لضمان حصولك على أفضل تجربة على موقعنا.</p>
          <button 
            onClick={() => {setCookieConsent(true); localStorage.setItem('abdou_cookie_consent', 'true');}}
            className="px-8 py-2 bg-white text-emerald-600 rounded-xl font-black text-sm"
          >أوافق</button>
        </div>
      )}

      <WhatsAppButton />
    </div>
  );
};

export default App;
