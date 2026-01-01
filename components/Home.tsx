
import React from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';
import RewardsCenter from './RewardsCenter.tsx';
import { INITIAL_REWARDS } from '../constants.tsx';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
  settings: Settings;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick, settings }) => {
  const trendingPost = posts.find(p => p.isTrending) || posts[0];
  const otherPosts = posts.filter(p => p.id !== trendingPost?.id);

  const temuLink = "https://temu.to/k/u6zpr84k5n5";

  return (
    <div className="pt-24 md:pt-36 space-y-12 md:space-y-24 animate-slide-in">
      {/* Top Scrolling Offers Bar */}
      <div className="fixed top-0 left-0 right-0 z-[1100] bg-gradient-to-r from-orange-600 to-amber-600 py-1.5 overflow-hidden shadow-lg border-b border-white/10 h-8 md:h-10 flex items-center">
        <div className="animate-marquee font-black text-[10px] md:text-sm text-white uppercase tracking-wider flex gap-12 items-center">
          <span>🎁 سجل في تيمو عبر رابطنا واحصل على 1000 درهم كوبونات فوراً</span>
          <span>🚚 الدفع عند الاستلام متاح الآن لجميع الطلبات في المغرب</span>
          <span>🔥 هميزات تيمو حصرية بخصم يصل لـ 90% للمنخرطين الجدد</span>
          <span>✨ كوبونات أمازون مجانية متوفرة الآن في صندوق الهدايا</span>
        </div>
      </div>

      {/* Hero Highlight - Emphasizing Temu Partnership */}
      <section 
        className="relative premium-glass rounded-[40px] md:rounded-[60px] overflow-hidden cursor-pointer group shadow-2xl transition-all hover:shadow-orange-500/10 border-white/5 mt-4"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="flex flex-col lg:flex-row items-stretch">
           <div className="w-full lg:w-1/2 p-8 md:p-16 space-y-6 md:space-y-8 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex flex-wrap gap-2">
                 <span className="bg-orange-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">شريك تيمو الرسمي 🇲🇦</span>
                 <span className="bg-white/10 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase border border-white/20">عرض ترحيبي للمغاربة</span>
              </div>
              <h1 className="text-3xl md:text-7xl font-black leading-[1.1] tracking-tight text-white">
                وفر حتى <span className="text-orange-500">90%</span> على مشترياتك من تيمو
              </h1>
              
              <div className="bg-orange-500/10 p-6 rounded-[30px] border border-orange-500/20">
                 <p className="text-orange-400 text-sm md:text-xl font-bold leading-relaxed">
                   استخدم الرابط الحصري بالأسفل لتفعيل حزمة كوبونات بقيمة <span className="text-white underline font-black">1000 درهم</span> وهدايا مجانية عند أول طلب! 🛍️
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4">
                 <a 
                   href={temuLink}
                   target="_blank"
                   rel="noopener noreferrer"
                   onClick={(e) => e.stopPropagation()}
                   className="w-full sm:w-auto bg-orange-600 text-white px-8 py-5 md:px-12 md:py-6 rounded-3xl font-black text-xl md:text-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-500 transition-all active:scale-95 text-center"
                 >
                    سجل واحصل على الهدية 🎁
                 </a>
              </div>
           </div>
           
           <div className="w-full lg:w-1/2 p-6 md:p-8 flex items-center justify-center bg-gradient-to-br from-orange-500/5 to-transparent relative min-h-[280px] md:min-h-[450px] order-1 lg:order-2">
              <div className="absolute inset-0 opacity-5 flex items-center justify-center overflow-hidden pointer-events-none">
                <span className="text-[120px] md:text-[250px] font-black opacity-10 select-none">TEMU</span>
              </div>
              <img 
                src={trendingPost.image} 
                className="w-full h-full max-h-[220px] md:max-h-[450px] object-contain drop-shadow-[0_20px_40px_rgba(255,165,0,0.3)] group-hover:scale-105 transition-transform duration-1000 relative z-10" 
                alt={trendingPost.title} 
              />
           </div>
        </div>
      </section>

      {/* Temu Trust Badges */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
         <div className="premium-glass p-6 rounded-[30px] text-center space-y-2 border-white/5">
            <span className="text-3xl block">🇲🇦</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">توصيل لكل المدن</span>
         </div>
         <div className="premium-glass p-6 rounded-[30px] text-center space-y-2 border-white/5">
            <span className="text-3xl block">💵</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">دفع عند الاستلام</span>
         </div>
         <div className="premium-glass p-6 rounded-[30px] text-center space-y-2 border-white/5">
            <span className="text-3xl block">🔒</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">حماية المشتري</span>
         </div>
         <div className="premium-glass p-6 rounded-[30px] text-center space-y-2 border-white/5">
            <span className="text-3xl block">🏷️</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">أرخص الأسعار</span>
         </div>
      </section>

      {/* Rewards Center */}
      <RewardsCenter rewards={INITIAL_REWARDS} settings={settings} darkMode={true} />

      {/* Featured Grid */}
      <div className="space-y-8 md:space-y-12 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-5xl font-black flex items-center gap-3">
            <span className="w-2 md:w-2.5 h-8 md:h-12 bg-orange-600 rounded-full"></span>
            أحدث الهميزات
          </h2>
          <span className="text-[8px] md:text-[10px] font-black opacity-30 uppercase tracking-[0.2em] hidden sm:block">Update: Live Now</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-8">
          {otherPosts.map(post => (
            <div 
              key={post.id} 
              className="premium-glass p-3 md:p-6 flex flex-col cursor-pointer rounded-[30px] md:rounded-[35px] transition-all hover:bg-white/5 hover:border-orange-500/30 group border-white/5" 
              onClick={() => onPostClick(post)}
            >
              <div className="relative aspect-square rounded-[20px] md:rounded-[25px] overflow-hidden bg-[#0d0d0e] mb-4 flex items-center justify-center border border-white/5">
                 <img src={post.image} className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                 <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-orange-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-lg">
                   {post.category}
                 </div>
              </div>
              
              <h3 className="text-xs md:text-lg font-black mb-4 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors h-8 md:h-14">{post.title}</h3>
              
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                 <div className="flex flex-col">
                   {post.marketPrice && <span className="text-[8px] md:text-[9px] opacity-30 line-through font-bold">{post.marketPrice} د.م</span>}
                   <span className="text-base md:text-2xl font-black text-white">{post.price || 'همزة'} <small className="text-[9px] md:text-[10px] opacity-40">د.م</small></span>
                 </div>
                 <div className="w-9 h-9 md:w-13 md:h-13 bg-white text-black rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all shadow-md active:scale-90">
                   <span className="text-lg md:text-xl">🔥</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Mobile Offer Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[1200] md:hidden p-4">
         <a 
           href={temuLink}
           target="_blank"
           rel="noopener noreferrer"
           className="w-full bg-orange-600 text-white p-4 rounded-2xl font-black flex items-center justify-between shadow-2xl border border-white/20 animate-bounce"
         >
            <div className="flex items-center gap-3">
               <span className="text-2xl">🎁</span>
               <div className="flex flex-col">
                  <span className="text-xs">هدية تيمو تنتظرك!</span>
                  <span className="text-[10px] opacity-80">سجل الآن واحصل على 1000 درهم</span>
               </div>
            </div>
            <span className="bg-white text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">تسجل الآن</span>
         </a>
      </div>

      <div className="py-8">
        <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
      </div>
    </div>
  );
};

export default Home;
