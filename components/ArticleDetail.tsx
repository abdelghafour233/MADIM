
import React, { useState, useEffect } from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  siteName: string;
  settings: Settings;
  relatedArticles: Article[];
  onArticleClick: (a: Article) => void;
  darkMode: boolean;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, settings, relatedArticles, onArticleClick, darkMode }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <article className="max-w-4xl mx-auto pb-24 animate-fadeIn relative text-right" dir="rtl">
      <div className="fixed top-0 right-0 h-1.5 bg-emerald-500 z-[200] transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
      
      <button onClick={onBack} className="mt-8 mb-12 text-slate-500 font-black flex items-center gap-2 hover:text-emerald-600 transition-all group">
        <span className="group-hover:translate-x-1 transition-transform">→</span> العودة للرئيسية
      </button>

      <div className={`rounded-[50px] md:rounded-[70px] shadow-2xl overflow-hidden border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
        <header className="relative h-[400px] md:h-[550px]">
          <img src={article.image} alt={article.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          <div className="absolute bottom-12 right-8 left-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-wider shadow-lg">{article.category}</span>
                <span className="text-white/70 text-sm font-bold">📅 {article.date}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">{article.name}</h1>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white">A</div>
                 <span className="text-white font-bold">{article.author || 'عبدو التقني'}</span>
              </div>
          </div>
        </header>

        <div className="px-6 md:px-20 py-16">
          <AdUnit publisherId={settings.adsenseCode} />

          <div className={`prose prose-2xl max-w-none mb-16 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} leading-[2.2]`}>
            {article.content.split('\n').map((p, i) => (
              <p key={i} className="mb-8">{p}</p>
            ))}
          </div>

          <AdUnit publisherId={settings.adsenseCode} slotId="footer_ad" />

          <div className="mt-16 p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border border-slate-100 dark:border-slate-800 text-center">
            <h3 className={`text-2xl font-black mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>هل أعجبك المقال؟ شاركه مع أصدقائك 🚀</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.name + ' - ' + window.location.href)}`)} 
                className="flex-grow sm:flex-none px-12 py-5 bg-[#25D366] text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-transform"
              >واتساب</button>
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} 
                className="flex-grow sm:flex-none px-12 py-5 bg-[#1877F2] text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-transform"
              >فيسبوك</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <h3 className="text-3xl font-black mb-12 flex items-center gap-4">
          <div className="h-10 w-2 bg-emerald-500 rounded-full"></div>
          مقالات قد تهمك
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {relatedArticles.map(a => (
             <div key={a.id} onClick={() => onArticleClick(a)} className="cursor-pointer group">
                <div className="h-48 rounded-[30px] overflow-hidden mb-4 shadow-lg border-2 border-transparent group-hover:border-emerald-500 transition-all">
                   <img src={a.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                </div>
                <h4 className="font-black text-lg line-clamp-2 group-hover:text-emerald-500 transition-colors">{a.name}</h4>
             </div>
           ))}
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
