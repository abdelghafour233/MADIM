
import React from 'react';
import { Article, Category } from '../types.ts';

interface HomeProps {
  articles: Article[];
  onArticleClick: (a: Article) => void;
  onCategoryClick: (c: Category) => void;
  darkMode: boolean;
  filterLabel?: string;
}

const Home: React.FC<HomeProps> = ({ articles, onArticleClick, onCategoryClick, darkMode, filterLabel }) => {
  return (
    <div className="animate-slideUp">
      <div className="mb-16 py-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
          <span className="text-emerald-500 font-black tracking-widest uppercase text-xs">Abdou Web Blog</span>
        </div>
        <h2 className={`text-4xl md:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {filterLabel ? `قسم: ${filterLabel}` : 'اكتشف جديد التقنية 🚀'}
        </h2>
        <p className="text-slate-500 font-bold max-w-2xl leading-relaxed">نشارككم آخر الأخبار والمقالات التحليلية حول التكنولوجيا والإنتاجية في المغرب والعالم.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map(article => (
          <article 
            key={article.id}
            onClick={() => onArticleClick(article)}
            className={`group rounded-[40px] overflow-hidden cursor-pointer transition-all duration-500 flex flex-col h-full ${darkMode ? 'bg-slate-900 border border-slate-800 hover:border-emerald-500/50' : 'bg-white shadow-xl hover:shadow-2xl'}`}
          >
            <div className="h-64 overflow-hidden relative">
              <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.name} />
              <div className="absolute top-6 right-6">
                 <span className="bg-emerald-600/90 backdrop-blur-md text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-xl">
                   {article.category}
                 </span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-3 mb-4 text-xs font-bold text-slate-400">
                <span>👤 {article.author || 'المدير'}</span>
                <span>•</span>
                <span>📅 {article.date}</span>
              </div>
              <h3 className={`font-black text-xl mb-6 leading-snug line-clamp-2 group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {article.name}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-8 leading-relaxed font-medium">
                {article.content.substring(0, 150)}...
              </p>
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-2">
                    <span className="text-emerald-500">👁️</span>
                    <span className="text-xs font-black text-slate-400">{(article.views || 0).toLocaleString()} مشاهدة</span>
                 </div>
                 <span className="text-emerald-500 font-black text-xs hover:underline">اقرأ المزيد ←</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <span className="text-6xl block mb-6">🔍</span>
           <h3 className="text-2xl font-black text-slate-400">لم نجد أي مقالات تطابق بحثك..</h3>
           <p className="mt-2 text-slate-500 font-bold">جرب كلمات مفتاحية أخرى</p>
        </div>
      )}
    </div>
  );
};

export default Home;
