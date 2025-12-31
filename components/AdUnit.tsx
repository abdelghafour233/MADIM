
import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  publisherId?: string;
  slotId?: string;
  isAlternative?: boolean;
  alternativeCode?: string; 
}

const AdUnit: React.FC<AdUnitProps> = ({ publisherId, slotId, isAlternative, alternativeCode }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAlternative && alternativeCode && adRef.current) {
      const container = adRef.current;
      container.innerHTML = '';
      
      // 1. استخراج الـ HTML (بدون السكربتات) ووضعه أولاً
      const htmlContent = alternativeCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      // نقل العناصر (مثل <div id="container-...">) إلى الحاوية الحقيقية
      while (tempDiv.firstChild) {
        container.appendChild(tempDiv.firstChild);
      }

      // 2. استخراج السكربتات وحقنها بعد التأكد من وجود الـ HTML
      const scriptMatches = alternativeCode.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gim);
      if (scriptMatches) {
        scriptMatches.forEach(scriptTag => {
          const scriptEl = document.createElement('script');
          
          // استخراج الـ SRC إذا وجد
          const srcMatch = scriptTag.match(/src=["'](.+?)["']/);
          if (srcMatch) scriptEl.src = srcMatch[1];

          // استخراج الخصائص الأخرى
          if (scriptTag.includes('async')) scriptEl.async = true;
          if (scriptTag.includes('data-cfasync="false"')) scriptEl.setAttribute('data-cfasync', 'false');

          // استخراج الكود الداخلي إذا وجد
          const contentMatch = scriptTag.match(/>([\s\S]*?)<\/script>/);
          if (contentMatch && contentMatch[1].trim()) {
            scriptEl.innerHTML = contentMatch[1];
          }

          // إضافة السكربت
          container.appendChild(scriptEl);
        });
      }
    } else if (publisherId && !isAlternative) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense pending...");
      }
    }
  }, [alternativeCode, isAlternative, publisherId]);

  return (
    <div className="ad-unit-wrapper my-4 w-full flex flex-col items-center overflow-hidden">
      <span className="text-[6px] text-slate-500 font-black mb-1 opacity-20 tracking-[0.5em] uppercase">إعلان مدفوع</span>
      <div 
        ref={adRef}
        className="w-full flex justify-center items-center min-h-[50px]"
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
