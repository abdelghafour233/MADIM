
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

// نسخة جديدة لكسر الكاش القديم
const CURRENT_VERSION = '2.4.0-FORCE-REFRESH'; 
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

  // نظام حقن الإعلانات الإجباري (Force Injection System)
  const forceInjectAd = useCallback((containerId: string, code: string) => {
    if (!code) return;
    try {
      const target = document.getElementById(containerId);
      if (target) {
        // تفريغ الحاوية تماماً
        target.innerHTML = '';
        const range = document.createRange();
        const fragment = range.createContextualFragment(code);
        target.appendChild(fragment);
        console.log(`Force Injected: ${containerId}`);
      }
    } catch (e) {
      console.warn(`Injection failed for ${containerId}`, e);
    }
  }, []);

  useEffect(() => {
    const lastVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    
    // إذا تغيرت النسخة، نقوم بمسح الكاش المحلي لضمان رؤية التحديثات
    if (lastVersion !== CURRENT_VERSION) {
      console.log("New Version Detected: Clearing local cache...");
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      // تحديث الإعدادات والبوستات للقيم الجديدة
      setSettings(INITIAL_SETTINGS);
      setPosts(INITIAL_POSTS);
    } else {
      if (savedSettings) setSettings({ ...INITIAL_SETTINGS, ...JSON.parse(savedSettings) });
      if (savedPosts) setPosts(JSON.parse(savedPosts));
      else setPosts(INITIAL_POSTS);
    }
    
    if (savedCart) setCart(JSON.parse(savedCart));
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // الحقن الفوري عند انتهاء التحميل
  useEffect(() => {
    if (!isLoading) {
      // حقن الإعلان العلوي في الحاوية الثابتة في index.html
      forceInjectAd('top-ad-fixed-container', settings.alternativeAdsCode);
      
      // حقن السوشيال بار في حاوية داخلية مخفية
      forceInjectAd('social-bar-internal', settings.globalAdsCode);
      
      // نظام Popunder عند أول لمسة
      const runPopunder = () => {
        if (settings.popunderCode) {
           const popDiv = document.createElement('div');
           popDiv.style.display = 'none';
           document.body.appendChild(popDiv);
           const frag = document.createRange().createContextualFragment(settings.popunderCode);
           popDiv.appendChild(frag);
        }
        window.removeEventListener('touchstart', runPopunder);
        window.removeEventListener('click', runPopunder);
      };
      window.addEventListener('touchstart', runPopunder);
      window.addEventListener('click', runPopunder);
    }
  }, [isLoading, settings, forceInjectAd]);

  const handlePostClick = (p: Article) => {
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // تفعيل الرابط المباشر عند الضغط
    if (settings.directLinkCode && Math.random() > 0.3) {
      window.open(settings.directLinkCode, '_blank');
    }
  };

  if (isLoading) return <div className="fixed inset-0 bg-[#0a0a0b] flex items-center justify-center z-[3000]"><div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* حاوية مخفية للسوشيال بار */}
      <div id="social-bar-internal" style={{display:'none'}}></div>

      <Navbar 
        currentView={view} setView={setView} siteName={settings.siteName} onSearch={setSearchQuery} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="container mx-auto px-4 py-4 flex-grow max-w-7xl">
        {view === 'home' && (
          <Home posts={posts.filter(p => (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()))} onPostClick={handlePostClick} darkMode={darkMode} settings={settings} />
        )}
        
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

      <footer className="mt-10 py-10 border-t border-white/5 text-center opacity-40 text-[10px] font-bold">
        © 2025 {settings.siteName} - جميع الحقوق محفوظة (v{CURRENT_VERSION})
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
