
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
        <>
          <section className={`relative overflow-hidden mb-20 rounded-[48px] p-12 md:p-24 transition-all duration-500 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-900 shadow-2xl shadow-emerald-900/10'}`}>
            <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
            
            <div className="relative z-10 max-w-4xl text-right">
              <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-6 py-2.5 rounded-full text-sm mb-10 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                مساحتك المعرفية المتجددة
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                استكشف عالم <br/>
                <span className="text-emerald-500">المعرفة والإلهام.</span>
              </h1>
              
              <p className="text-slate-400 text-xl md:text-2xl mb-12 leading-loose max-w-3xl font-light">
                نقدم لك محتوى مدروساً بعناية يغطي مجالات التقنية، ريادة الأعمال، وتطوير الذات، لنصحبك في رحلة نحو التميز الرقمي.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {Object.values(Category).slice(0, 3).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => onCategoryClick(cat)}
                    className="bg-white/5 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-white/10 hover:border-emerald-500"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Animated background elements */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-12 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px]"></div>
          </section>

          {/* Featured Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
              { label: 'مقالة ثرية', val: '+1,200' },
              { label: 'متابع مهتم', val: '+50K' },
              { label: 'تحديث يومي', val: '100%' },
              { label: 'تفاعل مجتمعي', val: 'نشط' }
            ].map((stat, idx) => (
              <div key={idx} className={`p-8 rounded-[32px] border text-center transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-emerald-500/5'}`}>
                <div className="text-3xl font-black text-emerald-600 mb-2">{stat.val}</div>
                <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isSearching ? 'نتائج البحث' : filterLabel ? `قسم: ${filterLabel}` : 'أحدث الأفكار والمقالات'}
          </h2>
          <div className="h-1.5 w-24 bg-emerald-500 rounded-full"></div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {Object.values(Category).map(cat => (
            <button 
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterLabel === cat ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-500')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
        {articles.map(article => (
          <article 
            key={article.id}
            className={`group rounded-[40px] overflow-hidden transition-all duration-500 cursor-pointer flex flex-col border ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:shadow-2xl hover:-translate-y-2'}`}
            onClick={() => onArticleClick(article)}
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
              />
              <div className="absolute top-4 right-4">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-lg shadow-lg">
                  {article.category}
                </span>
              </div>
            </div>
            
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex items-center gap-4 mb-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {calculateReadingTime(article.content)} دقيقة
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                  {article.views || 100}
                </span>
              </div>
              
              <h3 className={`font-black text-2xl mb-4 line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {article.name}
              </h3>
              
              <p className={`text-sm mb-6 line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {article.content}
              </p>
              
              <div className="mt-auto pt-6 border-t border-slate-50/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                  </div>
                  فريق التحرير
                </div>
                <div className={`text-emerald-500 font-black text-sm group-hover:translate-x-[-4px] transition-transform`}>
                  إقرأ المزيد ←
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Home;
