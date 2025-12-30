
import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  publisherId?: string;
  slotId?: string;
  isAlternative?: boolean;
  alternativeCode?: string; // هذا الحقل سيستقبل كود Adsterra
}

const AdUnit: React.FC<AdUnitProps> = ({ publisherId, slotId, isAlternative, alternativeCode }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // إذا كان هناك كود يدوي (Adsterra)، نقوم بتنفيذه
    if (isAlternative && alternativeCode && adRef.current) {
      const range = document.createRange();
      const documentFragment = range.createContextualFragment(alternativeCode);
      adRef.current.innerHTML = '';
      adRef.current.appendChild(documentFragment);
    }
  }, [alternativeCode, isAlternative]);

  if (isAlternative) {
    return (
      <div className="ad-container my-10 w-full flex flex-col items-center">
        <span className="text-[9px] text-slate-400 font-black mb-2 uppercase tracking-[0.2em]">إعلان ممول</span>
        <div 
          ref={adRef}
          className="w-full min-h-[100px] flex justify-center items-center overflow-hidden rounded-2xl bg-emerald-500/5 border border-dashed border-emerald-500/20"
        >
          {!alternativeCode && (
            <div className="text-center p-6">
               <p className="font-black text-emerald-500 text-sm">مساحة إعلانية نشطة (Adsterra)</p>
               <p className="text-[10px] opacity-50">ضع الكود في لوحة التحكم ليظهر هنا</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ad-container my-12 w-full flex flex-col items-center overflow-hidden">
      <span className="text-[9px] text-slate-400 font-black mb-2 uppercase tracking-widest">إعلان</span>
      <div className="w-full min-h-[120px] bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center relative border border-slate-100 dark:border-slate-800">
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
