
import React, { useEffect, useState } from 'react';
import { Article, Comment } from '../types';

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

  const pubId = adsenseCode?.match(/ca-pub-\d+/)?.[0];
  const shareUrl = window.location.href;

  useEffect(() => {
    // Reading Progress
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    // Inject JSON-LD Schema for SEO
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": article.name,
      "image": article.image,
      "description": article.content.substring(0, 160),
      "brand": { "@type": "Brand", "name": "Temu" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": article.rating,
        "reviewCount": (article.likes || 5) + 2
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(script);
    };
  }, [article]);

  const handleLike = () => {
    if (!liked) {
      onLike();
      setLiked(true);
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
    alert('تم إضافة تعليقك بنجاح!');
  };

  const renderContent = (text: string) => {
    return text.split('\n').map((para, i) => {
      if (!para.trim()) return <br key={i} />;
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = para.split(urlRegex);
      
      return (
        <p key={i} className={`mb-6 leading-[2.1] text-xl ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              return (
                <div key={index} className="my-10 flex justify-center">
                  <a href={part} target="_blank" rel="noopener noreferrer" className="bg-[#ff6000] hover:bg-[#e55600] text-white px-14 py-6 rounded-[32px] font-black text-2xl shadow-2xl transition-all hover:scale-105 flex items-center gap-4">
                    <span>تسوق الآن 🛒</span>
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
    <article className="max-w-4xl mx-auto pb-20 animate-fadeIn relative">
      <div className="fixed top-[112px] left-0 h-1.5 bg-emerald-500 z-50 transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }}></div>

      <button onClick={onBack} className={`mb-10 flex items-center gap-3 font-black transition-all group ${darkMode ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`}>
        <span className={`p-2 rounded-xl group-hover:bg-emerald-500/10 transition-colors ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>←</span>
        العودة للرئيسية
      </button>

      <div className={`rounded-[60px] shadow-2xl overflow-hidden border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
        <header className="relative h-[400px] md:h-[550px]">
          <img src={article.image} alt={article.name} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-slate-900' : 'from-white'} via-transparent to-transparent`}></div>
          <div className="absolute bottom-12 right-12 left-12">
              <h1 className={`text-4xl md:text-6xl font-black leading-[1.2] tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {article.name}
              </h1>
          </div>
        </header>

        <div className="px-8 md:px-20 py-12">
          {/* Interaction Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-16 border-b border-slate-50/10 pb-12">
             <div className="flex items-center gap-4">
               <button 
                onClick={handleLike}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all ${liked ? 'bg-red-500 text-white' : (darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')}`}
               >
                 <svg className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                 {liked ? 'أعجبك!' : 'أعجبني'} ({article.likes || 0})
               </button>
               <span className="text-slate-400 font-bold text-sm">{article.views || 200} مشاهدة</span>
             </div>
             
             <div className="flex gap-4">
               <a href={`https://wa.me/?text=${encodeURIComponent(article.name)}%20${encodeURIComponent(shareUrl)}`} className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
             </div>
          </div>

          <div className="prose prose-slate prose-xl max-w-none">
            {renderContent(article.content)}
          </div>

          {/* Comments Section */}
          <div className="mt-24 border-t border-slate-50/10 pt-16">
            <h3 className={`text-3xl font-black mb-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>التعليقات ({article.comments?.length || 0})</h3>
            
            <form onSubmit={handleCommentSubmit} className="mb-16 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <input 
                  className={`p-5 rounded-2xl outline-none font-bold ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}
                  placeholder="اسمك المستعار"
                  value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                  required
                 />
              </div>
              <textarea 
                className={`w-full p-5 rounded-3xl outline-none font-medium h-32 ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}
                placeholder="اترك سؤالك أو تعليقك حول المنتج هنا..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                required
              />
              <button type="submit" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all">إرسال التعليق</button>
            </form>

            <div className="space-y-8">
              {article.comments?.map(c => (
                <div key={c.id} className={`p-8 rounded-[32px] ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-emerald-500">{c.userName}</span>
                    <span className="text-xs text-slate-400 font-bold">{c.date}</span>
                  </div>
                  <p className={`text-lg font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{c.text}</p>
                </div>
              ))}
              {(!article.comments || article.comments.length === 0) && (
                <p className="text-center text-slate-400 font-bold py-10">لا توجد تعليقات بعد، كن أول من يسأل!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
