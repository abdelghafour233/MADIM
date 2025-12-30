
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
import { INITIAL_POSTS } from './constants.tsx';

// الإصدار 1.6.0: ثورة الصور وتجاوز الكاش
const CURRENT_VERSION = '1.6.0-IMAGE-ULTRA'; 
const STORAGE_KEYS = {
  POSTS: 'abdou_v20_posts', 
  SETTINGS: 'abdou_v20_settings',
  CART: 'abdou_v20_cart',
  VERSION: 'abdou_v20_version'
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
  dashboardPassword: '1234',
  totalVisits: 7500,
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

  useEffect(() => {
    const lastVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    
    if (lastVersion !== CURRENT_VERSION) {
      setPosts(INITIAL_POSTS);
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    } else {
      setPosts(savedPosts ? JSON.parse(savedPosts) : INITIAL_POSTS);
      setSettings(savedSettings ? JSON.parse(savedSettings) : INITIAL_SETTINGS);
    }
    if (savedCart) setCart(JSON.parse(savedCart));
    
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    if (settings.globalAdsCode) {
      const scriptId = 'adsterra-v160-loader';
      const old = document.getElementById(scriptId);
      if (old) old.remove();
      
      const el = document.createElement('div');
      el.id = scriptId;
      document.body.appendChild(el);
      
      const range = document.createRange();
      el.appendChild(range.createContextualFragment(settings.globalAdsCode));
    }
  }, [settings.globalAdsCode]);

  const handlePostClick = (p: Article) => {
    const updated = posts.map(item => item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item);
    setPosts(updated);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (settings.directLinkCode && p.isProduct) {
      window.open(settings.directLinkCode, '_blank');
    }
  };

  const addToCart = (product: Article) => {
    if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
    
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
    <div className="fixed inset-0 bg-[#0a0a0b] flex flex-col items-center justify-center z-[1000]">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <h2 className="text-emerald-500 font-black text-xl animate-pulse tracking-tighter uppercase">abdouweb.online</h2>
      <p className="text-white/20 text-[10px] mt-4 font-bold tracking-[0.3em]">VERSION {CURRENT_VERSION}</p>
    </div>
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const filteredPosts = posts.filter(p => (p.title || p.name || p.id || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view} setView={setView} siteName={settings.siteName} onSearch={setSearchQuery} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="container mx-auto px-4 md:px-6 py-6 flex-grow max-w-7xl">
        {view === 'home' && (
          <Home posts={filteredPosts} onPostClick={handlePostClick} darkMode={darkMode} directLink={settings.directLinkCode} settings={settings} />
        )}
        
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedPost && <ProductDetail product={selectedPost} onAddToCart={addToCart} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'checkout' && <Checkout total={cartTotal} onPlaceOrder={(data) => {
          const msg = `طلب جديد من: ${data.name}\nالمدينة: ${data.city}\nالهاتف: ${data.phone}\nالمجموع: ${cartTotal} د.م.\nالمنتجات:\n${cart.map(i => `- ${i.name} (x${i.quantity})`).join('\n')}`;
          window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`);
          setCart([]); localStorage.removeItem(STORAGE_KEYS.CART); setView('home');
        }} />}
        {view === 'admin' && (!isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : <AdminDashboard posts={posts} settings={settings} onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));}} onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));}} onLogout={() => setIsAuth(false)} darkMode={darkMode} />)}
        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />}
      </main>

      {isCartOpen && <Cart items={cart} onRemove={(id) => setCart(c => c.filter(i => i.id !== id))} onUpdateQuantity={(id, q) => setCart(c => c.map(i => i.id === id ? {...i, quantity: q} : i))} onCheckout={() => {setIsCartOpen(false); setView('checkout');}} onClose={() => setIsCartOpen(false)} darkMode={darkMode} />}

      <footer className="mt-20 py-20 border-t border-white/5 text-center bg-black/40">
        <div className="container mx-auto px-4">
           <h3 className="text-4xl font-black mb-6 text-emerald-500 tracking-tighter">abdouweb</h3>
           <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm font-bold opacity-60">
              <button onClick={() => setView('about')} className="hover:text-emerald-500 transition-colors">من نحن</button>
              <button onClick={() => setView('privacy')} className="hover:text-emerald-500 transition-colors">الخصوصية</button>
              <button onClick={() => setView('terms')} className="hover:text-emerald-500 transition-colors">الشروط</button>
              <button onClick={() => setView('contact')} className="hover:text-emerald-500 transition-colors">اتصل بنا</button>
           </div>
           <p className="text-[11px] font-bold opacity-30 tracking-widest uppercase">© 2025 abdouweb.online - v{CURRENT_VERSION}</p>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
