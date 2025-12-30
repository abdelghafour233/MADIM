
import React from 'react';
import { Article } from '../types';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, darkMode = true }) => {
  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const otherPosts = posts.filter(p => p.id !== trendingPost?.id);

  if (!trendingPost) return <div className="text-center py-20 font-black opacity-50">لا توجد عروض حالياً..</div>;

  return (
    <div className="space-y-16 animate-fadeIn" dir="rtl">
      {/* Hero Section - العرض الأكثر تميزاً */}
      <section className="relative group cursor-pointer" onClick={() => onPostClick(trendingPost)}>
        <div className="relative h-[450px] md:h-[600px] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl">
          <img src={trendingPost.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt={trendingPost.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          <div className="absolute bottom-10 right-8 left-8 md:bottom-16 md:right-16 md:left-16 text-white">
            <span className="bg-orange-600 px-5 py-2 rounded-xl text-xs font-black uppercase mb-6 inline-block shadow-xl animate-pulse">همزة اليوم 🔥</span>
            <h1 className="text-3xl md:text-6xl font-black mb-6 leading-tight group-hover:text-emerald-400 transition-colors">{trendingPost.title}</h1>
            <p className="text-lg opacity-80 line-clamp-2 max-w-3xl font-bold hidden md:block">{trendingPost.excerpt}</p>
          </div>
        </div>
      </section>

      {/* قسم الكوبونات السريع - High Conversion */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[40px] flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">🏷️</div>
          <div>
            <h3 className="text-2xl font-black text-emerald-500">كوبونات تيمو (Temu) الحصرية</h3>
            <p className="text-sm font-bold opacity-60">تمنحك خصماً حتى 90% وشحناً مجانياً للمغرب</p>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {['epm88', 'epm99', 'maroc25'].map(code => (
            <div key={code} className="bg-white dark:bg-black/40 px-8 py-4 rounded-2xl border-2 border-dashed border-emerald-500/40 font-mono font-black text-emerald-500 text-xl shadow-sm hover:scale-105 transition-transform cursor-copy" onClick={() => {navigator.clipboard.writeText(code); alert('تم نسخ الكود: ' + code)}}>
              {code}
            </div>
          ))}
        </div>
      </div>

      {/* شبكة العروض والمراجعات */}
      <div className="space-y-10">
        <h2 className="text-3xl font-black flex items-center gap-4">
          <span className="w-3 h-10 bg-orange-500 rounded-full shadow-[0_0_15px_#f97316]"></span> أحدث مراجعات الأفلييت والعروض
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {otherPosts.map(post => (
            <div key={post.id} className="group cursor-pointer bg-white/5 dark:bg-white/5 rounded-[45px] overflow-hidden border border-white/5 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500" onClick={() => onPostClick(post)}>
              <div className="relative h-64 overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-tighter border border-white/10">
                  {post.category}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black mb-4 group-hover:text-emerald-500 transition-colors leading-snug">{post.title}</h3>
                <p className="text-sm opacity-50 line-clamp-2 font-bold mb-6">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-emerald-500 font-black text-sm group-hover:translate-x-[-5px] transition-transform">اقرأ المراجعة ←</span>
                  <div className="flex gap-1 text-yellow-400 text-xs">
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
