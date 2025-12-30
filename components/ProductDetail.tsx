
import React, { useState } from 'react';
import { Article } from '../types';

interface ProductDetailProps {
  product: Article;
  onAddToCart: (p: Article) => void;
  onBack: () => void;
  darkMode: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack, darkMode }) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `شوف هاد الهمزة اللي لقيت في متجر عبدو: ${product.name}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackImage = 'https://via.placeholder.com/800x800/10b981/ffffff?text=Product+Image';

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 animate-fadeIn px-4" dir="rtl">
      <button onClick={onBack} className="mb-8 md:mb-10 text-slate-500 font-black flex items-center gap-2 hover:text-emerald-600 transition-colors group text-sm md:text-base">
        <span className="text-xl group-hover:translate-x-1 transition-transform">→</span> العودة للمتجر
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* عرض الصورة - ارتفاع أصغر في الهاتف */}
        <div className="relative rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl border-4 md:border-8 border-white dark:border-slate-800 group h-[350px] sm:h-[450px] md:h-[600px] bg-slate-100 dark:bg-slate-800 shrink-0">
          <img 
            src={imgError ? fallbackImage : product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
            onError={() => setImgError(true)}
          />
          <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-emerald-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black shadow-2xl text-[10px] md:text-xs uppercase tracking-widest">
            {product.category}
          </div>
        </div>

        <div className="space-y-8 md:space-y-10 text-right">
          <div>
            <h1 className={`text-2xl sm:text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</h1>
            <div className="flex items-center gap-3">
               <div className="flex text-yellow-400 text-base md:text-xl">
                 {'★'.repeat(5)}
               </div>
               <span className="text-slate-400 font-bold text-xs md:text-sm">({(product.views || 0) + 125} تقييم حقيقي)</span>
            </div>
          </div>

          <div className="bg-emerald-600 text-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -translate-x-12 -translate-y-12 md:-translate-x-16 md:-translate-y-16"></div>
            <p className="text-emerald-100 font-black mb-1 md:mb-2 text-base md:text-lg">سعر العرض المحدود:</p>
            <div className="flex items-baseline gap-2 md:gap-3">
              <span className="text-4xl md:text-6xl font-black">{product.price?.toLocaleString()}</span>
              <span className="text-xl md:text-2xl font-black opacity-80">درهم مغربي</span>
            </div>
            <p className="mt-3 md:mt-4 text-[10px] md:text-sm font-bold bg-white/20 inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-xl">🚚 توصيل سريع بالمغرب</p>
          </div>

          <div className={`text-base md:text-xl leading-relaxed md:leading-[1.8] font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <h3 className={`text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
               <span className="w-8 h-1 bg-emerald-500 rounded-full"></span> تفاصيل المنتج
            </h3>
            <p className="whitespace-pre-line bg-white/5 dark:bg-slate-900/50 p-6 md:p-8 rounded-[25px] md:rounded-[35px] border border-white/5 shadow-sm text-sm md:text-lg">{product.content}</p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 pt-4">
            {product.affiliateLink ? (
              <a 
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-orange-600 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl shadow-2xl hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <span>🛍️</span> اطلب الآن
              </a>
            ) : (
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full bg-emerald-600 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl shadow-2xl hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <span>🛒</span> أضف للسلة
              </button>
            )}
            
            <button 
              onClick={() => window.open(`https://wa.me/212649075664?text=${encodeURIComponent('أريد استفسار حول: ' + (product.name || product.title))}`)}
              className="w-full bg-slate-900 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl shadow-2xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border border-white/10"
            >
              <span>💬</span> واتساب
            </button>
          </div>

          <div className="pt-6 md:pt-8 border-t border-white/5">
            <h4 className="text-base md:text-lg font-black mb-4 md:mb-6 text-slate-400">شارك الهمزة مع صحابك 🚀</h4>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 md:gap-4">
              <button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`)}
                className="flex-1 bg-[#25D366] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-transform text-xs md:text-sm"
              >
                واتساب
              </button>
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
                className="flex-1 bg-[#1877F2] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-transform text-xs md:text-sm"
              >
                فيسبوك
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 md:gap-4 text-center py-6 md:py-8 border-t border-white/5">
             <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl">
                <span className="text-2xl md:text-4xl block mb-1 md:mb-2">🏷️</span>
                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">خصم حقيقي</p>
             </div>
             <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl">
                <span className="text-2xl md:text-4xl block mb-1 md:mb-2">✨</span>
                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">جودة عالية</p>
             </div>
             <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl">
                <span className="text-2xl md:text-4xl block mb-1 md:mb-2">🚛</span>
                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">توصيل سريع</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
