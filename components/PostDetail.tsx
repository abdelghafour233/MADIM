
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
    <div className="max-w-4xl mx-auto animate-fadeIn relative pb-32" dir="rtl">
      {/* شريط القراءة العلوي */}
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

      {/* Adsterra Native Banner (Before Content) */}
      <div className="mb-12">
        <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
      </div>

      {/* كود الخصم - Floating Style */}
      {post.couponCode && (
        <div className="mb-16 bg-gradient-to-br from-emerald-600 to-teal-800 p-8 md:p-12 rounded-[50px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_30px_60px_rgba(16,185,129,0.3)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32 group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10 text-center md:text-right">
            <h3 className="text-3xl font-black mb-3">كود خصم تيمو حصري! 🎁</h3>
            <p className="opacity-90 font-bold text-lg">استعمل هذا الكود للحصول على شحن مجاني للمغرب</p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="bg-black/20 backdrop-blur-xl px-10 py-5 rounded-3xl border-2 border-dashed border-white/40">
              <span className="font-mono text-4xl font-black tracking-[0.2em]">{post.couponCode}</span>
            </div>
            <button 
              onClick={copyCoupon}
              className="w-full bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-xl hover:shadow-xl hover:scale-105 transition-all active:scale-95 shadow-lg"
            >
              {copied ? '✅ تم النسخ' : 'نسخ الكود فوراً'}
            </button>
          </div>
        </div>
      )}

      {/* محتوى المقال */}
      <div className={`text-right leading-[2.2] font-medium text-lg md:text-2xl space-y-10 mb-20 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* زر الأفلييت الثابت (Sticky Conversion) */}
      {post.affiliateLink && (
        <div className="sticky bottom-8 z-[150] px-4 md:px-0">
          <a 
            href={post.affiliateLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-full text-center py-7 bg-orange-600 text-white rounded-[30px] font-black text-2xl shadow-[0_20px_50px_rgba(249,115,22,0.4)] hover:bg-orange-500 hover:-translate-y-2 transition-all active:scale-95 flex items-center justify-center gap-4 border-2 border-orange-400/20"
          >
            <span className="text-3xl">🛍️</span> اذهب إلى صفحة العرض الرسمية
          </a>
        </div>
      )}

      {/* مشاركة المقال */}
      <div className="mt-20 p-10 bg-white/5 rounded-[40px] border border-white/10 text-center">
         <h4 className="text-xl font-black mb-8">شارك هذا العرض مع أصدقائك ليستفيد الجميع 🚀</h4>
         <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`)} className="px-10 py-4 bg-[#25D366] rounded-2xl font-black text-white shadow-lg">واتساب</button>
            <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} className="px-10 py-4 bg-[#1877F2] rounded-2xl font-black text-white shadow-lg">فيسبوك</button>
         </div>
      </div>
    </div>
  );
};

export default PostDetail;
