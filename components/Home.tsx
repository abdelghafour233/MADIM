
import React from 'react';
import { Article, Category } from '../types.ts';

interface HomeProps {
  articles: Article[];
  onArticleClick: (a: Article) => void;
  onCategoryClick: (c: Category) => void;
  filterLabel?: string;
  darkMode: boolean;
}

// استخدام memo لمنع إعادة الرندر غير الضرورية لبطاقات المقالات
const ArticleCard = React.memo(({ article, onClick, darkMode }: { article: Article, onClick: () => void, darkMode: boolean }) => (
  <div 
    onClick={onClick} 
    className={`group relative rounded-[30px] overflow-hidden transition-all duration-300 cursor-pointer flex flex-col border-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50 hover:shadow-xl hover:border-emerald-100'}`}
  >
    <div className="relative h-56 overflow-hidden bg-slate-200">
      <img 
        src={article.image} 
        alt={article.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
        loading="lazy" 
        width="500"
        height="300"
      />
      <div className="absolute top-4 right-4">
        <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase">{article.category}</span>
      </div>
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <div className="flex items-center gap-3 mb-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
        <span>⏱️ {article.date || 'منذ ساعات'}</span>
        <span>👁️ {article.views?.toLocaleString()}</span>
      </div>
      <h3 className={`font-black text-xl mb-4 line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{article.name}</h3>
      <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <span className="text-emerald-600 font-black text-xs">إقرأ المزيد ←</span>
      </div>
    </div>
  </div>
));

const Home: React.FC<HomeProps> = ({ articles, onArticleClick, onCategoryClick, filterLabel, darkMode }) => {
  return (
    <div className="animate-fadeIn pb-24">
      {!filterLabel && (
        <section className={`relative overflow-hidden mb-12 rounded-[40px] p-8 md:p-16 transition-all duration-500 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-900 shadow-xl'}`}>
          <div className="relative z-10 max-w-4xl text-right">
            <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-white">
              نقربك من <span className="text-emerald-500">عالم التقنية</span> بكل تفاصيله.
            </h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
              مراجعات حيادية، أخبار تقنية عاجلة، ونصائح ريادة الأعمال.. كل ما تحتاجه في مكان واحد.
            </p>
            <button onClick={() => onCategoryClick(Category.TECH)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-black text-lg transition-all shadow-lg active:scale-95">تصفح المقالات التقنية</button>
          </div>
        </section>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h2 className={`text-2xl md:text-3xl font-black flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
           {filterLabel ? `قسم ${filterLabel}` : 'آخر المقالات'} 
           <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
        </h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => onCategoryClick(cat)} className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${filterLabel === cat ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-100 text-slate-500 hover:border-emerald-500')}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 ? articles.map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            darkMode={darkMode} 
            onClick={() => onArticleClick(article)} 
          />
        )) : (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 text-xl font-black">لا توجد مقالات حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
