
import React, { useState, useEffect } from 'react';
import { View, Article, Settings, Category, CartItem } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';
import LegalPage from './components/LegalPage.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './components/Checkout.tsx';
import { INITIAL_POSTS, CITIES } from './constants.tsx';

// الأكواد الجديدة التي زودتني بها
const DEFAULT_GLOBAL_ADS = `<script src="https://pl28365246.effectivegatecpm.com/3d/40/12/3d4012bf393d5dde160f3b0dd073d124.js"></script>`;
const DEFAULT_NATIVE_ADS = `<script async="async" data-cfasync="false" src="//pl25832770.highperformanceformat.com/f8/77/f1/f877f1523497b7b37060472658827918.js"></script><div id="container-f877f1523497b7b37060472658827918"></div>`;

const INITIAL_SETTINGS: Settings = {
  siteName: 'متجر عبدو | عروض حصرية',
  adsenseCode: 'ca-pub-5578524966832192',
  alternativeAdsCode: DEFAULT_NATIVE_ADS, 
  globalAdsCode: DEFAULT_GLOBAL_ADS,      
  directLinkCode: 'https://www.effectivegatecpm.com/wga5mrxfz?key=2d97310179e241819b7915da9473f01d',
  dashboardPassword: '1234',
  totalVisits: 100,
  whatsappNumber: '212649075664'
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<{name: string, city: string} | null>(null);
  const [showExitPopup, setShowExitPopup] = useState(false);

  useEffect(() => {
    const savedPosts = localStorage.getItem('abdou_shop_posts_v29');
    const savedSettings = localStorage.getItem('abdou_shop_settings_v29');
    const savedCart = localStorage.getItem('abdou_shop_cart_v29');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('abdou_shop_posts_v29', JSON.stringify(INITIAL_POSTS));
    }

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('abdou_shop_settings_v29', JSON.stringify(INITIAL_SETTINGS));
    }

    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // ميزة اكتشاف محاولة الخروج لزيادة الأرباح
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('exit_popup_shown')) {
        setShowExitPopup(true);
        localStorage.setItem('exit_popup_shown', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // نظام الإشعارات الوهمية
  useEffect(() => {
    const names = ['سفيان', 'ياسين', 'فاطمة', 'إدريس', 'خديجة', 'أمين', 'مريم', 'يوسف'];
    const interval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      setNotification({ name, city });
      setTimeout(() => setNotification(null), 5000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('abdou_shop_cart_v29', JSON.stringify(cart));
  }, [cart]);

  // حقن كود Social Bar
  useEffect(() => {
    if (settings.globalAdsCode) {
      const scriptId = 'adsterra-social-bar-v2';
      const oldScript = document.getElementById(scriptId);
      if (oldScript) oldScript.remove();
      
      const adContainer = document.createElement('div');
      adContainer.id = scriptId;
      document.body.appendChild(adContainer);
      
      const range = document.createRange();
      const fragment = range.createContextualFragment(settings.globalAdsCode);
      adContainer.appendChild(fragment);
    }
  }, [settings.globalAdsCode]);

  const handlePostClick = (p: Article) => {
    const updated = posts.map(item => item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item);
    setPosts(updated);
    localStorage.setItem('abdou_shop_posts_v29', JSON.stringify(updated));
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Article) => {
    // فتح الرابط المباشر عند الإضافة للسلة لضمان الربح
    window.open(settings.directLinkCode, '_blank');
    
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: q } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const filteredPosts = posts.filter(p => (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view} setView={setView} siteName={settings.siteName} onSearch={setSearchQuery} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && (
          <>
            {settings.directLinkCode && (
              <div className="mb-12 relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-4xl animate-bounce">🎁</div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white">هدية ترحيبية من عبدو!</h2>
                    <p className="text-white/80 font-bold">اضغط لاستلام "همزة اليوم" قبل انتهاء الوقت</p>
                  </div>
                </div>
                <a 
                  href={settings.directLinkCode} target="_blank" 
                  className="relative z-10 bg-white text-orange-600 px-10 py-4 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                >استلام الهديـة 🎰</a>
              </div>
            )}
            <Home posts={filteredPosts} onPostClick={handlePostClick} darkMode={darkMode} directLink={settings.directLinkCode} />
          </>
        )}
        
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedPost && <ProductDetail product={selectedPost} onAddToCart={addToCart} onBack={() => setView('home')} darkMode={darkMode} />}
        {view === 'checkout' && <Checkout total={cartTotal} onPlaceOrder={(data) => {
          const msg = `طلب جديد من ${data.name}\nالمدينة: ${data.city}\nالمجموع: ${cartTotal} د.م.\nالمنتجات:\n${cart.map(i => `- ${i.name || i.title}`).join('\n')}`;
          window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`);
          setCart([]); setView('home'); alert('تم تسجيل طلبك!');
        }} />}
        {view === 'admin' && (!isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : <AdminDashboard posts={posts} settings={settings} onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_shop_posts_v29', JSON.stringify(newPosts));}} onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_shop_settings_v29', JSON.stringify(s));}} onLogout={() => setIsAuth(false)} darkMode={darkMode} />)}
        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />}
      </main>

      {/* نافذة الخروج المنبثقة (Exit Intent) */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowExitPopup(false)}></div>
          <div className="relative bg-gradient-to-b from-slate-900 to-black border border-white/20 p-10 rounded-[50px] max-w-lg w-full text-center shadow-[0_0_100px_rgba(249,115,22,0.3)] animate-scaleIn">
            <span className="text-7xl block mb-6 animate-bounce">🛑</span>
            <h2 className="text-3xl font-black text-white mb-4">انتظر لحظة!</h2>
            <p className="text-white/60 font-bold mb-8 leading-relaxed">لقد نسيت استلام "كود الخصم الشامل" الخاص بك. لا تغادر خالي الوفاض!</p>
            <a 
              href={settings.directLinkCode} 
              target="_blank"
              onClick={() => setShowExitPopup(false)}
              className="block w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-all"
            >استلم الكود الآن 🔓</a>
            <button onClick={() => setShowExitPopup(false)} className="mt-6 text-white/30 font-bold text-sm">لا أريد خصماً، شكراً</button>
          </div>
        </div>
      )}

      {/* إشعار الربح الصغير */}
      {notification && (
        <div className="fixed bottom-32 left-8 z-[200] animate-slideLeft bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">✔</div>
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase">تم التأكيد</p>
            <p className="text-xs font-bold text-white">{notification.name} من {notification.city} ربح الجائزة!</p>
          </div>
        </div>
      )}

      {settings.directLinkCode && (
        <a href={settings.directLinkCode} target="_blank" className="fixed bottom-24 right-8 z-[90] w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce hover:scale-110">🎁</a>
      )}

      {isCartOpen && <Cart items={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} onCheckout={() => {setIsCartOpen(false); setView('checkout');}} onClose={() => setIsCartOpen(false)} darkMode={darkMode} />}

      <footer className="mt-20 py-12 border-t border-white/5 text-center opacity-60">
        <h3 className="text-xl font-black mb-2 text-emerald-500">{settings.siteName}</h3>
        <p className="text-[10px]">المنصة رقم 1 في المغرب للعروض والربح</p>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
