
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
    domain: 'souq-morocco.com',
    dashboardPassword: 'admin',
    siteName: 'دليلك الشرائي',
    siteDescription: 'نراجع لك أفضل المنتجات ونختار لك أفضل العروض في المغرب'
  });

  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedArticles) setArticles(JSON.parse(savedArticles));
    else setArticles(INITIAL_ARTICLES);

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({...prev, ...parsed}));
    }
  }, []);

  const handleDashboardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === (settings.dashboardPassword || 'admin')) {
      setIsDashboardUnlocked(true);
      setPasswordInput('');
    } else {
      alert('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
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
            <div className="min-h-[70vh] flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 animate-fadeIn relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200 rotate-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-3xl font-black text-slate-800 mb-2">مركز التحكم</h2>
                  <p className="text-slate-400 font-bold mb-10">يرجى إدخال رمز الوصول للمتابعة</p>
                  
                  <form onSubmit={handleDashboardLogin} className="space-y-6">
                    <div className="relative">
                      <input 
                        type="password" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 text-center font-black text-xl tracking-[0.5em] transition-all"
                        placeholder="••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
                      فتح لوحة التحكم
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCurrentView('home')}
                      className="text-slate-400 font-bold text-sm hover:text-emerald-600 transition-colors"
                    >
                      العودة للموقع
                    </button>
                  </form>
                </div>
              </div>
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
      <footer className="bg-white border-t py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
             <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{settings.siteName}</h3>
          </div>
          <p className="text-slate-400 text-sm mb-8 font-medium max-w-md mx-auto">{settings.siteDescription}</p>
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-300 text-xs font-bold">© 2024 جميع الحقوق محفوظة لـ {settings.siteName}. صنع في المغرب 🇲🇦</p>
            <button 
              onClick={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-slate-300 hover:text-emerald-600 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              دخول الإدارة
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
