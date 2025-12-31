
import React, { useState, useEffect, useCallback } from 'react';
import { View, Article, Settings, CartItem } from './types.ts';
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

const STORAGE_KEYS = {
  POSTS: 'abdou_v4_posts', 
  SETTINGS: 'abdou_v4_settings',
  CART: 'abdou_v4_cart',
  VERSION: 'abdou_v4_version'
};

const CURRENT_VERSION = '4.0.3-STABLE';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>(INITIAL_POSTS);
  const [settings, setSettings] = useState<Settings>({
    siteName: 'abdouweb.online',
    adsenseCode: 'ca-pub-5578524966832192',
    alternativeAdsCode: '', 
    globalAdsCode: '',      
    directLinkCode: 'https://bouncingbuzz.com/zj3mgnqb3?key=06741e12c87b4f0448ad3a2ef3183b49', 
    whatsappNumber: '212649075664',
    totalVisits: 65000,
    totalEarnings: 240.00
  });
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من الإصدار ومسح الكاش إذا لزم الأمر
    const savedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (savedVersion !== CURRENT_VERSION) {
      localStorage.clear();
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    }

    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedCart) setCart(JSON.parse(savedCart));
    
    setTimeout(() => setIsLoading(false), 200);
  }, []);

  const handlePostClick = (p: Article) => {
    setSelectedPost(p);
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentView={view} 
        setView={setView} 
        siteName={settings.siteName} 
        onSearch={setSearchQuery} 
        darkMode={true} 
        toggleDarkMode={() => {}} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)} 
      />
      
      <main className="container mx-auto px-4 flex-grow max-w-6xl">
        {view === 'home' && (
          <Home 
            posts={posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))} 
            onPostClick={handlePostClick} 
            settings={settings} 
          />
        )}
        
        {view === 'post' && selectedPost && (
          <PostDetail post={selectedPost} onBack={() => setView('home')} settings={settings} />
        )}
        
        {view === 'product' && selectedPost && (
          <ProductDetail 
            product={selectedPost} 
            onAddToCart={(p) => {
              const up = [...cart, {...p, quantity: 1}];
              setCart(up);
              localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(up));
              setIsCartOpen(true);
            }} 
            onBack={() => setView('home')} 
            darkMode={true} 
            settings={settings} 
          />
        )}
        
        {view === 'checkout' && (
          <Checkout 
            total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} 
            onPlaceOrder={(data) => {
               window.open(settings.directLinkCode, '_blank');
               setTimeout(() => {
                 window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`طلب جديد:\nالاسم: ${data.name}\nالمدينة: ${data.city}\nالهاتف: ${data.phone}`)}`);
                 setCart([]); 
                 setView('home');
               }, 400);
            }} 
          />
        )}
        
        {view === 'admin' && (
          !isAuth ? 
          <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings} 
            onUpdate={(n) => {setPosts(n); localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(n));}} 
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));}} 
            onLogout={() => setIsAuth(false)} 
            darkMode={true} 
          />
        )}

        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && (
          <LegalPage type={view as any} darkMode={true} siteName={settings.siteName} />
        )}
      </main>

      {isCartOpen && (
        <Cart 
          items={cart} 
          onRemove={(id) => setCart(c => c.filter(i => i.id !== id))} 
          onUpdateQuantity={(id, q) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, q)} : i))} 
          onCheckout={() => {setIsCartOpen(false); setView('checkout');}} 
          onClose={() => setIsCartOpen(false)} 
          darkMode={true} 
          adCode={settings.alternativeAdsCode} 
        />
      )}
      
      <footer className="mt-20 py-16 text-center border-t border-white/5 opacity-30">
        <div className="text-2xl font-black mb-2 italic">abdouweb</div>
        <p className="text-[10px] uppercase tracking-widest mb-8">Premium Shopping Experience 🇲🇦</p>
        <div className="flex justify-center gap-6 text-[9px] font-black uppercase">
           <button onClick={() => setView('privacy')} className="hover:text-emerald-500">الخصوصية</button>
           <button onClick={() => setView('terms')} className="hover:text-emerald-500">الشروط</button>
           <button onClick={() => setView('contact')} className="hover:text-emerald-500">اتصل بنا</button>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
