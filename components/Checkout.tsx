
import React, { useState } from 'react';
import { CITIES } from '../constants';

interface CheckoutProps {
  total: number;
  onPlaceOrder: (data: { name: string; city: string; phone: string }) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ total, onPlaceOrder }) => {
  const [formData, setFormData] = useState({ name: '', city: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.phone) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onPlaceOrder(formData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-3xl font-bold mb-8">إتمام الطلب</h2>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="mb-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between">
          <span className="text-emerald-800 font-bold">المبلغ المطلوب دفعه:</span>
          <span className="text-2xl font-bold text-emerald-600">{total.toLocaleString()} د.م.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">الاسم الكامل *</label>
            <input 
              type="text" 
              required
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              placeholder="أدخل اسمك الكامل"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">المدينة *</label>
            <select 
              required
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
            >
              <option value="">اختر مدينتك</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">رقم الهاتف *</label>
            <input 
              type="tel" 
              required
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition text-right"
              dir="ltr"
              placeholder="06XXXXXXXX"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">سوف نتصل بك لتأكيد الطلب</p>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-xl transition disabled:bg-gray-400"
            >
              {loading ? 'جاري معالجة الطلب...' : 'تأكيد الطلب والدفع عند الاستلام'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">الدفع يكون نقداً عند استلام المنتج</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
