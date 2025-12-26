
import React from 'react';
import { Article, Category } from '../types';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, darkMode = true }) => {
  if (posts.length === 0) return null;

  const trending = posts.filter(p => p.isTrending);
  const techPosts = posts.filter(p => p.category === Category.TECH);
  const reviews = posts.filter(p => p.category === Category.REVIEWS);

  return (
    <div className="space-y-24 animate-fadeIn">
      {/* Hero Section - Breaking News Style */}
      <section className="relative group cursor-pointer" onClick={() => onPostClick(posts[0])}>
        <div className="relative h-[600px] md:h-[750px] rounded-[60px] overflow-hidden shadow-2xl">
          <img src={posts[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-12 right-8 left-8 md:right-20 md:left-20 text-white">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-emerald-600 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-pulse">عاجل</span>
              <span className="text-white/70 font-bold text-sm">{posts[0].category} • {posts[0].date}</span>
            </div>
            <h1 className="text-4xl md:text-8xl font-black mb-10 leading-[1.1] max-w-5xl group-hover:text-emerald-400 transition-colors">
              {posts[0].title}
            </h1>
            <p className="text-slate-300 text-2xl max-w-3xl line-clamp-2 font-medium opacity-80 leading-relaxed">
              {posts[0].excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Categories Fast Access */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {Object.values(Category).map((cat, i) => (
          <button key={i} className={`px-10 py-5 rounded-[25px] font-black text-sm whitespace-nowrap transition-all flex items-center gap-3 ${darkMode ? 'glass hover:bg-emerald-600/20 text-white' : 'bg-white shadow-lg border border-slate-100 text-slate-700 hover:bg-slate-50'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid: Morocco News & Tech */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black flex items-center gap-4">
              <span className="w-12 h-1.5 bg-emerald-500 rounded-full"></span>
              أخبار المغرب والتقنية
            </h2>
            <button className="text-emerald-500 font-black text-sm hover:translate-x-[-10px] transition-transform">مشاهدة الكل ←</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.slice(1, 5).map(post => (
              <div key={post.id} className="group cursor-pointer" onClick={() => onPostClick(post)}>
                <div className="relative h-80 rounded-[45px] overflow-hidden mb-6 shadow-xl">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-tighter">
                    {post.category}
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-4 leading-snug group-hover:text-emerald-500 transition-colors">{post.title}</h3>
                <p className={`text-sm line-clamp-2 opacity-60 font-medium leading-relaxed`}>{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Self Development */}
        <div className={`p-10 rounded-[50px] space-y-10 h-fit transition-all ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-white shadow-2xl shadow-slate-200'}`}>
          <h2 className="text-2xl font-black text-emerald-500">تطوير الذات ✨</h2>
          <div className="space-y-8">
            {posts.filter(p => p.category === Category.SELF_DEV).map(p => (
              <div key={p.id} onClick={() => onPostClick(p)} className="group cursor-pointer flex gap-4 items-center">
                <img src={p.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg" alt="" />
                <div>
                  <h4 className="font-black text-sm group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug">{p.title}</h4>
                  <span className="text-[10px] opacity-40 font-bold uppercase mt-2 block">{p.date}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all">استكشف المزيد من المقالات</button>
        </div>
      </div>

      {/* Product Reviews Section (Glow Style) */}
      <section className={`p-16 rounded-[70px] transition-all ${darkMode ? 'bg-emerald-600/5' : 'bg-white shadow-2xl border border-slate-50'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">تقييم المنتجات 🛒</h2>
            <p className="opacity-60 font-bold text-lg">مراجعات حيادية لأحدث الأجهزة المتوفرة في المغرب</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-4 rounded-2xl bg-white dark:bg-white/5 shadow-sm text-center">
               <span className="text-3xl block mb-1">⭐</span>
               <span className="text-[10px] font-black opacity-40 uppercase">دقة المراجعة</span>
             </div>
             <div className="px-6 py-4 rounded-2xl bg-white dark:bg-white/5 shadow-sm text-center">
               <span className="text-3xl block mb-1">🇲🇦</span>
               <span className="text-[10px] font-black opacity-40 uppercase">توفر محلي</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviews.map(item => (
            <div key={item.id} className="bg-white dark:bg-[#121214] p-8 rounded-[45px] shadow-xl hover:-translate-y-2 transition-all group cursor-pointer" onClick={() => onPostClick(item)}>
               <div className="h-56 rounded-[35px] overflow-hidden mb-8 relative">
                 <img src={item.image} className="w-full h-full object-cover" alt="" />
                 <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs">
                   {item.price?.toLocaleString()} د.م
                 </div>
               </div>
               <div className="flex gap-1 text-yellow-500 mb-4">
                 {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
               </div>
               <h3 className="text-xl font-black mb-4 group-hover:text-emerald-500 transition-colors">{item.title}</h3>
               <p className="text-sm opacity-60 line-clamp-2 mb-8 leading-relaxed font-medium">{item.excerpt}</p>
               <button className="w-full py-4 border-2 border-emerald-500/20 rounded-2xl font-black text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">اقرأ المراجعة</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
