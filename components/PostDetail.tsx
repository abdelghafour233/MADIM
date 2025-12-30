
import React, { useEffect, useState } from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';

interface PostDetailProps {
  post: Article;
  onBack: () => void;
  darkMode?: boolean;
  settings: Settings;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, darkMode = true, settings }) => {
  const [progress, setProgress] = useState(0);
  const fallbackImage = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop';

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrolled / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuyClick = () => {
    if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
    if (post.affiliateLink) window.open(post.affiliateLink, '_blank');
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn relative pb-32" dir="rtl">
      <div className="fixed top-0 left-0 h-1.5 bg-emerald-500 z-[200] transition-all duration-300 shadow-[0_0_15px_#10b981]" style={{ width: `${progress}%` }}></div>
      
      <button onClick={onBack} className={`mt-6 mb-8 flex items-center gap-2 font-black transition-all ${darkMode ? 'text-slate-500' : 'text-slate-400'} hover:text-emerald-500 group text-sm md:text-base`}>
        <span className="group-hover:translate-x-1 transition-transform">→</span> العودة للرئيسية
      </button>

      <div className="mb-10">
        <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-[9px] font-black mb-5 inline-block uppercase tracking-widest shadow-lg">
          {post.category}
        </span>
        <h1 className="text-2xl md:text-5xl font-black mb-6 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 opacity-50 font-bold text-[10px] md:text-sm">
           <span>📅 {post.date}</span>
           <span>•</span>
           <span>👁️ {post.views} مشاهدة</span>
        </div>
      </div>

      {/* Main Post Image */}
      <div className="relative rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl mb-12 border-2 border-white/5 bg-slate-900 h-[250px] sm:h-[400px] md:h-[550px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110" 
          style={{ backgroundImage: `url("${post.image}")` }}
        ></div>
        <img 
          src={post.image} 
          onError={handleImgError}
          className="relative z-10 w-full h-full object-contain md:object-cover" 
          alt={post.title} 
        />
      </div>

      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

      {post.marketPrice && post.price && post.price > 0 && (
        <div className="mb-12 overflow-hidden rounded-[30px] md:rounded-[40px] border border-white/10 bg-white/5">
          <div className="bg-emerald-600 p-4 md:p-6 text-center">
             <h3 className="text-white font-black text-sm md:text-xl">تحليل السعر وتوفيرك اليوم 💸</h3>
          </div>
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/10">
             <div className="p-6 md:p-8 text-center bg-red-500/5">
                <span className="block text-slate-400 text-[10px] font-black mb-1 uppercase">ثمن السوق</span>
                <span className="text-xl md:text-3xl font-black text-slate-500 line-through">{post.marketPrice} د.م</span>
             </div>
             <div className="p-6 md:p-8 text-center bg-emerald-500/10">
                <span className="block text-emerald-500 text-[10px] font-black mb-1 uppercase">ثمن العرض</span>
                <span className="text-2xl md:text-4xl font-black text-emerald-500">{post.price} د.م</span>
             </div>
          </div>
        </div>
      )}

      <div className={`text-right leading-[1.8] md:leading-[2.2] font-medium text-sm md:text-2xl space-y-8 mb-16 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {post.affiliateLink && (
        <div className="mb-16">
          <button 
            onClick={handleBuyClick}
            className="w-full py-5 md:py-8 bg-orange-600 text-white rounded-[25px] md:rounded-[40px] font-black text-lg md:text-2xl shadow-xl hover:bg-orange-500 transition-all flex items-center justify-center gap-3"
          >
            اطلب الآن قبل انتهاء الكمية 🛍️
          </button>
        </div>
      )}

      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
    </div>
  );
};

export default PostDetail;
