
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
        if (isImage) {
          return (
            <div key={i} className="my-10">
              <img src={part} alt="محتوى توضيحي" className="w-full h-auto rounded-[30px] shadow-lg border border-slate-100 dark:border-slate-800" loading="lazy" />
            </div>
          );
        }
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-black underline decoration-2 underline-offset-4">
            {part}
          </a>
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
        <header className="relative h-[400px] md:h-[500px]">
          <img src={article.image} alt={article.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-10 right-8 left-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-wider">{article.category}</span>
                <span className="text-white/80 text-sm font-bold">📅 {article.date || 'فبراير 2025'}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{article.name}</h1>
          </div>
        </header>

        <div className="px-6 md:px-16 py-12">
          <EzoicPlaceholder id={101} />

          <div className={`prose prose-xl max-w-none mb-16 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} leading-[2]`}>
            {paragraphs.map((p, i) => (
              <React.Fragment key={i}>
                <div className="mb-6">{renderParagraph(p)}</div>
                {i === 2 && <AdUnit publisherId={publisherId} />}
              </React.Fragment>
            ))}
          </div>

          <EzoicPlaceholder id={102} />

          <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[35px] border border-slate-100 dark:border-slate-800 text-center">
            <h3 className={`text-xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>شارك هذا المقال 🚀</h3>
            <div className="flex justify-center gap-4">
              <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(article.name + ' ' + window.location.href)}`)} className="px-10 py-4 bg-[#25D366] text-white rounded-2xl font-black">واتساب</button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} className="px-10 py-4 bg-[#1877F2] text-white rounded-2xl font-black">فيسبوك</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
