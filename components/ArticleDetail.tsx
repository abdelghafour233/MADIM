
import React, { useEffect } from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  siteName: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, siteName }) => {
  
  // SEO: Schema.org JSON-LD injection for Google Rich Results
  useEffect(() => {
    const scriptId = 'article-schema-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.name,
      "image": [article.image],
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "author": [{
        "@type": "Person",
        "name": siteName,
        "url": window.location.origin
      }],
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=200"
        }
      },
      "description": article.content.substring(0, 200).replace(/\n/g, ' '),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": article.rating,
        "reviewCount": "87"
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.text = JSON.stringify(schema);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [article, siteName]);

  const renderContent = (text: string) => {
    return text.split('\n').map((para, i) => {
      if (!para.trim()) return <br key={i} />;
      
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = para.split(urlRegex);
      
      return (
        <p key={i} className="mb-6 leading-[2] text-slate-700">
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              const isTemu = part.includes('temu.to');
              return (
                <div key={index} className="my-8 flex justify-center" aria-label="رابط خارجي للشراء">
                  <a 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${
                      isTemu 
                        ? 'bg-[#ff6000] hover:bg-[#e55600] ring-4 ring-orange-100' 
                        : 'bg-emerald-600 hover:bg-emerald-700 ring-4 ring-emerald-100'
                    } text-white px-10 py-5 rounded-2xl font-black text-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-3`}
                  >
                    <span>{isTemu ? 'تسوق من تيمو الآن' : 'انتقل للرابط'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto pb-20 animate-fadeIn" itemscope itemtype="https://schema.org/Article">
      <button 
        onClick={onBack} 
        className="mb-8 flex items-center gap-2 font-black text-slate-400 hover:text-emerald-600 transition-all group"
        aria-label="العودة للصفحة الرئيسية"
      >
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-emerald-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        العودة للمقالات
      </button>

      <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-white">
        <header className="relative h-[400px] md:h-[500px]">
          <img 
            src={article.image} 
            alt={article.name} 
            className="w-full h-full object-cover" 
            itemprop="image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-10 right-10 left-10">
             <span className="bg-emerald-600 text-white font-black px-6 py-2 rounded-2xl text-xs shadow-xl shadow-emerald-500/20 mb-6 inline-block">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] drop-shadow-sm" itemprop="headline">
                {article.name}
              </h1>
          </div>
        </header>

        <div className="px-6 md:px-16 py-12">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">وقت القراءة</p>
                <p className="font-black text-slate-700">5 دقائق</p>
              </div>
            </div>

            <div className="flex items-center gap-4" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">تقييم الخبراء</p>
                <p className="font-black text-slate-700">
                  <span itemprop="ratingValue">{article.rating}</span>/5
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose prose-slate prose-lg max-w-none font-medium text-slate-800" itemprop="articleBody">
            {renderContent(article.content)}
          </div>

          <section className="mt-20 p-8 md:p-12 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-black mb-2 text-emerald-400">لا تفوت فرصة التوفير!</h3>
              <p className="text-slate-400 font-medium max-w-sm">اشترك في قائمتنا البريدية لتصلك أحدث كوبونات الخصم والمراجعات الحصرية فور صدورها.</p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500 flex-grow md:w-64"
                aria-label="البريد الإلكتروني للاشتراك"
                required
              />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-500/20">
                انضمام
              </button>
            </form>
          </section>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
