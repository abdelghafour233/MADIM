
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onCheckout: () => void;
  onClose: () => void;
  darkMode: boolean;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQuantity, onCheckout, onClose, darkMode }) => {
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

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

              {items.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-7xl block mb-6">🛍️</span>
                  <p className="text-slate-500 font-bold text-lg">سلتك فارغة حالياً..</p>
                  <button onClick={onClose} className="mt-6 text-emerald-600 font-black">ابدأ التسوق الآن ←</button>
                </div>
              ) : (
                <ul role="list" className="space-y-8">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl px-4 border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>

                      <div className="mr-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-black">
                            <h3 className={`line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</h3>
                            <p className="mr-4 text-emerald-600">{item.price} د.م.</p>
                          </div>
                          <p className="mt-1 text-sm text-slate-400">{item.category}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm mt-4">
                          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-800">
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center font-black hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">-</button>
                            <span className="font-black px-2">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center font-black hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">+</button>
                          </div>
                          <button onClick={() => onRemove(item.id)} className="font-black text-red-500 hover:text-red-600 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-lg">حذف</button>
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
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>المجموع الإجمالي</span>
                  <span className="text-emerald-600">{total.toLocaleString()} د.م.</span>
                </div>
                <p className="text-xs text-slate-400 font-bold text-center">يتم احتساب مصاريف الشحن عند تأكيد الطلب حسب مدينتك.</p>
                <button 
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center rounded-2xl border border-transparent bg-emerald-600 px-6 py-5 text-xl font-black text-white shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
                >
                  إتمام الطلب الآن (الدفع عند الاستلام)
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
