
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

const DEFAULT_GLOBAL_ADS = `<script type='text/javascript' src='//pl25832734.highperformanceformat.com/9a/5c/7e/9a5c7e6c38827918861e3d366a7b189a.js'></script>`;
const DEFAULT_NATIVE_ADS = `<script async="async" data-cfasync="false" src="//pl25832770.highperformanceformat.com/f8/77/f1/f877f1523497b7b37060472658827918.js"></script><div id="container-f877f1523497b7b37060472658827918"></div>`;

const INITIAL_SETTINGS: Settings = {
  siteName: 'متجر عبدو | تسوق بذكاء',
  adsenseCode: 'ca-pub-5578524966832192',
  alternativeAdsCode: DEFAULT_NATIVE_ADS, 
  globalAdsCode: DEFAULT_GLOBAL_ADS,      
  directLinkCode: 'https://www.effectivegatecpm.com/ctpynfts0?key=a6c7eb53025d8d39c467b947581bb153',
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

  useEffect(() => {
    const savedPosts = localStorage.getItem('abdou_shop_posts_v27');
    const savedSettings = localStorage.getItem('abdou_shop_settings_v27');
    const savedCart = localStorage.getItem('abdou_shop_cart_v27');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('abdou_shop_posts_v27', JSON.stringify(INITIAL_POSTS));
    }

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('abdou_shop_settings_v27', JSON.stringify(INITIAL_SETTINGS));
    }

    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('abdou_shop_cart_v27', JSON.stringify(cart));
  }, [cart]);

  // تفعيل كود Adsterra العالمي
  useEffect(() => {
    if (settings.globalAdsCode) {
      const scriptId = 'adsterra-injection-v1';
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
    localStorage.setItem('abdou_shop_posts_v27', JSON.stringify(updated));
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Article) => {
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

  const filteredPosts = posts.filter(p => 
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
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && (
          <>
            {settings.directLinkCode && (
              <div className="mb-8 p-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl flex items-center justify-between animate-pulse shadow-lg shadow-orange-500/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <p className="font-black text-sm text-orange-500">هدية حصرية للزوار!</p>
                    <p className="text-[10px] opacity-60">اضغط للمطالبة بخصمك الآن</p>
                  </div>
                </div>
                <a 
                  href={settings.directLinkCode} 
                  target="_blank" 
                  className="bg-orange-600 text-white px-6 py-2 rounded-xl font-black text-xs hover:scale-105 transition-transform"
                >إستلام الهدية</a>
              </div>
            )}
            <Home posts={filteredPosts} onPostClick={handlePostClick} darkMode={darkMode} />
          </>
        )}
        
        {view === 'post' && selectedPost && (
          <PostDetail 
            post={selectedPost} 
            onBack={() => setView('home')} 
            darkMode={darkMode} 
            settings={settings} 
          />
        )}

        {view === 'product' && selectedPost && (
          <ProductDetail 
            product={selectedPost} 
            onAddToCart={addToCart}
            onBack={() => setView('home')} 
            darkMode={darkMode} 
          />
        )}

        {view === 'checkout' && (
          <Checkout 
            total={cartTotal} 
            onPlaceOrder={(data) => {
              const msg = `طلب جديد من ${data.name}\nالمدينة: ${data.city}\nالهاتف: ${data.phone}\nالمجموع: ${cartTotal} د.م.\nالمنتجات:\n${cart.map(i => `- ${i.name || i.title} (x${i.quantity})`).join('\n')}`;
              window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`);
              setCart([]);
              setView('home');
              alert('تم تسجيل طلبك! سيتم التواصل معك قريباً.');
            }}
          />
        )}

        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_shop_posts_v27', JSON.stringify(newPosts));}}
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_shop_settings_v27', JSON.stringify(s));}}
            onLogout={() => setIsAuth(false)}
            darkMode={darkMode}
          />
        )}

        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && (
          <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />
        )}
      </main>

      {/* زر الهدية العائم (Adsterra Direct Link) */}
      {settings.directLinkCode && (
        <a 
          href={settings.directLinkCode} 
          target="_blank"
          className="fixed bottom-24 right-8 z-[90] w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce hover:scale-110 transition-transform"
        >
          🎁
        </a>
      )}

      {isCartOpen && (
        <Cart 
          items={cart} 
          onRemove={removeFromCart} 
          onUpdateQuantity={updateQuantity} 
          onCheckout={() => {setIsCartOpen(false); setView('checkout');}}
          onClose={() => setIsCartOpen(false)}
          darkMode={darkMode}
        />
      )}

      <footer className="mt-20 py-12 border-t border-white/5 text-center opacity-60">
          <h3 className="text-xl font-black mb-2 text-emerald-500">{settings.siteName}</h3>
          <p className="text-xs mb-6">تجارة إلكترونية ذكية - جميع الحقوق محفوظة 2025</p>
          <div className="flex justify-center gap-6 text-xs font-bold mb-8">
            <button onClick={() => setView('privacy')}>سياسة الخصوصية</button>
            <button onClick={() => setView('terms')}>شروط الاستخدام</button>
            <button onClick={() => setView('about')}>من نحن</button>
          </div>
          <div className="inline-block px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-[10px] font-black border border-emerald-500/20">
            Secure Payment Enabled ✅
          </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default App;
