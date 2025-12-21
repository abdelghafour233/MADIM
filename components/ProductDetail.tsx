
import React from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden animate-fadeIn">
      <div className="grid md:grid-cols-2">
        <div className="h-[400px] md:h-full relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <button 
            onClick={onBack} 
            className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg text-gray-800 hover:text-emerald-600 transition md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <button onClick={onBack} className="hidden md:flex text-gray-400 hover:text-emerald-600 mb-6 items-center gap-2 transition font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة للمتجر
          </button>
          
          <div className="inline-block bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-lg text-sm mb-4 self-start">
            {product.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mb-10 p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-emerald-600">{product.price.toLocaleString()}</span>
              <span className="text-xl font-bold text-emerald-600">د.م.</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">السعر شامل للتوصيل والدفع عند الاستلام</p>
          </div>

          <button 
            onClick={() => onAddToCart(product)}
            className="bg-orange-600 hover:bg-orange-700 text-white py-5 px-8 rounded-2xl font-black text-xl shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            اشتري الآن
          </button>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>ضمان لمدة سنة</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>توصيل 24-48 ساعة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
