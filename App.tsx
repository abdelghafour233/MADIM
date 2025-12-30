
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
    id: 'temu-winter-jacket-2025',
    title: 'أفضل جاكيت شتوي من تيمو (Temu): مراجعة الجودة والسعر ورابط الشراء',
    excerpt: 'تجربتي الحصرية مع جاكيت شتوي أنيق من منصة تيمو، نكتشف معاً جودة القماش، سرعة التوصيل للمغرب وهل يستحق الشراء؟',
    content: `مع دخول موجة البرد في المغرب، أصبح البحث عن ملابس شتوية تجمع بين الأناقة والدفء والسعر المناسب أمراً ضرورياً. في هذا المقال، أشارككم مراجعة دقيقة لجاكيت شتوي قمت بطلبه مؤخراً من منصة تيمو الشهيرة.

الجاكيت يتميز بتصميم عصري وخامة داخلية دافئة جداً، كما أن القياسات جاءت مطابقة تماماً لما هو معروض في الموقع. ما أبهرني حقاً هو تنافسية السعر مقارنة بالمحلات المحلية، بالإضافة إلى وصول الطلب في وقت قياسي.

إذا كنت تبحث عن التميز هذا الشتاء بميزانية معقولة، فأنصحك بشدة بهذا الموديل.

يمكنكم الحصول على الجاكيت مباشرة من خلال الرابط الرسمي التالي:

https://temu.to/k/epmeiw8zeno`,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '01 أبريل 2025',
    views: 1250,
    author: 'عبدو المراجع',
    isTrending: true
  },
  {
    id: 'ww3-future-2025',
    title: 'أعقاب الحرب العالمية الثالثة: سيناريوهات تقنية وجيوسياسية لمستقبل البشرية',
    excerpt: 'تحليل مستقبلي لما قد يؤول إليه العالم تقنياً وبيئياً في حال نشوب صراع عالمي وتأثير ذلك على استقرار القارة الأفريقية.',
    content: `تعد فرضية الحرب العالمية الثالثة من أكثر المواضيع إثارة للقلق والتحليل. في هذا المقال، نستعرض كيف يمكن للتكنولوجيا أن تلعب دوراً مزدوجاً كأداة للدمار ووسيلة لإعادة الإعمار. أعقاب هذه الحرب لن تكون مجرد دمار مادي، بل ستشهد تحولاً جذرياً في سلاسل الإمداد، والاعتماد الكلي على الطاقة المتجددة، وظهور أنظمة ذكاء اصطناعي لإدارة الموارد. المغرب بموقعه الاستراتيجي قد يلعب دوراً محورياً كجسر للسلام أو كمركز لإعادة الربط القاري.`,
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '30 مارس 2025',
    views: 15400,
    author: 'عبدو المحلل'
  },
  {
    id: 'olive-oil-prices-2025',
    title: 'أزمة أسعار زيت الزيتون بالمغرب: الأسباب والحلول وتوقعات الموسم القادم',
    excerpt: 'تحليل للارتفاع غير المسبوق في أسعار زيت الزيتون وتأثير الجفاف على الإنتاج الوطني لعام 2025.',
    content: `تشهد أسعار زيت الزيتون في المغرب ارتفاعاً قياسياً نتيجة توالي سنوات الجفاف. في هذا المقال نناقش التدابير الحكومية المتخذة لحماية القدرة الشرائية وتوقعات المهنيين للموسم الفلاحي القادم. تتدخل الدولة عبر تقييد التصدير لضمان تزويد السوق الوطنية بأسعار معقولة، وسط توقعات ببدء استقرار الأسعار مع تحسن التساقطات المطرية الأخيرة.`,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '28 مارس 2025',
    views: 92100,
    author: 'عبدو المحلل'
  },
  {
    id: 'casablanca-vision-2025',
    title: 'الدار البيضاء 2025: كيف تتحول العاصمة الاقتصادية إلى مدينة ذكية؟',
    excerpt: 'استعراض للمشاريع الكبرى التي تغير وجه كازابلانكا، من النقل الذكي إلى المساحات الخضراء الرقمية.',
    content: `تشهد مدينة الدار البيضاء تحولات هيكلية كبرى تهدف إلى جعلها مدينة ذكية بامتياز، من خلال رقمنة الخدمات العمومية وتطوير شبكة نقل حديثة وصديقة للبيئة. مشاريع الترامواي والحافلات عالية الجودة تساهم في تقليل الازدحام وتحسين جودة الحياة للسكان.`,
    image: 'https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '27 مارس 2025',
    views: 45600,
    author: 'عبدو المحلل'
  },
  {
    id: 'solar-energy-noor',
    title: 'محطة نور ورزازات: كيف يقود المغرب العالم في إنتاج الطاقة الشمسية؟',
    excerpt: 'رحلة إلى أكبر مجمع للطاقة الشمسية في العالم وكيف يساهم في تأمين السيادة الطاقية للمملكة.',
    content: `يعد مشروع "نور" في ورزازات نموذجاً عالمياً للنجاح في مجال الطاقات المتجددة، حيث يضع المغرب في صدارة الدول المصدرة للطاقة النظيفة. يهدف المغرب لتغطية أكثر من 52% من احتياجاته الكهربائية من مصادر نظيفة بحلول 2030.`,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '26 مارس 2025',
    views: 31200,
    author: 'عبدو التقني'
  },
  {
    id: 'marrakech-tourism-tips',
    title: 'مراكش 2025: دليل المسافر لاكتشاف المدينة الحمراء بين الأصالة والمعاصرة',
    excerpt: 'نصائح حصرية لزيارة مراكش، أفضل الرياضات، المطاعم الخفية، والتجارب الثقافية التي لا تنسى.',
    content: `تظل مراكش جوهرة السياحة المغربية، حيث تمزج بين التاريخ العريق والخدمات السياحية العصرية، مما يجعلها وجهة عالمية لا غنى عنها. ننصح السياح بزيارة المتاحف الفنية المعاصرة بجانب ساحة جامع الفنا التاريخية.`,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '25 مارس 2025',
    views: 18900,
    author: 'عبدو المحلل'
  },
  {
    id: 'ai-health-morocco',
    title: 'الذكاء الاصطناعي في قطاع الصحة بالمغرب: ثورة التشخيص عن بعد',
    excerpt: 'كيف تساهم التقنيات الحديثة في تحسين جودة العلاجات وتقريب الخدمات الصحية من المناطق النائية.',
    content: `بدأت المستشفيات المغربية في تبني تقنيات الذكاء الاصطناعي لتحسين دقة التشخيص وتدبير الملفات الطبية، مما يمثل قفزة نوعية في الرعاية الصحية خاصة في المناطق القروية التي تعاني من نقص الأطباء المتخصصين.`,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '24 مارس 2025',
    views: 12400,
    author: 'عبدو التقني'
  },
  {
    id: 'amo-cnss-guide',
    title: 'دليل التغطية الصحية AMO في المغرب: كيف تستفيد من التعويضات؟',
    excerpt: 'كل ما تحتاج معرفته عن نظام التأمين الإجباري عن المرض وكيفية تسجيل أفراد أسرتك.',
    content: `يعد تعميم التغطية الصحية بالمغرب مشروعاً مجتمعياً ضخماً. في هذا المقال نوضح الخطوات العملية للاستفادة من خدمات الضمان الاجتماعي وتتبع ملفات التعويض عن المرض عبر البوابة الإلكترونية.`,
    image: 'https://images.unsplash.com/photo-1505751172107-5972297c3377?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '23 مارس 2025',
    views: 56700,
    author: 'عبدو المحلل'
  },
  {
    id: 'money-online-morocco',
    title: 'أفضل طرق الربح من الإنترنت في المغرب 2025: دليل شامل للمبتدئين',
    excerpt: 'اكتشف كيف يمكنك تحقيق دخل إضافي بالدرهم من خلال العمل الحر والتجارة الإلكترونية.',
    content: `أصبح العمل عبر الإنترنت خياراً واقعياً للشباب المغربي، من خلال التجارة الإلكترونية بنظام COD، البرمجة، أو صناعة المحتوى. المفتاح هو الاستمرارية وتعلم مهارات مطلوبة عالمياً.`,
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '22 مارس 2025',
    views: 84300,
    author: 'عبدو التقني'
  },
  {
    id: 'argan-oil-climate',
    title: 'مستقبل زيت الأركان المغربي: الذهب السائل بين تحديات المناخ والطلب العالمي',
    excerpt: 'تحليل لوضعية شجرة الأركان بالمغرب وكيف تساهم التعاونيات في حماية هذا الموروث.',
    content: `يواجه زيت الأركان تحديات بيئية كبيرة بسبب الجفاف، لكن الطلب العالمي المتزايد يجعله ثروة وطنية تتطلب استراتيجيات مستدامة للحفاظ على الغطاء الغابوي في مناطق سوس وماسة.`,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '21 مارس 2025',
    views: 15600,
    author: 'عبدو المحلل'
  },
  {
    id: 'dirham-economy-2025',
    title: 'تعويم الدرهم المغربي في 2025: هل تنجح المملكة في تحقيق التوازن المالي؟',
    excerpt: 'دراسة اقتصادية حول مسار مرونة سعر صرف الدرهم وتأثيراته على القدرة الشرائية.',
    content: `يواصل المغرب نهجه التدريجي في تعويم العملة الوطنية، وهو إجراء يهدف إلى تعزيز تنافسية الاقتصاد الوطني وجذب الاستثمارات الأجنبية، مع مراقبة صارمة لمعدلات التضخم.`,
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '20 مارس 2025',
    views: 42300,
    author: 'عبدو الاقتصادي'
  },
  {
    id: 'jobs-market-morocco',
    title: 'أكثر 10 وظائف مطلوبة في المغرب لعام 2025: أين يوجه الشباب طموحاتهم؟',
    excerpt: 'تحليل لسوق الشغل المغربي والمهن التي تضمن دخلاً مرتفعاً في قطاعات التكنولوجيا والخدمات.',
    content: `تتصدر المهن التقنية كالأمن السيبراني وتطوير البرمجيات قائمة التخصصات الأكثر طلباً، بالإضافة إلى المهندسين في مجالات الطيران وصناعة السيارات التي يشهد فيها المغرب نهضة كبرى.`,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '19 مارس 2025',
    views: 38900,
    author: 'عبدو التقني'
  },
  {
    id: '5g-internet-morocco',
    title: 'شبكة 5G في المغرب: متى ستصبح متاحة للجميع وما هي المدن الأولى؟',
    excerpt: 'توقعات انتشار الجيل الخامس بالمغرب وتأثيره على سرعة الإنترنت والتحول الرقمي.',
    content: `تستعد شركات الاتصالات المغربية لإطلاق خدمات الجيل الخامس بالتزامن مع استعدادات المملكة لاستضافة تظاهرات كبرى، مما سيوفر سرعات إنترنت هائلة تدعم إنترنت الأشياء والذكاء الاصطناعي.`,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '18 مارس 2025',
    views: 29400,
    author: 'عبدو التقني'
  },
  {
    id: 'bac-student-tips',
    title: '10 نصائح ذهبية لطلاب البكالوريا في المغرب: كيف تنظم وقتك وتتفوق؟',
    excerpt: 'دليل شامل لطلاب الثانية باك حول كيفية التعامل مع ضغط الامتحانات والحصول على ميزة تنافسية.',
    content: `النجاح في البكالوريا يتطلب تنظيماً محكماً ومراجعة دورية للمواد. ننصح الطلاب بالتركيز على اللغات والرياضيات وتخصيص وقت للراحة لتجنب الإرهاق النفسي قبل الامتحانات الوطنية.`,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '17 مارس 2025',
    views: 31200,
    author: 'عبدو الموجه'
  },
  {
    id: 'handicrafts-export',
    title: 'الصناعة التقليدية المغربية في الأسواق العالمية: كيف تبيع منتجاتك على Etsy؟',
    excerpt: 'دليل الحرفيين المغاربة للوصول إلى الزبناء الدوليين وبيع الزرابي والجلد باحترافية.',
    content: `الصناعة التقليدية المغربية مطلوبة بشدة في الخارج. يوضح هذا المقال كيفية فتح متجر إلكتروني دولي وشحن المنتجات التقليدية إلى أوروبا وأمريكا بكل سهولة.`,
    image: 'https://images.unsplash.com/photo-1563296150-2470c3886300?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '16 مارس 2025',
    views: 12300,
    author: 'عبدو المحلل'
  },
  {
    id: 'laptops-students-2025',
    title: 'أفضل 5 حواسيب محمولة للطلبة في المغرب لعام 2025: الجودة مقابل السعر',
    excerpt: 'مراجعة لأفضل أجهزة اللابتوب المناسبة للدراسة والبرمجة مع مراعاة الميزانية المتوسطة.',
    content: `نستعرض أفضل الأجهزة المتوفرة في السوق المغربية التي تجمع بين قوة الأداء وسعرها المناسب، مع التركيز على عمر البطارية وسهولة الحمل للطلاب الجامعيين.`,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '15 مارس 2025',
    views: 45600,
    author: 'عبدو التقني'
  },
  {
    id: 'mount-atlas-lions',
    title: 'مواجهة الحسم: أسود الأطلس وطريق المجد نحو كأس أفريقيا 2025',
    excerpt: 'تحليل فني لاستعدادات المنتخب المغربي والتحديات التي تواجه كتيبة وليد الركراكي.',
    content: `بعد الإنجاز المونديالي التاريخي، يطمح المنتخب المغربي للفوز باللقب القاري على أرضه وأمام جماهيره، معتمداً على تشكيلة تضم نجوماً يمارسون في أكبر الدوريات الأوروبية.`,
    image: 'https://images.unsplash.com/photo-1518091043644-c1d445eb951d?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '14 مارس 2025',
    views: 125400,
    author: 'عبدو الرياضي'
  },
  {
    id: 'startup-funding-guide',
    title: 'كيف تحصل على تمويل لمشروعك الناشئ في المغرب؟ دليلك للمقاولين الشباب',
    excerpt: 'استعراض لأهم برامج الدعم الحكومي والتمويل الخاص المتاحة للشركات الناشئة المغربية.',
    content: `يقدم المغرب عدة برامج لدعم المقاولين الشباب مثل "فرصة" و"انطلاقة". يشرح هذا المقال الشروط المطلوبة وكيفية تقديم ملف مشروع قوي للجهات المانحة.`,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '13 مارس 2025',
    views: 22100,
    author: 'عبدو التقني'
  },
  {
    id: 'moroccan-diet-health',
    title: 'النظام الغذائي المتوسطي: سر الصحة والنشاط في الثقافة المغربية',
    excerpt: 'لماذا يعتبر المطبخ المغربي أحد أصح الأنظمة الغذائية في العالم؟ تحليل للمكونات والفوائد.',
    content: `يعتمد المطبخ المغربي على زيت الزيتون، القطاني، والخضروات الطازجة. هذا المزيج يوفر مضادات أكسدة طبيعية تحمي من أمراض القلب وتطيل العمر الصحي للإنسان.`,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '12 مارس 2025',
    views: 19800,
    author: 'عبدو الموجه'
  },
  {
    id: 'ai-student-tools',
    title: 'أفضل 5 أدوات ذكاء اصطناعي للطلبة في المغرب: كيف تدرس بذكاء؟',
    excerpt: 'دليل شامل لأدوات تقنية ستساعدك في البحث العلمي وتلخيص الدروس باحترافية.',
    content: `من تلخيص المقالات إلى المساعدة في حل المسائل المعقدة، أصبح الذكاء الاصطناعي شريكاً تعليمياً لا غنى عنه. نستعرض أدوات مجانية تدعم اللغة العربية والفرنسية.`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '11 مارس 2025',
    views: 33100,
    author: 'عبدو التقني'
  },
  {
    id: 'electric-cars-morocco',
    title: 'السيارات الكهربائية في المغرب: هل البنية التحتية جاهزة لهذا التحول؟',
    excerpt: 'مراجعة لواقع محطات الشحن وأسعار السيارات الكهربائية في السوق المغربية لعام 2025.',
    content: `مع توجه المغرب نحو الطاقة الخضراء، بدأت محطات الشحن في الانتشار. نناقش هنا تكلفة الشحن المنزلي ومميزات التحول للسيارات الكهربائية في المدن الكبرى.`,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '10 مارس 2025',
    views: 27300,
    author: 'عبدو التقني'
  },
  {
    id: 'cfc-hub-africa',
    title: 'قطب الدار البيضاء المالي: كيف أصبح المغرب بوابة الاستثمار في أفريقيا؟',
    excerpt: 'تحليل لمكانة CFC كأول مركز مالي في القارة الأفريقية وتأثيره على الاقتصاد الوطني.',
    content: `بفضل موقعه الاستراتيجي وقوانينه المحفزة، نجح قطب الدار البيضاء المالي في جذب مئات الشركات العالمية التي تدير استثماراتها في القارة السمراء من قلب المغرب.`,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '09 مارس 2025',
    views: 34100,
    author: 'عبدو الاقتصادي'
  },
  {
    id: 'ecommerce-success-cod',
    title: 'دليل النجاح في التجارة الإلكترونية بالمغرب: كيف تبدأ من الصفر بنظام COD؟',
    excerpt: 'خطوات عملية لإنشاء مشروعك الخاص في الدفع عند الاستلام بالسوق المغربية.',
    content: `نظام الدفع عند الاستلام هو الأكثر ثقة لدى المغاربة. يشرح هذا الدليل كيفية اختيار المنتجات، التعاقد مع شركات الشحن، وتسويق متجرك عبر فيسبوك وتيك توك.`,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '08 مارس 2025',
    views: 29800,
    author: 'عبدو التقني'
  },
  {
    id: 'digital-wellbeing-tips',
    title: 'الصحة النفسية في عصر الشاشات: كيف تحافظ على هدوئك الرقمي؟',
    excerpt: 'نصائح عملية للتخلص من إدمان الهاتف والتعامل مع ضغوط منصات التواصل الاجتماعي.',
    content: `الاستخدام المفرط للهواتف يؤدي للقلق وضعف التركيز. في هذا المقال، نقدم تقنيات بسيطة مثل "الصيام الرقمي" لتجديد الطاقة العقلية والحفاظ على التوازن النفسي.`,
    image: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '07 مارس 2025',
    views: 18400,
    author: 'عبدو الموجه'
  },
  {
    id: 'iphone-16-morocco-price',
    title: 'آيفون 16 برو ماكس: السعر في المغرب ومراجعة الأداء الفعلي',
    excerpt: 'هل يستحق الهاتف سعره الحالي في الأسواق المغربية؟ تحليل للكاميرا والبطارية.',
    content: `نراجع أحدث إصدارات آبل ونقارن الأسعار بين الموزعين المعتمدين في المغرب. هل تستحق ميزات الذكاء الاصطناعي الجديدة دفع مبلغ يتجاوز 15 ألف درهم؟`,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '06 مارس 2025',
    views: 55200,
    author: 'عبدو التقني'
  },
  {
    id: 'success-morning-routine',
    title: 'الروتين الصباحي للناجحين: كيف تبدأ يومك بطاقة متجددة؟',
    excerpt: 'عادات صباحية بسيطة طبقها مشاهير رواد الأعمال لتحسين إنتاجيتهم وصحتهم.',
    content: `الاستيقاظ المبكر، شرب الماء، والتأمل هي ركائز البداية الناجحة. يشاركنا المقال كيف يمكن لـ 30 دقيقة صباحية أن تغير مسار يومك بالكامل وتزيد من تركيزك.`,
    image: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '05 مارس 2025',
    views: 21600,
    author: 'عبدو الموجه'
  },
  {
    id: 'learn-fast-20-hours',
    title: 'تعلم أي مهارة في 20 ساعة فقط: تقنيات التعلم السريع للمغاربة',
    excerpt: 'كيف تكتسب مهارة جديدة بسرعة فائقة وتنافس في سوق الشغل المتغير.',
    content: `لا تحتاج لآلاف الساعات لتصبح جيداً في شيء ما. يشرح جوش كوفمان في منهجيته كيف يمكن لـ 20 ساعة من التدريب المركز أن تجعلك تتقن أساسيات أي مهارة جديدة.`,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '04 مارس 2025',
    views: 25100,
    author: 'عبدو الموجه'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View | 'about' | 'privacy' | 'contact' | 'terms'>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedItem, setSelectedItem] = useState<Article | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // الإصدار v11.0 لإضافة مقال جاكيط تيمو الجديد وتحديث الكاش
  const DATA_VERSION = "v11.0_temu_jacket"; 

  useEffect(() => {
    const savedSettings = localStorage.getItem('abdou_settings_v11');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedCart = localStorage.getItem('abdou_cart_v11');
    if (savedCart) setCart(JSON.parse(savedCart));

    const consent = localStorage.getItem('abdou_cookie_consent_v11');
    if (consent) setCookieConsent(true);

    const savedPostsRaw = localStorage.getItem('abdou_blog_v11');
    const savedVersion = localStorage.getItem('abdou_data_version_v11');
    
    if (savedVersion !== DATA_VERSION) {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v11', JSON.stringify(INITIAL_DATA));
      localStorage.setItem('abdou_data_version_v11', DATA_VERSION);
      
      // تنظيف النسخ السابقة
      localStorage.removeItem('abdou_blog_v10');
      localStorage.removeItem('abdou_data_version_v10');
      localStorage.removeItem('abdou_blog_v9');
    } else {
      setPosts(savedPostsRaw ? JSON.parse(savedPostsRaw) : INITIAL_DATA);
    }
  }, []);

  const handleItemClick = (p: Article) => {
    const updatedPosts = posts.map(item => 
      item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item
    );
    setPosts(updatedPosts);
    localStorage.setItem('abdou_blog_v11', JSON.stringify(updatedPosts));
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
        
        {(view === 'privacy' || view === 'about' || view === 'contact' || view === 'terms') && (
          <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />
        )}

        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_blog_v11', JSON.stringify(newPosts));}}
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_settings_v11', JSON.stringify(s));}}
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
              <li><button onClick={() => setView('home')} className="hover:text-emerald-500 text-right">الرئيسية</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-emerald-500 text-right">من نحن</button></li>
              <li><button onClick={() => setView('privacy')} className="hover:text-emerald-500 text-right">سياسة الخصوصية</button></li>
              <li><button onClick={() => setView('terms')} className="hover:text-emerald-500 text-right">شروط الاستخدام</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-4">أدسنس 2025</h4>
            <p className="text-xs opacity-50 mb-4">الموقع يضم حالياً 27 مقالاً حصرياً مكتوباً باحترافية لتلائم شروط القبول.</p>
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
            onClick={() => {setCookieConsent(true); localStorage.setItem('abdou_cookie_consent_v11', 'true');}}
            className="px-8 py-2 bg-white text-emerald-600 rounded-xl font-black text-sm"
          >أوافق</button>
        </div>
      )}

      <WhatsAppButton />
    </div>
  );
};

export default App;
