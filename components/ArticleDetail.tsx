
import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../types';
import AdUnit from './AdUnit.tsx';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  siteName: string;
  adsenseCode?: string;
  relatedArticles: Article[];
  onArticleClick: (a: Article) => void;
  onLike: () => void;
  onAddComment: (c: Comment) => void;
  darkMode: boolean;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, siteName, adsenseCode, relatedArticles, onArticleClick, onLike, onAddComment, darkMode }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}?article=${article.id}`;
  const publisherId = adsenseCode?.match(/ca-pub-\d+/)?.[0] || 'ca-pub-5578524966832192';

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    if (!liked) {
      onLike();
      setLiked(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentText) return;
    onAddComment({
      id: Date.now().toString(),
      userName: commentName,
      text: commentText,
      date: new Date().toLocaleDateString('ar-MA')
    });
    setCommentName('');
    setCommentText('');
  };

  const renderContent = (text: string) => {
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    return paragraphs.map((para, i) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = para.split(urlRegex);
      return (
        <React.Fragment key={i}>
          <div className={`mb-8 leading-[2.1] text-xl ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {parts.map((part, index) => {
              if (part.match(urlRegex)) {
                const isTemu = part.includes('temu.to');
                return (
                  <div key={index} className="my-12 flex justify-center">
                    <a href={part} target="_blank" rel="noopener noreferrer" className={`${isTemu ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'} text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-105 flex items-center gap-4 group`}>
                      <span>{isTemu ? 'اشتري الآن بخصم حصري من Temu 🛒' : 'المصدر / المزيد من المعلومات 🔗'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-[-5px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                );
              }
              return part;
            })}
          </div>
          {(i === 1 || (paragraphs.length > 5 && i === 4)) && (
            <div className="my-12 border-y border-slate-100 py-4">
              <span className="block text-center text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-widest">إعلان</span>
              <AdUnit publisherId={publisherId} />
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto pb-20 animate-fadeIn relative">
      <div className="fixed top-0 left-0 h-1.5 bg-emerald-500 z-[100] transition-all duration-100" style={{ width: `${scrollProgress}%` }}></div>
      <button onClick={onBack} className={`mt-8 mb-10 flex items-center gap-3 font-black transition-all group ${darkMode ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`}>
        <span className={`p-2 rounded-xl group-hover:bg-emerald-500/10 transition-colors ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>←</span>
        العودة للمقالات
      </button>

      <div className={`rounded-[60px] shadow-2xl overflow-hidden border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
        <header className="relative h-[450px] md:h-[600px]">
          <img src={article.image} alt={article.name} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-slate-900' : 'from-white'} via-transparent to-transparent`}></div>
          <div className="absolute bottom-12 right-8 left-8 md:right-16 md:left-16">
              <span className="bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-lg mb-4 inline-block shadow-lg">{article.category}</span>
              <h1 className={`text-4xl md:text-6xl font-black leading-[1.2] tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{article.name}</h1>
          </div>
        </header>

        <div className="px-8 md:px-20 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-slate-100 pb-12">
             <div className="flex items-center gap-6">
               <button onClick={handleLike} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all ${liked ? 'bg-red-500 text-white shadow-lg' : (darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')}`}>
                 <svg className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                 {liked ? 'شكراً لك!' : 'تفاعل مع المقال'} ({article.likes || 0})
               </button>
               <span className="text-slate-400 font-bold text-sm">{article.views || 200} قراءة</span>
             </div>
             <div className="flex flex-wrap items-center gap-3">
               <button onClick={handleCopyLink} className={`flex items-center gap-2 p-4 rounded-2xl transition-all shadow-md ${copyStatus ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                 {copyStatus ? <span className="text-xs font-black">تم النسخ!</span> : <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>}
               </button>
             </div>
          </div>

          <div className="prose prose-slate prose-xl max-w-none">{renderContent(article.content)}</div>

          {relatedArticles.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-100">
              <h3 className={`text-3xl font-black mb-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>اقرأ المزيد في {article.category} 📚</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedArticles.map(rel => (
                  <div key={rel.id} onClick={() => onArticleClick(rel)} className={`cursor-pointer group rounded-3xl overflow-hidden border transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 hover:shadow-xl'}`}>
                    <div className="h-40 overflow-hidden">
                      <img src={rel.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                    </div>
                    <div className="p-6">
                      <h4 className={`font-black text-lg mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{rel.name}</h4>
                      <span className="text-emerald-500 font-bold text-sm">استمر في القراءة ←</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-24 border-t border-slate-100 pt-16">
            <h3 className={`text-3xl font-black mb-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>نقاشات القراء ({article.comments?.length || 0})</h3>
            <form onSubmit={handleCommentSubmit} className="mb-16 space-y-6">
              <input className={`w-full p-5 rounded-2xl outline-none font-bold ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-transparent'} border-2 focus:border-emerald-500 transition-all`} placeholder="اسمك المستعار" value={commentName} onChange={e => setCommentName(e.target.value)} required />
              <textarea className={`w-full p-5 rounded-3xl outline-none font-medium h-32 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-transparent'} border-2 focus:border-emerald-500 transition-all`} placeholder="ما رأيك في هذا الموضوع؟" value={commentText} onChange={e => setCommentText(e.target.value)} required />
              <button type="submit" className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg">نشر التعليق</button>
            </form>
            <div className="space-y-8">
              {article.comments?.map(c => (
                <div key={c.id} className={`p-8 rounded-[32px] ${darkMode ? 'bg-slate-800/50 border border-slate-800' : 'bg-white border border-slate-100 shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-emerald-500 flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div>{c.userName}</span>
                    <span className="text-xs text-slate-400 font-bold">{c.date}</span>
                  </div>
                  <p className={`text-lg font-medium leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
