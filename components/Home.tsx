
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

  return (
    <div className="space-y-12 animate-fade" dir="rtl">
      {/* Hero Section Premium */}
      <section 
        className="relative group cursor-pointer overflow-hidden rounded-[40px] md:rounded-[60px] bg-white/5 border border-white/10 shadow-3xl"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[500px] md:min-h-[600px]">
           {/* Image Container */}
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
              <div className="absolute inset-0 bg-gradient-to-t lg:hidden from-[#0a0a0b] via-transparent to-transparent z-20"></div>
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

      {/* Trust Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: 'توصيل سريع', d: 'لباب الدار', i: '🚚', c: 'bg-blue-500' },
          { t: 'الدفع عند الاستلام', d: 'خالص حتى تقيس', i: '💸', c: 'bg-emerald-500' },
          { t: 'أفضل جودة', d: 'سلعة أصلية 100%', i: '🛡️', c: 'bg-orange-500' },
          { t: 'دعم مباشر', d: 'واتساب 24/7', i: '💬', c: 'bg-green-500' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-6 md:p-8 text-center group hover:bg-white/[0.05]">
             <div className={`w-14 h-14 md:w-16 md:h-16 ${item.c}/10 rounded-[22px] flex items-center justify-center text-3xl md:text-4xl mx-auto mb-5 group-hover:scale-110 transition-transform group-hover:rotate-6`}>
               {item.i}
             </div>
             <h4 className="font-black text-sm md:text-xl mb-2">{item.t}</h4>
             <p className="text-[10px] md:text-sm opacity-40 font-bold">{item.d}</p>
          </div>
        ))}
      </div>

      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

      {/* Grid Products */}
      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
           <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4">
              <span className="w-3 h-10 bg-emerald-600 rounded-full"></span>
              أحدث الهميزات والعروض
           </h2>
           <span className="text-xs md:text-sm font-bold opacity-40">أكثر من {posts.length} عرض نشط</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {otherPosts.map(post => (
            <div 
              key={post.id} 
              className="group cursor-pointer glass-card p-4 md:p-6 overflow-hidden flex flex-col"
              onClick={() => onPostClick(post)}
            >
              <div className="relative aspect-square rounded-[25px] md:rounded-[40px] overflow-hidden bg-[#0d0d0e] mb-6 flex items-center justify-center img-loading">
                 <div 
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-10" 
                    style={{ backgroundImage: `url("${post.image}")` }}
                 ></div>
                 <img 
                    src={post.image} 
                    loading="lazy" 
                    referrerPolicy="no-referrer"
                    onError={handleImgError}
                    className="relative z-10 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                    alt={post.title} 
                 />
                 <div className="absolute top-3 right-3 md:top-6 md:right-6 bg-orange-600 backdrop-blur-md text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black shadow-2xl z-20">
                    {post.marketPrice && post.price && post.price > 0 ? `وفر ${post.marketPrice - post.price} د.م` : 'تخفيض كبير'}
                 </div>
              </div>
              <div className="flex flex-col flex-1 px-1">
                <h3 className="text-sm md:text-2xl font-black mb-4 line-clamp-2 min-h-[3rem] md:min-h-[4rem] group-hover:text-emerald-500 transition-colors leading-snug">
                  {post.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                   <div className="flex flex-col">
                      <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">الثمن:</span>
                      <span className="text-lg md:text-3xl font-black text-emerald-500">{post.price && post.price > 0 ? `${post.price} د.م` : 'انظر العرض'}</span>
                   </div>
                   <button className="w-10 h-10 md:w-14 md:h-14 bg-emerald-600/10 text-emerald-500 rounded-xl md:rounded-[22px] flex items-center justify-center text-lg md:text-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-inner">
                      🛍️
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
    </div>
  );
};

export default Home;
