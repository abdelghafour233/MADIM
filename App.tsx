
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
  globalAdsCode: '',
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
  },
  {
    id: 'post-smart-home',
    title: 'كيف تحول منزلك لبيت ذكي بأقل من 500 درهم من تيمو؟',
    excerpt: 'دليل شامل لاختيار أرخص وأجود قطع الـ Smart Home المتوفرة حالياً مع روابط الشحن للمغرب.',
    content: `المنزل الذكي لم يعد ترفاً للأغنياء فقط. بفضل تيمو يمكنك الحصول على مصابيح ذكية، مقابس واي فاي، وحساسات حركة بأسعار خيالية.
    
    إليك القائمة التي جربناها:
    1. مصابيح RGB ذكية (تتحكم بها من الهاتف).
    2. حساسات الأبواب.
    3. ريموت كنترول شامل لكل الأجهزة.`,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1200',
    category: Category.TEMU,
    date: '05 أبريل 2025',
    views: 3200,
    author: 'عبدو التقني',
    affiliateLink: 'https://temu.to/k/example2',
    couponCode: 'SALE2025'
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

  const DATA_VERSION = "v17.0_affiliate_ready"; 

  useEffect(() => {
    const savedSettings = localStorage.getItem('abdou_settings_v17');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedPostsRaw = localStorage.getItem('abdou_blog_v17');
    const savedVersion = localStorage.getItem('abdou_data_version_v17');
    
    if (savedVersion !== DATA_VERSION) {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v17', JSON.stringify(INITIAL_DATA));
      localStorage.setItem('abdou_data_version_v17', DATA_VERSION);
    } else {
      setPosts(savedPostsRaw ? JSON.parse(savedPostsRaw) : INITIAL_DATA);
    }
  }, []);

  useEffect(() => {
    if (settings.globalAdsCode) {
      const scriptContainer = document.getElementById('global-ads-container') || document.createElement('div');
      scriptContainer.id = 'global-ads-container';
      scriptContainer.innerHTML = '';
      const range = document.createRange();
      const fragment = range.createContextualFragment(settings.globalAdsCode);
      scriptContainer.appendChild(fragment);
      if (!document.getElementById('global-ads-container')) document.body.appendChild(scriptContainer);
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
            onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_blog_v17', JSON.stringify(newPosts));}}
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_settings_v17', JSON.stringify(s));}}
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
          <p className="text-xs">المتجر المغربي الأول لخدمة الشباب - 2025</p>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default App;
