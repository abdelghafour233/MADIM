
import React, { useEffect } from 'react';

interface AdUnitProps {
  publisherId: string;
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

const AdUnit: React.FC<AdUnitProps> = ({ publisherId, slotId = 'default_slot', format = 'auto' }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  const cleanPubId = publisherId.includes('ca-pub-') ? publisherId : `ca-pub-${publisherId}`;

  return (
    <div className="ad-container my-12 w-full flex flex-col items-center overflow-hidden">
      <span className="text-[10px] text-slate-400 font-black mb-2 uppercase tracking-widest">إعلان مدفوع</span>
      <div className="w-full min-h-[120px] bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center relative border border-slate-100 dark:border-slate-800">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '100px' }}
          data-ad-client={cleanPubId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default AdUnit;
