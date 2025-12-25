
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Article, Category, Settings } from './types.ts';
import { INITIAL_ARTICLES } from './constants.tsx';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import ArticleDetail from './components/ArticleDetail.tsx';
import Dashboard from './components/Dashboard.tsx';
import LegalPage from './components/LegalPage.tsx';

const STORAGE_KEY_ARTICLES = 'abdou_web_articles_v9_final';
const STORAGE_KEY_SETTINGS = 'abdou_web_settings_v9_final';
const STORAGE_KEY_VERSION = 'abdou_web_version_v9_final';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
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
    ezoicCode: '',
    adsTxt: 'google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0',
    domain: 'abdouweb.online',
    dashboardPassword: '1234',
    siteName: 'عبدو ويب | Abdou Web',
    siteDescription: 'مدونة تقنية مغربية لمراجعة الأجهزة وآخر الأخبار بأسلوب موثوق.'
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const incrementArticleView = useCallback((articleId: string) => {
    setArticles(prev => {
      const updated = prev.map(a => a.id === articleId ? { ...a, views: (a.views || 0) + 1 } : a);
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const navigateTo = useCallback((view: View, article?: Article, category?: Category | null) => {
    if (view === 'article' && article) {
      setSelectedArticle(article);
      incrementArticleView(article.id);
    } else if (view === 'category' && category !== undefined) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    setCurrentView(view);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [incrementArticleView]);

  useEffect(() => {
    const savedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
    const savedArticles = localStorage.getItem(STORAGE_KEY_ARTICLES);
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

    if (savedVersion !== '9.0' || !savedArticles || JSON.parse(savedArticles).length === 0) {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
      localStorage.setItem(STORAGE_KEY_VERSION, '9.0');
      setArticles(INITIAL_ARTICLES);
      setSettings(defaultSettings);
    } else {
      setArticles(JSON.parse(savedArticles));
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const filteredArticles = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    let result = articles;
    if (selectedCategory && currentView === 'category') {
      result = result.filter(a => a.category === selectedCategory);
    }
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
              <div className="bg-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-emerald-500/20">🔐</div>
              <h2 className="text-3xl font-black mb-8">دخول الإدارة</h2>
              <form onSubmit={(e) => { e.preventDefault(); if(passwordInput === (settings.dashboardPassword || '1234')) setIsDashboardUnlocked(true); else alert('كلمة مرور خاطئة!'); }} className="space-y-6">
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center font-black text-2xl outline-none border-2 border-transparent focus:border-emerald-500 pr-14 pl-14 transition-all" 
                    placeholder="كلمة السر" 
                    value={passwordInput} 
                    onChange={(e) => setPasswordInput(e.target.value)} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title={showPassword ? "إخفاء" : "إظهار"}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
                <button type="submit" className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all transform active:scale-95">دخول</button>
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
      
      <footer className={`${darkMode ? 'bg-black' : 'bg-slate-900'} text-white py-16 mt-20 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-black mb-6 text-emerald-500">{settings.siteName}</h3>
          <p className="text-slate-400 font-medium mb-10 max-w-xl mx-auto">{settings.siteDescription}</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-10 text-sm font-bold">
            <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => navigateTo('about')}>من نحن</span>
            <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => navigateTo('privacy')}>سياسة الخصوصية</span>
            <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => navigateTo('contact')}>اتصل بنا</span>
            <span className="cursor-pointer text-slate-500 hover:text-emerald-400 transition-colors" onClick={() => navigateTo('dashboard')}>لوحة الإدارة ⚙️</span>
          </div>
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} - جميع الحقوق محفوظة لـ {settings.siteName}.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
