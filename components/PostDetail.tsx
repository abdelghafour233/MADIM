
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
  const [copied, setCopied] = useState(false);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrolled / height) * 100);
      setShowFloating(scrolled > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyCoupon = () => {
    if (post.couponCode) {
      navigator.clipboard.writeText(post.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBuyClick = () => {
    if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
    if (post.affiliateLink) window.open(post.affiliateLink, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn relative pb-32" dir="rtl">
      <div className="fixed top-0 left-0 h-2 bg-emerald-500 z-[200] transition-all duration-300 shadow-[0_0_15px_#10b981]" style={{ width: `${progress}%` }}></div>
      
      <button onClick={onBack} className={`mt-8 mb-12 flex items-center gap-2 font-black transition-all ${darkMode ? 'text-slate-500' : 'text-slate-400'} hover:text-emerald-500 group`}>
        <span className="group-hover:translate-x-1 transition-transform">→</span> العودة للرئيسية
      </button>

      <div className="mb-12">
        <span className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] font-black mb-6 inline-block uppercase tracking-widest shadow-lg">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-6xl font-black mb-8 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 opacity-50 font-bold text-sm">
           <span>📅 {post.date}</span>
           <span>•</span>
           <span>👁️ {post.views} مشاهدة</span>
        </div>
      </div>

      <div className="relative rounded-[50px] overflow-hidden shadow-2xl mb-16 border-4 border-white/5">
        <img src={post.image} className="w-full h-[400px] md:h-[550px] object-cover" alt={post.title} />
      </div>

      {/* Ad Top */}
      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

      {post.marketPrice && post.price && (
        <div className="mb-16 overflow-hidden rounded-[40px] border border-white/10 bg-white/5">
          <div className="bg-emerald-600 p-6 text-center">
             <h3 className="text-white font-black text-xl">تحليل السعر وتوفيرك اليوم 💸</h3>
          </div>
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/10">
             <div className="p-8 text-center bg-red-500/5">
                <span className="block text-slate-400 text-xs font-black mb-2 uppercase">ثمن السوق</span>
                <span className="text-3xl font-black text-slate-500 line-through">{post.marketPrice} د.م</span>
             </div>
             <div className="p-8 text-center bg-emerald-500/10">
                <span className="block text-emerald-500 text-xs font-black mb-2 uppercase">ثمن العرض</span>
                <span className="text-4xl font-black text-emerald-500">{post.price} د.م</span>
             </div>
          </div>
        </div>
      )}

      {/* محتوى المقال مع إعلان في المنتصف */}
      <div className={`text-right leading-[2.2] font-medium text-lg md:text-2xl space-y-10 mb-20 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {post.content.split('\n').slice(0, Math.ceil(post.content.split('\n').length / 2)).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        
        <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

        {post.content.split('\n').slice(Math.ceil(post.content.split('\n').length / 2)).map((para, i) => (
          <p key={i + 100}>{para}</p>
        ))}
      </div>

      {/* زر الشراء الرئيسي */}
      {post.affiliateLink && (
        <div className="px-4 md:px-0 mb-20">
          <button 
            onClick={handleBuyClick}
            className="group relative block w-full text-center py-7 bg-orange-600 text-white rounded-[30px] font-black text-2xl shadow-xl hover:bg-orange-500 hover:-translate-y-1 transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
               <span className="text-3xl">🛍️</span> اطلب الآن قبل انتهاء الكمية
            </span>
          </button>
        </div>
      )}

      {/* Ad Bottom */}
      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
    </div>
  );
};

export default PostDetail;
