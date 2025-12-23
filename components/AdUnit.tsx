
import React, { useEffect } from 'react';

interface AdUnitProps {
  publisherId: string;
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
}

const AdUnit: React.FC<AdUnitProps> = ({ publisherId, slotId = 'default_slot', format = 'auto', style }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  // Clean the publisher ID if it contains 'ca-pub-'
  const cleanPubId = publisherId.includes('ca-pub-') ? publisherId : `ca-pub-${publisherId}`;

  return (
    <div className="ad-container my-10 w-full flex justify-center overflow-hidden">
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', minWidth: '250px', minHeight: '100px' }}
        data-ad-client={cleanPubId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdUnit;
