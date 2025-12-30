
import React from 'react';
import { Article, Category } from '../types';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, darkMode = true }) => {
  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const deals = posts.filter(p => p.id !== trendingPost.id);

  return (
    <div className="space-y-20 animate-fadeIn" dir="rtl">
      {/* Hero Section - المميز */}
      <section className="relative group cursor-pointer" onClick={() => onPostClick(trendingPost)}>
        <div className="relative h-[500px] md:h-[650px] rounded-[50px] overflow-hidden shadow-2xl">
          <img src={trendingPost.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt={trendingPost.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/20 to-transparent"></div>
          <div className="absolute bottom-12 right-12 left-12 text-white">
            <span className="bg-emerald-600 px-5 py-2 rounded-xl text-xs font-black uppercase mb-6 inline-block shadow-xl">صفقة اليوم 🔥</span>
            <h1 className="text-3xl md:text-6xl font-black mb-6 leading-tight group-hover:text-emerald-400 transition-colors">{trendingPost.title}</h1>
            <p className="text-lg opacity-80 line-clamp-2 max-w-3xl font-bold">{trendingPost.excerpt}</p>
          </div>
        </div>
      </section>

      {/* قسم الكوبونات السريع */}
      <div className="bg-orange-500/10 border border-orange-500/20 p-8 rounded-[40px] flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🏷️</span>
          <div>
            <h3 className="text-xl font-black text-orange-500">كوبونات تيمو الحصرية</h3>
            <p className="text-sm font-bold opacity-60">محدثة يومياً لمتابعي عبدو ويب</p>
          </div>
        </div>
        <div className="flex gap-3">
          {['epm88', 'epm99', 'maroc25'].map(code => (
            <div key={code} className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-orange-500/30 font-mono font-black text-orange-500 shadow-sm">
              {code}
            </div>
          ))}
        </div>
      </div>

      {/* شبكة العروض */}
      <div className="space-y-12">
        <h2 className="text-3xl font-black flex items-center gap-4">
          <span className="w-3 h-10 bg-emerald-500 rounded-full"></span> أحدث مراجعات الأفلييت
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {deals.map(post => (
            <div key={post.id} className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all" onClick={() => onPostClick(post)}>
              <div className="relative h-64 overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-tighter">
                  {post.category}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black mb-4 group-hover:text-emerald-500 transition-colors leading-snug">{post.title}</h3>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-emerald-500 font-black text-sm">اقرأ المزيد ←</span>
                  <div className="flex gap-1 text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
