
import React, { useState, useEffect } from 'react';
import { View, Article, Category, Settings } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const INITIAL_SETTINGS: Settings = {
  siteName: 'عبدو ويب',
  adsenseCode: 'ca-pub-5578524966832192'
};

const INITIAL_DATA: Article[] = [
  {
    id: 'temu-shopping-guide-morocco',
    title: 'دليلك الشامل للتسوق من تيمو (Temu) في المغرب: أسعار خيالية وشحن مجاني حتى باب منزلك',
    excerpt: 'لماذا أصبح تيمو التطبيق الأول للتسوق في المغرب؟ نكشف لكم أسرار الأسعار الرخيصة وكيفية الحصول على الشحن المجاني وحزم القسائم.',
    content: `يعتبر تطبيق تيمو (Temu) حالياً ظاهرة عالمية في عالم التجارة الإلكترونية، وقد اكتسح السوق المغربي مؤخراً بفضل عروضه التي لا تقاوم. إذا كنت تبحث عن جودة مقبولة بأسعار لا تصدق، فإن تيمو هو وجهتك المثالية التي تجمع بين التنوع والتوفير.

لماذا تيمو رخيص جداً؟
السر يكمن في نموذج العمل المباشر من المصنع إلى المستهلك (Direct-from-Factory). هذا النموذج يلغي كافة التكاليف الإضافية التي يفرضها الوسطاء والموزعون، مما يتيح لك شراء مستلزمات المنزل، الإلكترونيات الذكية، والملابس بكسر من قيمتها في المتاجر التقليدية أو حتى المواقع المنافسة.

ميزة الشحن المجاني للمغرب: ثورة في عالم التوصيل
أكثر ما يؤرق المتسوق المغربي عادة هو تكاليف الشحن الدولي، لكن تيمو كسر هذه القاعدة. المنصة توفر ميزة الشحن المجاني للمغرب على أغلب الطلبيات، مع تتبع دقيق لمسار الطرد من المستودع حتى باب منزلك. كما أن تيمو يتعاقد مع شركات توصيل محلية سريعة لضمان وصول الطلبية في وقت قياسي يتراوح غالباً بين 10 إلى 15 يوماً.

كيف تحصل على خصومات إضافية؟
بالإضافة إلى الأسعار المنخفضة أصلاً، يوفر تيمو نظام "القسائم الشرائية" (Coupons) وعروض "الفلاش سيل" التي تصل فيها الخصومات إلى 90%. 

🚀 عرض خاص وحصري لمتابعي "عبدو ويب":
يمكنك الآن الحصول على حزمة خصومات هائلة وقسائم شراء مجانية عند التسجيل عبر الرابط الرسمي التالي:
https://temu.to/k/u6zpr84k5n5

نصائح ذهبية عند الشراء من تيمو:
1. قراءة المراجعات: دائماً قم بتفقد صور المنتجات التي يرفعها المشترون الحقيقيون في التعليقات.
2. قياسات الملابس: تأكد من مراجعة جدول القياسات بالسنتيمتر لأن المقاسات الصينية قد تختلف عن الأوروبية.
3. العروض اليومية: قم بزيارة التطبيق يومياً للحصول على هدايا مجانية ونقاط مكافأة.

خلاصة القول، تيمو ليس مجرد موقع تسوق، بل هو شريكك الذكي لتجهيز منزلك وحياتك بأقل التكاليف الممكنة. لا تضيع الفرصة وابدأ رحلة التوفير الآن!`,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '4 مارس 2025',
    views: 78200,
    author: 'عبدو التقني',
    isTrending: true
  },
  {
    id: 'afcon-2025-opening-v2',
    title: 'المغرب يبهر العالم: حفل افتتاح "الكان" يكتب تاريخاً جديداً للكرة الإفريقية',
    excerpt: 'بمزيج بين العراقة والتكنولوجيا، المملكة المغربية تفتتح كأس أمم أفريقيا بحفل أسطوري حبس أنفاس الملايين حول العالم.',
    content: 'بألوان العلم المغربي وصيحات آلاف المشجعين التي هزت أركان الملعب، انطلقت رسمياً نهائيات كأس أمم إفريقيا في أجواء احتفالية غير مسبوقة. لم يكن مجرد حفل افتتاح، بل كان سيمفونية بصرية مزجت بين التكنولوجيا الرقمية المتطورة والعراقة المغربية التي تضرب بجذورها في أعماق التاريخ الإفريقي.\n\nاستخدمت اللجنة المنظمة أسطولاً من الطائرات المسيرة (الدرونز) التي شكلت لوحات فنية في سماء الرباط، تجسد خريطة القارة السمراء والتحام الشعوب خلف كرة القدم. وتخلل الحفل عروض فلكلورية تمثل مختلف جهات المملكة، من عبيدات الرما وأحواش إلى فنون الكناوة، مما أعطى للحدث بعداً ثقافياً عميقاً.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '3 مارس 2025',
    views: 52400,
    author: 'هيئة التحرير',
    isTrending: false
  },
  {
    id: '1',
    title: 'المغرب يستعد لاستضافة كأس العالم 2030 ببنبة تحتية عالمية',
    excerpt: 'تفاصيل الملاعب الجديدة ومشاريع النقل الكبرى التي ستحول المدن المغربية إلى وجهات عالمية.',
    content: 'تشهد المملكة المغربية ورشة إصلاح كبرى استعداداً لاحتضان مونديال 2030 بالتعاون مع إسبانيا والبرتغال. تشمل المشاريع بناء "ملعب الحسن الثاني الكبير" ببنسليمان وسلسلة من القطارات فائقة السرعة التي ستربط طنجة بأكادير.',
    image: 'https://images.unsplash.com/photo-1539186607619-df476afe3ff1?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '1 مارس 2025',
    views: 8500,
    author: 'هيئة التحرير',
    isTrending: false
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (view === 'home') {
      document.title = `${settings.siteName} | أخبار المغرب والتقنية`;
    } else if (view === 'post' && selectedPost) {
      document.title = `${selectedPost.title || selectedPost.name} | ${settings.siteName}`;
    } else if (view === 'admin') {
      document.title = `لوحة التحكم | ${settings.siteName}`;
    }
  }, [view, selectedPost, settings.siteName]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('abdou_blog_v2');
    
    if (savedPosts) {
      let parsed = JSON.parse(savedPosts);
      
      // تحديث قسري للمقال الجديد "تيمو" لضمان ظهوره للجميع
      const hasTemuPost = parsed.some((p: Article) => p.id === 'temu-shopping-guide-morocco');

      if (!hasTemuPost) {
        const updated = [INITIAL_DATA[0], ...parsed];
        setPosts(updated);
        localStorage.setItem('abdou_blog_v2', JSON.stringify(updated));
      } else {
        setPosts(parsed);
      }
    } else {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v2', JSON.stringify(INITIAL_DATA));
    }

    const savedSettings = localStorage.getItem('abdou_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setDarkMode(false);
  }, []);

  const updatePosts = (newPosts: Article[]) => {
    setPosts(newPosts);
    localStorage.setItem('abdou_blog_v2', JSON.stringify(newPosts));
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('abdou_settings', JSON.stringify(newSettings));
  };

  const navigateTo = (v: View, p?: Article) => {
    if (p) setSelectedPost(p);
    setView(v);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view}
        setView={setView}
        siteName={settings.siteName}
        onSearch={() => {}}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={0}
        onOpenCart={() => {}}
      />

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && <Home posts={posts} onPostClick={(p) => navigateTo('post', p)} darkMode={darkMode} />}
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'admin' && (
          !isAuth ? <Login onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={updatePosts}
            onUpdateSettings={updateSettings}
            onLogout={() => setIsAuth(false)}
            darkMode={darkMode}
          />
        )}
      </main>

      <footer className={`mt-20 py-16 border-t transition-all ${darkMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200 shadow-inner'}`}>
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
          <div>
            <div className="text-3xl font-black mb-6"><span className="text-emerald-500">ABDO</span>WEB</div>
            <p className="opacity-60 leading-relaxed font-bold">منصتك المغربية الرائدة لاستكشاف عالم التقنية، تطوير الذات، وآخر الأخبار المحلية بلمسة إبداعية.</p>
          </div>
          <div>
            <h4 className="text-xl font-black mb-6">الأقسام الرئيسية</h4>
            <ul className="space-y-4 opacity-60 font-bold">
              {Object.values(Category).map(c => <li key={c} className="hover:text-emerald-500 cursor-pointer transition-colors">{c}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-black mb-6">تواصل معنا</h4>
            <p className="opacity-60 font-bold mb-4">الدعم الفني والتعاون الإعلاني متوفر 24/7</p>
          </div>
        </div>
        <div className="text-center mt-20 pt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
          جميع الحقوق محفوظة © 2025 لـ {settings.siteName}
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
