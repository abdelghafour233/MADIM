
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
    id: 'morocco-olive-oil-abundance-2025',
    title: 'زيت الزيتون بالمغرب: وفرة استثنائية في الإنتاج وتراجع كبير في الأسعار يثلج صدور المغاربة',
    excerpt: 'بعد سنوات من الغلاء الفاحش، يشهد الموسم الفلاحي الحالي وفرة غير مسبوقة في محاصيل الزيتون، مما أدى إلى انخفاض ملحوظ في أثمان "الذهب الأخضر" بمختلف جهات المملكة.',
    content: `يعيش المواطن المغربي خلال هذه الأسابيع على وقع خبر سار طال انتظاره، حيث سجلت أسواق زيت الزيتون في مختلف ربوع المملكة تراجعاً ملحوظاً في الأسعار...`,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '5 مارس 2025',
    views: 89400,
    author: 'هيئة التحرير',
    isTrending: true
  },
  {
    id: 'temu-shopping-guide-morocco',
    title: 'دليلك الشامل للتسوق من تيمو (Temu) in المغرب: أسعار خيالية وشحن مجاني حتى باب منزلك',
    excerpt: 'لماذا أصبح تيمو التطبيق الأول للتسوق في المغرب؟ نكشف لكم أسرار الأسعار الرخيصة وكيفية الحصول على الشحن المجاني وحزم القسائم.',
    content: `يعتبر تطبيق تيمو (Temu) حالياً ظاهرة عالمية في عالم التجارة الإلكترونية... هو وجهتك المثالية التي تجمع بين التنوع والتوفير. يمكنكم التسجيل عبر الرابط التالي للحصول على خصومات: https://temu.to/k/u6zpr84k5n5`,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '4 مارس 2025',
    views: 78200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'afcon-2025-opening-v2',
    title: 'المغرب يبهر العالم: حفل افتتاح "الكان" يكتب تاريخاً جديداً للكرة الإفريقية',
    excerpt: 'بمزيج بين العراقة والتكنولوجيا، المملكة المغربية تفتتح كأس أمم أفريقيا بحفل أسطوري حبس أنفاس الملايين حول العالم.',
    content: 'بألوان العلم المغربي وصيحات آلاف المشجعين التي هزت أركان الملعب، انطلقت رسمياً نهائيات كأس أمم إفريقيا...',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '3 مارس 2025',
    views: 52400,
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
      
      // منطق الحذف القسري للمقال الذي طلب المستخدم إزالته
      const needsCleanup = parsed.some((p: Article) => 
        p.id === 'morocco-world-cup-2030-prep' || p.id === '1'
      );

      if (needsCleanup) {
        // حذف المقالات المستهدفة وتحديث القائمة
        const updated = parsed.filter((p: Article) => 
          p.id !== 'morocco-world-cup-2030-prep' && p.id !== '1'
        );
        // نضمن أن المقالات الأساسية الأخرى موجودة
        const finalPosts = [...INITIAL_DATA];
        setPosts(finalPosts);
        localStorage.setItem('abdou_blog_v2', JSON.stringify(finalPosts));
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
