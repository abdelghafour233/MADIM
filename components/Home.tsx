
import React from 'react';
import { Article, Category } from '../types';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, darkMode = true }) => {
  if (posts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fadeIn px-4">
        <div className="w-24 h-24 bg-emerald-600/10 rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce">
          ✨
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-4">مرحباً بك في موقعك الجديد</h2>
        <p className="text-slate-500 max-w-lg text-lg font-medium leading-relaxed">
          لا توجد مقالات أو منتجات حالياً. يمكنك البدء بإضافة محتواك الأول من خلال لوحة التحكم في قسم الإدارة.
        </p>
      </div>
    );
  }

  const reviews = posts.filter(p => p.category === Category.REVIEWS);

  return (
    <div className="space-y-12 md:space-y-24 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative group cursor-pointer" onClick={() => onPostClick(posts[0])}>
        <div className="relative h-[450px] sm:h-[600px] md:h-[750px] rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl">
          <img 
            src={posts[0].image} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            alt={posts[0].title || posts[0].name}
            loading="eager" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-6 right-4 left-4 md:bottom-12 md:right-20 md:left-20 text-white">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
              <span className="bg-emerald-600 px-3 py-1 md:px-6 md:py-2.5 rounded-lg md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl animate-pulse">جديد</span>
              <span className="text-white/70 font-bold text-[10px] md:text-sm">{posts[0].category} • {posts[0].date}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-10 leading-[1.2] md:leading-[1.1] max-w-5xl group-hover:text-emerald-400 transition-colors">
              {posts[0].title || posts[0].name}
            </h1>
            <p className="text-slate-300 text-sm md:text-2xl max-w-3xl line-clamp-2 font-medium opacity-80 leading-relaxed hidden sm:block">
              {posts[0].excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Categories Fast Access */}
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {Object.values(Category).map((cat, i) => (
          <button key={i} className={`px-6 py-3 md:px-10 md:py-5 rounded-2xl md:rounded-[25px] font-black text-xs md:text-sm whitespace-nowrap transition-all flex items-center gap-2 md:gap-3 ${darkMode ? 'glass hover:bg-emerald-600/20 text-white' : 'bg-white shadow-md border border-slate-100 text-slate-700 hover:bg-slate-50'}`}>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid: News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl md:text-3xl font-black flex items-center gap-3 md:gap-4">
              <span className="w-8 md:w-12 h-1 md:h-1.5 bg-emerald-500 rounded-full"></span>
              أحدث المقالات
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
            {posts.slice(1, 5).map(post => (
              <div key={post.id} className="group cursor-pointer" onClick={() => onPostClick(post)}>
                <div className="relative h-56 sm:h-80 rounded-[30px] md:rounded-[45px] overflow-hidden mb-4 md:mb-6 shadow-xl">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title || post.name} loading="lazy" />
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] md:text-[10px] font-black text-white uppercase tracking-tighter">
                    {post.category}
                  </div>
                </div>
                <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-4 leading-snug group-hover:text-emerald-500 transition-colors">{post.title || post.name}</h3>
                <p className={`text-xs md:text-sm line-clamp-2 opacity-60 font-medium leading-relaxed`}>{post.excerpt}</p>
              </div>
            ))}
            {posts.length <= 1 && (
               <p className="col-span-full text-center py-10 opacity-40 font-bold">لا توجد مقالات إضافية حالياً.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={`p-6 md:p-10 rounded-[30px] md:rounded-[50px] space-y-6 md:space-y-10 h-fit transition-all ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-white shadow-xl shadow-slate-200'}`}>
          <h2 className="text-xl md:text-2xl font-black text-emerald-500">تطوير الذات ✨</h2>
          <div className="space-y-6 md:space-y-8">
            {posts.filter(p => p.category === Category.SELF_DEV).map(p => (
              <div key={p.id} onClick={() => onPostClick(p)} className="group cursor-pointer flex gap-3 md:gap-4 items-center">
                <img src={p.image} className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover shadow-lg" alt={p.title || p.name} loading="lazy" />
                <div className="overflow-hidden">
                  <h4 className="font-black text-xs md:text-sm group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug">{p.title || p.name}</h4>
                  <span className="text-[8px] md:text-[10px] opacity-40 font-bold uppercase mt-1 md:mt-2 block">{p.date}</span>
                </div>
              </div>
            ))}
            {posts.filter(p => p.category === Category.SELF_DEV).length === 0 && (
              <p className="text-xs opacity-50 font-bold text-center py-4">لا توجد مقالات في هذا القسم حالياً.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className={`p-8 md:p-16 rounded-[40px] md:rounded-[70px] transition-all ${darkMode ? 'bg-emerald-600/5' : 'bg-white shadow-xl border border-slate-50'}`}>
        <h2 className="text-3xl md:text-5xl font-black mb-8 md:text-5xl md:mb-16">تقييم المنتجات 🛒</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {reviews.map(item => (
            <div key={item.id} className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[30px] md:rounded-[45px] shadow-lg hover:-translate-y-2 transition-all group cursor-pointer" onClick={() => onPostClick(item)}>
               <div className="h-48 md:h-56 rounded-[25px] md:rounded-[35px] overflow-hidden mb-6 md:mb-8 relative">
                 <img src={item.image} className="w-full h-full object-cover" alt={item.title || item.name} loading="lazy" />
                 {item.price && <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-black text-[10px]">{item.price.toLocaleString()} د.م</div>}
               </div>
               <h3 className="text-lg md:text-xl font-black mb-3 group-hover:text-emerald-500 transition-colors">{item.title || item.name}</h3>
               <p className="text-xs md:text-sm opacity-60 line-clamp-2 mb-6 leading-relaxed font-medium">{item.excerpt}</p>
            </div>
          ))}
          {reviews.length === 0 && (
             <div className="col-span-full text-center py-10 opacity-30 font-bold border-2 border-dashed border-emerald-500/10 rounded-3xl">لا توجد مراجعات منتجات حالياً.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
