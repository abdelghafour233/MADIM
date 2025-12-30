
import React, { useState } from 'react';
import { Reward, Settings } from '../types';

interface RewardsCenterProps {
  rewards: Reward[];
  settings: Settings;
  darkMode: boolean;
}

const RewardsCenter: React.FC<RewardsCenterProps> = ({ rewards, settings, darkMode }) => {
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleReveal = (reward: Reward) => {
    // فتح رابط أدستيرا المباشر لزيادة الأرباح
    if (settings.directLinkCode) {
      window.open(settings.directLinkCode, '_blank');
    }
    setRevealedId(reward.id);
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-12 md:py-20" dir="rtl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-orange-600/30">🎁</div>
           <div>
             <h2 className="text-2xl md:text-4xl font-black">مركز الهدايا والكوبونات</h2>
             <p className="text-slate-500 font-bold text-sm md:text-lg">افتح الصناديق واحصل على أكواد خصم حصرية</p>
           </div>
        </div>
        <div className="bg-orange-600/10 text-orange-500 px-6 py-3 rounded-2xl border border-orange-500/20 font-black animate-pulse">
           متبقي 5 هدايا اليوم فقط! ⏳
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {rewards.map((reward) => (
          <div 
            key={reward.id} 
            className={`relative overflow-hidden group transition-all duration-500 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'} border-2 rounded-[40px] p-6 flex flex-col items-center text-center h-full`}
          >
            {/* Background Glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 transition-all group-hover:scale-150 ${reward.type === 'coupon' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>

            <div className="relative z-10 w-full">
              <div className="mb-6 relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                <img 
                  src={reward.image} 
                  className={`w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-700 ${revealedId === reward.id ? 'scale-90 rotate-3' : 'group-hover:rotate-6 group-hover:scale-110'}`} 
                  alt={reward.title} 
                />
                {revealedId !== reward.id && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl flex items-center justify-center text-3xl animate-pulse">🔒</div>
                )}
              </div>

              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full mb-4 inline-block uppercase tracking-widest ${reward.type === 'coupon' ? 'bg-emerald-600/20 text-emerald-500' : 'bg-orange-600/20 text-orange-500'}`}>
                {reward.store || 'هدية حصرية'}
              </span>

              <h3 className="text-xl md:text-2xl font-black mb-3">{reward.title}</h3>
              <p className="text-slate-400 text-xs md:text-sm font-medium mb-8 leading-relaxed line-clamp-2">{reward.description}</p>

              {revealedId === reward.id ? (
                <div className="space-y-4 animate-fadeIn">
                   <div className="bg-white/10 border-2 border-dashed border-emerald-500/50 p-4 rounded-2xl flex items-center justify-between gap-4">
                      <span className="text-xl md:text-2xl font-black text-emerald-500 font-mono tracking-widest">{reward.code}</span>
                      <button 
                        onClick={() => handleCopy(reward.code, reward.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${copiedId === reward.id ? 'bg-emerald-600 text-white' : 'bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`}
                      >
                        {copiedId === reward.id ? 'تم!' : 'نسخ'}
                      </button>
                   </div>
                   <p className="text-[10px] text-emerald-500 font-bold">✅ الكود مفعل وصالح للاستخدام الآن</p>
                </div>
              ) : (
                <button 
                  onClick={() => handleReveal(reward)}
                  className={`w-full py-4 md:py-6 rounded-2xl font-black text-lg md:text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${reward.type === 'coupon' ? 'bg-emerald-600 shadow-emerald-600/30 hover:bg-emerald-500' : 'bg-orange-600 shadow-orange-600/30 hover:bg-orange-500'}`}
                >
                  <span>كشف الكود مجاناً</span>
                  <span className="text-2xl">🔥</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RewardsCenter;
