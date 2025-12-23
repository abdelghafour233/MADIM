
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
    // تم تثبيت الكود الخاص بك هنا بنجاح 🇲🇦
    adsenseCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5578524966832192" crossorigin="anonymous"></script>',
    adsTxt: 'google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0',
    domain: 'souq-morocco.com',
    dashboardPassword: '1234',
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
    } else {
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  }, []);

  // نظام الحقن الآلي لكود أدسنس في كل الصفحات
  useEffect(() => {
    if (settings.adsenseCode) {
      const scriptId = 'adsense-script-injected';
      let existingScript = document.getElementById(scriptId);
      if (!existingScript) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = settings.adsenseCode.trim();
        const scriptTags = tempDiv.getElementsByTagName('script');
        
        for (let s of scriptTags) {
          const newScript = document.createElement('script');
          newScript.id = scriptId;
          newScript.async = true;
          if (s.src) newScript.src = s.src;
          if (s.innerHTML) newScript.innerHTML = s.innerHTML;
          if (s.getAttribute('crossorigin')) newScript.setAttribute('crossorigin', s.getAttribute('crossorigin')!);
          document.head.appendChild(newScript);
        }
      }
    }
  }, [settings.adsenseCode]);

  useEffect(() => {
    let title = settings.siteName;
    let description = settings.siteDescription;

    if (currentView === 'article' && selectedArticle) {
      title = `${selectedArticle.name} | ${settings.siteName}`;
      description = selectedArticle.content.substring(0, 160).replace(/\n/g, ' ');
    } else if (currentView === 'category' && selectedCategory) {
      title = `قسم ${selectedCategory} | ${settings.siteName}`;
    }

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', description);
  }, [currentView, selectedArticle, selectedCategory, settings]);

  const handleDashboardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === (settings.dashboardPassword || '1234')) {
      setIsDashboardUnlocked(true);
      setPasswordInput('');
      setShowPassword(false);
    } else {
      alert('كلمة المرور غير صحيحة!');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            articles={articles} 
            onArticleClick={(a) => { setSelectedArticle(a); setCurrentView('article'); window.scrollTo(0,0); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); window.scrollTo(0,0); }}
          />
        );
      case 'category':
        return (
          <Home 
            articles={articles.filter(a => a.category === selectedCategory)} 
            onArticleClick={(a) => { setSelectedArticle(a); setCurrentView('article'); window.scrollTo(0,0); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); window.scrollTo(0,0); }}
            filterLabel={selectedCategory || ''}
          />
        );
      case 'article':
        return selectedArticle ? (
          <ArticleDetail 
            article={selectedArticle} 
            onBack={() => setCurrentView('home')} 
            siteName={settings.siteName}
            adsenseCode={settings.adsenseCode}
          />
        ) : null;
      case 'dashboard':
        if (!isDashboardUnlocked) {
          return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100 animate-fadeIn">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-10">مركز التحكم</h2>
                  <form onSubmit={handleDashboardLogin} className="space-y-6">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none text-center font-black text-xl"
                      placeholder="كلمة السر"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg">دخول</button>
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
      <footer className="bg-white border-t py-12 mt-20 text-center">
        <h3 className="text-2xl font-black text-slate-800 mb-4">{settings.siteName}</h3>
        <p className="text-slate-400 text-sm mb-8">{settings.siteDescription}</p>
        <button onClick={() => setCurrentView('dashboard')} className="text-slate-300 hover:text-emerald-600 text-[10px] font-black uppercase">إدارة الموقع وأدسنس</button>
      </footer>
    </div>
  );
};

export default App;
