
import React from 'react';
import { Product } from '../types';

interface CartProps {
  items: { product: Product; quantity: number }[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQty, onCheckout }) => {
  const total = items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fadeIn">
        <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-4">سلة المشتريات فارغة</h2>
        <p className="text-gray-500 text-lg mb-8">لم تضف أي منتجات بعد. ابدأ بالتسوق الآن!</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100"
        >
          اكتشف منتجاتنا
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn px-2">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-900">سلة التسوق</h2>
        <span className="bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full font-bold text-sm">
          {items.length} منتجات
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-8 mb-8 space-y-6">
        {items.map(item => (
          <div key={item.product.id} className="flex flex-col md:flex-row items-center gap-6 py-6 border-b border-gray-50 last:border-b-0">
            <img src={item.product.image} alt={item.product.name} className="w-28 h-28 object-cover rounded-2xl shadow-sm border" />
            <div className="flex-grow text-center md:text-right">
              <h3 className="font-bold text-xl text-gray-900 mb-1">{item.product.name}</h3>
              <p className="text-emerald-600 font-black text-lg">{item.product.price.toLocaleString()} د.م.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-gray-50 rounded-2xl p-1 border">
                <button 
                  onClick={() => onUpdateQty(item.product.id, -1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-600 font-black transition"
                >
                  -
                </button>
                <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQty(item.product.id, 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-600 font-black transition"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => onRemove(item.product.id)}
                className="text-red-400 hover:text-red-600 p-3 hover:bg-red-50 rounded-2xl transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-50 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-gray-400 font-bold block mb-1">المجموع الكلي للحساب:</span>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-emerald-600">{total.toLocaleString()}</p>
            <span className="text-xl font-bold text-emerald-600">د.م.</span>
          </div>
        </div>
        <button 
          onClick={onCheckout}
          className="bg-orange-600 hover:bg-orange-700 text-white py-5 px-14 rounded-2xl font-black text-xl shadow-xl shadow-orange-100 transition-all active:scale-95 w-full md:w-auto"
        >
          أطلب الآن (دفع عند الاستلام)
        </button>
      </div>
    </div>
  );
};

export default Cart;
