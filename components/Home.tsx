
import React from 'react';
import { Article, Category } from '../types.ts';

interface HomeProps {
  articles: Article[];
  onArticleClick: (a: Article) => void;
  onCategoryClick: (c: Category) => void;
  filterLabel?: string;
  darkMode: boolean;
}

const ArticleCard = React.memo(({ article, onClick, darkMode }: { article: Article, onClick: () => void, darkMode: boolean }) => (
  <div 
    onClick={onClick} 
    className={`group relative rounded-[35px] overflow-hidden transition-all duration-300 cursor-pointer flex flex-col border-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50 hover:shadow-2xl hover:border-emerald-200'}`}
  >
    <div className="relative h-60 overflow-hidden bg-slate-200">
      <img 
        src={article.image} 
        alt={article.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
        loading="lazy" 
      />
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-xl uppercase tracking-widest">{article.category}</span>
        {article.price && (
          <span className="bg-orange-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl">{article.price} درهم</span>
        )}
      </div>
    </div>
    <div className="p-8 flex-grow flex flex-col">
      <div className="flex items-center gap-3 mb-4 text-[11px] text-slate-400 font-black uppercase tracking-widest">
        <span>🕒 {article.date || 'اليوم'}</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span>👁️ {article.views?.toLocaleString() || 0}</span>
      </div>
      <h3 className={`font-black text-xl mb-6 line-clamp-2 leading-[1.4] group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{article.name}</h3>
      <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <span className="text-emerald-600 font-black text-sm">{article.isProduct ? 'اطلب الآن 🛒' : 'إقرأ التفاصيل ←'}</span>
      </div>
    </div>
  </div>
));

const Home: React.FC<HomeProps> = ({ articles, onArticleClick, onCategoryClick, filterLabel, darkMode }) => {
  return (
    <div className="animate-fadeIn pb-24">
      {!filterLabel && (
        <section className={`relative overflow-hidden mb-16 rounded-[50px] p-10 md:p-20 transition-all duration-500 ${darkMode ? 'bg-slate-900 border border-slate-800 shadow-emerald-900/10' : 'bg-slate-900 shadow-2xl shadow-emerald-500/10'}`}>
          <div className="relative z-10 max-w-4xl text-right">
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.2] text-white">
              بوابة <span className="text-emerald-500">عبدو ويب</span> للتسوق والتقنية بالمغرب 🇲🇦
            </h1>
            <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium max-w-2xl">
              نحن دليلك الموثوق لأحدث المنتجات، المراجعات التقنية الحقيقية، وأخبار المملكة بأسلوب عصري.
            </p>
            <div className="flex flex-wrap gap-5">
              <button onClick={() => onCategoryClick(Category.REVIEWS)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-[20px] font-black text-xl transition-all shadow-2xl shadow-emerald-500/20 active:scale-95">تصفح المنتجات 🛍️</button>
              <button onClick={() => onCategoryClick(Category.NEWS)} className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-[20px] font-black text-xl transition-all border border-white/20 backdrop-blur-md">آخر الأخبار 🗞️</button>
            </div>
          </div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </section>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h2 className={`text-3xl md:text-4xl font-black flex items-center gap-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
             {filterLabel ? `قسم: ${filterLabel}` : 'أحدث الإضافات'} 
             <div className="h-1.5 w-16 bg-emerald-500 rounded-full"></div>
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3">
          {Object.values(Category).map(cat => (
            <button 
              key={cat} 
              onClick={() => onCategoryClick(cat)} 
              className={`px-7 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 ${filterLabel === cat ? 'bg-emerald-600 text-white shadow-xl scale-105' : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 shadow-sm')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.length > 0 ? articles.map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            darkMode={darkMode} 
            onClick={() => onArticleClick(article)} 
          />
        )) : (
          <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[50px] border-4 border-dashed border-slate-100 dark:border-slate-800">
            <span className="text-6xl block mb-6">🏜️</span>
            <p className="text-slate-400 text-2xl font-black">لا توجد نتائج مطابقة لبحثك حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
