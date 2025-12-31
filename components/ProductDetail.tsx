
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
  const fallbackImage = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop';

  const handleOrderClick = () => {
    // نفتح الرابط الإعلاني المباشر (الرابط الثاني) قبل الانتقال للطلب
    if (settings.directLinkCode) {
      window.open(settings.directLinkCode, '_blank');
    }
    
    if (product.affiliateLink) {
      setTimeout(() => {
        window.open(product.affiliateLink, '_blank');
      }, 300);
      return;
    }
    onAddToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-16 animate-fadeIn px-4" dir="rtl">
      <button onClick={onBack} className="mb-8 text-slate-500 font-black hover:text-emerald-600 transition-all flex items-center gap-2">
        <span>←</span> العودة للرئيسية
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="sticky top-32">
          <div className="relative rounded-[40px] overflow-hidden shadow-3xl aspect-square bg-[#0d0d0e] flex items-center justify-center">
             <img 
                src={imgError ? fallbackImage : product.image} 
                className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-110" 
                onError={() => setImgError(true)} 
                alt={product.title}
             />
          </div>
          <div className="mt-8">
             <AdUnit isAlternative={true} alternativeCode={settings.nativeAdCode} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="bg-orange-600/20 text-orange-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">عرض حصري</span>
            <span className="bg-emerald-600/20 text-emerald-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">{product.category}</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black leading-tight">{product.title}</h1>
          
          <div className="bg-emerald-600 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="font-black opacity-80 mb-2 uppercase text-xs">سعر العرض المحدود:</p>
            <div className="text-5xl md:text-7xl font-black">
               {product.price && product.price > 0 ? `${product.price} د.م` : 'أفضل سعر حالياً'}
            </div>
            {product.marketPrice && (
              <p className="mt-2 opacity-50 line-through font-bold">بدلاً من {product.marketPrice} د.م</p>
            )}
          </div>

          <button 
            onClick={handleOrderClick}
            className="w-full bg-orange-600 py-8 rounded-[30px] font-black text-2xl shadow-2xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            اكتشف العرض واطلب الآن 🔥
          </button>

          <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
             <h3 className="font-black text-xl mb-4 text-emerald-500">تفاصيل الهمزة:</h3>
             <p className="text-slate-400 leading-relaxed whitespace-pre-line text-lg">{product.content}</p>
          </div>

          <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
