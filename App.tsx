
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Article, Category, Settings } from './types.ts';
import { INITIAL_ARTICLES } from './constants.tsx';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import ArticleDetail from './components/ArticleDetail.tsx';
import Dashboard from './components/Dashboard.tsx';
import LegalPage from './components/LegalPage.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const STORAGE_KEY_ARTICLES = 'abdou_v10_articles';
const STORAGE_KEY_SETTINGS = 'abdou_v10_settings';
const STORAGE_KEY_VERSION = 'abdou_v10_ver';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const defaultSettings: Settings = {
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    adsenseCode: 'ca-pub-5578524966832192',
    adsTxt: 'google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0',
    domain: 'abdouweb.online',
    dashboardPassword: '1234',
    siteName: 'عبدو ويب | Abdou Web',
    siteDescription: 'بوابتك المغربية لعالم التقنية والأخبار الرقمية بأسلوب عصري.'
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // تحميل البيانات عند بدء التشغيل مع الحماية
  useEffect(() => {
    try {
      const savedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
      const savedArticles = localStorage.getItem(STORAGE_KEY_ARTICLES);
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

      if (savedVersion !== '10.0' || !savedArticles) {
        setArticles(INITIAL_ARTICLES);
        setSettings(defaultSettings);
        localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(INITIAL_ARTICLES));
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
        localStorage.setItem(STORAGE_KEY_VERSION, '10.0');
      } else {
        const parsedArticles = JSON.parse(savedArticles);
        const parsedSettings = JSON.parse(savedSettings || '{}');
        setArticles(Array.isArray(parsedArticles) ? parsedArticles : INITIAL_ARTICLES);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Storage Error:", error);
      setArticles(INITIAL_ARTICLES);
      setSettings(defaultSettings);
    }
    
    // إخفاء المحمل
    const loader = document.getElementById('initial-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 800);
    }
  }, []);

  const navigateTo = useCallback((view: View, article?: Article, category?: Category | null) => {
    if (view === 'article' && article) {
      setSelectedArticle(article);
      setArticles(prev => {
        const updated = prev.map(a => a.id === article.id ? { ...a, views: (a.views || 0) + 1 } : a);
        localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(updated));
        return updated;
      });
    } else if (view === 'category' && category !== undefined) {
      setSelectedCategory(category);
    }
    setCurrentView(view);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredArticles = useMemo(() => {
    let result = [...articles];
    if (currentView === 'category' && selectedCategory) {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    }
    return result;
  }, [articles, selectedCategory, searchQuery, currentView]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar 
        currentView={currentView} 
        setView={navigateTo} 
        siteName={settings.siteName} 
        onSearch={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <Home articles={filteredArticles} onArticleClick={(a) => navigateTo('article', a)} onCategoryClick={(c) => navigateTo('category', undefined, c)} darkMode={darkMode} />
        )}
        {currentView === 'category' && (
          <Home articles={filteredArticles} onArticleClick={(a) => navigateTo('article', a)} onCategoryClick={(c) => navigateTo('category', undefined, c)} filterLabel={selectedCategory || ''} darkMode={darkMode} />
        )}
        {currentView === 'article' && selectedArticle && (
          <ArticleDetail 
            article={articles.find(a => a.id === selectedArticle.id) || selectedArticle} 
            onBack={() => navigateTo('home')} 
            siteName={settings.siteName}
            settings={settings}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category).slice(0, 3)}
            onArticleClick={(a) => navigateTo('article', a)}
            darkMode={darkMode}
          />
        )}
        {(currentView === 'about' || currentView === 'privacy' || currentView === 'contact') && (
          <LegalPage type={currentView} darkMode={darkMode} siteName={settings.siteName} />
        )}
        {currentView === 'dashboard' && (
          !isDashboardUnlocked ? (
            <div className="max-w-md mx-auto mt-20 p-10 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl text-center border border-slate-100 dark:border-slate-800 animate-fadeIn">
              <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-emerald-500/20">🔐</div>
              <h2 className="text-2xl font-black mb-8">لوحة التحكم</h2>
              <form onSubmit={(e) => { e.preventDefault(); if(passwordInput === (settings.dashboardPassword || '1234')) setIsDashboardUnlocked(true); else alert('كلمة مرور خاطئة!'); }} className="space-y-6">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center font-bold text-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all" 
                    placeholder="رمز الدخول" 
                    value={passwordInput} 
                    onChange={(e) => setPasswordInput(e.target.value)} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
                <button type="submit" className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all">دخول</button>
              </form>
            </div>
          ) : (
            <Dashboard 
              settings={settings} 
              articles={articles} 
              onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(s));}} 
              onUpdateArticles={(a) => {setArticles(a); localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(a));}} 
              onLogout={() => {setIsDashboardUnlocked(false); setPasswordInput('');}} 
            />
          )
        )}
      </main>
      
      <footer className={`${darkMode ? 'bg-black/40' : 'bg-slate-900'} text-white py-12 border-t dark:border-slate-800`}>
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-xl font-black mb-4 text-emerald-500">{settings.siteName}</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto">{settings.siteDescription}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold mb-8">
            <span className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('about')}>من نحن</span>
            <span className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('privacy')}>الخصوصية</span>
            <span className="cursor-pointer hover:text-emerald-400" onClick={() => navigateTo('contact')}>اتصل بنا</span>
            <span className="cursor-pointer text-slate-500" onClick={() => navigateTo('dashboard')}>الإدارة ⚙️</span>
          </div>
          <p className="text-slate-500 text-[10px]">© {new Date().getFullYear()} عبدو ويب. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
