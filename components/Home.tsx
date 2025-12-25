
import React from 'react';
import { Article, Category } from '../types.ts';

interface HomeProps {
  articles: Article[];
  onArticleClick: (a: Article) => void;
  onCategoryClick: (c: Category) => void;
  filterLabel?: string;
  darkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ articles, onArticleClick, onCategoryClick, filterLabel, darkMode }) => {
  const safeArticles = Array.isArray(articles) ? articles : [];
  const featuredArticle = !filterLabel ? safeArticles[0] : null;
  const gridArticles = !filterLabel ? safeArticles.slice(1) : safeArticles;

  return (
    <div className="animate-fadeIn hero-gradient">
      {!filterLabel && featuredArticle && (
        <section 
          className="relative mb-20 group cursor-pointer overflow-hidden rounded-[40px] md:rounded-[60px] shadow-2xl h-[400px] md:h-[600px]"
          onClick={() => onArticleClick(featuredArticle)}
        >
          <img 
            src={featuredArticle.image} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt={featuredArticle.name} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          <div className="absolute bottom-10 right-8 left-8 md:bottom-20 md:right-16 md:left-16">
            <span className="bg-emerald-600 text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest mb-6 inline-block">مقال مميز ✨</span>
            <h2 className="text-3xl md:text-6xl font-black text-white leading-tight mb-6 max-w-4xl group-hover:text-emerald-400 transition-colors">{featuredArticle.name}</h2>
            <div className="flex items-center gap-6 text-white/70 font-bold text-sm">
              <span>📅 {featuredArticle.date || 'فبراير 2025'}</span>
              <span>👁️ {featuredArticle.views?.toLocaleString()} مشاهدة</span>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <h2 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
           {filterLabel ? `قسم: ${filterLabel}` : 'اكتشف جديد التقنية 🔥'} 
        </h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {Object.values(Category).map(cat => (
            <button 
              key={cat} 
              onClick={() => onCategoryClick(cat)} 
              className={`px-8 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 ${filterLabel === cat ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-emerald-500/30')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {gridArticles.length === 0 ? (
        <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[50px] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
          <div className="text-8xl mb-8">🔭</div>
          <p className="text-slate-400 font-black text-3xl">عذراً، هذا القسم خالٍ حالياً.</p>
          <p className="text-slate-500 mt-4 text-xl">نحن نعمل على إضافة مقالات ومراجعات جديدة قريباً!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {gridArticles.map(article => (
            <div 
              key={article.id}
              onClick={() => onArticleClick(article)}
              className={`group rounded-[50px] overflow-hidden cursor-pointer transition-all duration-500 border-b-8 ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500' : 'bg-white border-slate-100 hover:border-emerald-600 shadow-xl hover:shadow-2xl'}`}
            >
              <div className="h-72 overflow-hidden relative">
                <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.name} />
                <div className="absolute top-6 right-6">
                   <span className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg">{article.category}</span>
                </div>
              </div>
              <div className="p-10">
                <h3 className={`font-black text-2xl mb-8 leading-snug line-clamp-2 transition-colors ${darkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-600'}`}>{article.name}</h3>
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold pt-8 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">👤</span>
                    <span>إدارة عبدو ويب</span>
                  </div>
                  <span>👁️ {(article.views || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
