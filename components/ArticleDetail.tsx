
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import AdUnit from './AdUnit.tsx';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  siteName: string;
  adsenseCode?: string;
  relatedArticles: Article[];
  onArticleClick: (a: Article) => void;
  darkMode: boolean;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, siteName, adsenseCode, relatedArticles, onArticleClick, darkMode }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const publisherId = adsenseCode?.match(/ca-pub-\d+/)?.[0] || 'ca-pub-5578524966832192';

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.name,
      "image": article.image,
      "author": {
        "@type": "Organization",
        "name": siteName
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": "https://abdouweb.online/logo.png"
        }
      },
      "datePublished": article.date || new Date().toISOString(),
      "description": article.content.substring(0, 160)
    };
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [article, siteName]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const paragraphs = article.content.split('\n').filter(p => p.trim() !== '');
  const shareUrl = window.location.href;
  const shareTitle = article.name;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
      case 'pinterest':
        url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(article.image)}&description=${encodeURIComponent(shareTitle)}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({ title: shareTitle, url: shareUrl }).catch(console.error);
          return;
        }
        break;
    }
    if (url) window.open(url, '_blank', 'width=600,height=400');
  };

  // وظيفة لتحويل الروابط إلى أزرار أو صور أو روابط قابلة للنقر
  const renderParagraph = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    if (parts.length === 1) return text;

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(part);
        const isTemu = part.includes('temu.to') || part.includes('temu.com');

        if (isImage) {
          return (
            <div key={i} className="my-10 animate-fadeIn">
              <div className="relative rounded-[30px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img 
                  src={part} 
                  alt="محتوى توضيحي" 
                  className="w-full h-auto object-cover max-h-[600px]" 
                  loading="lazy"
                />
              </div>
            </div>
          );
        }

        return (
          <div key={i} className="my-6 text-center">
            <a 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl hover:scale-105 active:scale-95 ${isTemu ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              <span>{isTemu ? 'اشتري الآن من تيمو 🛒' : 'زيارة الرابط المباشر 🔗'}</span>
            </a>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">{part}</p>
          </div>
        );
      }
      return part;
    });
  };

  return (
    <article className="max-w-4xl mx-auto pb-24 animate-fadeIn relative text-right" dir="rtl">
      <div className="fixed top-0 right-0 h-2 bg-emerald-500 z-[100] transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
      
      <button onClick={onBack} className="mt-8 mb-10 text-slate-500 font-black flex items-center gap-2 hover:text-emerald-600 transition-all group">
        <span className="group-hover:translate-x-1 transition-transform">→</span> العودة للرئيسية
      </button>

      <div className={`rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
        <header className="relative h-[400px] md:h-[550px]">
          <img src={article.image} alt={article.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div className="absolute bottom-10 right-8 left-8 md:bottom-16 md:right-16 md:left-16">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-wider">{article.category}</span>
                <span className="text-white/70 text-sm font-bold flex items-center gap-2">
                   📅 {article.date || 'اليوم'} 
                </span>
                <span className="text-white/70 text-sm font-bold flex items-center gap-2">
                   👁️ {(article.views || 0).toLocaleString()} مشاهدة
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.3] md:leading-tight">{article.name}</h1>
          </div>
        </header>

        <div className="px-6 md:px-16 py-12 md:py-20">
          <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
             <span className="block text-center text-[10px] font-black text-slate-400 mb-4 tracking-widest">إعلان مخصص</span>
             <AdUnit publisherId={publisherId} />
          </div>

          <div className={`prose prose-xl max-w-none mb-16 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} leading-[1.8]`}>
            {paragraphs.map((p, i) => (
              <React.Fragment key={i}>
                <div className="mb-8">{renderParagraph(p)}</div>
                {i === 2 && (
                  <div className="my-12 py-8 border-y border-slate-100 dark:border-slate-800">
                    <AdUnit publisherId={publisherId} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[35px] border border-slate-100 dark:border-slate-800">
            <h3 className={`text-xl font-black mb-8 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>هل أعجبك المقال؟ شاركه مع أصدقائك 🚀</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => handleShare('facebook')} className="flex items-center gap-3 px-6 py-4 bg-[#1877F2] text-white rounded-2xl font-black transition-all hover:scale-105 shadow-lg shadow-blue-500/20"><span>فيسبوك</span></button>
              <button onClick={() => handleShare('twitter')} className="flex items-center gap-3 px-6 py-4 bg-[#000000] text-white rounded-2xl font-black transition-all hover:scale-105 shadow-lg shadow-black/20"><span>تويتر</span></button>
              <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white rounded-2xl font-black transition-all hover:scale-105 shadow-lg shadow-green-500/20"><span>واتساب</span></button>
              <button onClick={() => handleShare('pinterest')} className="flex items-center gap-3 px-6 py-4 bg-[#E60023] text-white rounded-2xl font-black transition-all hover:scale-105 shadow-lg shadow-red-500/20"><span>بنتريست</span></button>
              <button onClick={() => handleShare('native')} className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"><span>مشاركة عبر...</span></button>
            </div>
          </div>

          <footer className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">✍️</div>
                   <div>
                      <h4 className={`font-black text-xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>فريق التحرير</h4>
                      <p className="text-slate-500 font-bold">متخصصون في مراجعة أحدث التقنيات المغربية.</p>
                   </div>
                </div>
             </div>
          </footer>
        </div>
      </div>

      <section className="mt-20">
        <h3 className={`text-3xl font-black mb-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>مقالات قد تهمك أيضاً ✨</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedArticles.map(art => (
            <div key={art.id} onClick={() => onArticleClick(art)} className={`cursor-pointer group rounded-3xl overflow-hidden border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500' : 'bg-white border-slate-100 hover:shadow-xl'}`}>
               <img src={art.image} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" alt="" />
               <div className="p-6">
                  <span className="text-emerald-500 text-xs font-black mb-2 block">{art.category}</span>
                  <h4 className={`font-black line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{art.name}</h4>
               </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export default ArticleDetail;
