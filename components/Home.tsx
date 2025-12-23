
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
          <section className={`relative overflow-hidden mb-20 rounded-[48px] p-12 md:p-24 shadow-2xl transition-colors ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-900 text-white'}`}>
            <div className="absolute top-0 right-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <div className="relative z-10 max-w-4xl text-right">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-widest mb-8 border border-emerald-500/30">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                مراجعات حية ومباشرة من المغرب 🇲🇦
              </span>
              <h1 className="text-5xl md:text-8xl font-black mb-10 leading-[1.1] tracking-tight text-white">
                هميزات <span className="text-emerald-400 italic">تيمو</span> <br/>بين يديك الآن.
              </h1>
              <p className="text-slate-400 text-xl md:text-2xl mb-12 leading-loose max-w-2xl font-light">
                لا تشترِ قبل أن تقرأ مراجعاتنا الشفافة. نختار لك أفضل المنتجات ونشحن تجربتنا إليك بكل أمانة.
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-[24px] font-black text-xl transition shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95">
                  ابدأ الاستكشاف
                </button>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
              { label: 'مراجعة منتج', val: '+450' },
              { label: 'كوبون خصم', val: '+120' },
              { label: 'زائر يومي', val: '+5,000' },
              { label: 'تقييم إيجابي', val: '4.9/5' }
            ].map((stat, idx) => (
              <div key={idx} className={`p-8 rounded-[32px] shadow-sm border text-center transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 hover:shadow-md'}`}>
                <div className="text-3xl font-black text-emerald-600 mb-2">{stat.val}</div>
                <div className="text-slate-400 font-bold text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isSearching ? 'نتائج البحث' : filterLabel ? `قسم: ${filterLabel}` : 'أحدث المراجعات والهميزات'}
          </h2>
          <div className="h-2 w-32 bg-emerald-500 rounded-full shadow-lg shadow-emerald-100"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
        {articles.map(article => (
          <article 
            key={article.id}
            className={`group rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer flex flex-col border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
            onClick={() => onArticleClick(article)}
          >
            <div className="relative h-72 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 ease-out" 
              />
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <span className="bg-white/95 backdrop-blur text-emerald-600 text-[10px] font-black px-4 py-2 rounded-xl shadow-xl">
                  {article.category}
                </span>
                <span className="bg-black/50 backdrop-blur text-white text-[9px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                   <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                   {article.views || 100} مشاهدة
                </span>
              </div>
            </div>
            <div className="p-10 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                   {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < article.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {calculateReadingTime(article.content)} دقيقة قراءة
                </span>
              </div>
              <h3 className={`font-black text-2xl md:text-3xl mb-6 line-clamp-2 leading-[1.3] group-hover:text-emerald-600 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {article.name}
              </h3>
              <p className={`text-lg mb-8 line-clamp-3 font-medium leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {article.content}
              </p>
              <div className="mt-auto pt-8 border-t border-slate-50/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg>
                      {article.likes || 0}
                   </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${darkMode ? 'bg-slate-800 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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
