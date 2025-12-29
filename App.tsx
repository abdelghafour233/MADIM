
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
    id: 'morocco-vs-zambia-can-2025-hype',
    title: 'مواجهة الحسم: المغاربة يترقبون موقعة "أسود الأطلس" ضد زامبيا في ليلة العبور نحو المجد الأفريقي',
    excerpt: 'تتجه أنظار الملايين من عشاق الكرة المغربية صوب الملعب الكبير لمتابعة المباراة الحاسمة ضد المنتخب الزامبي، وسط آمال عريضة بتأكيد الصدارة ومواصلة المسار الناجح في الكان.',
    content: `تعيش الشوارع المغربية منذ الساعات الأولى من صباح اليوم حالة من الغليان الرياضي والترقب الكبير، حيث لا صوت يعلو فوق صوت الموقعة المرتقبة التي ستجمع أسود الأطلس بمنتخب زامبيا برسم نهائيات كأس أمم أفريقيا.

الأجواء في المقاهي والشوارع:
من طنجة إلى الكويرة، استعدت المقاهي والساحات العمومية لاستقبال الجماهير عبر شاشات عملاقة، في مشهد يعيد للأذهان ملحمة مونديال قطر. الأعلام الوطنية تزين الشرفات، والقمصان الحمراء والخضراء باتت الزي الرسمي للمغاربة اليوم، في تعبير صريح عن الدعم اللامشروط لكتيبة وليد الركراكي.`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '20 مارس 2025',
    views: 98400,
    author: 'عبدو الرياضي',
    isTrending: true
  },
  {
    id: 'world-war-3-ukraine-analysis-2025',
    title: 'هل العالم على أعتاب حرب عالمية ثالثة؟ الأزمة الأوكرانية وتداعياتها',
    excerpt: 'تحليل جيوسياسي للصراع الروسي الأوكراني وتداعياته الدولية واحتمالات الحرب العالمية الثالثة.',
    content: `منذ اندلاع الصراع الروسي الأوكراني في فبراير 2022، لم يعد العالم كما كان. ما بدأ كعملية عسكرية محدودة تحول إلى أطول استنزاف عسكري في أوروبا منذ الحرب العالمية الثانية...`,
    image: 'https://images.unsplash.com/photo-1547721064-36203693e3d9?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '21 مارس 2025',
    views: 125400,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'morocco-dirham-float-2025-analysis',
    title: 'تعويم الدرهم المغربي: رحلة الانتقال نحو المرونة والنمو',
    excerpt: 'تحليل اقتصادي لمسار تعويم العملة الوطنية المغربية وتأثيراتها على الجيب والنمو الاقتصادي.',
    content: `يعد قرار إصلاح نظام سعر صرف الدرهم، أو ما يعرف بـ "التعويم"، أحد أبرز التحولات الهيكلية في الاقتصاد المغربي...`,
    image: 'https://images.unsplash.com/photo-1611974714024-4607a55d464a?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '19 مارس 2025',
    views: 38200,
    author: 'عبدو التقني',
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
          mergedPosts[existingIndex].title !== initialPost.title
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

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view as any}
        setView={setView as any}
        siteName={settings.siteName}
        onSearch={() => {}}
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
        {view === 'home' && <Home posts={posts} onPostClick={handleItemClick} darkMode={darkMode} />}
        {view === 'post' && selectedItem && <PostDetail post={selectedItem} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedItem && <ProductDetail product={selectedItem} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} onBack={() => setView('home')} darkMode={darkMode} />}
        {view === 'checkout' && <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={() => { alert('تم الطلب!'); setCart([]); setView('home'); }} />}
        
        {/* Legal Pages */}
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

      {/* Footer Required for AdSense */}
      <footer className={`mt-20 py-12 border-t ${darkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-black mb-4">{settings.siteName}</h3>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              منصتكم الشاملة لمتابعة أحدث أخبار المغرب والتقنية بكل احترافية ومصداقية.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><button onClick={() => setView('home')} className="hover:text-emerald-500">الرئيسية</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-emerald-500">من نحن</button></li>
              <li><button onClick={() => setView('privacy')} className="hover:text-emerald-500">سياسة الخصوصية</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-emerald-500">اتصل بنا</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-4">تواصل معنا</h4>
            <p className="text-sm opacity-60">contact@abdouweb.online</p>
            <div className="flex gap-4 mt-4">
               {/* Social Icons Placeholder */}
               <span className="opacity-40 text-xs">حقوق النشر © 2025</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
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
