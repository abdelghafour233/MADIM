
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
        className="relative group cursor-pointer overflow-hidden rounded-[40px] md:rounded-[60px] bg-white/5 border border-white/10 shadow-3xl"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[500px] md:min-h-[600px]">
           {/* Image Container Fixed */}
           <div className="relative h-[300px] sm:h-[400px] lg:h-auto overflow-hidden bg-[#111] flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110" 
                style={{ backgroundImage: `url(${trendingPost.image})` }}
              ></div>
              <img 
                src={trendingPost.image} 
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-contain md:object-cover group-hover:scale-105 transition-transform duration-1000 shadow-2xl" 
                alt={trendingPost.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:hidden from-black/90 via-black/20 to-transparent z-20"></div>
              <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-black shadow-xl animate-pulse z-30">
                ينتهي في {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
              </div>
           </div>

           <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-black/40 lg:bg-transparent relative z-30">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-emerald-600/20 text-emerald-500 px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest border border-emerald-500/20">همزة اليوم 🔥</span>
              </div>
              <h1 className="text-2xl md:text-5xl font-black mb-6 leading-tight group-hover:text-emerald-500 transition-colors">{trendingPost.title}</h1>
              <p className="text-slate-400 text-base md:text-lg font-medium mb-10 line-clamp-2">{trendingPost.excerpt}</p>
              
              <div className="flex items-center gap-4 md:gap-6">
                 <div className="bg-white text-black p-4 md:p-5 rounded-2xl md:rounded-3xl font-black shadow-2xl flex flex-col items-center min-w-[100px] md:min-w-[130px]">
                    <span className="text-[9px] opacity-40 mb-1">الثمن الآن</span>
                    <span className="text-xl md:text-3xl">{trendingPost.price} د.م</span>
                 </div>
                 <button className="flex-1 bg-emerald-600 text-white py-5 md:py-7 rounded-[25px] md:rounded-[35px] font-black text-lg md:text-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3">
                     اطلب الآن
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
          <div key={idx} className="glass-card p-5 md:p-6 text-center group">
             <div className={`w-12 h-12 md:w-14 md:h-14 ${item.c}/10 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
               {item.i}
             </div>
             <h4 className="font-black text-xs md:text-lg mb-1">{item.t}</h4>
             <p className="text-[9px] md:text-xs opacity-40 font-bold">{item.d}</p>
          </div>
        ))}
      </div>

      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

      {/* Grid Updates */}
      <div className="space-y-10">
        <div className="flex items-center justify-between">
           <h2 className="text-xl md:text-3xl font-black flex items-center gap-3">
              <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
              أحدث الهميزات
           </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {otherPosts.map(post => (
            <div 
              key={post.id} 
              className="group cursor-pointer glass-card p-3 md:p-5 overflow-hidden"
              onClick={() => onPostClick(post)}
            >
              <div className="relative aspect-square rounded-[20px] md:rounded-[30px] overflow-hidden bg-slate-900 mb-4 md:mb-6 flex items-center justify-center">
                 <div 
                    className="absolute inset-0 bg-cover bg-center blur-lg opacity-20" 
                    style={{ backgroundImage: `url(${post.image})` }}
                 ></div>
                 <img 
                    src={post.image} 
                    loading="lazy" 
                    referrerPolicy="no-referrer"
                    className="relative z-10 w-full h-full object-contain md:object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={post.title} 
                 />
                 <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-emerald-600/90 backdrop-blur-md text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-[7px] md:text-[9px] font-black shadow-lg z-20">
                    وفر {post.marketPrice ? post.marketPrice - (post.price || 0) : 0} د.م
                 </div>
              </div>
              <div className="px-1 md:px-2">
                <h3 className="text-xs md:text-xl font-black mb-2 md:mb-4 line-clamp-2 min-h-[2rem] md:min-h-[3.5rem] group-hover:text-emerald-500 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between mt-2 md:mt-4">
                   <div className="flex flex-col">
                      <span className="text-[7px] md:text-[9px] font-black text-slate-500">الثمن:</span>
                      <span className="text-sm md:text-2xl font-black text-emerald-500">{post.price} د.م</span>
                   </div>
                   <button className="w-8 h-8 md:w-12 md:h-12 bg-white/5 rounded-lg md:rounded-2xl flex items-center justify-center text-xs md:text-lg hover:bg-emerald-600 hover:text-white transition-all shadow-inner">
                      ➕
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
