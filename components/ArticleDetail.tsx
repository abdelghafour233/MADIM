
import React, { useEffect } from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  siteName: string;
  adsenseCode?: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, siteName, adsenseCode }) => {
  
  const pubId = adsenseCode?.match(/ca-pub-\d+/)?.[0];
  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(`${article.name} | ${siteName}`);

  useEffect(() => {
    if (pubId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense injection error', e);
      }
    }
  }, [article, pubId]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000';
  };

  const renderContent = (text: string) => {
    const paragraphs = text.split('\n');
    return paragraphs.map((para, i) => {
      if (!para.trim()) return <br key={i} />;
      
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = para.split(urlRegex);
      
      return (
        <React.Fragment key={i}>
          {i === 2 && pubId && (
            <div className="my-12 p-4 bg-slate-50/50 rounded-3xl flex justify-center overflow-hidden min-h-[120px]">
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '100%', textAlign: 'center' }}
                   data-ad-layout="in-article"
                   data-ad-format="fluid"
                   data-ad-client={pubId}
                   data-ad-slot="default"></ins>
            </div>
          )}
          
          <p className="mb-6 leading-[2.1] text-slate-700 text-lg">
            {parts.map((part, index) => {
              if (part.match(urlRegex)) {
                const isTemu = part.includes('temu.to');
                return (
                  <div key={index} className="my-8 flex justify-center">
                    <a 
                      href={part} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${
                        isTemu 
                          ? 'bg-[#ff6000] hover:bg-[#e55600]' 
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      } text-white px-12 py-5 rounded-[24px] font-black text-xl shadow-2xl flex items-center gap-3 transition-transform hover:scale-105`}
                    >
                      <span>{isTemu ? 'تسوق من تيمو الآن' : 'شراء المنتج الآن'}</span>
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
        </React.Fragment>
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto pb-20 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 font-black text-slate-400 hover:text-emerald-600 transition-all">
        ← العودة للرئيسية
      </button>

      <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-white">
        <header className="relative h-[350px] md:h-[450px]">
          <img 
            src={article.image} 
            alt={article.name} 
            onError={handleImageError}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-8 right-8 left-8">
             <span className="bg-emerald-600 text-white font-black px-4 py-2 rounded-xl text-xs mb-4 inline-block shadow-lg shadow-emerald-200">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                {article.name}
              </h1>
          </div>
        </header>

        <div className="px-6 md:px-16 py-8">
          {/* Social Sharing Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-12 border-b border-slate-50 pb-8">
            <span className="text-slate-400 font-bold ml-2 text-sm">شارك المراجعة:</span>
            
            {/* Facebook */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1877f2] text-white p-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-blue-100"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span className="text-xs font-black hidden sm:inline">فيسبوك</span>
            </a>

            {/* WhatsApp */}
            <a 
              href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25d366] text-white p-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-green-100"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span className="text-xs font-black hidden sm:inline">واتساب</span>
            </a>

            {/* Twitter / X */}
            <a 
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white p-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-slate-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span className="text-xs font-black hidden sm:inline">تويتر</span>
            </a>
          </div>

          <div className="prose prose-slate prose-lg max-w-none font-medium text-slate-800">
            {renderContent(article.content)}
          </div>

          {pubId && (
            <div className="mt-16 border-t border-slate-50 pt-12 flex justify-center min-h-[250px]">
               <ins className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-client={pubId}
                    data-ad-slot="default"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
