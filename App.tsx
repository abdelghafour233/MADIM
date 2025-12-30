
import React, { useState, useEffect } from 'react';
import { View, Article, Category, Settings, CartItem } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import Store from './components/Store.tsx';
import PostDetail from './components/PostDetail.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './components/Checkout.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';
import LegalPage from './components/LegalPage.tsx';
import { INITIAL_POSTS } from './constants.tsx';

const INITIAL_SETTINGS: Settings = {
  siteName: 'عبدو ويب | صيد العروض والأفلييت',
  adsenseCode: 'ca-pub-5578524966832192',
  alternativeAdsCode: '', 
  globalAdsCode: '<script src="https://pl28365246.effectivegatecpm.com/3d/40/12/3d4012bf393d5dde160f3b0dd073d124.js"></script>',
  dashboardPassword: '1234',
  totalVisits: 0,
  whatsappNumber: '212649075664'
};

const INITIAL_DATA: Article[] = [
  ...INITIAL_POSTS,
  {
    id: 'prod-1',
    name: 'ساعة ذكية Ultra Series 9',
    excerpt: 'أحدث إصدار من الساعات الذكية مع شاشة AMOLED ودعم كامل للغة العربية والاتصال.',
    content: `تعتبر هذه الساعة الخيار الأمثل للمغاربة الباحثين عن الأناقة والأداء.
    مميزات الساعة:
    - شاشة مقاومة للخدش.
    - بطارية تدوم 5 أيام.
    - قياس نبضات القلب والأكسجين.
    - شحن لاسلكي سريع.`,
    image: 'https://images.unsplash.com/photo-1544117518-3065a7ecf343?auto=format&fit=crop&q=80&w=1000',
    category: Category.STORE,
    date: '04 أبريل 2025',
    views: 1200,
    author: 'المتجر',
    price: 450,
    oldPrice: 600,
    isProduct: true,
    rating: 5,
    inStock: true
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedItem, setSelectedItem] = useState<Article | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // التحديث الأقوى v21 لإجبار كل الأجهزة على التحديث
  const DATA_VERSION = "v21.0_ultra_refresh"; 

  useEffect(() => {
    const savedVersion = localStorage.getItem('abdou_version_v21');
    
    if (savedVersion !== DATA_VERSION) {
      // إجبار المتصفح على حذف كل البيانات القديمة والمخزنة نهائياً
      localStorage.clear(); 
      
      setPosts(INITIAL_DATA);
      setSettings(INITIAL_SETTINGS);
      
      localStorage.setItem('abdou_posts_v21', JSON.stringify(INITIAL_DATA));
      localStorage.setItem('abdou_settings_v21', JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem('abdou_version_v21', DATA_VERSION);
      
      console.log("System Updated to v21 - Cache Cleared");
    } else {
      const s = localStorage.getItem('abdou_settings_v21');
      const p = localStorage.getItem('abdou_posts_v21');
      if (s) setSettings(JSON.parse(s));
      if (p) setPosts(JSON.parse(p));
    }
  }, []);

  useEffect(() => {
    if (settings.globalAdsCode) {
      const containerId = 'adsterra-v21-injection';
      let scriptContainer = document.getElementById(containerId);
      
      if (!scriptContainer) {
        scriptContainer = document.createElement('div');
        scriptContainer.id = containerId;
        document.body.appendChild(scriptContainer);
      }
      
      scriptContainer.innerHTML = '';
      const range = document.createRange();
      const fragment = range.createContextualFragment(settings.globalAdsCode);
      scriptContainer.appendChild(fragment);
    }
  }, [settings.globalAdsCode]);

  const handleItemClick = (p: Article) => {
    setPosts(prev => prev.map(item => item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item));
    setSelectedItem(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product: Article) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const filteredItems = posts.filter(p => 
    (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view}
        setView={setView}
        siteName={settings.siteName}
        onSearch={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setShowCart(true)}
      />

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && <Home posts={filteredItems} onPostClick={handleItemClick} darkMode={darkMode} />}
        {view === 'store' && <Store products={filteredItems.filter(p => p.isProduct)} onProductClick={handleItemClick} darkMode={darkMode} onAddToCart={handleAddToCart} />}
        {view === 'post' && selectedItem && <PostDetail post={selectedItem} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedItem && <ProductDetail product={selectedItem} onAddToCart={handleAddToCart} onBack={() => setView('store')} darkMode={darkMode} />}
        {view === 'checkout' && <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={() => { alert('شكراً لك! سنتصل بك قريباً.'); setCart([]); setView('home'); }} />}
        
        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && (
          <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />
        )}

        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_posts_v21', JSON.stringify(newPosts));}}
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_settings_v21', JSON.stringify(s));}}
            onLogout={() => setIsAuth(false)}
            darkMode={darkMode}
          />
        )}
      </main>

      {showCart && (
        <Cart 
          items={cart} 
          onClose={() => setShowCart(false)} 
          onRemove={(id) => setCart(cart.filter(i => i.id !== id))}
          onUpdateQuantity={(id, q) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, q)} : i))}
          onCheckout={() => {setShowCart(false); setView('checkout');}}
          darkMode={darkMode}
        />
      )}

      <footer className="mt-20 py-12 border-t border-white/5 text-center opacity-60">
          <h3 className="text-xl font-black mb-2">{settings.siteName}</h3>
          <p className="text-xs mb-4">المتجر المغربي الأول لخدمة الشباب - 2025</p>
          <div className="inline-block px-3 py-1 bg-emerald-600/20 text-emerald-500 rounded-full text-[10px] font-black border border-emerald-500/20">
            System Version: {DATA_VERSION.split('_')[0]}
          </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default App;
