
import React, { useState, useEffect, useMemo } from 'react';
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
  const [darkMode, setDarkMode] = useState(false);
  
  // Default settings with your AdSense ID
  const defaultSettings: Settings = {
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    adsenseCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5578524966832192" crossorigin="anonymous"></script>',
    adsTxt: 'google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0',
    domain: 'abdouweb.online',
    dashboardPassword: '1234',
    siteName: 'Abdou Web | عبدو ويب',
    siteDescription: 'دليلك الموثوق لأفضل المراجعات والعروض الحصرية في المغرب'
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load Data
  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    const savedSettings = localStorage.getItem('settings');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    } else {
      setArticles(INITIAL_ARTICLES.map(a => ({ ...a, likes: 0, views: 100, comments: [] })));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  // AdSense Sync
  useEffect(() => {
    if (settings.adsenseCode) {
      const pubIdMatch = settings.adsenseCode.match(/ca-pub-\d+/);
      if (pubIdMatch) {
        const pubId = pubIdMatch[0];
        let metaTag = document.querySelector('meta[name="google-adsense-account"]');
        if (metaTag) metaTag.setAttribute('content', pubId);
        
        // Ensure script exists
        if (!document.querySelector(`script[src*="${pubId}"]`)) {
          const sc = document.createElement('script');
          sc.async = true;
          sc.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
          sc.crossOrigin = "anonymous";
          document.head.appendChild(sc);
        }
      }
    }
  }, [settings.adsenseCode]);

  const handleUpdateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const handleUpdateArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    localStorage.setItem('articles', JSON.stringify(newArticles));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === (settings.dashboardPassword || '1234')) {
      setIsDashboardUnlocked(true);
    } else {
      alert('كلمة المرور خاطئة!');
    }
  };

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (selectedCategory && currentView === 'category') {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [articles, selectedCategory, searchQuery, currentView]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        siteName={settings.siteName} 
        onSearch={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <Home 
            articles={filteredArticles} 
            onArticleClick={(a) => { setSelectedArticle(a); setCurrentView('article'); window.scrollTo(0,0); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); window.scrollTo(0,0); }}
            isSearching={!!searchQuery}
            darkMode={darkMode}
          />
        )}
        {currentView === 'category' && (
          <Home 
            articles={filteredArticles} 
            onArticleClick={(a) => { setSelectedArticle(a); setCurrentView('article'); window.scrollTo(0,0); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); window.scrollTo(0,0); }}
            filterLabel={selectedCategory || ''}
            isSearching={!!searchQuery}
            darkMode={darkMode}
          />
        )}
        {currentView === 'article' && selectedArticle && (
          <ArticleDetail 
            article={selectedArticle} 
            onBack={() => setCurrentView('home')} 
            siteName={settings.siteName}
            adsenseCode={settings.adsenseCode}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id).slice(0, 2)}
            onArticleClick={(a) => { setSelectedArticle(a); window.scrollTo(0,0); }}
            onLike={() => {}}
            onAddComment={() => {}}
            darkMode={darkMode}
          />
        )}
        {currentView === 'dashboard' && (
          !isDashboardUnlocked ? (
            <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[40px] shadow-2xl text-center">
              <h2 className="text-3xl font-black mb-8 text-slate-800">لوحة التحكم</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="password" 
                  className="w-full p-5 bg-slate-50 rounded-2xl text-center font-black text-xl border"
                  placeholder="كلمة السر"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg">دخول</button>
              </form>
            </div>
          ) : (
            <Dashboard 
              settings={settings} 
              articles={articles}
              onUpdateSettings={handleUpdateSettings}
              onUpdateArticles={handleUpdateArticles}
              onLogout={() => setIsDashboardUnlocked(false)}
            />
          )
        )}
      </main>
      
      <WhatsAppButton />
      
      <footer className="bg-slate-900 text-white py-10 mt-20 text-center">
        <p>© {new Date().getFullYear()} {settings.siteName} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default App;
