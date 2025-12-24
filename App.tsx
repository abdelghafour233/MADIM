
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Article, Category, Settings, Comment } from './types.ts';
import { INITIAL_ARTICLES } from './constants.tsx';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import ArticleDetail from './components/ArticleDetail.tsx';
import Dashboard from './components/Dashboard.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const defaultSettings: Settings = {
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    adsenseCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5578524966832192" crossorigin="anonymous"></script>',
    adsTxt: 'google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0',
    domain: 'abdouweb.online',
    dashboardPassword: '1234',
    siteName: 'مدونة عبدو | Abdou Blog',
    siteDescription: 'منصة معرفية متخصصة في التقنية، ريادة الأعمال، وأسلوب حياة المعاصر.'
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const navigateTo = useCallback((view: View, article?: Article, category?: Category | null) => {
    if (view === 'article' && article) {
      setSelectedArticle(article);
    } else if (view === 'category' && category !== undefined) {
      setSelectedCategory(category);
    } else {
      setSelectedArticle(null);
      setSelectedCategory(null);
    }

    setCurrentView(view);

    const url = new URL(window.location.origin + window.location.pathname);
    if (view === 'article' && article) url.searchParams.set('article', article.id);
    if (view === 'category' && category) url.searchParams.set('category', category);
    if (view === 'dashboard') url.searchParams.set('view', 'dashboard');
    
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      const catName = params.get('category');
      const view = params.get('view');

      if (articleId) {
        const found = articles.find(a => a.id === articleId) || INITIAL_ARTICLES.find(a => a.id === articleId);
        if (found) {
          setSelectedArticle(found);
          setCurrentView('article');
          return;
        }
      }
      
      if (catName) {
        setSelectedCategory(catName as Category);
        setCurrentView('category');
        return;
      }

      if (view === 'dashboard') {
        setCurrentView('dashboard');
        return;
      }

      setCurrentView('home');
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  useEffect(() => {
    const savedArticlesStr = localStorage.getItem('articles');
    const savedSettings = localStorage.getItem('settings');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedArticlesStr) {
      const savedArticles: Article[] = JSON.parse(savedArticlesStr);
      const savedIds = new Set(savedArticles.map(a => a.id));
      
      const newArticles = INITIAL_ARTICLES.filter(a => !savedIds.has(a.id)).map(a => ({
        ...a,
        likes: Math.floor(Math.random() * 50) + 10,
        views: Math.floor(Math.random() * 2000) + 500,
        comments: []
      }));

      const merged = [...newArticles, ...savedArticles];
      setArticles(merged);
      if (newArticles.length > 0) {
        localStorage.setItem('articles', JSON.stringify(merged));
      }
    } else {
      const initial = INITIAL_ARTICLES.map(a => ({ ...a, likes: 24, views: 1540, comments: [] }));
      setArticles(initial);
      localStorage.setItem('articles', JSON.stringify(initial));
    }

    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
    
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (selectedCategory && currentView === 'category') {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.content.toLowerCase().includes(q)
      );
    }
    return result;
  }, [articles, selectedCategory, searchQuery, currentView]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar 
        currentView={currentView} 
        setView={(v) => navigateTo(v)} 
        siteName={settings.siteName} 
        onSearch={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => {
          const next = !darkMode;
          setDarkMode(next);
          localStorage.setItem('theme', next ? 'dark' : 'light');
        }}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <Home 
            articles={filteredArticles} 
            onArticleClick={(a) => navigateTo('article', a)}
            onCategoryClick={(c) => navigateTo('category', undefined, c)}
            isSearching={!!searchQuery}
            darkMode={darkMode}
          />
        )}
        {currentView === 'category' && (
          <Home 
            articles={filteredArticles} 
            onArticleClick={(a) => navigateTo('article', a)}
            onCategoryClick={(c) => navigateTo('category', undefined, c)}
            filterLabel={selectedCategory || ''}
            isSearching={!!searchQuery}
            darkMode={darkMode}
          />
        )}
        {currentView === 'article' && selectedArticle && (
          <ArticleDetail 
            article={selectedArticle} 
            onBack={() => navigateTo('home')} 
            siteName={settings.siteName}
            adsenseCode={settings.adsenseCode}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category).slice(0, 2)}
            onArticleClick={(a) => navigateTo('article', a)}
            onLike={() => {}}
            onAddComment={() => {}}
            darkMode={darkMode}
          />
        )}
        {currentView === 'dashboard' && (
          !isDashboardUnlocked ? (
            <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-[50px] shadow-2xl text-center border border-slate-100 animate-slideUp">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black mb-8 text-slate-800">إدارة المدونة</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (passwordInput === (settings.dashboardPassword || '1234')) {
                  setIsDashboardUnlocked(true);
                } else {
                  alert('❌ كلمة المرور خاطئة!');
                }
              }} className="space-y-6">
                <div className="relative">
                  <input 
                    type={showLoginPassword ? "text" : "password"} 
                    className="w-full p-6 bg-slate-50 rounded-2xl text-center font-black text-2xl border-2 border-transparent focus:border-emerald-500 outline-none pr-14 pl-14"
                    placeholder="كلمة السر"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-2"
                  >
                    {showLoginPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.04m4.533-4.533A10.01 10.01 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-4.225-4.225l-4.225-4.225m4.225 4.225L7 7m3.586 3.586a3 3 0 004.243 4.243" />
                      </svg>
                    )}
                  </button>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-lg">دخول</button>
              </form>
            </div>
          ) : (
            <Dashboard 
              settings={settings} 
              articles={articles}
              onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('settings', JSON.stringify(s));}}
              onUpdateArticles={(a) => {setArticles(a); localStorage.setItem('articles', JSON.stringify(a));}}
              onLogout={() => setIsDashboardUnlocked(false)}
            />
          )
        )}
      </main>
      
      <WhatsAppButton />
      
      <footer className={`${darkMode ? 'bg-black border-t border-slate-900' : 'bg-slate-900'} text-white py-16 mt-20`}>
        <div className="container mx-auto px-6 text-center md:text-right">
           <p className="text-slate-500 font-bold">© {new Date().getFullYear()} - جميع الحقوق محفوظة لـ {settings.siteName}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
