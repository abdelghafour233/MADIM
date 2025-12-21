
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
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn px-2">
      <h2 className="text-3xl font-black text-gray-900 mb-8">معلومات الشحن</h2>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="mb-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
          <span className="text-emerald-800 font-bold text-lg">المبلغ المطلوب دفعه:</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-600">{total.toLocaleString()}</span>
            <span className="font-bold text-emerald-600">د.م.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-800 font-bold mr-2">الاسم الكامل *</label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition text-lg"
              placeholder="مثلاً: محمد الإدريسي"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-800 font-bold mr-2">المدينة *</label>
            <select 
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition text-lg appearance-none cursor-pointer"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
            >
              <option value="">اختر مدينتك</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-800 font-bold mr-2">رقم الهاتف *</label>
            <input 
              type="tel" 
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition text-lg text-right"
              dir="ltr"
              placeholder="06XXXXXXXX"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            <p className="text-xs text-emerald-600 font-bold mt-2 pr-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              سنتصل بك لتأكيد طلبك قبل الشحن
            </p>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black text-2xl shadow-xl shadow-orange-100 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التأكيد...
                </span>
              ) : 'تأكيد الطلب الآن'}
            </button>
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="h-px w-8 bg-gray-200"></span>
              <p className="text-gray-400 text-sm font-bold">الدفع عند الاستلام</p>
              <span className="h-px w-8 bg-gray-200"></span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
