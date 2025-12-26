
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

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title || post.name,
      "image": [post.image],
      "datePublished": post.date,
      "author": [{
          "@type": "Person",
          "name": post.author,
          "url": window.location.origin
        }]
    };
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [post]);

  const shareUrl = window.location.href;
  const shareTitle = post.title || post.name || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // وظيفة للتحقق مما إذا كان النص رابطاً
  const isUrl = (text: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(text.trim());
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn relative pb-10 md:pb-20">
      <div className="fixed top-0 left-0 h-1 md:h-1.5 bg-emerald-500 z-[100] transition-all duration-100" style={{ width: `${progress}%` }}></div>
      
      <button onClick={onBack} className={`mt-4 md:mt-8 mb-8 md:mb-12 flex items-center gap-2 font-bold hover:text-emerald-500 transition-all group ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <span className="group-hover:translate-x-1 transition-transform text-xl md:text-2xl">→</span> العودة للرئيسية
      </button>

      <div className="mb-8 md:mb-16 px-2">
        <span className="text-emerald-500 font-black text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6 block text-center">{post.category}</span>
        <h1 className={`text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-10 leading-[1.3] md:leading-tight text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>{post.title || post.name}</h1>
        <div className={`flex flex-wrap justify-center items-center gap-4 md:gap-8 text-[8px] md:text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
           <div className="flex items-center gap-2">👤 <span>{post.author}</span></div>
           <div className="flex items-center gap-2">📅 <span>{post.date}</span></div>
           <div className="flex items-center gap-2">👁️ <span>{post.views} قراءة</span></div>
        </div>
      </div>

      <div className={`rounded-[25px] md:rounded-[60px] overflow-hidden mb-8 md:mb-12 shadow-xl md:shadow-2xl border-4 md:border-8 ${darkMode ? 'border-white/5' : 'border-white shadow-slate-200'}`}>
        <img src={post.image} className="w-full h-auto" alt={post.title || post.name} loading="lazy" />
      </div>

      <AdUnit publisherId={settings.adsenseCode} slotId="top_ad" />

      <div className={`max-w-none text-right leading-[2] md:leading-[2.2] font-medium px-2 md:px-4 text-lg md:text-2xl mb-8 md:mb-12 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {post.content.split('\n').map((para, i) => {
          const trimmedPara = para.trim();
          if (!trimmedPara) return null;

          // إذا كان الباراجراف عبارة عن رابط فقط، قم بتحويله لزر جذاب
          if (isUrl(trimmedPara)) {
            return (
              <div key={i} className="my-10 md:my-16">
                <a 
                  href={trimmedPara} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative flex items-center justify-center gap-4 py-6 md:py-8 px-10 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-[25px] md:rounded-[35px] font-black text-xl md:text-3xl shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10">استفد من العرض الآن</span>
                  <span className="relative z-10 text-3xl md:text-4xl animate-bounce">🎁</span>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                </a>
                <p className="text-center mt-4 text-[10px] md:text-xs font-bold opacity-40 uppercase tracking-widest">اضغط أعلاه للتوجه للموقع الرسمي</p>
              </div>
            );
          }

          return <p key={i} className="mb-8 md:mb-12 last:mb-0">{para}</p>;
        })}
      </div>

      <AdUnit publisherId={settings.adsenseCode} slotId="bottom_ad" />

      <div className={`mt-10 md:mt-20 p-6 md:p-16 rounded-[30px] md:rounded-[60px] text-center border-t-2 md:border-t-4 border-emerald-600 shadow-xl md:shadow-2xl transition-all ${darkMode ? 'glass bg-white/5' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
        <h3 className={`text-xl md:text-3xl font-black mb-6 md:mb-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>شارك المقال 🚀</h3>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
           {['facebook', 'twitter', 'whatsapp', 'copy'].map((platform) => {
             const baseClass = "flex flex-col items-center justify-center p-4 md:p-6 rounded-[20px] md:rounded-[35px] hover:scale-105 transition-all shadow-md group";
             if (platform === 'facebook') return (
               <button key={platform} onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)} className={`${baseClass} bg-[#1877F2] text-white`}>
                 <span className="text-xl md:text-3xl mb-1 md:mb-2 font-bold">f</span>
                 <span className="text-[8px] md:text-[10px] font-black uppercase">فيسبوك</span>
               </button>
             );
             if (platform === 'twitter') return (
               <button key={platform} onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${shareUrl}`)} className={`${baseClass} bg-black text-white border border-white/10`}>
                 <span className="text-xl md:text-3xl mb-1 md:mb-2">𝕏</span>
                 <span className="text-[8px] md:text-[10px] font-black uppercase">تويتر</span>
               </button>
             );
             if (platform === 'whatsapp') return (
               <button key={platform} onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`)} className={`${baseClass} bg-[#25D366] text-white`}>
                 <span className="text-xl md:text-3xl mb-1 md:mb-2">WA</span>
                 <span className="text-[8px] md:text-[10px] font-black uppercase">واتساب</span>
               </button>
             );
             if (platform === 'copy') return (
               <button key={platform} onClick={handleCopy} className={`${baseClass} ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`}>
                 <span className="text-xl md:text-3xl mb-1 md:mb-2">{copied ? '✅' : '🔗'}</span>
                 <span className="text-[8px] md:text-[10px] font-black uppercase">{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
               </button>
             );
             return null;
           })}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
