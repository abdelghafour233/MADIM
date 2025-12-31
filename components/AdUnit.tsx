
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
      // تفريغ الحاوية أولاً
      adRef.current.innerHTML = '';
      
      // إنشاء حاوية مؤقتة لتحليل الكود
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = alternativeCode.trim();
      
      // استخراج السكربتات وتنفيذها يدوياً
      const scripts = tempDiv.getElementsByTagName('script');
      const nonScriptHtml = alternativeCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
      
      // وضع الـ HTML العادي (مثل الديفات)
      adRef.current.innerHTML = nonScriptHtml;

      // حقن السكربتات واحداً تلو الآخر لضمان التنفيذ
      Array.from(scripts).forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // نقل كافة الخصائص (src, async, type, الخ)
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // نقل الكود الداخلي إذا وجد
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        
        // إضافة السكربت للجسم لضمان العمل العالمي أو للحاوية
        if (newScript.src) {
           document.head.appendChild(newScript);
        } else {
           adRef.current?.appendChild(newScript);
        }
      });
    } else if (publisherId && !isAlternative) {
      // التعامل مع AdSense
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense Error", e);
      }
    }
  }, [alternativeCode, isAlternative, publisherId]);

  return (
    <div className="ad-unit-wrapper my-6 w-full flex flex-col items-center">
      <span className="text-[7px] text-slate-500 font-black mb-1 opacity-20 tracking-[0.4em] uppercase">إعلان</span>
      <div 
        ref={adRef}
        className="w-full min-h-[50px] flex justify-center items-center overflow-hidden rounded-xl"
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
