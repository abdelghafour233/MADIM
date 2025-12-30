
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
  const [isSpinning, setIsSpinning] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 10 });
  const [stockLevel, setStockLevel] = useState(89);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
      // خفض المخزون تدريجياً لزيادة الإثارة
      if (Math.random() > 0.85) setStockLevel(prev => Math.max(prev - 1, 12));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      if (directLink) window.open(directLink, '_blank');
      setIsSpinning(false);
      alert('مبروك! لقد ربحت "قسيمة شراء مجانية". سيتم فتح صفحة الجائزة الآن.');
    }, 2000);
  };

  if (!trendingPost) return <div className="text-center py-20 font-black opacity-50">لا توجد عروض حالياً..</div>;

  return (
    <div className="space-y-16 animate-fadeIn" dir="rtl">
      {/* Hero Section with Countdown & Stock Bar */}
      <section className="relative group cursor-pointer" onClick={() => onPostClick(trendingPost)}>
        <div className="relative h-[450px] md:h-[650px] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl border border-white/5">
          <img src={trendingPost.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt={trendingPost.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute top-8 right-8 flex flex-col gap-3">
            <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              ينتهي في: {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
            </div>
            <div className="bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20 min-w-[180px]">
              <div className="flex justify-between mb-2">
                 <span className="text-[10px] font-black uppercase">تم بيع {stockLevel}%</span>
                 <span className="text-[10px] font-black uppercase text-red-400">مخزون محدود</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-orange-400 to-red-600 transition-all duration-1000" style={{ width: `${stockLevel}%` }}></div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 right-8 left-8 md:bottom-16 md:right-16 md:left-16 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-600 px-5 py-2 rounded-xl text-xs font-black uppercase shadow-xl tracking-widest">همزة اليوم الحصرية 🔥</span>
              {trendingPost.marketPrice && (
                 <span className="bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black">وفر {trendingPost.marketPrice - (trendingPost.price || 0)} د.م</span>
              )}
            </div>
            <h1 className="text-3xl md:text-6xl font-black mb-6 leading-tight group-hover:text-emerald-400 transition-colors">{trendingPost.title}</h1>
            <div className="flex items-center gap-6">
              <p className="text-lg opacity-80 line-clamp-2 max-w-2xl font-bold hidden md:block">{trendingPost.excerpt}</p>
              <div className="shrink-0 bg-white text-black p-4 rounded-3xl font-black text-center shadow-2xl scale-110">
                <span className="text-xs block opacity-50 uppercase">السعر الآن</span>
                <span className="text-2xl">{trendingPost.price} د.م</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { t: 'شحن سريع بالمغرب', d: '24-48 ساعة', i: '🚚' },
          { t: 'أقل سعر مضمون', d: 'تيمو أصلي', i: '💎' },
          { t: 'دفع عند الاستلام', d: 'آمن 100%', i: '🤝' },
          { t: 'دعم فني 24/7', i: '📞', d: 'عبر الواتساب' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-[30px] text-center hover:bg-white/10 transition-all">
            <span className="text-3xl block mb-2">{item.i}</span>
            <h4 className="font-black text-xs md:text-sm">{item.t}</h4>
            <p className="text-[10px] opacity-40 font-bold">{item.d}</p>
          </div>
        ))}
      </div>

      {/* عجلة الحظ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          onClick={handleSpin}
          className="bg-gradient-to-br from-indigo-900 to-purple-900 p-10 rounded-[50px] border border-white/10 relative overflow-hidden group cursor-pointer flex flex-col items-center justify-center text-center"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <h3 className="text-3xl font-black text-white mb-6 relative z-10">عجلة الحظ اليومية 🎰</h3>
          <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-white/20 relative flex items-center justify-center transition-all duration-[2000ms] ease-out ${isSpinning ? 'rotate-[1080deg]' : ''}`}>
             <div className="w-2 h-10 bg-red-500 absolute -top-5 left-1/2 -translate-x-1/2 z-20 rounded-full shadow-lg"></div>
             <div className="w-full h-full rounded-full bg-[conic-gradient(#10b981_0%_25%,#f59e0b_25%_50%,#3b82f6_50%_75%,#ef4444_75%_100%)]"></div>
             <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white drop-shadow-lg">SPIN</div>
          </div>
          <div className="mt-8 py-4 px-10 bg-white text-indigo-900 rounded-2xl font-black text-xl shadow-xl animate-pulse">جرب حظك الآن 🎲</div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 p-10 rounded-[50px] flex flex-col justify-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-3xl text-white">🔥</div>
            <div>
              <h3 className="text-2xl font-black text-orange-600">أقوى كوبونات اليوم</h3>
              <p className="text-sm font-bold opacity-60">تم التحقق منها بنجاح</p>
            </div>
          </div>
          <div className="space-y-4">
            {['SUPER631', 'TEMU2025'].map(code => (
              <div 
                key={code} 
                className="group flex items-center justify-between bg-black/40 p-6 rounded-2xl border-2 border-dashed border-orange-500/40 font-mono font-black text-orange-500 cursor-pointer hover:bg-orange-600 hover:text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(code);
                  alert('تم نسخ الكود: ' + code);
                  if (directLink) window.open(directLink, '_blank');
                }}
              >
                <span className="text-2xl">{code}</span>
                <span className="text-xs px-3 py-1 bg-white/10 rounded-lg group-hover:bg-black/20">نسخ 📋</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* قائمة العروض */}
      <div className="space-y-10">
        <h2 className="text-3xl font-black flex items-center gap-4">
          <span className="w-3 h-10 bg-emerald-500 rounded-full"></span> أقوى الهميزات في المغرب
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {otherPosts.map(post => (
            <div key={post.id} className="group cursor-pointer bg-white/5 rounded-[45px] overflow-hidden border border-white/5 hover:border-emerald-500/30 hover:shadow-2xl transition-all duration-500" onClick={() => onPostClick(post)}>
              <div className="relative h-64 overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                {post.marketPrice && post.price && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black">
                    -{Math.round((1 - post.price / post.marketPrice) * 100)}%
                  </div>
                )}
                <div className="absolute bottom-6 right-6 bg-emerald-600 px-4 py-2 rounded-xl font-black text-white shadow-xl">
                  {post.price} د.م
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black mb-4 group-hover:text-emerald-500 transition-colors line-clamp-2">{post.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex text-yellow-500 text-xs">{'★'.repeat(5)}</div>
                  <span className="text-xs opacity-40 font-bold">👁️ {post.views}</span>
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
