
import React from 'react';
import { Article } from '../types';

interface ProductDetailProps {
  product: Article;
  onAddToCart: (p: Article) => void;
  onBack: () => void;
  darkMode: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack, darkMode }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 animate-fadeIn px-4" dir="rtl">
      <button onClick={onBack} className="mb-10 text-slate-500 font-black flex items-center gap-2 hover:text-emerald-600 transition-colors group">
        <span className="text-xl group-hover:translate-x-1 transition-transform">→</span> العودة للمتجر
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="relative rounded-[50px] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 group h-[400px] md:h-[600px]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
          <div className="absolute top-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black shadow-2xl text-xs uppercase tracking-widest">
            {product.category}
          </div>
        </div>

        <div className="space-y-10 text-right">
          <div>
            <h1 className={`text-3xl md:text-5xl font-black mb-6 leading-[1.2] ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</h1>
            <div className="flex items-center gap-3">
               <div className="flex text-yellow-400 text-xl">
                 {'★'.repeat(5)}
               </div>
               <span className="text-slate-400 font-bold text-sm">({(product.views || 0) + 125} تقييم حقيقي)</span>
            </div>
          </div>

          <div className="bg-emerald-600 text-white p-10 rounded-[40px] shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <p className="text-emerald-100 font-black mb-2 text-lg">سعر العرض المحدود:</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black">{product.price?.toLocaleString()}</span>
              <span className="text-2xl font-black opacity-80">درهم مغربي</span>
            </div>
            <p className="mt-4 text-sm font-bold bg-white/20 inline-block px-4 py-2 rounded-xl">🚚 التوصيل بالمجان لجميع المدن</p>
          </div>

          <div className={`text-xl leading-[1.8] font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <h3 className={`text-2xl font-black mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
               <span className="w-10 h-1 bg-emerald-500 rounded-full"></span> تفاصيل المنتج
            </h3>
            <p className="whitespace-pre-line bg-white dark:bg-slate-900 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm">{product.content}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-grow bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <span>🛒</span> أضف للسلة
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/212649075664?text=${encodeURIComponent('أريد طلب منتج: ' + product.name)}`)}
              className="flex-grow bg-slate-900 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl hover:bg-black hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <span>💬</span> طلب مباشر
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center py-8 border-t border-slate-100 dark:border-slate-800">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                <span className="text-4xl block mb-2">🇲🇦</span>
                <p className="text-[10px] font-black text-slate-500 uppercase">صنع بإتقان</p>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                <span className="text-4xl block mb-2">🤝</span>
                <p className="text-[10px] font-black text-slate-500 uppercase">دفع آمن</p>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                <span className="text-4xl block mb-2">🔄</span>
                <p className="text-[10px] font-black text-slate-500 uppercase">إرجاع سهل</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
