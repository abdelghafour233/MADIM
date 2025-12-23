
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

  // تحديث SEO Metadata عند تغيير الصفحة
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
      alert('خطأ في كلمة السر');
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
            <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[40px] shadow-2xl border border-slate-100 text-center">
              <h2 className="text-3xl font-black mb-8">مركز الإدارة</h2>
              <form onSubmit={handleDashboardLogin} className="space-y-4">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full p-4 bg-slate-50 border rounded-2xl text-center font-black text-xl"
                  placeholder="كلمة السر"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">دخول</button>
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
        <button onClick={() => setCurrentView('dashboard')} className="text-[10px] text-slate-300 uppercase tracking-widest font-black">Dashboard</button>
      </footer>
    </div>
  );
};

export default App;
