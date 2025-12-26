
import React, { useEffect, useState } from 'react';
import { Article } from '../types';

interface PostDetailProps {
  post: Article;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
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
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="fixed top-0 left-0 h-1.5 bg-emerald-500 z-[100] transition-all duration-100" style={{ width: `${progress}%` }}></div>
      
      <button onClick={onBack} className="mb-12 flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-500 transition-colors">
        <span>→</span> العودة للرئيسية
      </button>

      <div className="mb-12 text-center">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em] mb-4 block">{post.category}</span>
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">{post.title}</h1>
        <div className="flex justify-center items-center gap-6 text-slate-400 text-sm font-bold uppercase tracking-widest">
           <span>🗓️ {post.date}</span>
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
           <span>👁️ {post.views} مشاهدة</span>
        </div>
      </div>

      <div className="rounded-[40px] overflow-hidden mb-16 shadow-2xl">
        <img src={post.image} className="w-full h-auto" alt="" />
      </div>

      <div className="prose prose-invert prose-2xl max-w-none text-right leading-[2.2] text-slate-300 font-medium">
        {post.content.split('\n').map((para, i) => (
          <p key={i} className="mb-10">{para}</p>
        ))}
      </div>

      <div className="mt-20 p-12 glass rounded-[40px] text-center">
        <h3 className="text-2xl font-black mb-8">هل أعجبك المقال؟ شاركه الآن 🚀</h3>
        <div className="flex justify-center gap-4 flex-wrap">
           <button className="px-10 py-4 bg-[#25D366] rounded-2xl font-black hover:scale-105 transition-transform shadow-xl shadow-green-600/10">واتساب</button>
           <button className="px-10 py-4 bg-[#1877F2] rounded-2xl font-black hover:scale-105 transition-transform shadow-xl shadow-blue-600/10">فيسبوك</button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
