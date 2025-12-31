
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
      container.innerHTML = ''; 
      
      try {
        // 1. حقن الـ HTML
        let htmlPart = alternativeCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").trim();
        
        // تعديل الـ ID ليكون فريداً
        const idMatch = htmlPart.match(/id=["'](container-[^"']+)["']/);
        let currentId = "";
        if (idMatch) {
          currentId = idMatch[1];
          const newId = `${currentId}-${uniqueId}`;
          htmlPart = htmlPart.replace(new RegExp(currentId, 'g'), newId);
          currentId = newId;
        }
        
        container.innerHTML = htmlPart;

        // 2. معالجة وحقن السكربتات
        const scriptTags = alternativeCode.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gim);
        if (scriptTags) {
          scriptTags.forEach((tag, idx) => {
            const scriptEl = document.createElement('script');
            
            // خصائص السكربت
            const src = tag.match(/src=["'](.+?)["']/);
            if (src) scriptEl.src = src[1];
            if (tag.includes('async')) scriptEl.async = true;
            scriptEl.setAttribute('data-cfasync', 'false');

            // محتوى السكربت
            const inner = tag.match(/>([\s\S]*?)<\/script>/);
            if (inner && inner[1].trim()) {
              let code = inner[1];
              if (idMatch && currentId) {
                code = code.split(idMatch[1]).join(currentId);
              }
              scriptEl.innerHTML = code;
            }

            // إضافة السكربت للحاوية
            setTimeout(() => {
              if (container) container.appendChild(scriptEl);
            }, (idx + 1) * 250);
          });
        }
      } catch (err) {
        console.error("AdUnit Exception:", err);
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
        <span className="h-[1px] w-3 bg-slate-500"></span>
        <span className="text-[6px] text-slate-500 font-bold uppercase tracking-widest">Ad Service</span>
        <span className="h-[1px] w-3 bg-slate-500"></span>
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
