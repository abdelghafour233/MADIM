
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Article, Category, Settings } from './types.ts';
import { INITIAL_ARTICLES } from './constants.tsx';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import ArticleDetail from './components/ArticleDetail.tsx';
import Dashboard from './components/Dashboard.tsx';
import LegalPage from './components/LegalPage.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const STORAGE_KEY_ARTICLES = 'abdou_web_articles_v11';
const STORAGE_KEY_SETTINGS = 'abdou_web_settings_v11';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false);
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
    siteDescription: 'بوابتك المغربية لعالم التقنية والابتكار الرقمي بأسلوب عصري وفكر متجدد.'
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    try {
      const savedArticles = localStorage.getItem(STORAGE_KEY_ARTICLES);
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

      if (savedArticles) {
        setArticles(JSON.parse(savedArticles));
      } else {
        setArticles(INITIAL_ARTICLES);
        localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      }

      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } catch (e) {
      setArticles(INITIAL_ARTICLES);
    }
  }, []);

  const navigateTo = useCallback((view: View, article?: Article, category?: Category | null) => {
    if (view === 'article' && article) {
      setSelectedArticle(article);
      // تحديث المشاهدات
      setArticles(prev => {
        const updated = prev.map(a => a.id === article.id ? { ...a, views: (a.views || 0) + 1 } : a);
        localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(updated));
        return updated;
      });
    } else if (view === 'category') {
      setSelectedCategory(category || null);
    }
    setCurrentView(view);
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
    return result.sort((a, b) => (b.views || 0) - (a.views || 0));
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
          <Home 
            articles={filteredArticles} 
            onArticleClick={(a) => navigateTo('article', a)} 
            onCategoryClick={(c) => navigateTo('category', undefined, c)} 
            darkMode={darkMode} 
          />
        )}
        {currentView === 'category' && (
          <Home 
            articles={filteredArticles} 
            onArticleClick={(a) => navigateTo('article', a)} 
            onCategoryClick={(c) => navigateTo('category', undefined, c)} 
            filterLabel={selectedCategory || ''}
            darkMode={darkMode} 
          />
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
          <Dashboard 
            settings={settings} 
            articles={articles} 
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(s));}} 
            onUpdateArticles={(a) => {setArticles(a); localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(a));}} 
            onLogout={() => setCurrentView('home')} 
          />
        )}
      </main>
      
      <footer className={`${darkMode ? 'bg-black/40' : 'bg-slate-900'} text-white py-16 border-t dark:border-slate-800`}>
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-black mb-4 text-emerald-500">{settings.siteName}</h3>
          <p className="text-slate-400 text-sm mb-10 max-w-xl mx-auto leading-relaxed">{settings.siteDescription}</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-black mb-12">
            <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => navigateTo('about')}>من نحن</span>
            <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => navigateTo('privacy')}>الخصوصية</span>
            <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => navigateTo('contact')}>اتصل بنا</span>
            <span className="cursor-pointer text-slate-500" onClick={() => navigateTo('dashboard')}>الإدارة ⚙️</span>
          </div>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">© {new Date().getFullYear()} Abdou Web. All Rights Reserved.</p>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
