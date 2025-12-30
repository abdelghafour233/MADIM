
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onCheckout: () => void;
  onClose: () => void;
  darkMode: boolean;
  adCode?: string; // إمكانية تمرير كود إعلاني للسلة
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQuantity, onCheckout, onClose, darkMode, adCode }) => {
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  // حقن الإعلان في السلة
  const renderAd = () => {
    if (!adCode) return null;
    return (
      <div className="my-6 p-4 bg-emerald-500/5 border border-dashed border-emerald-500/20 rounded-2xl overflow-hidden flex justify-center">
         <div dangerouslySetInnerHTML={{ __html: adCode }} />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className={`relative w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 animate-slideLeft ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="h-full flex flex-col shadow-2xl overflow-y-scroll no-scrollbar">
            <div className="flex-1 py-6 overflow-y-auto px-6">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`} id="slide-over-title">سلة التسوق 🛒</h2>
                <div className="mr-3 h-7 flex items-center">
                  <button onClick={onClose} className="p-2 -m-2 text-slate-400 hover:text-slate-500">✕</button>
                </div>
              </div>

              {renderAd()}

              {items.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-7xl block mb-6">🛍️</span>
                  <p className="text-slate-500 font-bold text-lg">سلتك فارغة حالياً..</p>
                </div>
              ) : (
                <ul role="list" className="space-y-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl px-4 border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>

                      <div className="mr-4 flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-black">
                          <h3 className={`line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</h3>
                          <p className="mr-4 text-emerald-600 font-black">{item.price} د.م.</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm mt-2">
                           <div className="flex items-center gap-2">
                             <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-white dark:bg-slate-700 rounded-md">-</button>
                             <span className="font-bold">{item.quantity}</span>
                             <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-white dark:bg-slate-700 rounded-md">+</button>
                           </div>
                           <button onClick={() => onRemove(item.id)} className="text-red-500 font-bold">حذف</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 py-8 px-6 space-y-6">
                <div className="flex justify-between text-2xl font-black">
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>المجموع</span>
                  <span className="text-emerald-600">{total.toLocaleString()} د.م.</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-emerald-600 px-6 py-5 text-xl font-black text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-all"
                >
                  إتمام الطلب الآن
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
