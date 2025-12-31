
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

  if (!posts || posts.length === 0) return null;

  const siteUrl = window.location.origin;
  const shareText = `اكتشف أقوى الهميزات والعروض الحصرية في المغرب على موقع abdouweb! 🔥🛍️ \nرابط الموقع: ${siteUrl}`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`
  };

  return (
    <div className="pt-24 md:pt-36 space-y-12 md:space-y-24 animate-slide-in">
      {/* Top Scrolling Offers Bar */}
      <div className="fixed top-0 left-0 right-0 z-[1100] bg-gradient-to-r from-orange-600 to-amber-600 py-1.5 overflow-hidden shadow-lg border-b border-white/10 h-8 md:h-10 flex items-center">
        <div className="animate-marquee font-black text-[10px] md:text-sm text-white uppercase tracking-wider flex gap-12 items-center">
          <span>🔥 هميزات تيمو حصرية بخصم يصل لـ 90%</span>
          <span>🚚 توصيل مجاني لجميع المدن المغربية عند تجاوز 300 د.م</span>
          <span>✨ كوبونات أمازون مجانية متوفرة الآن في صندوق الهدايا</span>
          <span>🔥 هميزات تيمو حصرية بخصم يصل لـ 90%</span>
          <span>🚚 توصيل مجاني لجميع المدن المغربية</span>
        </div>
      </div>

      {/* Hero Highlight */}
      <section 
        className="relative premium-glass rounded-[40px] md:rounded-[60px] overflow-hidden cursor-pointer group shadow-2xl transition-all hover:shadow-emerald-500/10 border-white/5 mt-4"
        onClick={() => onPostClick(trendingPost)}
      >
        <div className="flex flex-col lg:flex-row items-stretch">
           <div className="w-full lg:w-1/2 p-8 md:p-16 space-y-6 md:space-y-8 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex flex-wrap gap-2">
                 <span className="bg-orange-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">عرض محدود 🔥</span>
                 <span className="bg-emerald-600/10 text-emerald-500 text-[9px] font-black px-4 py-1.5 rounded-full uppercase border border-emerald-500/20">همزة ممتازة</span>
              </div>
              <h1 className="text-3xl md:text-7xl font-black leading-[1.1] tracking-tight">{trendingPost.title}</h1>
              
              {/* Promotion Message for the new Link */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                 <p className="text-emerald-400 text-xs md:text-lg font-bold leading-relaxed">
                   ⭐️ Tap the exclusive deal link <span className="underline break-all">https://temu.to/k/u6zpr84k5n5</span> to score top-quality items at ultra-low prices. 🛍️
                 </p>
              </div>

              <p className="text-slate-400 text-sm md:text-xl line-clamp-2 leading-relaxed opacity-70">{trendingPost.excerpt}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4">
                 <div className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 md:px-12 md:py-6 rounded-3xl font-black text-xl md:text-2xl shadow-xl shadow-emerald-500/20 group-hover:bg-emerald-500 transition-all active:scale-95 text-center">
                    اكتشف الهمزة 🛒
                 </div>
                 {trendingPost.marketPrice && (
                    <div className="flex flex-col items-center sm:items-start">
                       <span className="text-slate-500 line-through font-bold text-xs md:text-sm">ثمن السوق: {trendingPost.marketPrice} د.م</span>
                       <span className="text-emerald-500 font-black text-base md:text-lg">أفضل ثمن مضمون ✅</span>
                    </div>
                 )}
              </div>
           </div>
           
           <div className="w-full lg:w-1/2 p-6 md:p-8 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent relative min-h-[280px] md:min-h-[450px] order-1 lg:order-2">
              <div className="absolute inset-0 opacity-5 flex items-center justify-center overflow-hidden pointer-events-none">
                <span className="text-[120px] md:text-[250px] font-black opacity-10 select-none">HOT</span>
              </div>
              <img 
                src={trendingPost.image} 
                className="w-full h-full max-h-[220px] md:max-h-[450px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-1000 relative z-10" 
                alt={trendingPost.title} 
                loading="eager"
              />
           </div>
        </div>
      </section>

      {/* Rewards Center */}
      <RewardsCenter rewards={INITIAL_REWARDS} settings={settings} darkMode={true} />

      {/* Featured Grid */}
      <div className="space-y-8 md:space-y-12 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-5xl font-black flex items-center gap-3">
            <span className="w-2 md:w-2.5 h-8 md:h-12 bg-emerald-600 rounded-full"></span>
            هميزات لا تُفوت
          </h2>
          <span className="text-[8px] md:text-[10px] font-black opacity-30 uppercase tracking-[0.2em] hidden sm:block">Update: Live Now</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-8">
          {otherPosts.map(post => (
            <div 
              key={post.id} 
              className="premium-glass p-3 md:p-6 flex flex-col cursor-pointer rounded-[30px] md:rounded-[35px] transition-all hover:bg-white/5 hover:border-emerald-500/30 group border-white/5" 
              onClick={() => onPostClick(post)}
            >
              <div className="relative aspect-square rounded-[20px] md:rounded-[25px] overflow-hidden bg-[#0d0d0e] mb-4 flex items-center justify-center border border-white/5">
                 <img src={post.image} className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                 <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-emerald-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-lg">
                   {post.category}
                 </div>
              </div>
              
              <h3 className="text-xs md:text-lg font-black mb-4 line-clamp-2 leading-tight group-hover:text-emerald-500 transition-colors h-8 md:h-14">{post.title}</h3>
              
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                 <div className="flex flex-col">
                   {post.marketPrice && <span className="text-[8px] md:text-[9px] opacity-30 line-through font-bold">{post.marketPrice} د.م</span>}
                   <span className="text-base md:text-2xl font-black text-white">{post.price || 'همزة'} <small className="text-[9px] md:text-[10px] opacity-40">د.م</small></span>
                 </div>
                 <div className="w-9 h-9 md:w-13 md:h-13 bg-white text-black rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-md active:scale-90">
                   <span className="text-lg md:text-xl">🛒</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Site Share Section */}
      <section className="premium-glass rounded-[40px] md:rounded-[50px] p-8 md:p-16 border-emerald-500/10 relative overflow-hidden text-center space-y-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
           <h2 className="text-3xl md:text-6xl font-black tracking-tighter">أعجبك الموقع؟ شاركه مع أحبابك 🚀</h2>
           <p className="text-slate-400 text-sm md:text-xl font-medium opacity-60 leading-relaxed">ساعدنا على نشر أقوى العروض في المغرب وشارك الهمزة مع أصدقائك وعائلتك بضغطة واحدة!</p>
           
           <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-grow sm:flex-none flex items-center justify-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-[25px] font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-emerald-900/20">
                 <span className="text-2xl">💬</span> واتساب
              </a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex-grow sm:flex-none flex items-center justify-center gap-3 bg-[#1877F2] text-white px-10 py-5 rounded-[25px] font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-blue-900/20">
                 <span className="text-2xl">👥</span> فايسبوك
              </a>
              <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex-grow sm:flex-none flex items-center justify-center gap-3 bg-[#0088cc] text-white px-10 py-5 rounded-[25px] font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-sky-900/20">
                 <span className="text-2xl">✈️</span> تيليجرام
              </a>
           </div>
        </div>
      </section>

      <div className="py-8">
        <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
      </div>
    </div>
  );
};

export default Home;
