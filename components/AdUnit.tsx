
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
      try {
        const range = document.createRange();
        const documentFragment = range.createContextualFragment(alternativeCode);
        adRef.current.innerHTML = '';
        adRef.current.appendChild(documentFragment);
        
        // محاولة تشغيل أي سكربتات تم حقنها يدوياً لضمان العمل على الهواتف
        const scripts = adRef.current.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const s = document.createElement('script');
          if (scripts[i].src) {
             s.src = scripts[i].src;
             s.async = true;
          } else {
             s.textContent = scripts[i].textContent;
          }
          document.body.appendChild(s);
        }
      } catch (e) {
        console.warn('Ad injection warning:', e);
      }
    }
  }, [alternativeCode, isAlternative]);

  if (isAlternative) {
    return (
      <div className="ad-container my-6 w-full flex flex-col items-center overflow-hidden">
        <span className="text-[8px] text-slate-500 font-black mb-1 opacity-30 tracking-[0.3em]">RECLAME</span>
        <div 
          ref={adRef}
          className="w-full min-h-[100px] flex justify-center items-center overflow-hidden rounded-2xl bg-white/5 border border-dashed border-white/10"
        >
          {!alternativeCode && (
            <div className="text-center p-4">
               <p className="font-black text-emerald-500 text-[10px]">مساحة إعلانية (Adsterra Native)</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ad-container my-8 w-full flex flex-col items-center">
      <div className="w-full min-h-[100px] bg-white/5 rounded-2xl flex items-center justify-center relative border border-white/5">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '100px' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId || 'default_slot'}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default AdUnit;
