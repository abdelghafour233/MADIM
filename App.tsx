
import React, { useState, useEffect } from 'react';
import { View, Article, Settings, Category } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';
import LegalPage from './components/LegalPage.tsx';
import { INITIAL_POSTS } from './constants.tsx';

const INITIAL_SETTINGS: Settings = {
  siteName: 'عبدو ويب | عروض الأفلييت',
  adsenseCode: 'ca-pub-5578524966832192',
  alternativeAdsCode: '', // Adsterra Native
  globalAdsCode: '', // Adsterra Social Bar
  dashboardPassword: '1234',
  totalVisits: 100,
  whatsappNumber: '212649075664'
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // جلب البيانات من LocalStorage لضمان استمرار التعديلات
  useEffect(() => {
    const savedPosts = localStorage.getItem('abdou_aff_posts_v23');
    const savedSettings = localStorage.getItem('abdou_aff_settings_v23');
    
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(INITIAL_POSTS as any);
      localStorage.setItem('abdou_aff_posts_v23', JSON.stringify(INITIAL_POSTS));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('abdou_aff_settings_v23', JSON.stringify(INITIAL_SETTINGS));
    }
  }, []);

  // حقن كود أدستيرا (Social Bar/Pop-under)
  useEffect(() => {
    if (settings.globalAdsCode) {
      const scriptId = 'adsterra-global-script';
      let existing = document.getElementById(scriptId);
      if (existing) existing.remove();

      const container = document.createElement('div');
      container.id = scriptId;
      document.body.appendChild(container);
      
      const range = document.createRange();
      const fragment = range.createContextualFragment(settings.globalAdsCode);
      container.appendChild(fragment);
    }
  }, [settings.globalAdsCode]);

  const handlePostClick = (p: Article) => {
    // زيادة عدد المشاهدات وهمياً عند الضغط
    const updated = posts.map(item => item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item);
    setPosts(updated);
    localStorage.setItem('abdou_aff_posts_v23', JSON.stringify(updated));
    
    setSelectedPost(p);
    setView('post');
    window.scrollTo(0, 0);
  };

  const filteredPosts = posts.filter(p => 
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view}
        setView={setView}
        siteName={settings.siteName}
        onSearch={setSearchQuery}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={0}
        onOpenCart={() => {}}
      />

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && <Home posts={filteredPosts} onPostClick={handlePostClick} darkMode={darkMode} />}
        
        {view === 'post' && selectedPost && (
          <PostDetail 
            post={selectedPost} 
            onBack={() => setView('home')} 
            darkMode={darkMode} 
            settings={settings} 
          />
        )}

        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_aff_posts_v23', JSON.stringify(newPosts));}}
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_aff_settings_v23', JSON.stringify(s));}}
            onLogout={() => setIsAuth(false)}
            darkMode={darkMode}
          />
        )}

        {(['privacy', 'about', 'contact', 'terms'].includes(view)) && (
          <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-white/5 text-center opacity-60">
          <h3 className="text-xl font-black mb-2">{settings.siteName}</h3>
          <p className="text-xs mb-6">منصة عبدو ويب لترشيد التسوق والربح من الأفلييت - 2025</p>
          <div className="flex justify-center gap-6 text-xs font-bold mb-8">
            <button onClick={() => setView('privacy')}>سياسة الخصوصية</button>
            <button onClick={() => setView('terms')}>شروط الاستخدام</button>
            <button onClick={() => setView('about')}>من نحن</button>
          </div>
          <div className="inline-block px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-[10px] font-black border border-emerald-500/20">
            Affiliate Engine: v23.1
          </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default App;
