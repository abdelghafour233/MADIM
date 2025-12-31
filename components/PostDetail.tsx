
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

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(post.title + ' \n ' + window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(post.title)}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
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

      <div className="relative rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl mb-12 border-2 border-white/5 bg-slate-900 h-[250px] sm:h-[400px] md:h-[550px] flex items-center justify-center">
        <img src={post.image} className="relative z-10 w-full h-full object-contain md:object-cover" alt={post.title} />
      </div>

      <div className={`text-right leading-[1.8] md:leading-[2.2] font-medium text-sm md:text-2xl space-y-8 mb-16 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="space-y-8">
        {post.affiliateLink && (
          <button 
            onClick={handleBuyClick}
            className="w-full py-5 md:py-8 bg-orange-600 text-white rounded-[25px] md:rounded-[40px] font-black text-lg md:text-2xl shadow-xl hover:bg-orange-500 transition-all flex items-center justify-center gap-3"
          >
            اطلب الآن قبل انتهاء الكمية 🛍️
          </button>
        )}

        {/* Share Section Updated with all requested social platforms */}
        <div className="bg-white/5 p-8 rounded-[35px] border border-white/5">
          <h3 className="text-center font-black text-lg mb-6">هل أعجبك هذا المقال؟ شاركه مع الآخرين 🚀</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
             <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg font-black text-[10px] hover:scale-105 transition-transform">
                <span>💬</span>
                <span>واتساب</span>
             </a>
             <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg font-black text-[10px] hover:scale-105 transition-transform">
                <span>👥</span>
                <span>فايسبوك</span>
             </a>
             <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="bg-[#0088cc] text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg font-black text-[10px] hover:scale-105 transition-transform">
                <span>✈️</span>
                <span>تيليجرام</span>
             </a>
             <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="bg-black text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg font-black text-[10px] border border-white/10 hover:scale-105 transition-transform">
                <span>𝕏</span>
                <span>تويتر</span>
             </a>
             <a href={shareLinks.pinterest} target="_blank" rel="noopener noreferrer" className="bg-[#E60023] text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg font-black text-[10px] hover:scale-105 transition-transform">
                <span>📌</span>
                <span>بنتريست</span>
             </a>
             <button onClick={handleNativeShare} className="bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg font-black text-[10px] hover:scale-105 transition-transform">
                <span>📸</span>
                <span>انستغرام</span>
             </button>
             <button onClick={copyToClipboard} className={`col-span-2 sm:col-span-1 ${copied ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-300'} py-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-black transition-all text-[10px]`}>
               <span>{copied ? '✅' : '🔗'}</span>
               <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
             </button>
          </div>
        </div>
      </div>

      <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
    </div>
  );
};

export default PostDetail;
