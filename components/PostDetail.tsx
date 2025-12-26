
import React, { useEffect, useState } from 'react';
import { Article } from '../types';

interface PostDetailProps {
  post: Article;
  onBack: () => void;
  darkMode?: boolean;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, darkMode = true }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrolled / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn relative">
      <div className="fixed top-0 left-0 h-1.5 bg-emerald-500 z-[100] transition-all duration-100" style={{ width: `${progress}%` }}></div>
      
      <button onClick={onBack} className={`mb-12 flex items-center gap-2 font-bold hover:text-emerald-500 transition-all group ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <span className="group-hover:translate-x-1 transition-transform">→</span> العودة للرئيسية
      </button>

      <div className="mb-16">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-6 block text-center">{post.category}</span>
        <h1 className={`text-4xl md:text-7xl font-black mb-10 leading-tight text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>{post.title}</h1>
        <div className={`flex justify-center items-center gap-8 text-xs font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
           <div className="flex items-center gap-2">👤 <span>{post.author}</span></div>
           <div className="flex items-center gap-2">📅 <span>{post.date}</span></div>
           <div className="flex items-center gap-2">👁️ <span>{post.views} قراءة</span></div>
        </div>
      </div>

      <div className={`rounded-[60px] overflow-hidden mb-20 shadow-2xl border-8 ${darkMode ? 'border-white/5' : 'border-white shadow-slate-200'}`}>
        <img src={post.image} className="w-full h-auto" alt="" />
      </div>

      <div className={`max-w-none text-right leading-[2.2] font-medium px-4 text-2xl ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {post.content.split('\n').map((para, i) => (
          <p key={i} className="mb-12 last:mb-0">{para}</p>
        ))}
      </div>

      <div className={`mt-24 p-16 rounded-[60px] text-center border-t-4 border-emerald-600 shadow-xl transition-all ${darkMode ? 'glass' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
        <h3 className={`text-3xl font-black mb-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>هل استمتعت بالقراءة؟ انشر المعرفة 🚀</h3>
        <div className="flex justify-center gap-6 flex-wrap">
           <button className="px-12 py-5 bg-[#25D366] text-white rounded-3xl font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-green-600/10">واتساب</button>
           <button className="px-12 py-5 bg-[#1877F2] text-white rounded-3xl font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-blue-600/10">فيسبوك</button>
           <button className={`px-12 py-5 rounded-3xl font-black text-lg transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>نسخ الرابط</button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
