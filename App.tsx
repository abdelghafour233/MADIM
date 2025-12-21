
import React, { useState, useEffect } from 'react';
import { View, Article, Category, Settings } from './types.ts';
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
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [settings, setSettings] = useState<Settings>({
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    domain: 'myblog.com',
    dashboardPassword: 'admin',
    siteName: 'دليلك الشرائي',
    siteDescription: 'نراجع لك أفضل المنتجات ونختار لك أفضل العروض في المغرب'
  });

  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedArticles) setArticles(JSON.parse(savedArticles));
    else setArticles(INITIAL_ARTICLES);

    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const handleDashboardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === (settings.dashboardPassword || 'admin')) {
      setIsDashboardUnlocked(true);
      setPasswordInput('');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            articles={articles} 
            onArticleClick={(a) => { setSelectedArticle(a); setCurrentView('article'); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }}
          />
        );
      case 'category':
        return (
          <Home 
            articles={articles.filter(a => a.category === selectedCategory)} 
            onArticleClick={(a) => { setSelectedArticle(a); setCurrentView('article'); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }}
            filterLabel={selectedCategory || ''}
          />
        );
      case 'article':
        return selectedArticle ? (
          <ArticleDetail 
            article={selectedArticle} 
            onBack={() => setCurrentView('home')} 
          />
        ) : null;
      case 'dashboard':
        if (!isDashboardUnlocked) {
          return (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg animate-fadeIn text-center border">
              <h2 className="text-2xl font-bold mb-6">إدارة المدونة</h2>
              <form onSubmit={handleDashboardLogin}>
                <input 
                  type="password" 
                  className="w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-emerald-500 outline-none text-center"
                  placeholder="كلمة السر"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
                  دخول
                </button>
              </form>
            </div>
          );
        }
        return (
          <Dashboard 
            settings={settings} 
            articles={articles}
            onUpdateSettings={(s) => { setSettings(s); localStorage.setItem('settings', JSON.stringify(s)); }}
            onUpdateArticles={(a) => { setArticles(a); localStorage.setItem('articles', JSON.stringify(a)); }}
            onLogout={() => setIsDashboardUnlocked(false)}
          />
        );
      default:
        return <Home articles={articles} onArticleClick={() => {}} onCategoryClick={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentView={currentView} setView={setCurrentView} siteName={settings.siteName} />
      <main className="flex-grow container mx-auto px-4 py-10">
        {renderView()}
      </main>
      <WhatsAppButton />
      <footer className="bg-white border-t py-10 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-emerald-600 mb-2">{settings.siteName}</h3>
          <p className="text-gray-500 text-sm mb-6">{settings.siteDescription}</p>
          <div className="pt-6 border-t">
            <p className="text-gray-400 text-xs">© 2024 جميع الحقوق محفوظة لـ {settings.siteName}.</p>
            <button onClick={() => setCurrentView('dashboard')} className="text-gray-200 mt-2 text-[10px]">الإدارة</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
