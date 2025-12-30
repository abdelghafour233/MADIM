
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

  const handleQuickShare = (e: React.MouseEvent, post: Article) => {
    e.stopPropagation();
    const text = `شوف هاد الهمزة الواعرة: ${post.title}`;
    const url = window.location.origin + '?id=' + post.id;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
  };

  if (!trendingPost) return <div className="text-center py-20 font-black opacity-50">لا توجد عروض حالياً..</div>;

  return (
    <div className="space-y-16 animate-fadeIn" dir="rtl">
      {/* Hero Section */}
      <section className="relative group cursor-pointer" onClick={() => onPostClick(trendingPost)}>
        <div className="relative h-[450px] md:h-[650px] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl border border-white/5">
          <img src={trendingPost.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt={trendingPost.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute top-8 right-8 flex flex-col gap-3">
            <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              ينتهي في: {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
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
              <div className="shrink-0 bg-white text-black p-4 rounded-3xl font-black text-center shadow-2xl scale-110">
                <span className="text-xs block opacity-50 uppercase">السعر الآن</span>
                <span className="text-2xl">{trendingPost.price} د.م</span>
              </div>
              <button 
                onClick={(e) => handleQuickShare(e, trendingPost)}
                className="bg-emerald-600 p-4 rounded-2xl text-white font-black hover:scale-110 transition-transform"
                title="مشاركة سريعة"
              >
                <span>📤 مشاركة</span>
              </button>
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
                <button 
                  onClick={(e) => handleQuickShare(e, post)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-emerald-600"
                >
                  📤
                </button>
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
