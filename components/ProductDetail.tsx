
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
    // الأولوية لرابط الأفلييت المباشر (تيمو مثلاً)
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank');
      return;
    }
    
    // إذا لم يوجد رابط أفلييت، نستخدم رابط Direct Link للإعلانات ثم السلة
    if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
    onAddToCart(product);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-12 animate-fadeIn px-4" dir="rtl">
      <button onClick={onBack} className="mb-8 md:mb-12 text-slate-500 font-black flex items-center gap-3 hover:text-emerald-600 transition-colors group text-sm md:text-lg">
        <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span> العودة للتسوق
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
        {/* Main Product Image */}
        <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden shadow-3xl border-2 md:border-4 border-white/5 group h-[450px] sm:h-[550px] md:h-[700px] bg-[#0d0d0e] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-150"
            style={{ backgroundImage: `url(${imgError ? fallbackImage : product.image})` }}
          ></div>
          
          <div className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-12">
             <img 
                src={imgError ? fallbackImage : product.image} 
                alt={product.name} 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] group-hover:scale-110 transition duration-1000 relative z-20"
                onError={() => setImgError(true)}
              />
          </div>

          <div className="absolute top-6 right-6 md:top-10 md:right-10 bg-emerald-600 text-white px-5 py-2.5 md:px-8 md:py-3.5 rounded-2xl md:rounded-3xl font-black shadow-3xl text-[10px] md:text-sm z-30 uppercase tracking-widest">
            {product.category}
          </div>
        </div>

        <div className="space-y-8 md:space-y-12">
          <div>
            <h1 className={`text-2xl sm:text-3xl md:text-6xl font-black mb-4 md:mb-8 leading-[1.1] ${darkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</h1>
            <div className="flex items-center gap-4">
               <div className="flex text-orange-500 text-xl md:text-2xl">{'★'.repeat(5)}</div>
               <span className="text-slate-500 font-bold text-xs md:text-lg">({(product.views || 0) + 142} زبون اشتروا هذا المنتج)</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 md:p-12 rounded-[40px] md:rounded-[50px] shadow-3xl shadow-emerald-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-emerald-100 font-black mb-2 text-sm md:text-xl uppercase tracking-widest">عرض خاص ومحدود:</p>
            <div className="flex items-baseline gap-2 md:gap-4">
              {product.price && product.price > 0 ? (
                <>
                  <span className="text-4xl md:text-7xl font-black">{product.price.toLocaleString()}</span>
                  <span className="text-xl md:text-3xl font-black opacity-80">د.م</span>
                </>
              ) : (
                <span className="text-3xl md:text-5xl font-black">أفضل سعر متاح اليوم</span>
              )}
            </div>
            {product.marketPrice && product.price && product.price > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm md:text-xl opacity-60 line-through">كان بـ {product.marketPrice} د.م</span>
                <span className="bg-orange-600 px-3 py-1 rounded-lg text-[10px] md:text-sm font-black">وفر {product.marketPrice - product.price} د.م</span>
              </div>
            )}
          </div>

          <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />

          <div className={`space-y-6 md:space-y-8 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <h3 className={`text-xl md:text-3xl font-black flex items-center gap-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
               <span className="w-8 h-1.5 bg-emerald-500 rounded-full"></span> 
               وصف المنتج
            </h3>
            <div className="whitespace-pre-line bg-white/5 p-6 md:p-10 rounded-[35px] md:rounded-[45px] border border-white/5 text-sm md:text-xl leading-relaxed font-medium">
              {product.content}
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-6">
            <button 
              onClick={handleOrderClick}
              className="w-full bg-orange-600 text-white py-6 md:py-10 rounded-[30px] md:rounded-[45px] font-black text-xl md:text-3xl shadow-3xl shadow-orange-600/20 hover:bg-orange-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              اكتشف الثمن واطلب الآن 🛍️
            </button>
            <p className="text-center text-[10px] md:text-sm font-bold opacity-40">توصيل آمن ودفع عند الاستلام متاح لجميع المدن</p>
          </div>

          <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
