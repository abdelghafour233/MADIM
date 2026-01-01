
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

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack, settings }) => {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop';

  const handleOrderClick = () => {
    // Priority to Temu Affiliate Link
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank');
      return;
    }
    if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
    onAddToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 md:py-20 animate-fadeIn px-4" dir="rtl">
      <button onClick={onBack} className="mb-12 text-slate-500 font-black hover:text-orange-500 transition-all flex items-center gap-3 text-lg">
        <span className="w-10 h-10 glass rounded-full flex items-center justify-center">→</span> العودة للعروض
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
        <div className="sticky top-40 space-y-8">
          <div className="relative rounded-[50px] overflow-hidden glass aspect-square flex items-center justify-center p-12">
             <div className="absolute inset-0 bg-mesh opacity-30"></div>
             <img 
                src={imgError ? fallbackImage : product.image} 
                className="relative z-10 max-w-full max-h-full object-contain drop-shadow-[0_45px_45px_rgba(255,165,0,0.2)] animate-float" 
                onError={() => setImgError(true)} 
                alt={product.title}
             />
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <span className="bg-orange-600/20 text-orange-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-500/20">عرض تيمو الحصري</span>
               <span className="bg-emerald-600/20 text-emerald-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border border-emerald-500/20">{product.category}</span>
             </div>
             <h1 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tighter text-white">{product.title}</h1>
          </div>
          
          <div className="glass p-10 rounded-[45px] relative overflow-hidden group border-white/10">
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
            <div className="flex items-center justify-between">
              <div>
                 <p className="font-black opacity-30 mb-2 uppercase text-[10px] tracking-widest">السعر الحصري (للمنخرطين):</p>
                 <div className="text-5xl md:text-8xl font-black text-white flex items-baseline gap-2">
                    {product.price && product.price > 0 ? product.price : 'أفضل عرض'}
                    <span className="text-xl md:text-2xl opacity-40 font-bold">د.م</span>
                 </div>
              </div>
              {product.marketPrice && (
                <div className="text-right">
                   <p className="text-slate-500 line-through font-black text-xl md:text-2xl opacity-40">{product.marketPrice} د.م</p>
                   <span className="text-orange-500 font-black text-sm">توفير {((product.marketPrice - (product.price || 0)) / product.marketPrice * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleOrderClick}
              className="w-full bg-orange-600 text-white py-8 rounded-[35px] font-black text-2xl md:text-3xl shadow-[0_20px_40px_rgba(255,165,0,0.3)] hover:bg-orange-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              سجل واحصل على العرض 🔥
            </button>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
               <ul className="text-xs md:text-sm text-slate-400 space-y-2 font-bold">
                  <li className="flex items-center gap-2">✅ تفعيل حزمة كوبونات 1000 د.م فور التسجيل</li>
                  <li className="flex items-center gap-2">✅ توصيل مجاني لكل المدن المغربية</li>
                  <li className="flex items-center gap-2">✅ الدفع عند الاستلام (COD) متاح</li>
               </ul>
            </div>
          </div>

          <div className="p-10 glass rounded-[45px] border-white/5">
             <h3 className="font-black text-2xl mb-6 text-orange-500 flex items-center gap-3">
               <span className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center text-sm">📄</span>
               تفاصيل العرض:
             </h3>
             <div className="text-slate-300 leading-relaxed whitespace-pre-line text-lg md:text-xl font-medium opacity-80">{product.content}</div>
          </div>

          <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
