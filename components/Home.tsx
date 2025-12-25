
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

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
           {filterLabel ? `قسم: ${filterLabel}` : 'أحدث المقالات التقنية 💡'} 
        </h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {Object.values(Category).map(cat => (
            <button 
              key={cat} 
              onClick={() => onCategoryClick(cat)} 
              className={`px-6 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${filterLabel === cat ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'bg-slate-800 text-slate-400 border-transparent' : 'bg-white border text-slate-500')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {safeArticles.length === 0 ? (
        <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="text-7xl mb-6">🔍</div>
          <p className="text-slate-400 font-black text-2xl">لم نجد أي مقالات في هذا القسم حالياً.</p>
          <p className="text-slate-500 mt-2">جرب العودة للرئيسية لرؤية كل جديد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {safeArticles.map(article => (
            <div 
              key={article.id}
              onClick={() => onArticleClick(article)}
              className={`group rounded-[45px] overflow-hidden cursor-pointer transition-all duration-500 border hover:-translate-y-3 ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:shadow-2xl hover:border-emerald-500/30'}`}
            >
              <div className="h-64 overflow-hidden relative">
                <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={article.name} />
                <div className="absolute top-6 right-6">
                   <span className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{article.category}</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className={`font-black text-xl mb-6 leading-snug line-clamp-2 transition-colors ${darkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-600'}`}>{article.name}</h3>
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold mt-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                  <span>📅 {article.date || 'فبراير 2025'}</span>
                  <span>👁️ {(article.views || 0).toLocaleString()} مشاهدة</span>
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
