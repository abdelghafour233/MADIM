
import React from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden animate-fadeIn border">
      <img src={article.image} alt={article.name} className="w-full h-[400px] object-cover" />
      <div className="p-8 md:p-12">
        <button onClick={onBack} className="text-gray-400 hover:text-emerald-600 mb-6 flex items-center gap-2 font-bold transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة للمقالات
        </button>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="bg-emerald-50 text-emerald-600 font-bold px-4 py-1 rounded-full text-sm">{article.category}</span>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`h-5 w-5 ${i < article.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">{article.name}</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600 mb-12 leading-loose">
          {article.content.split('\n').map((para, i) => <p key={i} className="mb-4">{para}</p>)}
        </div>

        {/* روابط الشراء الخارجية */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            روابط الشراء الخارجية:
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {article.links && article.links.length > 0 ? (
              article.links.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 p-5 rounded-2xl transition-all group"
                >
                  <span className="font-bold text-gray-700 group-hover:text-emerald-700">{link.label}</span>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <span>عرض العرض</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-gray-400 italic">لا توجد روابط شراء متوفرة حالياً.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
