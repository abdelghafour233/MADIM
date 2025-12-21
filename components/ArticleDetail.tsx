
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

        <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-orange-800 font-bold text-lg mb-1">أفضل سعر وجدناه:</p>
            <p className="text-4xl font-black text-orange-600">{article.price.toLocaleString()} د.م.</p>
          </div>
          <a 
            href={article.affiliateLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-orange-600 hover:bg-orange-700 text-white py-5 px-12 rounded-2xl font-black text-xl shadow-xl shadow-orange-200 transition-all active:scale-95 text-center w-full md:w-auto"
          >
            اشتري الآن من المتجر
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
