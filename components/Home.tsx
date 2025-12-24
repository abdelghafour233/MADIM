
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
  return (
    <div className="animate-fadeIn pb-24">
      {/* Blog Hero Section */}
      {!filterLabel && (
        <section className={`relative overflow-hidden mb-16 md:mb-24 rounded-[40px] md:rounded-[60px] p-8 md:p-24 transition-all duration-500 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-900 shadow-2xl shadow-emerald-900/10'}`}>
          <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
          <div className="relative z-10 max-w-4xl text-right">
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-6 py-2.5 rounded-2xl text-sm mb-10 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              عبدو ويب: دليلك التقني في المغرب 🇲🇦
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.2] md:leading-[1.1] tracking-tight text-white">
              نقربك من <span className="text-emerald-500">عالم التقنية</span> <br className="hidden md:block"/>
              بكل تفاصيله.
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl mb-12 leading-relaxed md:leading-loose max-w-3xl font-medium">
              مراجعات حيادية، أخبار تقنية عاجلة، ونصائح ريادة الأعمال.. كل ما تحتاجه للمعرفة في مكان واحد.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <button onClick={() => onCategoryClick(Category.TECH)} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-emerald-900/40 active:scale-95">تصفح المقالات التقنية</button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h2 className={`text-3xl md:text-4xl font-black mb-4 flex items-center gap-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
             {filterLabel ? `قسم ${filterLabel}` : 'آخر ما نشرناه'} 
             <div className="h-1.5 w-20 bg-emerald-500 rounded-full"></div>
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => onCategoryClick(cat)} className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${filterLabel === cat ? 'bg-emerald-600 text-white shadow-lg scale-105' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-emerald-500')}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.length > 0 ? articles.map(article => (
          <div 
            key={article.id} 
            onClick={() => onArticleClick(article)} 
            className={`group relative rounded-[40px] overflow-hidden transition-all duration-500 cursor-pointer flex flex-col border-2 ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-50 hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-100'}`}
          >
            <div className="relative h-64 overflow-hidden">
              <img src={article.image} alt={article.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" />
              <div className="absolute top-6 right-6">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg uppercase">{article.category}</span>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex items-center gap-4 mb-5 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                <span>⏱️ {article.date || 'منذ ساعات'}</span>
                <span>👁️ {article.views?.toLocaleString() || '1.2k'} قراءة</span>
              </div>
              <h3 className={`font-black text-2xl mb-6 line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{article.name}</h3>
              <p className={`text-base mb-8 line-clamp-3 leading-relaxed font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {article.content.substring(0, 150)}...
              </p>
              
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-emerald-600 font-black text-sm group-hover:pr-2 transition-all">إقرأ المقال كاملاً ←</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[50px] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-8xl mb-8">📭</div>
            <p className="text-slate-500 text-2xl font-black">لا توجد مقالات في هذا القسم حالياً.</p>
            <button onClick={() => window.location.reload()} className="mt-8 text-emerald-500 font-black underline text-lg">العودة للرئيسية</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
