
import React from 'react';
import { Article, Category } from '../types.ts';

interface HomeProps {
  articles: Article[];
  onArticleClick: (a: Article) => void;
  onCategoryClick: (c: Category) => void;
  filterLabel?: string;
}

const Home: React.FC<HomeProps> = ({ articles, onArticleClick, onCategoryClick, filterLabel }) => {
  return (
    <div className="animate-fadeIn pb-20">
      {!filterLabel && (
        <section className="relative overflow-hidden mb-20 rounded-[40px] bg-slate-900 text-white p-10 md:p-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 hero-pattern"></div>
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-emerald-500/20 text-emerald-400 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6 border border-emerald-500/30">
              دليلك الموثوق في المغرب 🇲🇦
            </span>
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.15]">
              نختار لك <span className="text-emerald-400">الأفضل</span>، <br/>لأنك تستحق الجودة.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl font-light">
              مراجعات دقيقة، مقارنات شفافة، وأفضل العروض الحصرية. انضم لأكثر من 50 ألف مغربي يثقون في اختياراتنا يومياً.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition shadow-xl shadow-emerald-500/20">
                استكشف المراجعات
              </button>
              <div className="flex -space-x-3 space-x-reverse items-center">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-slate-900" />
                ))}
                <span className="mr-4 text-sm text-slate-400 font-bold">+50k متابع</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        </section>
      )}

      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {filterLabel ? `قسم: ${filterLabel}` : 'أحدث المنشورات'}
          </h2>
          <div className="h-1.5 w-20 bg-emerald-500 rounded-full"></div>
        </div>
        <div className="hidden sm:flex gap-2">
          {Object.values(Category).slice(0, 3).map(c => (
            <button key={c} className="text-xs font-bold px-4 py-2 rounded-xl bg-white border hover:border-emerald-500 transition shadow-sm">
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map(article => (
          <article 
            key={article.id}
            className="group bg-white rounded-[32px] overflow-hidden card-shadow hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col border border-slate-100"
            onClick={() => onArticleClick(article)}
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-5 right-5">
                <span className="bg-white/90 backdrop-blur text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">
                  {article.category}
                </span>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`h-3 w-3 ${i < article.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
                <span className="text-[10px] text-slate-400 font-bold mr-1">(مراجعة موثوقة)</span>
              </div>
              <h3 className="font-black text-2xl mb-4 text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                {article.name}
              </h3>
              <p className="text-slate-500 text-sm mb-8 line-clamp-3 font-medium leading-relaxed">
                {article.content}
              </p>
              <div className="mt-auto flex items-center justify-end border-t border-slate-50 pt-6">
                <div className="flex items-center gap-2 group-hover:translate-x-[-4px] transition-transform duration-300">
                  <span className="text-xs font-black text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">اقرأ المزيد</span>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
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
