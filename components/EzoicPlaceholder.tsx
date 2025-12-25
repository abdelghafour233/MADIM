
import React, { useEffect } from 'react';

interface EzoicPlaceholderProps {
  id: number;
}

const EzoicPlaceholder: React.FC<EzoicPlaceholderProps> = ({ id }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.ezstandalone) {
        // @ts-ignore
        window.ezstandalone.cmd.push(function () {
          // @ts-ignore
          window.ezstandalone.showAds(id);
        });
      }
    } catch (e) {
      console.error('Ezoic placeholder error:', e);
    }
  }, [id]);

  return (
    <div className="ezoic-ad-wrapper my-8 flex justify-center">
      <div id={`ezoic-pub-ad-placeholder-${id}`}></div>
    </div>
  );
};

export default EzoicPlaceholder;
