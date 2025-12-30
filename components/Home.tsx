
import React, { useState, useEffect } from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
  directLink?: string;
  settings: Settings;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, darkMode = true, directLink, settings }) => {
  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const otherPosts = posts.filter(p => p.id !== trendingPost?.id);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const fallbackImage = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop';

  useEffect(() => {
    const end = new Date().setHours(23, 59, 59);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = end - now;
      if (diff <= 0) return;
      setTimeLeft({
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  if (!trendingPost) return <div className="text-center py-20 opacity-40 font-black">جاري جلب أفضل العروض...</div>;

  // تقسيم المنتجات لوضع إعلانات بينها
  const chunkedPosts = [];
  for (let i = 0; i < otherPosts.length; i += 4) {
    chunkedPosts.push(otherPosts.slice(i, i + 4));
  }

  return (
    <div className="space-y-12 animate-fade" dir="rtl">
      {/* Hero Section Premium */}
      <section 
        className="relative group cursor-pointer overflow-hidden rounded-[40px] md:rounded-[60px] bg-white/5 border border-white/10 shadow-3xl"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[500px] md:min-h-[600px]">
           <div className="relative h-[300px] sm:h-[400px] lg:h-auto overflow-hidden bg-[#0d0d0e] flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-125" 
                style={{ backgroundImage: `url("${trendingPost.image}")` }}
              ></div>
              <img 
                src={trendingPost.image} 
                referrerPolicy="no-referrer"
                onError={handleImgError}
                className="relative z-10 w-full h-full object-contain p-4 md:p-12 group-hover:scale-105 transition-transform duration-1000" 
                alt={trendingPost.title} 
              />
              <div className="absolute top-6 right-6 md:top-10 md:right-10 bg-orange-600 text-white px-5 py-2 rounded-2xl text-[10px] md:text-sm font-black shadow-2xl animate-pulse z-30 flex items-center gap-2">
                <span>⏱️</span>
                <span>ينتهي العرض: {timeLeft.h}:{timeLeft.m}:{timeLeft.s}</span>
              </div>
           </div>

           <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center bg-black/40 lg:bg-transparent relative z-30">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-emerald-600/20 text-emerald-500 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border border-emerald-500/20">همزة اليوم الحصرية 🔥</span>
              </div>
              <h1 className="text-3xl md:text-6xl font-black mb-8 leading-[1.1] group-hover:text-emerald-500 transition-colors">{trendingPost.title}</h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 line-clamp-3 leading-relaxed">{trendingPost.excerpt}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <div className="w-full sm:w-auto bg-white text-black p-5 md:p-6 rounded-3xl font-black shadow-2xl flex flex-col items-center min-w-[140px]">
                    <span className="text-[10px] opacity-40 mb-1 uppercase tracking-tighter">الثمن</span>
                    <span className="text-xl md:text-4xl">{trendingPost.price && trendingPost.price > 0 ? `${trendingPost.price} د.م` : 'أفضل سعر'}</span>
                 </div>
                 <button className="w-full sm:flex-1 bg-emerald-600 text-white py-6 md:py-8 rounded-[30px] md:rounded-[40px] font-black text-xl md:text-3xl shadow-2xl shadow-emerald-600/30 hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                     اكتشف العرض الآن 🛍️
                 </button>
              </div>
           </div>
        </div>
      </section>

      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
           <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4">
              <span className="w-3 h-10 bg-emerald-600 rounded-full"></span>
              أحدث الهميزات والعروض
           </h2>
        </div>

        {chunkedPosts.map((chunk, index) => (
          <React.Fragment key={index}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {chunk.map(post => (
                <div 
                  key={post.id} 
                  className="group cursor-pointer glass-card p-4 md:p-6 overflow-hidden flex flex-col"
                  onClick={() => onPostClick(post)}
                >
                  <div className="relative aspect-square rounded-[25px] md:rounded-[40px] overflow-hidden bg-[#0d0d0e] mb-6 flex items-center justify-center img-loading">
                     <img 
                        src={post.image} 
                        loading="lazy" 
                        referrerPolicy="no-referrer"
                        onError={handleImgError}
                        className="relative z-10 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                        alt={post.title} 
                     />
                  </div>
                  <h3 className="text-sm md:text-xl font-black mb-4 line-clamp-2 min-h-[3rem] group-hover:text-emerald-500 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-lg md:text-2xl font-black text-emerald-500">{post.price && post.price > 0 ? `${post.price} د.م` : 'انظر العرض'}</span>
                      <button className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600/10 text-emerald-500 rounded-xl flex items-center justify-center">🛍️</button>
                  </div>
                </div>
              ))}
            </div>
            {/* إعلان بعد كل 4 منتجات */}
            <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Home;
