
import React from 'react';
import { Article } from '../types';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, darkMode = true }) => {
  if (posts.length === 0) return null;

  return (
    <div className="animate-fadeIn">
      {/* Featured Article */}
      <div 
        className="relative h-[500px] md:h-[650px] rounded-[50px] overflow-hidden mb-20 cursor-pointer group shadow-2xl"
        onClick={() => onPostClick(posts[0])}
      >
        <img src={posts[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
        <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-black via-black/30' : 'from-black/80 via-black/20'} to-transparent`}></div>
        <div className="absolute bottom-16 right-8 left-8 md:right-16 md:left-16 text-white">
          <span className="bg-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase mb-6 inline-block tracking-widest shadow-lg">مقال مميز</span>
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight max-w-5xl">{posts[0].title}</h1>
          <p className="text-slate-200 text-xl max-w-2xl line-clamp-2 hidden md:block font-medium opacity-90">{posts[0].excerpt}</p>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex gap-4 overflow-x-auto pb-8 mb-12 no-scrollbar">
         {['الكل', 'تقنية', 'مراجعات', 'أخبار المغرب', 'ذكاء اصطناعي'].map((cat, idx) => (
           <button 
            key={idx} 
            className={`px-8 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all 
              ${idx === 0 ? 'bg-emerald-600 text-white' : 
              darkMode ? 'glass text-white hover:bg-white/10' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
           >
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
            <div className={`h-72 rounded-[40px] overflow-hidden mb-8 shadow-xl relative transition-all ${!darkMode ? 'border border-slate-100' : ''}`}>
              <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex items-center gap-3 mb-4">
               <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">{post.category}</span>
               <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
               <span className={`font-bold text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{post.date}</span>
            </div>
            <h3 className={`text-2xl font-black mb-4 leading-snug group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{post.title}</h3>
            <p className={`text-sm line-clamp-2 leading-relaxed font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
