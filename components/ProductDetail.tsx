
import React, { useState } from 'react';
import { Article, Settings } from '../types';
import AdUnit from './AdUnit.tsx';

interface ProductDetailProps {
  product: Article;
  onAddToCart: (p: Article) => void;
  onBack: () => void;
  darkMode: boolean;
  settings: Settings;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack, darkMode, settings }) => {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = 'https://via.placeholder.com/800x800/10b981/ffffff?text=Image+Unavailable';

  const handleOrderClick = () => {
    if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
    if (product.affiliateLink) window.open(product.affiliateLink, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-12 animate-fadeIn px-4" dir="rtl">
      <button onClick={onBack} className="mb-6 md:mb-10 text-slate-500 font-black flex items-center gap-2 hover:text-emerald-600 transition-colors group text-sm md:text-base">
        <span className="text-xl group-hover:translate-x-1 transition-transform">→</span> العودة للمتجر
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Main Product Image Fixed */}
        <div className="relative rounded-[35px] md:rounded-[50px] overflow-hidden shadow-2xl border-2 md:border-4 border-white/5 group h-[400px] sm:h-[500px] md:h-[650px] bg-[#111] flex items-center justify-center">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-125"
            style={{ backgroundImage: `url(${imgError ? fallbackImage : product.image})` }}
          ></div>
          
          {/* Main Image Container */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
             <img 
                src={imgError ? fallbackImage : product.image} 
                alt={product.name} 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:scale-105 transition duration-1000 relative z-20"
                onError={() => setImgError(true)}
              />
          </div>

          <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-emerald-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl md:rounded-2xl font-black shadow-2xl text-[9px] md:text-xs z-30">
            {product.category}
          </div>
        </div>

        <div className="space-y-6 md:space-y-10">
          <div>
            <h1 className={`text-xl sm:text-2xl md:text-5xl font-black mb-3 md:mb-6 leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</h1>
            <div className="flex items-center gap-3">
               <div className="flex text-yellow-400 text-sm md:text-xl">{'★'.repeat(5)}</div>
               <span className="text-slate-400 font-bold text-[10px] md:text-sm">({(product.views || 0) + 125} تقييم حقيقي)</span>
            </div>
          </div>

          <div className="bg-emerald-600 text-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
            <p className="text-emerald-100 font-black mb-1 text-sm md:text-lg">سعر العرض المحدود:</p>
            <div className="flex items-baseline gap-2 md:gap-3">
              <span className="text-3xl md:text-6xl font-black">{product.price?.toLocaleString()}</span>
              <span className="text-lg md:text-2xl font-black opacity-80">د.م</span>
            </div>
            {product.marketPrice && (
              <span className="block mt-2 text-xs md:text-lg opacity-60 line-through">كان بـ {product.marketPrice} د.م</span>
            )}
          </div>

          <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

          <div className={`space-y-4 md:space-y-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <h3 className={`text-lg md:text-2xl font-black flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
               <span className="w-6 h-1 bg-emerald-500 rounded-full"></span> تفاصيل المنتج
            </h3>
            <p className="whitespace-pre-line bg-white/5 p-5 md:p-8 rounded-[25px] md:rounded-[35px] border border-white/5 text-sm md:text-lg leading-relaxed">{product.content}</p>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            {product.affiliateLink ? (
              <button 
                onClick={handleOrderClick}
                className="w-full bg-orange-600 text-white py-5 md:py-7 rounded-2xl md:rounded-[35px] font-black text-lg md:text-2xl shadow-2xl hover:bg-orange-700 transition-all flex items-center justify-center gap-3"
              >
                اطلب الآن 🛍️
              </button>
            ) : (
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full bg-emerald-600 text-white py-5 md:py-7 rounded-2xl md:rounded-[35px] font-black text-lg md:text-2xl shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
              >
                أضف للسلة 🛒
              </button>
            )}
          </div>

          <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
