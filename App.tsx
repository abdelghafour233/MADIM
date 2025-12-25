
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Article, Category, Settings, CartItem } from './types.ts';
import { INITIAL_ARTICLES } from './constants.tsx';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import ArticleDetail from './components/ArticleDetail.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './components/Checkout.tsx';
import Dashboard from './components/Dashboard.tsx';
import LegalPage from './components/LegalPage.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const DATA_VERSION = 'v3.9'; 

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const defaultSettings: Settings = {
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    adsenseCode: '',
    ezoicCode: '',
    taboolaCode: '',
    propellerCode: '',
    adsTxt: 'google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0',
    domain: 'abdouweb.online',
    dashboardPassword: '1234',
    siteName: 'عبدو ويب | Abdou Web',
    siteDescription: 'منصتك الأولى لمتابعة آخر مراجعات التقنية وأخبار المغرب والعالم بأسلوب احترافى وموثوق.',
    affiliateTemuLink: 'https://temu.to/k/ej9j3nai23s',
    affiliateAmazonLink: ''
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const incrementArticleView = useCallback((articleId: string) => {
    setArticles(prev => {
      const updated = prev.map(a => a.id === articleId ? { ...a, views: (a.views || 0) + 1 } : a);
      localStorage.setItem('articles', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const navigateTo = useCallback((view: View, article?: Article, category?: Category | null) => {
    if (view === 'article' && article) {
      setSelectedArticle(article);
      incrementArticleView(article.id);
    } else if (view === 'category' && category !== undefined) {
      setSelectedCategory(category);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [incrementArticleView]);

  useEffect(() => {
    const savedVersion = localStorage.getItem('app_data_version');
    
    // إضافة بيانات الأسعار للمنتجات المختارة بشكل تلقائي للتوضيح
    const enrichedArticles = INITIAL_ARTICLES.map(a => ({
      ...a,
      price: a.id.includes('jacket') ? 349 : (a.category === Category.REVIEWS ? 199 : undefined),
      isProduct: a.id.includes('jacket') || a.category === Category.REVIEWS
    }));

    if (savedVersion !== DATA_VERSION) {
      localStorage.setItem('articles', JSON.stringify(enrichedArticles));
      localStorage.setItem('app_data_version', DATA_VERSION);
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
      setArticles(enrichedArticles);
      setSettings(defaultSettings);
    } else {
      const savedArticlesStr = localStorage.getItem('articles');
      const savedSettingsStr = localStorage.getItem('settings');
      if (savedArticlesStr) setArticles(JSON.parse(savedArticlesStr));
      if (savedSettingsStr) setSettings(JSON.parse(savedSettingsStr));
    }
  }, []);

  const addToCart = (product: Article) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  
  const updateCartQuantity = (id: string, q: number) => {
    if (q < 1) return removeFromCart(id);
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: q } : item));
  };

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (selectedCategory && currentView === 'category') result = result.filter(a => a.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    }
    return result;
  }, [articles, selectedCategory, searchQuery, currentView]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar 
        currentView={currentView} 
        setView={navigateTo} 
        siteName={settings.siteName} 
        onSearch={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onShowCart={() => setShowCart(true)}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <Home articles={filteredArticles} onArticleClick={(a) => navigateTo('article', a)} onCategoryClick={(c) => navigateTo('category', undefined, c)} darkMode={darkMode} />
        )}
        {currentView === 'category' && (
          <Home articles={filteredArticles} onArticleClick={(a) => navigateTo('article', a)} onCategoryClick={(c) => navigateTo('category', undefined, c)} filterLabel={selectedCategory || ''} darkMode={darkMode} />
        )}
        {currentView === 'article' && selectedArticle && (
          selectedArticle.isProduct ? (
            <ProductDetail product={selectedArticle} onAddToCart={addToCart} onBack={() => navigateTo('home')} darkMode={darkMode} />
          ) : (
            <ArticleDetail 
              article={articles.find(a => a.id === selectedArticle.id) || selectedArticle} 
              onBack={() => navigateTo('home')} 
              siteName={settings.siteName}
              settings={settings}
              relatedArticles={articles.filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category).slice(0, 3)}
              onArticleClick={(a) => navigateTo('article', a)}
              darkMode={darkMode}
            />
          )
        )}
        {currentView === 'cart' && (
          <div className="max-w-4xl mx-auto py-12 animate-fadeIn">
            <h1 className={`text-4xl font-black mb-12 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>مراجعة طلبك وتأكيده</h1>
            <Checkout 
              total={cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)} 
              onPlaceOrder={(data) => {
                const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
                const itemsStr = cartItems.map(item => `📦 ${item.name} (${item.quantity}x)`).join('\n');
                const message = `طلب جديد من ${data.name}!\nالمدينة: ${data.city}\nالهاتف: ${data.phone}\nالمنتجات:\n${itemsStr}\nالمجموع: ${total} درهم.`;
                window.open(`https://wa.me/212649075664?text=${encodeURIComponent(message)}`);
                setCartItems([]);
                setCurrentView('home');
              }}
            />
          </div>
        )}
        {(currentView === 'about' || currentView === 'privacy' || currentView === 'contact') && (
          <LegalPage type={currentView} darkMode={darkMode} siteName={settings.siteName} />
        )}
        {currentView === 'dashboard' && (
          !isDashboardUnlocked ? (
            <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[50px] shadow-2xl text-center border border-slate-100">
              <h2 className="text-3xl font-black mb-8 text-slate-800">إدارة الموقع</h2>
              <form onSubmit={(e) => { e.preventDefault(); if(passwordInput === (settings.dashboardPassword || '1234')) setIsDashboardUnlocked(true); else alert('كلمة مرور خاطئة!'); }} className="space-y-6">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full p-6 bg-slate-50 rounded-2xl text-center font-black text-2xl border-2 border-transparent focus:border-emerald-500 outline-none pr-14" 
                    placeholder="كلمة السر" 
                    value={passwordInput} 
                    onChange={(e) => setPasswordInput(e.target.value)} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">
                    {showPassword ? '👁️' : '🕶️'}
                  </button>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-emerald-700">دخول للوحة التحكم</button>
              </form>
            </div>
          ) : (
            <Dashboard settings={settings} articles={articles} onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('settings', JSON.stringify(s));}} onUpdateArticles={(a) => {setArticles(a); localStorage.setItem('articles', JSON.stringify(a));}} onLogout={() => setIsDashboardUnlocked(false)} />
          )
        )}
      </main>
      
      {showCart && (
        <Cart 
          items={cartItems} 
          onRemove={removeFromCart} 
          onUpdateQuantity={updateCartQuantity} 
          onCheckout={() => { setShowCart(false); setCurrentView('cart'); }} 
          onClose={() => setShowCart(false)}
          darkMode={darkMode}
        />
      )}

      <WhatsAppButton />
      
      <footer className={`${darkMode ? 'bg-black' : 'bg-slate-900'} text-white py-16 mt-20 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-right">
          <div>
            <h3 className="text-2xl font-black mb-6 gradient-text">{settings.siteName}</h3>
            <p className="text-slate-400 font-medium leading-relaxed">{settings.siteDescription}</p>
          </div>
          <div>
            <h4 className="text-lg font-black mb-6 text-emerald-500">روابط سريعة</h4>
            <ul className="space-y-4 text-slate-300 font-bold">
              <li className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('about')}>من نحن</li>
              <li className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('privacy')}>سياسة الخصوصية</li>
              <li className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('contact')}>اتصل بنا</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-black mb-6 text-emerald-500">الأقسام الرئيسية</h4>
            <ul className="space-y-4 text-slate-300 font-bold">
              {Object.values(Category).slice(0, 4).map(c => (
                <li key={c} className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('category', undefined, c)}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center">
           <p className="text-slate-500 font-bold">© {new Date().getFullYear()} - جميع الحقوق محفوظة لـ {settings.siteName}.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
