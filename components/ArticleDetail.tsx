
import React, { useEffect, useState } from 'react';
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

  const shareUrl = window.location.href;
  
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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.name,
          text: article.content.substring(0, 100) + '...',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    }
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
          <p className={`mb-8 leading-[2.1] text-xl ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {parts.map((part, index) => {
              if (part.match(urlRegex)) {
                const isTemu = part.includes('temu.to');
                return (
                  <div key={index} className="my-12 flex justify-center">
                    <a 
                      href={part} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`${isTemu ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'} text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-105 flex items-center gap-4 group`}
                    >
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
          </p>
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

  const ShareButtons = () => (
    <div className="flex flex-wrap items-center gap-3">
      {typeof navigator !== 'undefined' && navigator.share && (
        <button onClick={handleNativeShare} className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-110 transition-all shadow-md active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      )}
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-[#1877F2] text-white rounded-2xl hover:scale-110 transition-all shadow-md active:scale-95">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.name)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-black text-white rounded-2xl hover:scale-110 transition-all shadow-md active:scale-95">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(article.name)}%20${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-[#25D366] text-white rounded-2xl hover:scale-110 transition-all shadow-md active:scale-95">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <button onClick={handleCopyLink} className={`flex items-center gap-2 p-4 rounded-2xl transition-all shadow-md ${copyStatus ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
        {copyStatus ? <span className="text-xs font-black">تم النسخ!</span> : <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>}
      </button>
    </div>
  );

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
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-slate-50/10 pb-12">
             <div className="flex items-center gap-6">
               <button onClick={handleLike} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all ${liked ? 'bg-red-500 text-white shadow-lg' : (darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')}`}>
                 <svg className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                 {liked ? 'شكراً لك!' : 'تفاعل مع المقال'} ({article.likes || 0})
               </button>
               <span className="text-slate-400 font-bold text-sm">{article.views || 200} قراءة</span>
             </div>
             <ShareButtons />
          </div>
          <div className="prose prose-slate prose-xl max-w-none">{renderContent(article.content)}</div>
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
