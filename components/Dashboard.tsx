
import React, { useState, useRef } from 'react';
import { Order, Settings, Product, Category } from '../types.ts';

interface DashboardProps {
  orders: Order[];
  settings: Settings;
  products: Product[];
  onUpdateSettings: (s: Settings) => void;
  onUpdateProducts: (p: Product[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, settings, products, onUpdateSettings, onUpdateProducts, onLogout }) => {
  const [tab, setTab] = useState<'orders' | 'products' | 'pixels' | 'domain' | 'security'>('orders');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: Category.ELECTRONICS, image: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('يرجى التأكد من ملء الاسم والسعر وتحميل صورة للمنتج');
      return;
    }
    const prod: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description || '',
      image: newProduct.image,
      category: newProduct.category as Category
    };
    onUpdateProducts([prod, ...products]);
    setNewProduct({ category: Category.ELECTRONICS, image: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
    alert('تم إضافة المنتج بنجاح');
  };

  const deleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setTab('orders')}
            className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            إدارة الطلبات ({orders.length})
          </button>
          <button 
            onClick={() => setTab('products')}
            className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'products' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            إدارة المنتجات
          </button>
          <button 
            onClick={() => setTab('pixels')}
            className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'pixels' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            إدارة البكسلات وتتبع البيانات
          </button>
          <button 
            onClick={() => setTab('security')}
            className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'security' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            إعدادات الأمان
          </button>
          <button 
            onClick={() => setTab('domain')}
            className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'domain' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            إعدادات الدومين والربط
          </button>
          <button 
            onClick={onLogout}
            className="w-full text-right p-4 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition mt-4"
          >
            تسجيل الخروج
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow bg-white rounded-2xl shadow-sm p-8 min-h-[500px]">
          {tab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">الطلبات الواردة</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-2">التاريخ</th>
                      <th className="py-4 px-2">الزبون</th>
                      <th className="py-4 px-2">المدينة</th>
                      <th className="py-4 px-2">الهاتف</th>
                      <th className="py-4 px-2">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-2 text-sm">{new Date(order.date).toLocaleDateString('ar-MA')}</td>
                        <td className="py-4 px-2 font-bold">{order.customerName}</td>
                        <td className="py-4 px-2">{order.city}</td>
                        <td className="py-4 px-2" dir="ltr">{order.phone}</td>
                        <td className="py-4 px-2 text-emerald-600 font-bold">{order.total.toLocaleString()} د.م.</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} className="py-10 text-center text-gray-400">لا يوجد طلبات حالياً</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">إضافة منتج جديد</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 bg-gray-50 p-6 rounded-xl border">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">اسم المنتج</label>
                  <input 
                    className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="مثال: هاتف ذكي" required
                    value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">السعر (MAD)</label>
                  <input 
                    className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0.00" type="number" required
                    value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">التصنيف</label>
                  <select 
                    className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                  >
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">صورة المنتج</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      id="product-image-upload"
                    />
                    <label 
                      htmlFor="product-image-upload"
                      className="flex-grow cursor-pointer bg-white border-2 border-dashed border-emerald-300 hover:border-emerald-500 p-3 rounded-lg text-center text-emerald-600 font-bold transition"
                    >
                      {newProduct.image ? 'تم اختيار صورة' : 'إضغط لتحميل صورة'}
                    </label>
                    {newProduct.image && (
                      <div className="w-12 h-12 rounded overflow-hidden border">
                        <img src={newProduct.image} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">وصف المنتج</label>
                  <textarea 
                    className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]" placeholder="اكتب تفاصيل المنتج هنا..."
                    value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                <button type="submit" className="bg-emerald-600 text-white p-4 rounded-lg font-bold hover:bg-emerald-700 md:col-span-2 shadow-md transition-all active:scale-95">
                  إضافة المنتج للمتجر
                </button>
              </form>

              <h2 className="text-2xl font-bold mb-6">قائمة المنتجات الحالية</h2>
              <div className="space-y-4">
                {products.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover border" />
                      <div>
                        <p className="font-bold text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.category} | <span className="text-emerald-600 font-bold">{p.price.toLocaleString()} د.م.</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteProduct(p.id)} 
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                      title="حذف المنتج"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">إعدادات الأمان</h2>
              <div>
                <label className="block font-bold mb-2">كلمة مرور لوحة التحكم</label>
                <input 
                  type="password"
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})}
                />
                <p className="text-xs text-gray-400 mt-2 italic">كلمة المرور هذه مطلوبة للوصول إلى هذه المنطقة.</p>
              </div>
              <button 
                onClick={handleSaveSettings}
                className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-emerald-700 transition"
              >
                تحديث كلمة المرور
              </button>
            </div>
          )}

          {tab === 'pixels' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">أكواد التتبع والبيانات</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">Facebook Pixel ID</label>
                  <input 
                    className="w-full p-3 border rounded-lg outline-none" placeholder="مثال: 1234567890"
                    value={localSettings.fbPixel} onChange={e => setLocalSettings({...localSettings, fbPixel: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Google Analytics ID</label>
                  <input 
                    className="w-full p-3 border rounded-lg outline-none" placeholder="مثال: G-XXXXXXX"
                    value={localSettings.googleAnalytics} onChange={e => setLocalSettings({...localSettings, googleAnalytics: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">TikTok Pixel ID</label>
                  <input 
                    className="w-full p-3 border rounded-lg outline-none" placeholder="مثال: C6XXXXXXXX"
                    value={localSettings.tiktokPixel} onChange={e => setLocalSettings({...localSettings, tiktokPixel: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Google Sheets Webhook URL</label>
                  <input 
                    className="w-full p-3 border rounded-lg text-left outline-none" dir="ltr" placeholder="https://script.google.com/macros/s/..."
                    value={localSettings.googleSheetsWebhook} onChange={e => setLocalSettings({...localSettings, googleSheetsWebhook: e.target.value})}
                  />
                </div>
              </div>
              <button onClick={handleSaveSettings} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-emerald-700 transition">حفظ التغييرات</button>
            </div>
          )}

          {tab === 'domain' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">إعدادات الدومين والربط</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2">اسم الدومين</label>
                  <input className="w-full p-3 border rounded-lg text-left outline-none" dir="ltr" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
                </div>
                <div>
                  <label className="block font-bold mb-2">خادم الأسماء</label>
                  <input className="w-full p-3 border rounded-lg text-left outline-none" dir="ltr" value={localSettings.nameServer} onChange={e => setLocalSettings({...localSettings, nameServer: e.target.value})} />
                </div>
              </div>
              <button onClick={handleSaveSettings} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-emerald-700 transition">تحديث الإعدادات</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
