
import React, { useState } from 'react';
import { Order, Settings, Product, Category } from '../types';

interface DashboardProps {
  orders: Order[];
  settings: Settings;
  products: Product[];
  onUpdateSettings: (s: Settings) => void;
  onUpdateProducts: (p: Product[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, settings, products, onUpdateSettings, onUpdateProducts }) => {
  const [tab, setTab] = useState<'orders' | 'products' | 'pixels' | 'domain'>('orders');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: Category.ELECTRONICS });

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) return;
    const prod: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description || '',
      image: newProduct.image,
      category: newProduct.category as Category
    };
    onUpdateProducts([prod, ...products]);
    setNewProduct({ category: Category.ELECTRONICS });
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
            onClick={() => setTab('domain')}
            className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'domain' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            إعدادات الدومين والربط
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
                <input 
                  className="p-3 border rounded-lg" placeholder="اسم المنتج" required
                  value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
                <input 
                  className="p-3 border rounded-lg" placeholder="السعر (MAD)" type="number" required
                  value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                />
                <select 
                  className="p-3 border rounded-lg"
                  value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                >
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input 
                  className="p-3 border rounded-lg" placeholder="رابط صورة المنتج" required
                  value={newProduct.image || ''} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                />
                <textarea 
                  className="p-3 border rounded-lg md:col-span-2" placeholder="وصف المنتج"
                  value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
                <button type="submit" className="bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-700 md:col-span-2">إضافة المنتج</button>
              </form>

              <h2 className="text-2xl font-bold mb-6">قائمة المنتجات الحالية</h2>
              <div className="space-y-4">
                {products.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.category} | {p.price.toLocaleString()} د.م.</p>
                      </div>
                    </div>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700">حذف</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'pixels' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">أكواد التتبع والبيانات</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">Facebook Pixel ID</label>
                  <input 
                    className="w-full p-3 border rounded-lg" placeholder="مثال: 1234567890"
                    value={localSettings.fbPixel} onChange={e => setLocalSettings({...localSettings, fbPixel: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Google Analytics ID</label>
                  <input 
                    className="w-full p-3 border rounded-lg" placeholder="مثال: G-XXXXXXX"
                    value={localSettings.googleAnalytics} onChange={e => setLocalSettings({...localSettings, googleAnalytics: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">TikTok Pixel ID</label>
                  <input 
                    className="w-full p-3 border rounded-lg" placeholder="مثال: C6XXXXXXXX"
                    value={localSettings.tiktokPixel} onChange={e => setLocalSettings({...localSettings, tiktokPixel: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Google Sheets Webhook URL</label>
                  <input 
                    className="w-full p-3 border rounded-lg text-left" dir="ltr" placeholder="https://script.google.com/macros/s/..."
                    value={localSettings.googleSheetsWebhook} onChange={e => setLocalSettings({...localSettings, googleSheetsWebhook: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 mt-1">يتم إرسال الطلبات تلقائياً إلى هذا الرابط فور إتمامها.</p>
                </div>
              </div>

              <button 
                onClick={handleSaveSettings}
                className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-emerald-700 transition"
              >
                حفظ التغييرات
              </button>
            </div>
          )}

          {tab === 'domain' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">إعدادات الدومين والربط</h2>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm mb-6">
                استخدم هذه الإعدادات لربط متجرك بالدومين الخاص بك بشكل احترافي.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2">اسم الدومين (Domain)</label>
                  <input 
                    className="w-full p-3 border rounded-lg text-left" dir="ltr"
                    value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">خادم الأسماء (Name Server)</label>
                  <input 
                    className="w-full p-3 border rounded-lg text-left" dir="ltr"
                    value={localSettings.nameServer} onChange={e => setLocalSettings({...localSettings, nameServer: e.target.value})}
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveSettings}
                className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-emerald-700 transition"
              >
                تحديث إعدادات النطاق
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
