
import React from 'react';
import { Article } from '../types';

interface HomeProps {
  posts: Article[];
  onPostClick: (p: Article) => void;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick }) => {
  const blogPosts = posts.filter(p => !p.isProduct);
  const products = posts.filter(p => p.isProduct);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      {blogPosts.length > 0 && (
        <div 
          className="relative h-[450px] md:h-[600px] rounded-[40px] overflow-hidden mb-20 cursor-pointer group shadow-2xl"
          onClick={() => onPostClick(blogPosts[0])}
        >
          <img src={blogPosts[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-12 right-6 left-6 md:right-12 md:left-12">
            <span className="bg-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-4 inline-block tracking-widest shadow-lg">مقال مميز</span>
            <h1 className="text-3xl md:text-6xl font-black mb-6 max-w-4xl leading-tight">{blogPosts[0].title || blogPosts[0].name}</h1>
            <p className="text-slate-300 text-lg max-w-2xl line-clamp-2 hidden md:block font-medium">{blogPosts[0].excerpt}</p>
          </div>
        </div>
      )}

      {/* Products Section */}
      {products.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black flex items-center gap-4">
              <span className="w-2 h-10 bg-emerald-500 rounded-full"></span>
              أحدث المنتجات في المتجر
            </h2>
            <div className="hidden md:block h-px flex-grow mx-8 bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div 
                key={product.id} 
                className="glass rounded-[35px] overflow-hidden hover:translate-y-[-8px] transition-all duration-300 cursor-pointer group flex flex-col h-full"
                onClick={() => onPostClick(product)}
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-lg">متوفر</div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-center">
                  <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">{product.name}</h3>
                  <div className="mt-auto">
                    <p className="text-2xl font-black text-emerald-500 mb-4">{product.price} <small className="text-xs">د.م</small></p>
                    <button className="w-full py-3 bg-white/5 hover:bg-emerald-600 rounded-2xl font-black text-sm transition-all border border-white/5 hover:border-emerald-500">
                      مشاهدة التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black flex items-center gap-4">
            <span className="w-2 h-10 bg-emerald-500 rounded-full"></span>
            آخر المقالات التقنية
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.slice(1).map(post => (
            <div 
              key={post.id} 
              className="group cursor-pointer"
              onClick={() => onPostClick(post)}
            >
              <div className="h-64 rounded-[35px] overflow-hidden mb-6 shadow-xl relative">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">{post.category}</span>
              <h3 className="text-2xl font-black mt-3 mb-4 leading-tight group-hover:text-emerald-400 transition-colors">{post.title || post.name}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed font-medium">{post.excerpt}</p>
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <span>📅 {post.date}</span>
                <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                <span>👤 {post.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
