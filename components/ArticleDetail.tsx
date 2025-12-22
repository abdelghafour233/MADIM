
import React from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fadeIn">
      <button 
        onClick={onBack} 
        className="mb-8 flex items-center gap-2 font-black text-slate-400 hover:text-emerald-600 transition-all group"
      >
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-emerald-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        العودة للمقالات
      </button>

      <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-white">
        <div className="relative h-[500px]">
          <img src={article.image} alt={article.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-10 right-10 left-10">
             <span className="bg-emerald-600 text-white font-black px-6 py-2 rounded-2xl text-xs shadow-xl shadow-emerald-500/20 mb-6 inline-block">
                {article.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.15] drop-shadow-sm">
                {article.name}
              </h1>
          </div>
        </div>

        <div className="px-8 md:px-16 py-12">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">وقت القراءة</p>
                <p className="font-black text-slate-700">4 دقائق</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">تقييمنا</p>
                <p className="font-black text-slate-700">{article.rating}/5 نجوم</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
                <p className="text-[10px] font-bold text-emerald-100 uppercase">السعر التقديري</p>
                <p className="font-black text-white text-xl">{article.price.toLocaleString()} د.م.</p>
              </div>
            </div>
          </div>
          
          <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-[2] font-medium space-y-6">
            {article.content.split('\n').map((para, i) => para.trim() ? (
              <p key={i} className="mb-6 first-letter:text-5xl first-letter:font-black first-letter:text-emerald-600 first-letter:ml-3 first-letter:float-right">
                {para}
              </p>
            ) : <br key={i}/>)}
          </div>

          <div className="mt-20 p-10 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-black mb-2">هل أعجبك هذا المقال؟</h3>
              <p className="text-slate-400 font-medium">اشترك لتصلك أحدث المراجعات والعروض الحصرية مباشرة.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="bg-white/10 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500 flex-grow md:w-64"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 px-6 py-4 rounded-2xl font-black transition">
                انضم
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
