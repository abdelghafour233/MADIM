
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
      window.open(product.affiliateLink, '_blank');
      return;
    }
    if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
    onAddToCart(product);
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(product.title + ' \n ' + window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.title)}`,
    // Instagram doesn't support direct URL sharing via link, but we provide a nice UI button
    instagram: `https://www.instagram.com/` 
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-16 animate-fadeIn px-4" dir="rtl">
      <button onClick={onBack} className="mb-8 md:mb-16 text-slate-500 font-black flex items-center gap-3 hover:text-emerald-600 transition-all group text-sm md:text-xl">
        <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span> العودة للتسوق
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Main Product Image Container */}
        <div className="sticky top-32 space-y-8">
          <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden shadow-3xl border-2 md:border-4 border-white/5 group aspect-square lg:h-[750px] bg-[#0d0d0e] flex items-center justify-center img-loading">
            <div 
              className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-150 transition-all duration-1000"
              style={{ backgroundImage: `url("${imgError ? fallbackImage : product.image}")` }}
            ></div>
            
            <div className="relative z-10 w-full h-full flex items-center justify-center p-8 md:p-16 lg:p-24">
               <img 
                  src={imgError ? fallbackImage : product.image} 
                  alt={product.name} 
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] group-hover:scale-110 transition duration-1000 relative z-20"
                  onError={() => setImgError(true)}
                />
            </div>

            <div className="absolute top-8 right-8 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-black shadow-3xl text-xs md:text-sm z-30 uppercase tracking-widest">
              {product.category}
            </div>
          </div>
          <div className="hidden lg:block">
             <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-10 md:space-y-16">
          <div className="space-y-6">
            <h1 className={`text-3xl sm:text-4xl md:text-6xl xl:text-7xl font-black leading-[1.1] ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {product.name}
            </h1>
            <div className="flex items-center gap-6">
               <div className="flex text-orange-500 text-2xl">{'★'.repeat(5)}</div>
               <span className="text-slate-500 font-bold text-sm md:text-xl">({(product.views || 0) + 142} تقييمات إيجابية)</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-10 md:p-14 rounded-[45px] md:rounded-[55px] shadow-3xl shadow-emerald-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-emerald-100 font-black mb-3 text-sm md:text-2xl uppercase tracking-widest">تخفيض حصري اليوم:</p>
            <div className="flex items-baseline gap-3 md:gap-5">
              {product.price && product.price > 0 ? (
                <>
                  <span className="text-5xl md:text-8xl font-black">{product.price.toLocaleString()}</span>
                  <span className="text-2xl md:text-4xl font-black opacity-80">د.م</span>
                </>
              ) : (
                <span className="text-4xl md:text-6xl font-black">أفضل سعر متاح</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <button 
              onClick={handleOrderClick}
              className="w-full bg-orange-600 text-white py-7 md:py-12 rounded-[35px] md:rounded-[50px] font-black text-2xl md:text-4xl shadow-3xl shadow-orange-600/30 hover:bg-orange-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              اكتشف العرض واطلب الآن 🛍️
            </button>
            
            {/* Social Share Section Updated */}
            <div className="space-y-6 bg-white/5 p-8 rounded-[40px] border border-white/10">
              <p className="text-center font-black text-xs md:text-lg opacity-60">توصيل لكل المدن.. شارك الهمزة مع أصدقائك:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-[#25D366]/10 text-[#25D366] py-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white transition-all font-black text-[10px] md:text-sm">
                   <span className="text-xl">💬</span>
                   <span>واتساب</span>
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-[#1877F2]/10 text-[#1877F2] py-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-[#1877F2]/20 hover:bg-[#1877F2] hover:text-white transition-all font-black text-[10px] md:text-sm">
                   <span className="text-xl">👥</span>
                   <span>فايسبوك</span>
                </a>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="bg-white/5 text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/10 hover:bg-white hover:text-black transition-all font-black text-[10px] md:text-sm">
                   <span className="text-xl">𝕏</span>
                   <span>تويتر</span>
                </a>
                <button onClick={handleNativeShare} className="bg-[#E4405F]/10 text-[#E4405F] py-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-[#E4405F]/20 hover:bg-[#E4405F] hover:text-white transition-all font-black text-[10px] md:text-sm">
                   <span className="text-xl">📸</span>
                   <span>انستغرام</span>
                </button>
                <button onClick={copyToClipboard} className={`col-span-2 sm:col-span-1 ${copied ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400'} py-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/10 hover:bg-white/10 transition-all font-black text-[10px] md:text-sm`}>
                   <span className="text-xl">{copied ? '✅' : '🔗'}</span>
                   <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`space-y-8 md:space-y-12 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <h3 className={`text-2xl md:text-4xl font-black flex items-center gap-5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
               <span className="w-10 h-2 bg-emerald-500 rounded-full"></span> 
               وصف وتفاصيل المنتج
            </h3>
            <div className="whitespace-pre-line bg-white/5 p-8 md:p-14 rounded-[40px] md:rounded-[60px] border border-white/5 text-base md:text-2xl leading-[1.8] font-medium">
              {product.content}
            </div>
          </div>
          <AdUnit isAlternative={true} alternativeCode={settings.alternativeAdsCode} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
