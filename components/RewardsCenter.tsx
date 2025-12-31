
import React, { useState } from 'react';
import { Reward, Settings } from '../types';

interface RewardsCenterProps {
  rewards: Reward[];
  settings: Settings;
  darkMode: boolean;
}

const RewardsCenter: React.FC<RewardsCenterProps> = ({ rewards, settings }) => {
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleReveal = (reward: Reward) => {
    if (settings.directLinkCode) window.open(settings.directLinkCode, '_blank');
    setRevealedId(reward.id);
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-10 md:py-20 px-4" dir="rtl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-orange-600/30 animate-bounce">🎁</div>
           <div>
             <h2 className="text-3xl md:text-5xl font-black tracking-tight">صندوق الهدايا</h2>
             <p className="text-slate-500 font-bold text-lg opacity-60">كوبونات حصرية لزوار عبدو ويب الأوفياء</p>
           </div>
        </div>
        <div className="glass px-8 py-4 rounded-2xl border-orange-500/20 text-orange-500 font-black text-sm flex items-center gap-3">
           <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
           العروض تنتهي قريباً!
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rewards.map((reward) => (
          <div 
            key={reward.id} 
            className="relative overflow-hidden group glass card-hover rounded-[45px] p-8 flex flex-col items-center text-center h-full border-white/5"
          >
            <div className="relative z-10 w-full">
              <div className="mb-8 relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                <img 
                  src={reward.image} 
                  className={`w-full h-full object-cover rounded-[35px] shadow-2xl transition-all duration-700 ${revealedId === reward.id ? 'scale-90 rotate-3 grayscale-0' : 'group-hover:rotate-6 group-hover:scale-110 grayscale-[0.8]'}`} 
                  alt={reward.title} 
                />
                {revealedId !== reward.id && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-[35px] flex items-center justify-center text-4xl group-hover:scale-110 transition-all cursor-pointer" onClick={() => handleReveal(reward)}>🔒</div>
                )}
              </div>

              <span className={`text-[9px] font-black px-5 py-2 rounded-full mb-6 inline-block uppercase tracking-[0.2em] border ${reward.type === 'coupon' ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-600/10 text-orange-500 border-orange-500/20'}`}>
                {reward.store || 'هدية حصرية'}
              </span>

              <h3 className="text-2xl md:text-3xl font-black mb-4 group-hover:text-emerald-500 transition-colors">{reward.title}</h3>
              <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed opacity-60">{reward.description}</p>

              {revealedId === reward.id ? (
                <div className="space-y-4 animate-fadeIn">
                   <div className="bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 p-5 rounded-3xl flex items-center justify-between gap-4">
                      <span className="text-2xl md:text-3xl font-black text-emerald-500 font-mono tracking-[0.2em]">{reward.code}</span>
                      <button 
                        onClick={() => handleCopy(reward.code, reward.id)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${copiedId === reward.id ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white hover:bg-emerald-600'}`}
                      >
                        {copiedId === reward.id ? '✓' : '📋'}
                      </button>
                   </div>
                   <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">الكود يعمل بنجاح ✅</p>
                </div>
              ) : (
                <button 
                  onClick={() => handleReveal(reward)}
                  className={`w-full py-6 rounded-[25px] font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${reward.type === 'coupon' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20'}`}
                >
                  كشف الكود 🔥
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
