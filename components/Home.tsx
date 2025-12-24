
import React from 'react';
import { Article, Category } from '../types.ts';

interface HomeProps {
  articles: Article[];
  onArticleClick: (a: Article) => void;
  onCategoryClick: (c: Category) => void;
  filterLabel?: string;
  isSearching?: boolean;
  darkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ articles, onArticleClick, onCategoryClick, filterLabel, isSearching, darkMode }) => {
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="animate-fadeIn pb-20">
      {!filterLabel && !isSearching && (
        <section className={`relative overflow-hidden mb-12 md:mb-20 rounded-[32px] md:rounded-[48px] p-8 md:p-24 transition-all duration-500 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-900 shadow-2xl shadow-emerald-900/10'}`}>
          <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
          <div className="relative z-10 max-w-4xl text-right">
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-4 md:px-6 py-2 rounded-full text-xs md:text-sm mb-6 md:mb-10 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              مساحتك المعرفية المتجددة
            </div>
            <h1 className="text-3xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.2] md:leading-[1.1] tracking-tight text-white">
              استكشف عالم <br className="hidden md:block"/>
              <span className="text-emerald-500">المعرفة والإلهام.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl mb-8 md:mb-12 leading-relaxed md:leading-loose max-w-3xl font-light">
              نقدم لك محتوى مدروساً بعناية يغطي مجالات التقنية، ريادة الأعمال، ومراجعات المنتجات.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <button onClick={() => onCategoryClick(Category.REVIEWS)} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-4 group active:scale-95">
                مراجعة المنتجات
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
        <div>
          <h2 className={`text-2xl md:text-4xl font-black mb-3 md:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isSearching ? 'نتائج البحث' : filterLabel ? `قسم: ${filterLabel}` : 'أحدث الأفكار والمقالات'}
          </h2>
          <div className="h-1.5 w-16 md:w-24 bg-emerald-500 rounded-full"></div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 md:mx-0 md:px-0">
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => onCategoryClick(cat)} className={`px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${filterLabel === cat ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-500')}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-24">
        {articles.length > 0 ? articles.map(article => (
          <div 
            key={article.id} 
            onClick={() => onArticleClick(article)} 
            className={`group relative rounded-[32px] md:rounded-[40px] overflow-hidden transition-all duration-500 cursor-pointer flex flex-col border ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:shadow-2xl hover:-translate-y-2'}`}
          >
            <div className="relative h-56 md:h-64 overflow-hidden">
              <img src={article.image} alt={article.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" />
              <div className="absolute top-4 right-4">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-lg">{article.category}</span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-grow flex flex-col">
              <div className="flex items-center gap-4 mb-3 md:mb-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">⏱️ {calculateReadingTime(article.content)} دقيقة</span>
                <span className="flex items-center gap-1">👁️ {article.views || 100} قراءة</span>
              </div>
              <h3 className={`font-black text-lg md:text-2xl mb-3 md:mb-4 line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{article.name}</h3>
              <p className={`text-sm mb-4 md:mb-6 line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {article.content.replace(/https?:\/\/[^\s]+/g, '').substring(0, 100)}...
              </p>
              
              <div className="mt-auto pt-4 md:pt-6 border-t border-slate-100/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic">فريق التحرير</div>
                <div className="text-emerald-500 font-black text-sm flex items-center gap-2 group-hover:translate-x-[-8px] transition-transform">
                  إقرأ المزيد
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <p className="text-slate-400 text-xl font-bold">عذراً، لم يتم العثور على مقالات في هذا القسم.</p>
            <button onClick={() => window.location.reload()} className="mt-6 text-emerald-500 font-black underline">عرض الكل</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
