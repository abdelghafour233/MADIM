
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
  const uniqueId = useId().replace(/:/g, ""); // توليد معرف فريد لكل نسخة من المكون

  useEffect(() => {
    if (isAlternative && alternativeCode && adRef.current) {
      const container = adRef.current;
      container.innerHTML = ''; // تنظيف الحاوية
      
      try {
        // 1. استخراج الـ HTML وإيجاد أي ID موجود
        let htmlContent = alternativeCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").trim();
        
        // إذا كان هناك ID في الكود (مثل container-f877...)، سنقوم بتغييره ليصبح فريداً
        const originalIdMatch = htmlContent.match(/id=["'](container-[^"']+)["']/);
        let targetId = "";
        
        if (originalIdMatch) {
          const originalId = originalIdMatch[1];
          targetId = `${originalId}-${uniqueId}`;
          htmlContent = htmlContent.replace(originalId, targetId);
        }

        container.innerHTML = htmlContent;

        // 2. معالجة السكربتات وتعديلها لتبحث عن الـ ID الجديد
        const scriptTags = alternativeCode.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gim);
        if (scriptTags) {
          scriptTags.forEach((tag, idx) => {
            const scriptEl = document.createElement('script');
            
            // استخراج الخصائص
            const srcMatch = tag.match(/src=["'](.+?)["']/);
            if (srcMatch) scriptEl.src = srcMatch[1];
            if (tag.includes('async')) scriptEl.async = true;
            scriptEl.setAttribute('data-cfasync', 'false');

            // استخراج الكود وتعديل الـ ID إذا لزم الأمر
            const innerCodeMatch = tag.match(/>([\s\S]*?)<\/script>/);
            if (innerCodeMatch && innerCodeMatch[1].trim()) {
              let code = innerCodeMatch[1];
              if (originalIdMatch && targetId) {
                // استبدال الـ ID القديم بالجديد داخل السكربت أيضاً
                code = code.split(originalIdMatch[1]).join(targetId);
              }
              scriptEl.innerHTML = code;
            }

            // إضافة السكربت بتأخير بسيط لضمان وجود الـ DOM
            setTimeout(() => {
              container.appendChild(scriptEl);
            }, (idx + 1) * 300);
          });
        }
      } catch (err) {
        console.error("Ad Injection Error:", err);
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
        <span className="h-[1px] w-4 bg-slate-500"></span>
        <span className="text-[7px] text-slate-500 font-black tracking-[0.3em] uppercase">ADVERTISEMENT</span>
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
