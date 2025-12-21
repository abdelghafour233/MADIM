
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-bold mb-4">سلة المشتريات فارغة</h2>
        <p className="text-gray-500 mb-8">لم تضف أي منتجات بعد. ابدأ بالتسوق الآن!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <h2 className="text-3xl font-bold mb-8">سلة المشتريات</h2>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        {items.map(item => (
          <div key={item.product.id} className="flex flex-col md:flex-row items-center gap-6 py-6 border-b last:border-b-0">
            <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
            <div className="flex-grow text-center md:text-right">
              <h3 className="font-bold text-lg text-gray-900">{item.product.name}</h3>
              <p className="text-emerald-600 font-bold">{item.product.price.toLocaleString()} د.م.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button 
                  onClick={() => onUpdateQty(item.product.id, -1)}
                  className="px-3 py-1 text-gray-500 hover:text-emerald-600 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQty(item.product.id, 1)}
                  className="px-3 py-1 text-gray-500 hover:text-emerald-600 font-bold"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => onRemove(item.product.id)}
                className="text-red-500 hover:text-red-600 p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <span className="text-gray-500">الإجمالي النهائي:</span>
          <p className="text-3xl font-bold text-emerald-600">{total.toLocaleString()} د.م.</p>
        </div>
        <button 
          onClick={onCheckout}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-12 rounded-xl font-bold text-xl transition mt-6 md:mt-0 w-full md:w-auto"
        >
          إتمام الطلب الآن
        </button>
      </div>
    </div>
  );
};

export default Cart;
