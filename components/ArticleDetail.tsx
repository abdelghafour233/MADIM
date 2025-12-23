
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

  const renderContent = (text: string) => {
    const paragraphs = text.split('\n');
    return paragraphs.map((para, i) => {
      if (!para.trim()) return <br key={i} />;
      
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = para.split(urlRegex);
      
      return (
        <React.Fragment key={i}>
          {/* إعلان تلقائي بعد الفقرة الثانية */}
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
          <img src={article.image} alt={article.name} className="w-full h-full object-cover" />
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

        <div className="px-6 md:px-16 py-12">
          <div className="prose prose-slate prose-lg max-w-none font-medium text-slate-800">
            {renderContent(article.content)}
          </div>

          {/* إعلان نهاية المقال */}
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
