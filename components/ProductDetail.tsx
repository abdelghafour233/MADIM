
import React from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      <div className="grid md:grid-cols-2">
        <div className="h-[400px] md:h-full">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-8 md:p-12 flex flex-col">
          <button onClick={onBack} className="text-gray-400 hover:text-emerald-600 mb-6 flex items-center gap-2 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة للمتجر
          </button>
          
          <span className="text-emerald-600 font-bold mb-2 uppercase tracking-wide">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mb-8">
            <span className="text-4xl font-bold text-emerald-600">{product.price.toLocaleString()} د.م.</span>
            <p className="text-gray-400 text-sm mt-1">السعر يشمل الضريبة ورسوم التوصيل الأساسية</p>
          </div>

          <button 
            onClick={() => onAddToCart(product)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            إضافة إلى سلة المشتريات
          </button>

          <div className="mt-12 grid grid-cols-2 gap-4 border-t pt-8">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>ضمان أصلي 100%</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <div className="bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>توصيل سريع</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
