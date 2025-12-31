
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
import AdUnit from './components/AdUnit.tsx'; 
import { INITIAL_POSTS } from './constants.tsx';

const CURRENT_VERSION = '4.0.0-PREMIUM-UI'; 
const STORAGE_KEYS = {
  POSTS: 'abdou_v140_posts', 
  SETTINGS: 'abdou_v140_settings',
  CART: 'abdou_v140_cart',
  VERSION: 'abdou_v140_version'
};

const LINK_A = 'https://bouncingbuzz.com/ctpynfts0?key=a6c7eb53025d8d39c467b947581bb153';
const LINK_B = 'https://bouncingbuzz.com/zj3mgnqb3?key=06741e12c87b4f0448ad3a2ef3183b49';

const ADSTERRA_SOCIAL_BAR = `<script src="https://pl28365246.effectivegatecpm.com/3d/40/12/3d4012bf393d5dde160f3b073d124.js"></script>`;
const ADSTERRA_NATIVE_BANNER = `<script async="async" data-cfasync="false" src="//pl25832770.highperformanceformat.com/f8/77/f1/f877f1523497b7b37060472658827918.js"></script><div id="container-f877f1523497b7b37060472658827918"></div>`;

const INITIAL_SETTINGS: Settings = {
  siteName: 'abdouweb.online',
  adsenseCode: 'ca-pub-5578524966832192',
  alternativeAdsCode: ADSTERRA_NATIVE_BANNER, 
  globalAdsCode: ADSTERRA_SOCIAL_BAR,      
  directLinkCode: LINK_B, 
  popunderCode: `<script type='text/javascript' src='${LINK_A}'></script>`,
  nativeAdCode: ADSTERRA_NATIVE_BANNER,
  dashboardPassword: '1234',
  totalVisits: 58200,
  totalEarnings: 194.20, 
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

  const injectGlobalAds = useCallback((code: string) => {
    if (!code) return;
    try {
      const scripts = code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gim);
      if (scripts) {
        scripts.forEach(tag => {
          const s = document.createElement('script');
          const srcMatch = tag.match(/src=["'](.+?)["']/);
          if (srcMatch) {
            s.src = srcMatch[1];
          } else {
            const innerMatch = tag.match(/>([\s\S]*?)<\/script>/);
            if (innerMatch && innerMatch[1].trim()) s.innerHTML = innerMatch[1];
          }
          s.setAttribute('data-cfasync', 'false');
          document.head.appendChild(s);
        });
      }
    } catch (e) {
      console.error("Adsterra Error", e);
    }
  }, []);

  useEffect(() => {
    const lastVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (lastVersion !== CURRENT_VERSION) {
      Object.keys(localStorage).forEach(key => { if (key.startsWith('abdou_')) localStorage.removeItem(key); });
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    }
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) setCart(JSON.parse(savedCart));
    
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      injectGlobalAds(settings.globalAdsCode);
      if (settings.popunderCode) injectGlobalAds(settings.popunderCode);
    }
  }, [isLoading, settings.globalAdsCode, settings.popunderCode, injectGlobalAds]);

  const handlePostClick = (p: Article) => {
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="text-emerald-500 font-black text-xs tracking-[0.5em] uppercase animate-pulse">abdouweb premium</div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white`}>
      <Navbar currentView={view} setView={setView} siteName={settings.siteName} onSearch={setSearchQuery} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        {view === 'home' && <Home posts={posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))} onPostClick={handlePostClick} settings={settings} />}
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} settings={settings} />}
        {view === 'product' && selectedPost && <ProductDetail product={selectedPost} onAddToCart={(p) => {
          const up = [...cart, {...p, quantity: 1}];
          setCart(up);
          localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(up));
          setIsCartOpen(true);
        }} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'checkout' && <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={(data) => {
             window.open(LINK_B, '_blank');
             setTimeout(() => {
               window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`طلب جديد من ${data.name}\nالمدينة: ${data.city}`)}`);
               setCart([]); setView('home');
             }, 300);
        }} />}
        {view === 'admin' && (!isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : <AdminDashboard posts={posts} settings={settings} onUpdate={(n) => {setPosts(n); localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(n));}} onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));}} onLogout={() => setIsAuth(false)} darkMode={darkMode} />)}
        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />}
      </main>

      {isCartOpen && <Cart items={cart} onRemove={(id) => setCart(c => c.filter(i => i.id !== id))} onUpdateQuantity={(id, q) => setCart(c => c.map(i => i.id === id ? {...i, quantity: q} : i))} onCheckout={() => {setIsCartOpen(false); setView('checkout');}} onClose={() => setIsCartOpen(false)} darkMode={darkMode} adCode={settings.alternativeAdsCode} />}
      
      <footer className="mt-20 py-16 glass border-t-0 rounded-t-[60px] text-center border-white/5">
        <div className="text-4xl font-black mb-4">abdouweb</div>
        <p className="text-slate-500 font-bold mb-8">وجهتك الأولى لأقوى العروض في المغرب</p>
        <div className="flex justify-center gap-8 mb-8 text-xs font-black opacity-30">
           <button onClick={() => setView('privacy')}>الخصوصية</button>
           <button onClick={() => setView('terms')}>الشروط</button>
           <button onClick={() => setView('contact')}>اتصل بنا</button>
        </div>
        <div className="opacity-10 text-[8px] font-black uppercase tracking-[1em]">
          © 2025 ALL RIGHTS RESERVED • V{CURRENT_VERSION}
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
