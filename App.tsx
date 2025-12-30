
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

// رفع الإصدار وتغيير مفاتيح التخزين هو الحل النهائي لمشاكل الكاش
const CURRENT_VERSION = '1.2.0'; 
const STORAGE_KEYS = {
  POSTS: 'abdouweb_posts_v4', 
  SETTINGS: 'abdouweb_settings_v4',
  CART: 'abdouweb_cart_v4',
  VERSION: 'abdouweb_version_v4'
};

const DEFAULT_GLOBAL_ADS = `<script src="https://pl28365246.effectivegatecpm.com/3d/40/12/3d4012bf393d5dde160f3b0dd073d124.js"></script>`;

const INITIAL_SETTINGS: Settings = {
  siteName: 'abdouweb',
  adsenseCode: 'ca-pub-5578524966832192',
  alternativeAdsCode: `<script async="async" data-cfasync="false" src="//pl25832770.highperformanceformat.com/f8/77/f1/f877f1523497b7b37060472658827918.js"></script><div id="container-f877f1523497b7b37060472658827918"></div>`, 
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
  const [notification, setNotification] = useState<{name: string, city: string, product: string, image: string} | null>(null);
  const [showExitPopup, setShowExitPopup] = useState(false);

  useEffect(() => {
    const lastVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    
    if (lastVersion !== CURRENT_VERSION) {
      // تحديث جذري: نقوم بمسح النسخ القديمة وتثبيت الجديدة
      setPosts(INITIAL_POSTS);
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      // مسح الكاش القديم لتوفير المساحة
      localStorage.removeItem('abdouweb_posts_v3');
      localStorage.removeItem('abdouweb_settings_v3');
    } else {
      if (savedPosts) setPosts(JSON.parse(savedPosts));
      else setPosts(INITIAL_POSTS);

      if (savedSettings) setSettings(JSON.parse(savedSettings));
      else setSettings(INITIAL_SETTINGS);
    }

    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    const handleFirstClick = () => {
      if (!localStorage.getItem('popunder_done')) {
        window.open(settings.directLinkCode, '_blank');
        localStorage.setItem('popunder_done', 'true');
        setTimeout(() => localStorage.removeItem('popunder_done'), 1800000);
      }
    };
    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, [settings.directLinkCode]);

  useEffect(() => {
    if (settings.globalAdsCode) {
      const scriptId = 'adsterra-social-bar-final';
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
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Article) => {
    window.open(settings.directLinkCode, '_blank');
    setCart(prev => {
      const updated = prev.find(item => item.id === product.id)
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return removeFromCart(id);
    setCart(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, quantity: q } : item);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
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
          setCart([]); localStorage.removeItem(STORAGE_KEYS.CART); setView('home'); alert('تم تسجيل طلبك!');
        }} />}
        {view === 'admin' && (!isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : <AdminDashboard posts={posts} settings={settings} onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));}} onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));}} onLogout={() => setIsAuth(false)} darkMode={darkMode} />)}
        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />}
      </main>

      {/* إشعارات حية */}
      {notification && (
        <div className="fixed bottom-24 right-4 md:bottom-32 md:right-8 z-[200] animate-slideLeft">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-3xl flex items-center gap-4 shadow-2xl min-w-[300px] max-w-sm">
            <div className="shrink-0 relative">
              <img src={notification.image} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt="" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">✔</div>
            </div>
            <div className="flex-1 text-right" dir="rtl">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">اشترى الآن! 🛍️</p>
              <p className="text-xs font-black text-white leading-tight mb-1">
                {notification.name} من <span className="text-emerald-400">{notification.city}</span>
              </p>
              <p className="text-[10px] text-white/60 font-bold truncate">اشترى: {notification.product}</p>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && <Cart items={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} onCheckout={() => {setIsCartOpen(false); setView('checkout');}} onClose={() => setIsCartOpen(false)} darkMode={darkMode} />}

      <footer className="mt-20 py-24 border-t border-white/5 text-center bg-black/20">
        <h3 className="text-3xl font-black mb-4 text-emerald-500">abdouweb</h3>
        <p className="text-sm font-bold opacity-40 max-w-md mx-auto mb-8">متجر عبدو ويب هو بوابتك الأولى لأقوى العروض والهميزات في المغرب. الإصدار {CURRENT_VERSION}</p>
        <p className="text-[10px] font-bold opacity-20">© 2025 جميع الحقوق محفوظة - abdouweb.online</p>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
