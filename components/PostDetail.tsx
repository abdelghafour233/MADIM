
import React, { useEffect, useState } from 'react';
import { Article } from '../types';

interface PostDetailProps {
  post: Article;
  onBack: () => void;
  darkMode?: boolean;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, darkMode = true }) => {
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

  const shareUrl = window.location.href;
  const shareTitle = post.title || post.name || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn relative">
      <div className="fixed top-0 left-0 h-1.5 bg-emerald-500 z-[100] transition-all duration-100" style={{ width: `${progress}%` }}></div>
      
      <button onClick={onBack} className={`mb-12 flex items-center gap-2 font-bold hover:text-emerald-500 transition-all group ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <span className="group-hover:translate-x-1 transition-transform">→</span> العودة للرئيسية
      </button>

      <div className="mb-16">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-6 block text-center">{post.category}</span>
        <h1 className={`text-4xl md:text-7xl font-black mb-10 leading-tight text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>{post.title || post.name}</h1>
        <div className={`flex justify-center items-center gap-8 text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
           <div className="flex items-center gap-2">👤 <span>{post.author}</span></div>
           <div className="flex items-center gap-2">📅 <span>{post.date}</span></div>
           <div className="flex items-center gap-2">👁️ <span>{post.views} قراءة</span></div>
        </div>
      </div>

      <div className={`rounded-[60px] overflow-hidden mb-20 shadow-2xl border-8 ${darkMode ? 'border-white/5' : 'border-white shadow-slate-200'}`}>
        <img src={post.image} className="w-full h-auto" alt="" />
      </div>

      <div className={`max-w-none text-right leading-[2.2] font-medium px-4 text-2xl mb-20 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {post.content.split('\n').map((para, i) => (
          <p key={i} className="mb-12 last:mb-0">{para}</p>
        ))}
      </div>

      {/* قسم المشاركة الجديد */}
      <div className={`p-10 md:p-16 rounded-[60px] text-center border-t-4 border-emerald-600 shadow-2xl transition-all ${darkMode ? 'glass bg-white/5' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
        <h3 className={`text-3xl font-black mb-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>شارك المقال مع العالم 🚀</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {/* فيسبوك */}
           <button 
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)}
            className="flex flex-col items-center justify-center p-6 bg-[#1877F2] text-white rounded-[35px] hover:scale-105 transition-all shadow-lg group"
           >
             <span className="text-3xl mb-2 group-hover:rotate-12 transition-transform">FB</span>
             <span className="text-[10px] font-black uppercase">فيسبوك</span>
           </button>

           {/* تويتر (X) */}
           <button 
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${shareUrl}`)}
            className="flex flex-col items-center justify-center p-6 bg-black text-white rounded-[35px] hover:scale-105 transition-all shadow-lg group border border-white/10"
           >
             <span className="text-3xl mb-2 group-hover:rotate-12 transition-transform">𝕏</span>
             <span className="text-[10px] font-black uppercase">تويتر</span>
           </button>

           {/* واتساب */}
           <button 
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`)}
            className="flex flex-col items-center justify-center p-6 bg-[#25D366] text-white rounded-[35px] hover:scale-105 transition-all shadow-lg group"
           >
             <span className="text-3xl mb-2 group-hover:rotate-12 transition-transform">WA</span>
             <span className="text-[10px] font-black uppercase">واتساب</span>
           </button>

           {/* بنتريست */}
           <button 
            onClick={() => window.open(`https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${post.image}&description=${encodeURIComponent(shareTitle)}`)}
            className="flex flex-col items-center justify-center p-6 bg-[#E60023] text-white rounded-[35px] hover:scale-105 transition-all shadow-lg group"
           >
             <span className="text-3xl mb-2 group-hover:rotate-12 transition-transform">PI</span>
             <span className="text-[10px] font-black uppercase">بنتريست</span>
           </button>

           {/* تيك توك (رابط الملف الشخصي أو نسخ الرابط للمشاركة) */}
           <button 
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-6 bg-[#000000] text-white rounded-[35px] hover:scale-105 transition-all shadow-lg group relative overflow-hidden"
           >
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400/20 via-transparent to-magenta-400/20 opacity-50"></div>
             <span className="text-3xl mb-2 group-hover:rotate-12 transition-transform relative z-10">TT</span>
             <span className="text-[10px] font-black uppercase relative z-10">تيك توك</span>
           </button>

           {/* زر نسخ الرابط */}
           <button 
            onClick={handleCopy}
            className={`flex flex-col items-center justify-center p-6 rounded-[35px] hover:scale-105 transition-all shadow-lg group ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`}
           >
             <span className="text-3xl mb-2 group-hover:rotate-12 transition-transform">{copied ? '✅' : '🔗'}</span>
             <span className="text-[10px] font-black uppercase">{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
