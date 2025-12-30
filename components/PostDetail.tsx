
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

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrolled / height) * 100);
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

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn relative pb-20" dir="rtl">
      <div className="fixed top-0 left-0 h-1.5 bg-emerald-500 z-[100] transition-all" style={{ width: `${progress}%` }}></div>
      
      <button onClick={onBack} className={`mt-8 mb-12 flex items-center gap-2 font-black transition-all ${darkMode ? 'text-slate-500' : 'text-slate-400'} hover:text-emerald-500`}>
        ← العودة للرئيسية
      </button>

      <div className="mb-12 text-center">
        <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black mb-6 inline-block uppercase tracking-widest shadow-lg">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-6xl font-black mb-8 leading-tight">{post.title}</h1>
      </div>

      <div className="relative group mb-16">
        <img src={post.image} className="w-full h-[400px] object-cover rounded-[50px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]" alt={post.title} />
        <div className="absolute inset-0 rounded-[50px] ring-1 ring-inset ring-white/10"></div>
      </div>

      {/* منطقة الكوبون الذكية */}
      {post.couponCode && (
        <div className="mb-16 bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl animate-bounce-slow">
          <div>
            <h3 className="text-2xl font-black mb-2">كود خصم حصري! 🎁</h3>
            <p className="opacity-90 font-bold">استخدم هذا الكود عند الدفع للحصول على تخفيض إضافي</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 p-2 rounded-2xl border border-white/30">
            <span className="px-6 py-3 font-mono text-3xl font-black tracking-widest">{post.couponCode}</span>
            <button 
              onClick={copyCoupon}
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-black hover:bg-slate-100 transition-all active:scale-95"
            >
              {copied ? '✅ تم النسخ' : 'نسخ الكود'}
            </button>
          </div>
        </div>
      )}

      <div className="text-right leading-[2.4] font-medium text-lg md:text-2xl space-y-10 mb-16">
        {post.content.split('\n').map((para, i) => (
          <p key={i} className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{para}</p>
        ))}
      </div>

      {/* أزرار الأفلييت الملونة */}
      {post.affiliateLink && (
        <div className="sticky bottom-8 z-[90] px-4">
          <a 
            href={post.affiliateLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-full text-center py-7 bg-emerald-600 text-white rounded-3xl font-black text-2xl shadow-2xl hover:bg-emerald-500 hover:-translate-y-2 transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            <span>🛍️</span> انتقل للعرض مباشرة الآن
          </a>
        </div>
      )}

      <div className="mt-20">
        <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
      </div>
    </div>
  );
};

export default PostDetail;
