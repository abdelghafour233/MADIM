
import React, { useState, useEffect } from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';
import RewardsCenter from './RewardsCenter.tsx';
import { INITIAL_REWARDS } from '../constants.tsx';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
  directLink?: string;
  settings: Settings;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, darkMode = true, directLink, settings }) => {
  // حماية: إذا كانت القائمة فارغة نرجع نصاً بسيطاً لمنع الشاشة البيضاء
  if (!posts || posts.length === 0) {
    return <div className="text-center py-20 opacity-40 font-black">جاري جلب أفضل العروض...</div>;
  }

  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const otherPosts = posts.filter(p => p.id !== trendingPost?.id);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });
  const fallbackImage = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  const chunkedPosts = [];
  const chunkSize = 8; 
  for (let i = 0; i < otherPosts.length; i += chunkSize) {
    chunkedPosts.push(otherPosts.slice(i, i + chunkSize));
  }

  return (
    <div className="space-y-12 md:space-y-20 animate-fade" dir="rtl">
      {/* Hero Section */}
      <section 
        className="relative group cursor-pointer overflow-hidden rounded-[40px] md:rounded-[60px] bg-white/5 border border-white/10 shadow-3xl transition-transform duration-500 hover:scale-[1.005]"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="flex flex-col lg:flex-row items-stretch">
           <div className="relative w-full lg:w-1/2 h-[350px] sm:h-[450px] lg:h-[650px] overflow-hidden bg-[#0d0d0e] flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20" style={{ backgroundImage: `url("${trendingPost.image}")` }}></div>
              <img 
                src={trendingPost.image} 
                onError={handleImgError}
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-1000" 
                alt={trendingPost.title} 
              />
              <div className="absolute top-6 right-6 bg-orange-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black z-30">
                ⏱️ {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
              </div>
           </div>

           <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <span className="bg-emerald-600/20 text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black w-fit mb-6">همزة حصرية 🔥</span>
              <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{trendingPost.title}</h1>
              <p className="text-slate-400 text-lg mb-10 line-clamp-3">{trendingPost.excerpt}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <div className="w-full sm:w-auto bg-white text-black p-5 rounded-[25px] font-black text-center min-w-[140px]">
                    <span className="text-[10px] opacity-40 block">الثمن اليوم</span>
                    <span className="text-2xl">{trendingPost.price ? `${trendingPost.price} د.م` : 'أفضل سعر'}</span>
                 </div>
                 <button className="w-full sm:flex-1 bg-emerald-600 text-white py-6 rounded-[25px] font-black text-xl shadow-xl shadow-emerald-600/30">
                     اكتشف العرض 🛍️
                 </button>
              </div>
           </div>
        </div>
      </section>

      <RewardsCenter rewards={INITIAL_REWARDS} settings={settings} darkMode={darkMode} />
      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

      <div className="space-y-8">
        <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4">
           <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
           أحدث العروض
        </h2>

        {chunkedPosts.map((chunk, index) => (
          <React.Fragment key={index}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
              {chunk.map(post => (
                <div key={post.id} className="group cursor-pointer glass-card p-4 flex flex-col h-full" onClick={() => onPostClick(post)}>
                  <div className="relative aspect-square rounded-[30px] overflow-hidden bg-[#0d0d0e] mb-4 flex items-center justify-center">
                     <img src={post.image} onError={handleImgError} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  <h3 className="text-sm font-black mb-4 line-clamp-2 leading-snug">{post.title}</h3>
                  <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-lg font-black text-emerald-500">{post.price ? `${post.price} د.م` : 'انظر العرض'}</span>
                      <div className="w-8 h-8 bg-emerald-600/10 text-emerald-500 rounded-lg flex items-center justify-center text-sm">🛒</div>
                  </div>
                </div>
              ))}
            </div>
            <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Home;
