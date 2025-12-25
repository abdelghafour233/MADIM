
import React from 'react';
import { Article } from '../types.ts';

interface HomeProps {
  articles: Article[];
  onItemClick: (item: Article) => void;
  darkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ articles, onItemClick, darkMode }) => {
  const products = articles.filter(a => a.isProduct);
  const posts = articles.filter(a => !a.isProduct);

  return (
    <div className="animate-slideUp space-y-20">
      {/* قسم المتجر */}
      <section>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black">المتجر الحصري 🛍️</h2>
            <p className="text-slate-500 font-bold mt-2">توصيل مجاني لجميع المدن المغربية والدفع عند الاستلام</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(item => (
            <div 
              key={item.id} onClick={() => onItemClick(item)}
              className={`group rounded-[40px] overflow-hidden cursor-pointer transition-all duration-500 border h-full flex flex-col ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl'}`}
            >
              <div className="h-64 overflow-hidden relative">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black">الأكثر مبيعاً</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-black text-lg mb-4 line-clamp-1">{item.name}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-emerald-600">{item.price} <small className="text-xs">د.م</small></span>
                    <span className="text-[10px] text-slate-400 line-through">{(item.price || 0) + 100} د.م</span>
                  </div>
                  <button className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:translate-x-[-5px] transition-transform">🛒</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* قسم المدونة */}
      <section>
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black">آخر الأخبار التقنية 🚀</h2>
          <p className="text-slate-500 font-bold mt-2">تحليلات، مراجعات، ومستجدات التكنولوجيا في المغرب</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {posts.map(post => (
            <article 
              key={post.id} onClick={() => onItemClick(post)}
              className={`group rounded-[40px] overflow-hidden cursor-pointer transition-all duration-500 ${darkMode ? 'bg-slate-900/50' : 'bg-white shadow-lg'}`}
            >
              <div className="h-56 overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              </div>
              <div className="p-8">
                <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">{post.category}</span>
                <h3 className="font-black text-xl mt-3 mb-4 leading-snug line-clamp-2">{post.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6">{post.content}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400">📅 {post.date}</span>
                  <span className="text-emerald-500 font-black text-xs">اقرأ المزيد ←</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
