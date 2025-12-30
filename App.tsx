
import React, { useState, useEffect, useCallback } from 'react';
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
import { INITIAL_POSTS } from './constants.tsx';

const CURRENT_VERSION = '2.2.0-MOBILE-RECOVERY'; 
const STORAGE_KEYS = {
  POSTS: 'abdou_v40_posts', 
  SETTINGS: 'abdou_v40_settings',
  CART: 'abdou_v40_cart',
  VERSION: 'abdou_v40_version'
};

const ADSTERRA_SOCIAL_BAR = `<script src="https://pl28365246.effectivegatecpm.com/3d/40/12/3d4012bf393d5dde160f3b0dd073d124.js"></script>`;
const ADSTERRA_NATIVE_BANNER = `<script async="async" data-cfasync="false" src="//pl25832770.highperformanceformat.com/f8/77/f1/f877f1523497b7b37060472658827918.js"></script><div id="container-f877f1523497b7b37060472658827918"></div>`;
const ADSTERRA_DIRECT_LINK = 'https://www.effectivegatecpm.com/wga5mrxfz?key=2d97310179e241819b7915da9473f01d';

const INITIAL_SETTINGS: Settings = {
  siteName: 'abdouweb.online',
  adsenseCode: 'ca-pub-5578524966832192',
  alternativeAdsCode: ADSTERRA_NATIVE_BANNER, 
  globalAdsCode: ADSTERRA_SOCIAL_BAR,      
  directLinkCode: ADSTERRA_DIRECT_LINK,
  popunderCode: '', 
  nativeAdCode: ADSTERRA_NATIVE_BANNER,
  dashboardPassword: '1234',
  totalVisits: 18920,
  totalEarnings: 42.15, 
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
  const [isLoading, setIsLoading] = useState(true);

  // وظيفة حقن السكربتات المتقدمة
  const injectAdScript = useCallback((id: string, code: string) => {
    if (!code) return;
    try {
      const containerId = `container-${id}`;
      let container = document.getElementById(containerId);
      if (container) container.remove();
      
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
      
      const range = document.createRange();
      const fragment = range.createContextualFragment(code);
      container.appendChild(fragment);
      console.log(`Ad script ${id} injected successfully.`);
    } catch (e) {
      console.error(`Error injecting ad script ${id}:`, e);
    }
  }, []);

  useEffect(() => {
    const lastVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    
    let currentSettings = INITIAL_SETTINGS;
    if (savedSettings) {
      currentSettings = { ...INITIAL_SETTINGS, ...JSON.parse(savedSettings) };
    }

    if (lastVersion !== CURRENT_VERSION) {
      setPosts(INITIAL_POSTS);
      setSettings(currentSettings);
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
    } else {
      setPosts(savedPosts ? JSON.parse(savedPosts) : INITIAL_POSTS);
      setSettings(currentSettings);
    }
    if (savedCart) setCart(JSON.parse(savedCart));
    
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // تشغيل الإعلانات عند تحميل التطبيق أو تغيير الإعدادات
  useEffect(() => {
    if (!isLoading) {
      injectAdScript('social-bar', settings.globalAdsCode);
      injectAdScript('popunder', settings.popunderCode || '');
      
      // محاولة إعادة الحقن عند أول تفاعل للمستخدم (للهواتف)
      const handleFirstInteraction = () => {
        injectAdScript('social-bar-retry', settings.globalAdsCode);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('click', handleFirstInteraction);
      };
      window.addEventListener('touchstart', handleFirstInteraction);
      window.addEventListener('click', handleFirstInteraction);
    }
  }, [isLoading, settings.globalAdsCode, settings.popunderCode, injectAdScript]);

  const handlePostClick = (p: Article) => {
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // تحفيز فتح الرابط المباشر
    if (settings.directLinkCode && Math.random() > 0.4) {
      const adTab = window.open(settings.directLinkCode, '_blank');
      if (adTab) adTab.blur();
      window.focus();
    }
  };

  const addToCart = (product: Article) => {
    setCart(prev => {
      const updated = prev.find(item => item.id === product.id)
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
    setIsCartOpen(true);
  };

  if (isLoading) return (
    <div className="fixed inset-0 bg-[#0a0a0b] flex items-center justify-center z-[1000]">
      <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const filteredPosts = posts.filter(p => (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view} setView={setView} siteName={settings.siteName} onSearch={setSearchQuery} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="container mx-auto px-4 md:px-6 py-4 flex-grow max-w-7xl">
        {view === 'home' && (
          <Home posts={filteredPosts} onPostClick={handlePostClick} darkMode={darkMode} directLink={settings.directLinkCode} settings={settings} />
        )}
        
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedPost && <ProductDetail product={selectedPost} onAddToCart={addToCart} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'checkout' && <Checkout total={cartTotal} onPlaceOrder={(data) => {
          const msg = `طلب جديد: ${data.name}\n${cart.map(i => `- ${i.name} (x${i.quantity})`).join('\n')}`;
          window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`);
          setCart([]); setView('home');
        }} />}
        {view === 'admin' && (!isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : <AdminDashboard posts={posts} settings={settings} onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));}} onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));}} onLogout={() => setIsAuth(false)} darkMode={darkMode} />)}
        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />}
      </main>

      {isCartOpen && <Cart items={cart} onRemove={(id) => setCart(c => c.filter(i => i.id !== id))} onUpdateQuantity={(id, q) => setCart(c => c.map(i => i.id === id ? {...i, quantity: q} : i))} onCheckout={() => {setIsCartOpen(false); setView('checkout');}} onClose={() => setIsCartOpen(false)} darkMode={darkMode} adCode={settings.alternativeAdsCode} />}

      <footer className="mt-10 py-10 border-t border-white/5 text-center opacity-40 text-[10px] font-bold">
        © 2025 {settings.siteName} - جميع الحقوق محفوظة
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
