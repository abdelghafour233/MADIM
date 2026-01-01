import React from 'react';

interface AdUnitProps {
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ className = "" }) => {
  const temuLink = "https://temu.to/k/u6zpr84k5n5";

  return (
    <div className={`temu-promo-banner ${className} px-4`}>
      <a 
        href={temuLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 rounded-[30px] p-6 md:p-8 border border-white/10 shadow-2xl transition-all hover:shadow-orange-500/20 active:scale-[0.98]"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="text-center md:text-right space-y-2">
              <span className="bg-white/20 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">عرض خاص من تيمو</span>
              <h3 className="text-xl md:text-3xl font-black text-white leading-tight">سجل الآن واحصل على حزمة كوبونات بقيمة 1000 درهم! 🎁</h3>
              <p className="text-white/80 text-sm font-bold">هذا العرض حصري للمستخدمين الجدد عبر رابطنا الرسمي.</p>
           </div>
           <div className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl group-hover:scale-110 transition-transform">
              احصل على الهدية 🔥
           </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none"></div>
      </a>
      <div className="mt-2 text-center">
         <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Promotion Partner: Temu Morocco</span>
      </div>
    </div>
  );
};

export default AdUnit;