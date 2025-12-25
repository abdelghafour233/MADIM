
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
    <div className="animate-fadeIn">
      {!filterLabel && featuredArticle && (
        <section 
          className="relative mb-24 group cursor-pointer overflow-hidden rounded-[50px] md:rounded-[70px] shadow-2xl h-[450px] md:h-[650px]"
          onClick={() => onArticleClick(featuredArticle)}
        >
          <img 
            src={featuredArticle.image} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            alt={featuredArticle.name} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
          <div className="absolute bottom-12 right-10 left-10 md:bottom-24 md:right-20 md:left-20">
            <span className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block shadow-lg">مقال اليوم المميز ✨</span>
            <h2 className="text-4xl md:text-7xl font-black text-white leading-tight mb-8 max-w-5xl group-hover:text-emerald-400 transition-colors drop-shadow-2xl">{featuredArticle.name}</h2>
            <div className="flex items-center gap-8 text-white/80 font-bold text-sm">
              <span className="flex items-center gap-2">📅 {featuredArticle.date || 'فبراير 2025'}</span>
              <span className="flex items-center gap-2">👁️ {featuredArticle.views?.toLocaleString()} مشاهدة</span>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 border-b-4 border-emerald-500/10 pb-10">
        <div>
           <span className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-4 block">تصفح حسب الاهتمام</span>
           <h2 className={`text-5xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {filterLabel ? `قسم: ${filterLabel}` : 'آخر التحديثات 🔥'} 
           </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {Object.values(Category).map(cat => (
            <button 
              key={cat} 
              onClick={() => onCategoryClick(cat)} 
              className={`px-10 py-4 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 border-2 ${filterLabel === cat ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' : (darkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-emerald-500' : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-500 shadow-sm')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {gridArticles.length === 0 ? (
        <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[60px] border-4 border-dashed border-slate-100 dark:border-slate-800">
          <div className="text-9xl mb-8">🔭</div>
          <p className="text-slate-400 font-black text-4xl">لا يوجد محتوى في هذا القسم حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {gridArticles.map(article => (
            <div 
              key={article.id}
              onClick={() => onArticleClick(article)}
              className={`group rounded-[50px] overflow-hidden cursor-pointer transition-all duration-500 flex flex-col ${darkMode ? 'bg-slate-900 hover:bg-slate-800/50' : 'bg-white shadow-xl hover:shadow-2xl'}`}
            >
              <div className="h-80 overflow-hidden relative">
                <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.name} />
                <div className="absolute top-8 right-8">
                   <span className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xl">{article.category}</span>
                </div>
              </div>
              <div className="p-12 flex-grow flex flex-col">
                <h3 className={`font-black text-2xl mb-10 leading-snug line-clamp-2 transition-colors flex-grow ${darkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-600'}`}>{article.name}</h3>
                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-xl">👤</div>
                    <span className="text-sm font-black text-slate-500">إدارة عبدو</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">👁️ {(article.views || 0).toLocaleString()}</span>
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
