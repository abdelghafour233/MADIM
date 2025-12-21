
import React from 'react';
import { Product, Category } from '../types.ts';

interface HomeProps {
  products: Product[];
  onProductClick: (p: Product) => void;
  onCategoryClick: (c: Category) => void;
  filterLabel?: string;
}

const Home: React.FC<HomeProps> = ({ products, onProductClick, onCategoryClick, filterLabel }) => {
  return (
    <div className="animate-fadeIn">
      {!filterLabel && (
        <section className="relative h-[400px] rounded-2xl overflow-hidden mb-12 flex items-center justify-center text-center text-white">
          <img 
            src="https://picsum.photos/seed/shop-hero/1200/400" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">تسوق أفضل المنتجات في المغرب</h1>
            <p className="text-xl md:text-2xl mb-8">إلكترونيات، مستلزمات منزلية، وسيارات بضمان الجودة</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {Object.values(Category).map(cat => (
                <button 
                  key={cat}
                  onClick={() => onCategoryClick(cat)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {filterLabel && (
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">تصفية حسب: {filterLabel}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="text-emerald-600 underline"
          >
            عرض الكل
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <div 
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col"
            onClick={() => onProductClick(product)}
          >
            <div className="relative h-64 rounded-t-xl overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                {product.category}
              </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-bold text-emerald-600">{product.price.toLocaleString()} د.م.</span>
                <button className="bg-gray-100 hover:bg-emerald-50 text-emerald-600 p-2 rounded-full transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
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
