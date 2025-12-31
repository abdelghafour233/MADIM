
import React, { useEffect, useRef, useId } from 'react';

interface AdUnitProps {
  publisherId?: string;
  slotId?: string;
  isAlternative?: boolean;
  alternativeCode?: string; 
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ publisherId, slotId, isAlternative, alternativeCode, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, ""); 

  useEffect(() => {
    if (isAlternative && alternativeCode && adRef.current) {
      const container = adRef.current;
      container.innerHTML = ''; // تنظيف الحاوية لضمان عدم التكرار
      
      try {
        // 1. استخراج الـ HTML (الديفات)
        let htmlContent = alternativeCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").trim();
        
        // 2. معالجة الـ ID لتجنب التصادم
        const originalIdMatch = htmlContent.match(/id=["'](container-[^"']+)["']/);
        let targetId = "";
        
        if (originalIdMatch) {
          const originalId = originalIdMatch[1];
          targetId = `${originalId}-${uniqueId}`;
          htmlContent = htmlContent.replace(new RegExp(originalId, 'g'), targetId);
        }

        container.innerHTML = htmlContent;

        // 3. حقن السكربتات يدوياً لضمان التنفيذ
        const scriptTags = alternativeCode.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gim);
        if (scriptTags) {
          scriptTags.forEach((tag, idx) => {
            const scriptEl = document.createElement('script');
            
            const srcMatch = tag.match(/src=["'](.+?)["']/);
            if (srcMatch) scriptEl.src = srcMatch[1];
            
            if (tag.includes('async')) scriptEl.async = true;
            scriptEl.setAttribute('data-cfasync', 'false');

            const innerCodeMatch = tag.match(/>([\s\S]*?)<\/script>/);
            if (innerCodeMatch && innerCodeMatch[1].trim()) {
              let code = innerCodeMatch[1];
              if (originalIdMatch && targetId) {
                // توجيه السكربت للـ ID الجديد
                code = code.split(originalIdMatch[1]).join(targetId);
              }
              scriptEl.innerHTML = code;
            }

            // تأخير بسيط جداً لضمان أن المتصفح قد رسم الـ HTML
            setTimeout(() => {
              if (container) container.appendChild(scriptEl);
            }, (idx + 1) * 200);
          });
        }
      } catch (err) {
        console.error("AdUnit Error:", err);
      }
    } else if (publisherId && !isAlternative) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    }
  }, [alternativeCode, isAlternative, uniqueId]);

  return (
    <div className={`ad-unit-wrapper ${className}`}>
      <div className="flex items-center justify-center gap-2 mb-1 opacity-20">
        <span className="h-[px] w-4 bg-slate-500"></span>
        <span className="text-[6px] text-slate-500 font-black tracking-[0.4em] uppercase">Promotion</span>
        <span className="h-[1px] w-4 bg-slate-500"></span>
      </div>
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
