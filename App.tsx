
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

const DEFAULT_GLOBAL_ADS = `<script src="https://pl28365246.effectivegatecpm.com/3d/40/12/3d4012bf393d5dde160f3b0dd073d124.js"></script>`;

const INITIAL_SETTINGS: Settings = {
  siteName: 'abdouweb affiliate',
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
    const savedPosts = localStorage.getItem('abdou_shop_posts_final_v1');
    const savedSettings = localStorage.getItem('abdou_shop_settings_final_v1');
    const savedCart = localStorage.getItem('abdou_shop_cart_final_v1');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('abdou_shop_posts_final_v1', JSON.stringify(INITIAL_POSTS));
    }

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('abdou_shop_settings_final_v1', JSON.stringify(INITIAL_SETTINGS));
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
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('exit_popup_shown_v2')) {
        setShowExitPopup(true);
        localStorage.setItem('exit_popup_shown_v2', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  useEffect(() => {
    const names = ['سفيان', 'ياسين', 'فاطمة الزهراء', 'إدريس', 'خديجة', 'أمين', 'مريم', 'يوسف', 'حمزة', 'سارة', 'عبد الله', 'ليلى'];
    
    const triggerNotification = () => {
      if (posts.length === 0) return;
      
      const productPosts = posts.filter(p => p.isProduct || p.price);
      const randomProduct = productPosts[Math.floor(Math.random() * productPosts.length)] || posts[0];
      const name = names[Math.floor(Math.random() * names.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      
      setNotification({ 
        name, 
        city, 
        product: randomProduct.title || randomProduct.name || '', 
        image: randomProduct.image 
      });

      setTimeout(() => setNotification(null), 6000);
    };

    const initialTimeout = setTimeout(() => {
      triggerNotification();
      const interval = setInterval(triggerNotification, 25000);
      return () => clearInterval(interval);
    }, 10000);

    return () => clearTimeout(initialTimeout);
  }, [posts]);

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
    localStorage.setItem('abdou_shop_posts_final_v1', JSON.stringify(updated));
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Article) => {
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

  const shareSite = (platform: string) => {
    const url = window.location.origin;
    const text = `دخل شوف هاد الموقع فيه هميزات واعرين في المغرب: ${settings.siteName}`;
    if (platform === 'wa') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    if (platform === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  };

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
        {view === 'admin' && (!isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : <AdminDashboard posts={posts} settings={settings} onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_shop_posts_final_v1', JSON.stringify(newPosts));}} onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_shop_settings_final_v1', JSON.stringify(s));}} onLogout={() => setIsAuth(false)} darkMode={darkMode} />)}
        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />}
      </main>

      {/* شريط المشاركة العائم - الجانب (Desktop) */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[150] hidden md:flex flex-col gap-2 p-2 bg-white/10 backdrop-blur-md rounded-r-2xl border border-white/10 shadow-2xl">
        <button onClick={() => shareSite('wa')} className="w-12 h-12 bg-[#25D366] text-white rounded-xl flex items-center justify-center text-xl hover:translate-x-2 transition-transform shadow-lg">W</button>
        <button onClick={() => shareSite('fb')} className="w-12 h-12 bg-[#1877F2] text-white rounded-xl flex items-center justify-center text-xl hover:translate-x-2 transition-transform shadow-lg">F</button>
      </div>

      {/* شريط المشاركة العائم - الأسفل (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-[150] md:hidden bg-white/10 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around p-3 animate-slideUp">
         <button onClick={() => shareSite('wa')} className="flex flex-col items-center gap-1">
            <span className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center text-lg shadow-lg">W</span>
            <span className="text-[10px] font-black text-white/60">واتساب</span>
         </button>
         <button onClick={() => shareSite('fb')} className="flex flex-col items-center gap-1">
            <span className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center text-lg shadow-lg">F</span>
            <span className="text-[10px] font-black text-white/60">فيسبوك</span>
         </button>
         <div className="h-8 w-px bg-white/10"></div>
         <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex flex-col items-center gap-1">
            <span className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center text-lg border border-white/20">↑</span>
            <span className="text-[10px] font-black text-white/60">لأعلى</span>
         </button>
      </div>

      {/* نافذة الخروج */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowExitPopup(false)}></div>
          <div className="relative bg-gradient-to-b from-slate-900 to-black border border-white/20 p-10 rounded-[50px] max-w-lg w-full text-center shadow-2xl animate-scaleIn">
            <span className="text-7xl block mb-6 animate-bounce">🛑</span>
            <h2 className="text-3xl font-black text-white mb-4">انتظر لحظة!</h2>
            <p className="text-white/60 font-bold mb-8">لقد فزت بقسيمة شراء مجانية بقيمة 200 درهم قبل مغادرتك!</p>
            <a 
              href={settings.directLinkCode} target="_blank" onClick={() => setShowExitPopup(false)}
              className="block w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-all"
            >استلم القسيمة الآن 🔓</a>
          </div>
        </div>
      )}

      {/* إشعارات المبيعات الحية المتطورة */}
      {notification && (
        <div className="fixed bottom-24 right-4 md:bottom-32 md:right-8 z-[200] animate-slideLeft">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-3xl flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[300px] max-w-sm">
            <div className="relative shrink-0">
              <img src={notification.image} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt="" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">✔</div>
            </div>
            <div className="flex-1 text-right" dir="rtl">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">اشترى الآن! 🛍️</p>
              <p className="text-xs font-black text-white leading-tight mb-1">
                {notification.name} من <span className="text-emerald-400">{notification.city}</span>
              </p>
              <p className="text-[10px] text-white/60 font-bold truncate">
                اشترى: {notification.product}
              </p>
              <p className="text-[8px] text-white/40 mt-1 font-bold">منذ دقيقتين • تأكيد الطلب ✅</p>
            </div>
          </div>
        </div>
      )}

      {settings.directLinkCode && (
        <a href={settings.directLinkCode} target="_blank" className="fixed bottom-24 left-8 z-[90] w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce hover:scale-110 shadow-orange-600/50">🎁</a>
      )}

      {isCartOpen && <Cart items={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} onCheckout={() => {setIsCartOpen(false); setView('checkout');}} onClose={() => setIsCartOpen(false)} darkMode={darkMode} />}

      <footer className="mt-20 py-24 border-t border-white/5 text-center bg-black/20">
        <h3 className="text-3xl font-black mb-4 text-emerald-500">{settings.siteName}</h3>
        <p className="text-sm font-bold opacity-40 max-w-md mx-auto mb-8">متجر عبدو هو بوابتك الأولى لأقوى العروض والهميزات في المغرب. تسوق بذكاء ووفر مالك.</p>
        <div className="flex justify-center gap-4 mb-10">
           <button onClick={() => shareSite('wa')} className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-600 transition-colors">واتساب</button>
           <button onClick={() => shareSite('fb')} className="p-4 bg-white/5 rounded-2xl hover:bg-blue-600 transition-colors">فيسبوك</button>
        </div>
        <p className="text-[10px] font-bold opacity-20">© 2025 جميع الحقوق محفوظة لمتجر عبدو</p>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
