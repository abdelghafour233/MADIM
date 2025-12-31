
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
import AdUnit from './components/AdUnit.tsx'; // استيراد الوحدة الإعلانية
import { INITIAL_POSTS } from './constants.tsx';

const CURRENT_VERSION = '3.4.0-FINAL-ADS'; 
const STORAGE_KEYS = {
  POSTS: 'abdou_v120_posts', 
  SETTINGS: 'abdou_v120_settings',
  CART: 'abdou_v120_cart',
  VERSION: 'abdou_v120_version'
};

const ADSTERRA_SOCIAL_BAR = `<script src="https://pl28365246.effectivegatecpm.com/3d/40/12/3d4012bf393d5dde160f3b073d124.js"></script>`;
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
  totalVisits: 35000,
  totalEarnings: 92.40, 
  whatsappNumber: '212649075664'
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>(INITIAL_POSTS);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // دالة حقن ذكية للإعلانات التي لا تحتاج لحاوية (مثل Social Bar)
  const injectFloatingAds = useCallback((code: string) => {
    if (!code) return;
    const scriptMatches = code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gim);
    if (scriptMatches) {
      scriptMatches.forEach(tag => {
        const s = document.createElement('script');
        const src = tag.match(/src=["'](.+?)["']/);
        if (src) s.src = src[1];
        const inner = tag.match(/>([\s\S]*?)<\/script>/);
        if (inner && inner[1].trim()) s.innerHTML = inner[1];
        s.setAttribute('data-cfasync', 'false');
        document.body.appendChild(s);
      });
    }
  }, []);

  useEffect(() => {
    const lastVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (lastVersion !== CURRENT_VERSION) {
      Object.keys(localStorage).forEach(key => { if (key.startsWith('abdou_')) localStorage.removeItem(key); });
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      setPosts(INITIAL_POSTS);
      setSettings(INITIAL_SETTINGS);
    } else {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedPosts) setPosts(JSON.parse(savedPosts));
    }
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) setCart(JSON.parse(savedCart));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // حقن الإعلانات العائمة فوراً
      setTimeout(() => {
        injectFloatingAds(settings.globalAdsCode);
        if (settings.popunderCode) injectFloatingAds(settings.popunderCode);
      }, 2000);
    }
  }, [isLoading, settings, injectFloatingAds]);

  const handlePostClick = (p: Article) => {
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-emerald-500 font-black">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      جاري تشغيل محرك الربح...
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar currentView={view} setView={setView} siteName={settings.siteName} onSearch={setSearchQuery} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      
      {/* الإعلان العلوي المباشر - يظهر في كل الصفحات */}
      <div className="w-full bg-black/20 flex justify-center py-2 overflow-hidden min-h-[60px]">
        <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} className="!my-0" />
      </div>

      <main className="container mx-auto px-4 py-4 flex-grow max-w-7xl">
        {view === 'home' && <Home posts={posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))} onPostClick={handlePostClick} darkMode={darkMode} settings={settings} />}
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedPost && <ProductDetail product={selectedPost} onAddToCart={(p) => {
          const up = [...cart, {...p, quantity: 1}];
          setCart(up);
          localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(up));
          setIsCartOpen(true);
        }} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'checkout' && <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={(data) => {
           window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`طلب جديد من ${data.name}`)}`);
           setCart([]); setView('home');
        }} />}
        {view === 'admin' && (!isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : <AdminDashboard posts={posts} settings={settings} onUpdate={(n) => {setPosts(n); localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(n));}} onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));}} onLogout={() => setIsAuth(false)} darkMode={darkMode} />)}
        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />}
      </main>

      {isCartOpen && <Cart items={cart} onRemove={(id) => setCart(c => c.filter(i => i.id !== id))} onUpdateQuantity={(id, q) => setCart(c => c.map(i => i.id === id ? {...i, quantity: q} : i))} onCheckout={() => {setIsCartOpen(false); setView('checkout');}} onClose={() => setIsCartOpen(false)} darkMode={darkMode} adCode={settings.alternativeAdsCode} />}
      
      <footer className="mt-10 py-10 border-t border-white/5 text-center opacity-30 text-[8px] font-bold tracking-[0.4em]">
        © 2025 {settings.siteName} • ENGINE {CURRENT_VERSION}
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
