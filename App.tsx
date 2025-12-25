
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
import Login from './components/Login.tsx';
import LegalPage from './components/LegalPage.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const STORAGE_KEY_ARTICLES = 'abdou_web_content_v12';
const STORAGE_KEY_SETTINGS = 'abdou_web_settings_v12';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedItem, setSelectedItem] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const defaultSettings: Settings = {
    fbPixel: '', googleAnalytics: '', tiktokPixel: '',
    adsenseCode: 'ca-pub-5578524966832192',
    adsTxt: 'google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0',
    domain: 'abdouweb.online',
    dashboardPassword: '1234',
    siteName: 'عبدو ويب | Abdou Web',
    siteDescription: 'بوابتك المغربية للمنتجات الحصرية وأحدث أخبار التقنية والابتكار.'
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const savedArticles = localStorage.getItem(STORAGE_KEY_ARTICLES);
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (savedArticles) setArticles(JSON.parse(savedArticles));
    else setArticles(INITIAL_ARTICLES);
    if (savedSettings) setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
  }, []);

  const navigateTo = useCallback((view: View, item?: Article, category?: Category | null) => {
    if (item) setSelectedItem(item);
    if (category !== undefined) setSelectedCategory(category);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToCart = (product: Article) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const filteredItems = useMemo(() => {
    let result = [...articles];
    if (currentView === 'category' && selectedCategory) result = result.filter(a => a.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    }
    return result;
  }, [articles, selectedCategory, searchQuery, currentView]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar 
        currentView={currentView} setView={navigateTo} siteName={settings.siteName} 
        onSearch={setSearchQuery} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <Home 
            articles={filteredItems} 
            onItemClick={(item) => navigateTo(item.isProduct ? 'product' : 'article', item)} 
            darkMode={darkMode} 
          />
        )}
        {currentView === 'article' && selectedItem && (
          <ArticleDetail 
            article={selectedItem} onBack={() => navigateTo('home')} 
            siteName={settings.siteName} settings={settings} darkMode={darkMode}
            relatedArticles={articles.filter(a => !a.isProduct).slice(0, 3)}
            onArticleClick={(a) => navigateTo('article', a)}
          />
        )}
        {currentView === 'product' && selectedItem && (
          <ProductDetail 
            product={selectedItem} onAddToCart={addToCart} 
            onBack={() => navigateTo('home')} darkMode={darkMode} 
          />
        )}
        {currentView === 'checkout' && (
          <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={() => {alert('تم استلام طلبك!'); setCart([]); navigateTo('home');}} />
        )}
        {currentView === 'dashboard' && (
          !isAuthenticated ? (
            <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuthenticated(true)} darkMode={darkMode} />
          ) : (
            <Dashboard 
              settings={settings} articles={articles} 
              onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(s));}} 
              onUpdateArticles={(a) => {setArticles(a); localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(a));}} 
              onLogout={() => {setIsAuthenticated(false); navigateTo('home');}} 
              onPreviewArticle={(a) => navigateTo(a.isProduct ? 'product' : 'article', a)}
            />
          )
        )}
        {(['about', 'privacy', 'contact'].includes(currentView)) && (
          <LegalPage type={currentView as any} darkMode={darkMode} siteName={settings.siteName} />
        )}
      </main>

      {isCartOpen && (
        <Cart 
          items={cart} darkMode={darkMode} onClose={() => setIsCartOpen(false)}
          onRemove={(id) => setCart(cart.filter(i => i.id !== id))}
          onUpdateQuantity={(id, q) => setCart(cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, q) } : i))}
          onCheckout={() => {setIsCartOpen(false); navigateTo('checkout');}}
        />
      )}
      
      <footer className={`${darkMode ? 'bg-black/40' : 'bg-slate-900'} text-white py-16 border-t dark:border-slate-800`}>
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-black mb-4 text-emerald-500">{settings.siteName}</h3>
          <p className="text-slate-400 text-sm mb-10 max-w-xl mx-auto">{settings.siteDescription}</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-black mb-12">
            <span className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('about')}>من نحن</span>
            <span className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('privacy')}>الخصوصية</span>
            <span className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('contact')}>اتصل بنا</span>
            <span className="cursor-pointer text-slate-500" onClick={() => navigateTo('dashboard')}>الإدارة ⚙️</span>
          </div>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">© 2025 Abdou Web. All Rights Reserved.</p>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
