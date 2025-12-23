
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
  const [showPassword, setShowPassword] = useState(false);
  
  const [settings, setSettings] = useState<Settings>({
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    adsenseCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5578524966832192" crossorigin="anonymous"></script>',
    adsTxt: 'google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0',
    domain: 'souq-morocco.com',
    dashboardPassword: '1234',
    siteName: 'دليلك المغربي',
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

  // تحديث SEO Metadata تلقائياً عند تغيير المقال لضمان فهرسة جوجل لكل صفحة
  useEffect(() => {
    let title = settings.siteName;
    let desc = settings.siteDescription;
    const baseUrl = `https://${settings.domain || 'souq-morocco.com'}`;
    let canonical = baseUrl;

    if (currentView === 'article' && selectedArticle) {
      title = `${selectedArticle.name} | ${settings.siteName}`;
      desc = selectedArticle.content.substring(0, 160).replace(/\n/g, ' ');
      canonical = `${baseUrl}/article/${selectedArticle.id}`;
    } else if (currentView === 'category' && selectedCategory) {
      title = `قسم ${selectedCategory} | ${settings.siteName}`;
      canonical = `${baseUrl}/category/${selectedCategory}`;
    }

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
    document.getElementById('canonical-link')?.setAttribute('href', canonical);
  }, [currentView, selectedArticle, selectedCategory, settings]);

  const handleDashboardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === (settings.dashboardPassword || '1234')) {
      setIsDashboardUnlocked(true);
      setPasswordInput('');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentView={currentView} setView={setCurrentView} siteName={settings.siteName} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <Home 
            articles={articles} 
            onArticleClick={(a) => { setSelectedArticle(a); setCurrentView('article'); window.scrollTo(0,0); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); window.scrollTo(0,0); }}
          />
        )}
        {currentView === 'category' && (
          <Home 
            articles={articles.filter(a => a.category === selectedCategory)} 
            onArticleClick={(a) => { setSelectedArticle(a); setCurrentView('article'); window.scrollTo(0,0); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); window.scrollTo(0,0); }}
            filterLabel={selectedCategory || ''}
          />
        )}
        {currentView === 'article' && selectedArticle && (
          <ArticleDetail 
            article={selectedArticle} 
            onBack={() => setCurrentView('home')} 
            siteName={settings.siteName}
            adsenseCode={settings.adsenseCode}
          />
        )}
        {currentView === 'dashboard' && (
          !isDashboardUnlocked ? (
            <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[40px] shadow-2xl border border-slate-100 text-center animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black mb-8 text-slate-800">مركز الإدارة</h2>
              <form onSubmit={handleDashboardLogin} className="space-y-4">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center font-black text-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="كلمة السر"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    {showPassword ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all">دخول للمنصة</button>
              </form>
            </div>
          ) : (
            <Dashboard 
              settings={settings} 
              articles={articles}
              onUpdateSettings={(s) => { setSettings(s); localStorage.setItem('settings', JSON.stringify(s)); }}
              onUpdateArticles={(a) => { setArticles(a); localStorage.setItem('articles', JSON.stringify(a)); }}
              onLogout={() => setIsDashboardUnlocked(false)}
            />
          )
        )}
      </main>
      <WhatsAppButton />
      <footer className="bg-white border-t py-12 text-center mt-20">
        <p className="text-slate-400 font-bold mb-4">جميع الحقوق محفوظة © {settings.siteName}</p>
        <button onClick={() => {setCurrentView('dashboard'); window.scrollTo(0,0);}} className="text-[10px] text-slate-200 uppercase tracking-widest font-black hover:text-emerald-500 transition-colors">Admin Dashboard</button>
      </footer>
    </div>
  );
};

export default App;
