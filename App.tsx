
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
  adsenseCode: 'ca-pub-5578524966832192',
  dashboardPassword: '1234',
  totalVisits: 0
};

const INITIAL_DATA: Article[] = [
  {
    id: 'morocco-dirham-float-2025',
    title: 'تعويم الدرهم المغربي: هل اقتربت ساعة الحسم؟ تحليل شامل للإيجابيات والسلبيات على جيب المواطن والاقتصاد الوطني',
    excerpt: 'مع تزايد التقارير الدولية حول ضرورة مرونة الصرف، نغوص في ملف تعويم الدرهم المغربي لنكشف تأثيراته المرتقبة على القدرة الشرائية ونمو الاقتصاد.',
    content: `يعود ملف "تعويم الدرهم" أو الانتقال إلى نظام صرف أكثر مرونة ليتصدر واجهة النقاش الاقتصادي في المغرب...`,
    image: 'https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '8 مارس 2025',
    views: 142000,
    author: 'هيئة التحرير',
    isTrending: true
  },
  {
    id: 'temu-shopping-guide-morocco',
    title: 'دليلك الشامل للتسوق من تيمو (Temu) في المغرب: أسعار خيالية وشحن مجاني حتى باب منزلك',
    excerpt: 'لماذا أصبح تيمو التطبيق الأول للتسوق في المغرب؟ نكشف لكم أسرار الأسعار الرخيصة وكيفية الحصول على الشحن المجاني وحزم القسائم.',
    content: `يعتبر تطبيق تيمو (Temu) حالياً ظاهرة عالمية...
https://temu.to/k/u6zpr84k5n5`,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '4 مارس 2025',
    views: 78200,
    author: 'عبدو التقني',
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

  // تتبع الزوار
  useEffect(() => {
    const isReturningVisitor = sessionStorage.getItem('visited_session');
    const savedSettings = localStorage.getItem('abdou_settings');
    let currentSettings = savedSettings ? JSON.parse(savedSettings) : INITIAL_SETTINGS;

    if (!isReturningVisitor) {
      currentSettings.totalVisits = (currentSettings.totalVisits || 0) + 1;
      setSettings(currentSettings);
      localStorage.setItem('abdou_settings', JSON.stringify(currentSettings));
      sessionStorage.setItem('visited_session', 'true');
    } else {
      setSettings(currentSettings);
    }
  }, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem('abdou_blog_v2');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v2', JSON.stringify(INITIAL_DATA));
    }

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

  const handlePostClick = (p: Article) => {
    const updatedPosts = posts.map(item => 
      item.id === p.id ? { ...item, views: item.views + 1 } : item
    );
    updatePosts(updatedPosts);
    setSelectedPost({ ...p, views: p.views + 1 });
    setView('post');
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
        {view === 'home' && <Home posts={posts} onPostClick={handlePostClick} darkMode={darkMode} />}
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
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
             <h4 className="text-xl font-black mb-6">إحصائيات سريعة</h4>
             <div className="flex flex-col gap-2 opacity-60 font-black text-sm">
                <span>👥 زوار الموقع: {settings.totalVisits?.toLocaleString()}</span>
                <span>📝 عدد المقالات: {posts.length}</span>
             </div>
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
