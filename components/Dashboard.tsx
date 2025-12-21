
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const netlifyNS = [
    'dns1.p01.nsone.net',
    'dns2.p01.nsone.net',
    'dns3.p01.nsone.net',
    'dns4.p01.nsone.net'
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ: ' + text);
  };

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

  const handleAddOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('يرجى التأكد من ملء الاسم والسعر وتحميل صورة للمنتج');
      return;
    }

    if (editingId) {
      const updatedProducts = products.map(p => 
        p.id === editingId ? { ...p, ...newProduct as Product } : p
      );
      onUpdateProducts(updatedProducts);
      setEditingId(null);
      alert('تم تحديث المنتج بنجاح');
    } else {
      const prod: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProduct.name,
        price: Number(newProduct.price),
        description: newProduct.description || '',
        image: newProduct.image,
        category: newProduct.category as Category
      };
      onUpdateProducts([prod, ...products]);
      alert('تم إضافة المنتج بنجاح');
    }
    setNewProduct({ category: Category.ELECTRONICS, image: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewProduct({ category: Category.ELECTRONICS, image: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      onUpdateProducts(products.filter(p => p.id !== id));
      if (editingId === id) cancelEditing();
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button onClick={() => setTab('orders')} className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            إدارة الطلبات ({orders.length})
          </button>
          <button onClick={() => setTab('products')} className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'products' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            إدارة المنتجات
          </button>
          <button onClick={() => setTab('pixels')} className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'pixels' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            إدارة البكسلات
          </button>
          <button onClick={() => setTab('domain')} className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'domain' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            إعدادات الدومين
          </button>
          <button onClick={() => setTab('security')} className={`w-full text-right p-4 rounded-xl font-bold transition ${tab === 'security' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            إعدادات الأمان
          </button>
          <button onClick={onLogout} className="w-full text-right p-4 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition mt-4">
            تسجيل الخروج
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow bg-white rounded-2xl shadow-sm p-8 min-h-[500px]">
          {tab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">الطلبات الواردة</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b text-gray-500">
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
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-2xl font-bold text-gray-800">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                {editingId && <button onClick={cancelEditing} className="text-red-500 hover:text-red-700 text-sm font-bold">إلغاء التعديل</button>}
              </div>
              <form onSubmit={handleAddOrUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 bg-gray-50 p-6 rounded-xl border">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">اسم المنتج</label>
                  <input className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="اسم المنتج" required value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">السعر (MAD)</label>
                  <input className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0.00" type="number" required value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">التصنيف</label>
                  <select className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}>
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">صورة المنتج</label>
                  <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="product-image-upload" />
                    <label htmlFor="product-image-upload" className="flex-grow cursor-pointer bg-white border-2 border-dashed border-emerald-300 hover:border-emerald-500 p-3 rounded-lg text-center text-emerald-600 font-bold transition">
                      {newProduct.image ? 'تغيير الصورة' : 'تحميل صورة'}
                    </label>
                    {newProduct.image && <div className="w-12 h-12 rounded overflow-hidden border"><img src={newProduct.image} className="w-full h-full object-cover" alt="Preview" /></div>}
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">وصف المنتج</label>
                  <textarea className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]" placeholder="وصف المنتج..." value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                <button type="submit" className="bg-emerald-600 text-white p-4 rounded-lg font-bold hover:bg-emerald-700 md:col-span-2 shadow-md transition-all active:scale-95">
                  {editingId ? 'تحديث بيانات المنتج' : 'إضافة المنتج للمتجر'}
                </button>
              </form>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">قائمة المنتجات الحالية</h2>
              <div className="space-y-4">
                {products.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 bg-white shadow-sm transition-all ${editingId === p.id ? 'ring-2 ring-emerald-500 border-transparent bg-emerald-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover border" />
                      <div>
                        <p className="font-bold text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.category} | <span className="text-emerald-600 font-bold">{p.price.toLocaleString()} د.م.</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditing(p)} className="text-emerald-500 hover:text-emerald-700 p-2 rounded-full hover:bg-emerald-50 transition" title="تحرير">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition" title="حذف">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'domain' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">إعدادات الدومين</h2>
              
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 mb-6">
                <p className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                   خوادم الأسماء لربط متجرك (Netlify NS):
                </p>
                <div className="space-y-3">
                  {netlifyNS.map((ns, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
                      <code className="text-emerald-700 font-mono text-sm">{ns}</code>
                      <button 
                        onClick={() => copyToClipboard(ns)}
                        className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md hover:bg-emerald-200 transition font-bold"
                      >
                        نسخ الخادم
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-emerald-600 italic">قم بنسخ هذه الخوادم ووضعها في إعدادات الـ DNS في حسابك على GoDaddy.</p>
              </div>

              <div className="flex flex-col gap-4">
                <label className="block font-bold text-gray-700">اسم الدومين الخاص بك</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-grow p-4 border rounded-xl text-left outline-none focus:ring-2 focus:ring-emerald-500 text-lg" 
                    dir="ltr" 
                    placeholder="example.com"
                    value={localSettings.domain} 
                    onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} 
                  />
                  <button 
                    onClick={handleSaveSettings} 
                    className="bg-emerald-600 text-white px-8 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md active:scale-95"
                  >
                    حفظ الدومين
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">إعدادات الأمان</h2>
              <div>
                <label className="block font-bold mb-2">كلمة مرور لوحة التحكم</label>
                <input type="password" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="أدخل كلمة المرور الجديدة" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
              </div>
              <button onClick={handleSaveSettings} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-emerald-700 transition">تحديث كلمة المرور</button>
            </div>
          )}

          {tab === 'pixels' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">أكواد التتبع</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">Facebook Pixel ID</label>
                  <input className="w-full p-3 border rounded-lg outline-none" placeholder="1234567890" value={localSettings.fbPixel} onChange={e => setLocalSettings({...localSettings, fbPixel: e.target.value})} />
                </div>
                <div>
                  <label className="block font-bold mb-1">Google Analytics ID</label>
                  <input className="w-full p-3 border rounded-lg outline-none" placeholder="G-XXXXXXX" value={localSettings.googleAnalytics} onChange={e => setLocalSettings({...localSettings, googleAnalytics: e.target.value})} />
                </div>
              </div>
              <button onClick={handleSaveSettings} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-emerald-700 transition">حفظ التغييرات</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
