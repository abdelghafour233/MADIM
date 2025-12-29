
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
        <div className="w-24 h-24 bg-emerald-600/10 rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce">✨</div>
        <h2 className="text-3xl md:text-5xl font-black mb-4">جاري التحميل...</h2>
      </div>
    );
  }

  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const regularPosts = posts.filter(p => p.id !== trendingPost.id);
  const techPosts = posts.filter(p => p.category === Category.TECH);
  const selfDevPosts = posts.filter(p => p.category === Category.SELF_DEV);

  return (
    <div className="space-y-16 md:space-y-24 animate-fadeIn">
      {/* Hero Section - الخبر الساخن */}
      <section className="relative group cursor-pointer" onClick={() => onPostClick(trendingPost)}>
        <div className="relative h-[450px] sm:h-[600px] md:h-[700px] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl">
          <img 
            src={trendingPost.image} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            alt={trendingPost.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-6 right-4 left-4 md:bottom-12 md:right-16 md:left-16 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase animate-pulse">ترند الآن</span>
              <span className="text-white/70 font-bold text-xs">{trendingPost.category}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black mb-4 leading-tight max-w-5xl group-hover:text-emerald-400 transition-colors">
              {trendingPost.title}
            </h1>
            <p className="text-slate-300 text-sm md:text-xl max-w-3xl line-clamp-2 font-medium opacity-80 leading-relaxed hidden sm:block">
              {trendingPost.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* أقسام سريعة */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {Object.values(Category).map((cat, i) => (
          <button key={i} className={`px-8 py-4 rounded-2xl font-black text-xs whitespace-nowrap transition-all border ${darkMode ? 'bg-white/5 border-white/5 hover:bg-emerald-600/20 text-white' : 'bg-white shadow-sm border-slate-100 text-slate-700 hover:bg-slate-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* شبكة المقالات الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
               <span className="w-10 h-1 bg-emerald-500 rounded-full"></span> آخر المستجدات
             </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {regularPosts.slice(0, 4).map(post => (
              <div key={post.id} className="group cursor-pointer" onClick={() => onPostClick(post)}>
                <div className="relative h-52 sm:h-64 rounded-[30px] overflow-hidden mb-5 shadow-lg">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                  <div className="absolute top-4 left-4 bg-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-tighter shadow-xl">
                    {post.category}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-black mb-3 leading-snug group-hover:text-emerald-500 transition-colors">{post.title}</h3>
                <p className="text-xs line-clamp-2 opacity-60 font-medium leading-relaxed">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - الأكثر قراءة */}
        <div className={`p-8 rounded-[40px] h-fit sticky top-24 ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-white shadow-xl border border-slate-50'}`}>
          <h2 className="text-xl font-black mb-8 text-emerald-500 flex items-center gap-2">تطوير الذات 💡</h2>
          <div className="space-y-8">
            {selfDevPosts.map(p => (
              <div key={p.id} onClick={() => onPostClick(p)} className="group cursor-pointer flex gap-4 items-center">
                <img src={p.image} className="w-16 h-16 rounded-xl object-cover shadow-md flex-shrink-0" alt="" />
                <div className="overflow-hidden">
                  <h4 className="font-black text-sm group-hover:text-emerald-500 transition-colors line-clamp-2 leading-tight">{p.title}</h4>
                  <span className="text-[10px] opacity-40 font-bold uppercase mt-1 block">{p.date}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5">
            <h2 className="text-xl font-black mb-8 text-orange-500 flex items-center gap-2">التقنية 🚀</h2>
            <div className="space-y-6">
               {techPosts.slice(0, 3).map(p => (
                 <div key={p.id} onClick={() => onPostClick(p)} className="flex items-center gap-4 cursor-pointer group">
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xs font-black group-hover:bg-orange-500 transition-all">#</div>
                   <h4 className="font-bold text-xs line-clamp-1 group-hover:text-orange-500">{p.title}</h4>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
