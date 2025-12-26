
import React from 'react';
import { Article } from '../types';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick }) => {
  if (posts.length === 0) return null;

  return (
    <div className="animate-fadeIn">
      {/* Featured Article */}
      <div 
        className="relative h-[500px] md:h-[650px] rounded-[50px] overflow-hidden mb-20 cursor-pointer group shadow-2xl"
        onClick={() => onPostClick(posts[0])}
      >
        <img src={posts[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
        <div className="absolute bottom-16 right-8 left-8 md:right-16 md:left-16">
          <span className="bg-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase mb-6 inline-block tracking-widest shadow-lg">مقال مميز</span>
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight max-w-5xl">{posts[0].title}</h1>
          <p className="text-slate-300 text-xl max-w-2xl line-clamp-2 hidden md:block font-medium opacity-80">{posts[0].excerpt}</p>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex gap-4 overflow-x-auto pb-8 mb-12 no-scrollbar">
         {['الكل', 'تقنية', 'مراجعات', 'أخبار المغرب', 'ذكاء اصطناعي'].map((cat, idx) => (
           <button key={idx} className={`px-8 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${idx === 0 ? 'bg-emerald-600' : 'glass hover:bg-white/10'}`}>
             {cat}
           </button>
         ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.slice(1).map(post => (
          <div 
            key={post.id} 
            className="group cursor-pointer"
            onClick={() => onPostClick(post)}
          >
            <div className="h-72 rounded-[40px] overflow-hidden mb-8 shadow-xl relative">
              <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex items-center gap-3 mb-4">
               <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">{post.category}</span>
               <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
               <span className="text-slate-500 font-bold text-[10px]">{post.date}</span>
            </div>
            <h3 className="text-2xl font-black mb-4 leading-snug group-hover:text-emerald-400 transition-colors">{post.title}</h3>
            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed font-medium">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
