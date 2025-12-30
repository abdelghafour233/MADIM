
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

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn relative pb-32" dir="rtl">
      {/* شريط القراءة */}
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
           <span className="text-emerald-500">• متوفر الآن في المغرب 🇲🇦</span>
        </div>
      </div>

      {/* الصورة الرئيسية مع عداد المشاهدة الحي */}
      <div className="relative rounded-[50px] overflow-hidden shadow-2xl mb-16 border-4 border-white/5">
        <img src={post.image} className="w-full h-[400px] md:h-[550px] object-cover" alt={post.title} />
        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3">
           <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
           <span className="text-xs font-black text-white">14 شخص يشاهدون هذا العرض حالياً</span>
        </div>
      </div>

      {/* جدول مقارنة الأسعار - ميزة الأفلييت القوية */}
      {post.marketPrice && post.price && (
        <div className="mb-16 overflow-hidden rounded-[40px] border border-white/10 bg-white/5">
          <div className="bg-emerald-600 p-6 text-center">
             <h3 className="text-white font-black text-xl">تحليل السعر وتوفيرك اليوم 💸</h3>
          </div>
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/10">
             <div className="p-8 text-center bg-red-500/5">
                <span className="block text-slate-400 text-xs font-black mb-2 uppercase">ثمن السوق المحلي</span>
                <span className="text-3xl font-black text-slate-500 line-through">{post.marketPrice} د.م</span>
             </div>
             <div className="p-8 text-center bg-emerald-500/10">
                <span className="block text-emerald-500 text-xs font-black mb-2 uppercase">ثمن "همزة عبدو"</span>
                <span className="text-4xl font-black text-emerald-500">{post.price} د.م</span>
             </div>
          </div>
          <div className="p-6 bg-emerald-600/20 text-center">
             <p className="font-black text-emerald-400">✅ وفرت الآن مبلغ {post.marketPrice - post.price} درهم مغربي!</p>
          </div>
        </div>
      )}

      {/* إعلان */}
      <div className="mb-12">
        <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
      </div>

      {/* كود الخصم */}
      {post.couponCode && (
        <div className="mb-16 bg-gradient-to-br from-emerald-600 to-teal-800 p-8 md:p-12 rounded-[50px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 text-center md:text-right">
            <h3 className="text-3xl font-black mb-3">كود خصم حصري! 🎁</h3>
            <p className="opacity-90 font-bold text-lg">استخدم الكود قبل نهاية العرض اليوم</p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="bg-black/20 backdrop-blur-xl px-10 py-5 rounded-3xl border-2 border-dashed border-white/40">
              <span className="font-mono text-4xl font-black tracking-[0.2em]">{post.couponCode}</span>
            </div>
            <button onClick={copyCoupon} className="w-full bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-xl hover:shadow-xl transition-all">
              {copied ? '✅ تم النسخ' : 'نسخ الكود'}
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

      {/* دليل الشراء الخطوة بخطوة */}
      <div className="mb-20 bg-white/5 p-10 rounded-[50px] border border-white/10">
         <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
            <span className="w-10 h-1 bg-orange-500 rounded-full"></span> كيفاش تطلب الهمزة؟ (3 خطوات)
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', t: 'اضغط على زر الشراء', d: 'غادي يحولك الصفحة الرسمية للمنتج.' },
              { n: '2', t: 'ضيف المنتج للسلة', d: 'استعمل كود الخصم باش تستافد من أقل ثمن.' },
              { n: '3', t: 'أدخل معلومات الشحن', d: 'اختار Speedaf باش توصلك السلعة لدارك.' }
            ].map((step, idx) => (
              <div key={idx} className="relative p-6 bg-black/20 rounded-3xl border border-white/5">
                 <span className="absolute -top-5 -right-5 w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">{step.n}</span>
                 <h4 className="font-black text-lg mb-2 mt-4">{step.t}</h4>
                 <p className="text-sm opacity-50 font-bold">{step.d}</p>
              </div>
            ))}
         </div>
      </div>

      {/* زر الشراء الرئيسي */}
      {post.affiliateLink && (
        <div className="px-4 md:px-0 mb-20">
          <a 
            href={post.affiliateLink} target="_blank" rel="noopener noreferrer" 
            className="group relative block w-full text-center py-7 bg-orange-600 text-white rounded-[30px] font-black text-2xl shadow-xl hover:bg-orange-500 hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-4">
               <span className="text-3xl">🛍️</span> اطلب الآن قبل انتهاء الكمية
            </span>
          </a>
          <p className="text-center mt-4 text-xs font-bold opacity-40">دفع آمن وشحن مضمون لجميع المدن المغربية 🇲🇦</p>
        </div>
      )}

      {/* الزر العائم للهواتف */}
      {post.affiliateLink && showFloating && (
        <div className="fixed bottom-0 left-0 right-0 z-[1000] p-4 bg-black/60 backdrop-blur-xl border-t border-white/10 md:hidden animate-slideUp">
           <a 
            href={post.affiliateLink} target="_blank" 
            className="block w-full text-center py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-2"
          >
            <span>🚀</span> اذهب لصفحة الشراء
          </a>
        </div>
      )}
      
      {/* إعلان سفلي */}
      <div className="mt-12">
        <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
      </div>

      {/* تقييمات الزبائن */}
      <div className="mt-20 space-y-8">
         <h3 className="text-2xl font-black">آراء زبائننا في المغرب ⭐</h3>
         <div className="grid gap-6">
            {[
              { n: 'حمزة من طنجة', r: 'الساعة واصلة كيفما في التصاور، التوصيل خدا 12 يوم بالضبط.', s: 5 },
              { n: 'سارة من كازا', r: 'أحسن همزة خديت هاد العام، الثمن خيالي مقارنة مع المحلات.', s: 5 },
              { n: 'ياسين من مراكش', r: 'تيمو صراحة بدا كيتعطل شوية في الشحن ولكن السلعة كاليتي.', s: 4 }
            ].map((rev, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                 <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-sm text-emerald-500">{rev.n}</span>
                    <div className="text-yellow-500 text-[10px]">{'★'.repeat(rev.s)}</div>
                 </div>
                 <p className="text-sm opacity-70 font-bold">{rev.r}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default PostDetail;
