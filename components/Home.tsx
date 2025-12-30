
import React, { useState, useEffect } from 'react';
import { Article } from '../types';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
  directLink?: string;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, darkMode = true, directLink }) => {
  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const otherPosts = posts.filter(p => p.id !== trendingPost?.id);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const end = new Date().setHours(23, 59, 59);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = end - now;
      setTimeLeft({
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!trendingPost) return <div className="text-center py-20 opacity-40 font-black">جاري جلب العروض...</div>;

  return (
    <div className="space-y-12 animate-fade" dir="rtl">
      {/* Hero Section Premium */}
      <section 
        className="relative group cursor-pointer overflow-hidden rounded-[45px] md:rounded-[65px] bg-white/5 border border-white/10 shadow-3xl"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
           <div className="relative h-[350px] md:h-[600px] overflow-hidden">
              <img src={trendingPost.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-black via-black/20 to-transparent"></div>
              <div className="absolute top-6 left-6 bg-red-600 text-white px-5 py-2 rounded-2xl text-[11px] font-black shadow-xl animate-pulse">
                ينتهي في {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
              </div>
           </div>
           <div className="p-8 md:p-16 lg:pr-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-emerald-600/20 text-emerald-500 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20">همزة اليوم 🔥</span>
                <span className="bg-orange-600/20 text-orange-500 px-5 py-2 rounded-xl text-xs font-black border border-orange-500/20">الأكثر طلباً</span>
              </div>
              <h1 className="text-3xl md:text-6xl font-black mb-6 leading-tight group-hover:text-emerald-500 transition-colors">{trendingPost.title}</h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 line-clamp-2">{trendingPost.excerpt}</p>
              
              <div className="flex items-center gap-6">
                 <div className="bg-white text-black p-5 md:p-6 rounded-3xl font-black shadow-2xl flex flex-col items-center min-w-[120px]">
                    <span className="text-[10px] opacity-40 mb-1">الثمن الآن</span>
                    <span className="text-2xl md:text-3xl">{trendingPost.price} د.م</span>
                 </div>
                 <button className="flex-1 bg-emerald-600 text-white py-6 md:py-8 rounded-[30px] font-black text-xl md:text-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3">
                    <span>🛒</span> اطلب الآن
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: 'توصيل مجاني', d: 'فوق 300 درهم', i: '📦', c: 'bg-blue-500' },
          { t: 'دفع عند الاستلام', d: 'آمن 100%', i: '🤝', c: 'bg-emerald-500' },
          { t: 'ضمان الجودة', d: 'أصلي 100%', i: '💎', c: 'bg-purple-500' },
          { t: 'دعم واتساب', d: 'متاح 24/7', i: '💬', c: 'bg-green-500' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-6 text-center group">
             <div className={`w-14 h-14 ${item.c}/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
               {item.i}
             </div>
             <h4 className="font-black text-sm md:text-lg mb-1">{item.t}</h4>
             <p className="text-[10px] md:text-xs opacity-40 font-bold">{item.d}</p>
          </div>
        ))}
      </div>

      {/* العروض المميزة Grid */}
      <div className="space-y-10">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4">
              <span className="w-3 h-10 bg-emerald-600 rounded-full"></span>
              أحدث الهميزات
           </h2>
           <div className="hidden md:flex gap-2">
              <span className="w-12 h-1 bg-emerald-600 rounded-full"></span>
              <span className="w-4 h-1 bg-white/10 rounded-full"></span>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map(post => (
            <div 
              key={post.id} 
              className="group cursor-pointer glass-card p-4 md:p-6"
              onClick={() => onPostClick(post)}
            >
              <div className="img-container mb-6 shadow-xl">
                 <img src={post.image} loading="lazy" alt={post.title} />
                 <div className="absolute top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg">
                    وفر {post.marketPrice ? post.marketPrice - (post.price || 0) : 0} د.م
                 </div>
                 {post.isTrending && (
                   <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black animate-pulse">
                     جديد 🔥
                   </div>
                 )}
              </div>
              <h3 className="text-lg md:text-xl font-black mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-emerald-500 transition-colors">
                {post.title}
              </h3>
              <div className="flex items-center justify-between mt-auto">
                 <div>
                    <span className="text-[10px] font-black text-slate-500 block mb-1">ثمن الهمزة:</span>
                    <span className="text-xl md:text-2xl font-black text-emerald-500">{post.price} د.م</span>
                 </div>
                 <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl hover:bg-emerald-600 hover:text-white transition-all shadow-inner">
                    ➕
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
