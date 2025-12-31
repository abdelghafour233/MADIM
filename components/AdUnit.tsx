
import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  publisherId?: string;
  slotId?: string;
  isAlternative?: boolean;
  alternativeCode?: string; 
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ publisherId, slotId, isAlternative, alternativeCode, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAlternative && alternativeCode && adRef.current) {
      const container = adRef.current;
      
      // تفريغ الحاوية وتجهيزها
      container.innerHTML = '';
      
      // 1. استخراج الـ HTML (الديفات) وحقنها فوراً
      const htmlContent = alternativeCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").trim();
      if (htmlContent) {
        container.innerHTML = htmlContent;
      }

      // 2. معالجة السكربتات بحذر
      const scriptTags = alternativeCode.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gim);
      
      if (scriptTags) {
        scriptTags.forEach((tag, index) => {
          // تأخير بسيط لكل سكربت لضمان ترتيب التنفيذ
          setTimeout(() => {
            const newScript = document.createElement('script');
            
            // استخراج الـ SRC
            const srcMatch = tag.match(/src=["'](.+?)["']/);
            if (srcMatch) newScript.src = srcMatch[1];

            // استخراج الخصائص (async, cfasync)
            if (tag.includes('async')) newScript.async = true;
            if (tag.includes('data-cfasync')) newScript.setAttribute('data-cfasync', 'false');

            // استخراج الكود الداخلي
            const innerCode = tag.match(/>([\s\S]*?)<\/script>/);
            if (innerCode && innerCode[1].trim()) {
              newScript.innerHTML = innerCode[1];
            }

            // إضافة السكربت للحاوية
            container.appendChild(newScript);
          }, index * 200); // تأخير 200ms بين كل سكربت
        });
      }
    } else if (publisherId && !isAlternative) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense pending context");
      }
    }
  }, [alternativeCode, isAlternative, publisherId]);

  return (
    <div className={`ad-unit-wrapper w-full flex flex-col items-center my-4 ${className}`}>
      <span className="text-[7px] text-slate-500 font-black mb-1 opacity-20 tracking-[0.4em] uppercase">إعلان</span>
      <div 
        ref={adRef}
        className="w-full min-h-[50px] flex justify-center items-center overflow-hidden"
      >
        {!isAlternative && publisherId && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={publisherId}
            data-ad-slot={slotId || 'default'}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        )}
      </div>
    </div>
  );
};

export default AdUnit;
