
import React, { useState, useEffect } from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';
import EzoicPlaceholder from './EzoicPlaceholder.tsx';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  siteName: string;
  settings: Settings;
  relatedArticles: Article[];
  onArticleClick: (a: Article) => void;
  darkMode: boolean;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, siteName, settings, relatedArticles, onArticleClick, darkMode }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const publisherId = settings.adsenseCode?.match(/ca-pub-\d+/)?.[0] || 'ca-pub-5578524966832192';

  // التحقق مما إذا كان Ezoic مفعلاً من الإعدادات
  const isEzoicEnabled = !!settings.ezoicCode || true; // نفترض التفعيل إذا وجد الكود في index.html

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.name,
      "image": article.image,
      "author": { "@type": "Organization", "name": siteName },
      "publisher": { "@type": "Organization", "name": siteName },
      "datePublished": article.date || new Date().toISOString()
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

  const renderParagraph = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    if (parts.length === 1) return text;

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(part);
        const isTemu = part.includes('temu.to') || part.includes('temu.com');
        const finalUrl = isTemu ? (settings.affiliateTemuLink || part) : part;

        if (isImage) {
          return (
            <div key={i} className="my-10 animate-fadeIn">
              <div className="relative rounded-[30px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img src={part} alt="محتوى توضيحي" className="w-full h-auto object-cover max-h-[600px]" loading="lazy" />
              </div>
            </div>
          );
        }

        return (
          <div key={i} className="my-6 text-center">
            {isTemu && (
              <p className="text-[11px] text-orange-500 font-bold mb-3">⚠️ إفصاح: قد نحصل على عمولة بسيطة عند الشراء لدعم استمرار الموقع.</p>
            )}
            <a 
              href={finalUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl hover:scale-105 active:scale-95 ${isTemu ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              <span>{isTemu ? 'تسوق الآن من تيمو 🛒' : 'زيارة الرابط المباشر 🔗'}</span>
            </a>
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
        <span>→</span> العودة للرئيسية
      </button>

      <div className={`rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
        <header className="relative h-[400px] md:h-[550px]">
          <img src={article.image} alt={article.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div className="absolute bottom-10 right-8 left-8 md:bottom-16 md:right-16 md:left-16">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-wider">{article.category}</span>
                <span className="text-white/70 text-sm font-bold">📅 {article.date || 'اليوم'}</span>
                <span className="text-white/70 text-sm font-bold">👁️ {(article.views || 0).toLocaleString()} مشاهدة</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.3] md:leading-tight">{article.name}</h1>
          </div>
        </header>

        <div className="px-6 md:px-16 py-12 md:py-20">
          {/* وحدة إيزويك العلوية */}
          {isEzoicEnabled && <EzoicPlaceholder id={101} />}

          {/* إعلان جوجل أدسنس الاحتياطي */}
          {!isEzoicEnabled && (
            <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
               <span className="block text-center text-[10px] font-black text-slate-400 mb-4 tracking-widest">إعلان ممول</span>
               <AdUnit publisherId={publisherId} />
            </div>
          )}

          <div className={`prose prose-xl max-w-none mb-16 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} leading-[1.8]`}>
            {paragraphs.map((p, i) => (
              <React.Fragment key={i}>
                <div className="mb-8">{renderParagraph(p)}</div>
                {/* إعلان في منتصف المقال */}
                {i === 3 && isEzoicEnabled && <EzoicPlaceholder id={102} />}
                {i === 3 && !isEzoicEnabled && settings.adsenseCode && (
                  <div className="my-12 py-8 border-y border-slate-100 dark:border-slate-800">
                    <AdUnit publisherId={publisherId} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* وحدة إيزويك السفلية */}
          {isEzoicEnabled && <EzoicPlaceholder id={103} />}

          {/* كود تابولا / أوتبراين أسفل المقال */}
          {settings.taboolaCode && (
            <div className="my-12" dangerouslySetInnerHTML={{ __html: settings.taboolaCode }} />
          )}

          <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[35px] border border-slate-100 dark:border-slate-800 text-center">
            <h3 className={`text-xl font-black mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>هل أعجبك المحتوى؟ شاركه مع أصدقائك 🚀</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(article.name + ' ' + window.location.href)}`)} className="px-8 py-4 bg-[#25D366] text-white rounded-2xl font-black shadow-lg">واتساب</button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} className="px-8 py-4 bg-[#1877F2] text-white rounded-2xl font-black shadow-lg">فيسبوك</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
