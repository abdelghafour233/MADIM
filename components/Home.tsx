
import React, { useState, useEffect } from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';
import RewardsCenter from './RewardsCenter.tsx';
import { INITIAL_REWARDS } from '../constants.tsx';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  darkMode?: boolean;
  settings: Settings;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, settings }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="font-bold text-emerald-500 opacity-60">جاري تحميل أقوى الهميزات...</p>
      </div>
    );
  }

  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const otherPosts = posts.filter(p => p.id !== trendingPost?.id);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });

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

  return (
    <div className="space-y-12 md:space-y-24 pb-20 animate-fadeIn" dir="rtl">
      {/* Hero Section - Ultra Modern */}
      <section 
        className="relative group cursor-pointer overflow-hidden rounded-[40px] md:rounded-[60px] glass transition-all duration-500 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="flex flex-col lg:flex-row items-stretch">
           <div className="relative w-full lg:w-1/2 min-h-[400px] flex items-center justify-center p-8 bg-gradient-to-br from-white/5 to-transparent">
              <div className="absolute top-8 right-8 z-20 flex gap-2">
                 <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">همزة اليوم</span>
                 <span className="bg-emerald-600/20 backdrop-blur-md text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">عروض حصرية</span>
              </div>
              
              <img 
                src={trendingPost.image} 
                className="relative z-10 w-[85%] h-[85%] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000" 
                alt={trendingPost.title} 
              />
              
              <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-center">
                 <div className="flex gap-4">
                    {[
                      { v: timeLeft.h, l: 'ساعة' },
                      { v: timeLeft.m, l: 'دقيقة' },
                      { v: timeLeft.s, l: 'ثانية' }
                    ].map((t, idx) => (
                      <div key={idx} className="bg-black/60 backdrop-blur-xl border border-white/10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-lg font-black leading-none">{t.v.toString().padStart(2, '0')}</span>
                        <span className="text-[8px] opacity-40 font-bold">{t.l}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
              <h1 className="text-3xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight text-white">{trendingPost.title}</h1>
              <p className="text-slate-400 text-lg mb-10 line-clamp-2 leading-relaxed">{trendingPost.excerpt}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <div className="w-full sm:w-auto p-1 rounded-3xl bg-gradient-to-r from-emerald-500/50 to-orange-500/50">
                    <div className="bg-[#050505] px-8 py-5 rounded-[22px] text-center">
                       <span className="text-[10px] text-emerald-500 font-black block mb-1">السعر الحصري</span>
                       <span className="text-3xl font-black">{trendingPost.price ? `${trendingPost.price} د.م` : 'أفضل عرض'}</span>
                    </div>
                 </div>
                 <button className="w-full sm:flex-1 bg-white text-black py-6 rounded-3xl font-black text-xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95">
                     اكتشف الهمزة الآن 🛒
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {[
          { i: '🚚', t: 'توصيل سريع', d: 'لكل مدن المغرب' },
          { i: '💰', t: 'الدفع عند الاستلام', d: 'تقة ومصداقية' },
          { i: '🔥', t: 'هميزات يومية', d: 'تحديث مستمر' },
          { i: '📞', t: 'دعم 24/7', d: 'عبر الواتساب' }
        ].map((item, i) => (
          <div key={i} className="glass p-6 rounded-[30px] flex flex-col items-center text-center gap-2 group hover:bg-white/5 transition-all">
            <span className="text-3xl group-hover:scale-125 transition-transform duration-500">{item.i}</span>
            <h4 className="font-black text-sm">{item.t}</h4>
            <p className="text-[10px] opacity-40 font-bold">{item.d}</p>
          </div>
        ))}
      </div>

      <RewardsCenter rewards={INITIAL_REWARDS} settings={settings} darkMode={true} />
      
      <div className="space-y-12">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl md:text-4xl font-black flex items-center gap-4">
            <span className="w-2 h-10 bg-emerald-600 rounded-full"></span>
            أحدث الهميزات
          </h2>
          <div className="flex gap-2">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center opacity-30">→</div>
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-emerald-500 border-emerald-500/20">←</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 px-4">
          {otherPosts.map(post => (
            <div 
              key={post.id} 
              className="group cursor-pointer glass p-4 flex flex-col h-full card-hover rounded-[35px]" 
              onClick={() => onPostClick(post)}
            >
              <div className="relative aspect-square rounded-[25px] overflow-hidden bg-[#0d0d0e] mb-5 flex items-center justify-center border border-white/5">
                 <img src={post.image} className="w-[85%] h-[85%] object-contain p-2 group-hover:scale-110 transition-transform duration-700" alt="" />
                 <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black text-emerald-500 border border-white/10 uppercase tracking-widest">
                   {post.category}
                 </div>
              </div>
              <h3 className="text-sm font-black mb-6 line-clamp-2 leading-tight group-hover:text-emerald-500 transition-colors h-10">{post.title}</h3>
              <div className="mt-auto flex justify-between items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] opacity-40 font-black line-through">{post.marketPrice} د.م</span>
                    <span className="text-xl font-black text-white">{post.price ? `${post.price} د.م` : 'عرض'}</span>
                  </div>
                  <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg active:scale-90">
                    <span className="text-lg">🛒</span>
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
