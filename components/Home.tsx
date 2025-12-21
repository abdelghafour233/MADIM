
import React from 'react';
import { Article, Category } from '../types.ts';

interface HomeProps {
  articles: Article[];
  onArticleClick: (a: Article) => void;
  onCategoryClick: (c: Category) => void;
  filterLabel?: string;
}

const Home: React.FC<HomeProps> = ({ articles, onArticleClick, onCategoryClick, filterLabel }) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4">{filterLabel || 'أحدث المراجعات والعروض'}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">نحن نبحث، نجرب، ونرشح لك أفضل المنتجات في السوق المغربي لنضمن لك أفضل قيمة مقابل السعر.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(article => (
          <div 
            key={article.id}
            className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all group overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
            onClick={() => onArticleClick(article)}
          >
            <div className="relative h-56 overflow-hidden">
              <img src={article.image} alt={article.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {article.category}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2 leading-tight">{article.name}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">{article.content}</p>
              <div className="mt-auto flex items-center justify-between border-t pt-4">
                <div className="text-emerald-600 font-bold">
                  {article.price.toLocaleString()} د.م.
                </div>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-700 transition">
                  اقرأ المزيد
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
