
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
  const [copied, setCopied] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop';

  const handleOrderClick = () => {
    if (product.affiliateLink) {
      // فتح الإعلان المباشر قبل التوجه للرابط لضمان الربح
      if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
      window.open(product.affiliateLink, '_blank');
      return;
    }
    onAddToCart(product);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-16 animate-fadeIn px-4" dir="rtl">
      <button onClick={onBack} className="mb-8 text-slate-500 font-black hover:text-emerald-600 transition-all">
        ← العودة للرئيسية
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="sticky top-32">
          <div className="relative rounded-[40px] overflow-hidden shadow-3xl aspect-square bg-[#0d0d0e] flex items-center justify-center">
             <img 
                src={imgError ? fallbackImage : product.image} 
                className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl" 
                onError={() => setImgError(true)} 
                alt={product.title}
             />
          </div>
          <div className="mt-8">
             <AdUnit isAlternative={true} alternativeCode={settings.nativeAdCode} />
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-3xl md:text-6xl font-black leading-tight">{product.title}</h1>
          
          <div className="bg-emerald-600 text-white p-10 rounded-[40px] shadow-2xl">
            <p className="font-black opacity-80 mb-2 uppercase text-xs">سعر العرض المحدود:</p>
            <div className="text-5xl md:text-7xl font-black">
               {product.price && product.price > 0 ? `${product.price} د.م` : 'انظر السعر في تيمو'}
            </div>
          </div>

          <button 
            onClick={handleOrderClick}
            className="w-full bg-orange-600 py-8 rounded-[30px] font-black text-2xl shadow-2xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all"
          >
            اكتشف العرض واطلب الآن 🔥
          </button>

          <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
             <h3 className="font-black text-xl mb-4">تفاصيل الهمزة:</h3>
             <p className="text-slate-400 leading-relaxed whitespace-pre-line">{product.content}</p>
          </div>

          <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
