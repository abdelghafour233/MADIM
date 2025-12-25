
import React, { useState } from 'react';
import { Article, Settings, Category } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
  onPreviewArticle: (a: Article) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout, onPreviewArticle }) => {
  const [tab, setTab] = useState<'items' | 'ads' | 'new' | 'settings'>('items');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [showPass, setShowPass] = useState(false);
  
  const [newItem, setNewItem] = useState<Partial<Article>>({
    name: '', content: '', image: '', category: Category.TECH, isProduct: false, price: 0
  });

  const handlePublish = () => {
    if(!newItem.name || !newItem.content) return alert('البيانات ناقصة!');
    const art: Article = {
      ...newItem as Article,
      id: Date.now().toString(),
      rating: 5, views: 0, author: 'المدير',
      date: new Date().toLocaleDateString('ar-MA')
    };
    onUpdateArticles([art, ...articles]);
    alert('🚀 تم النشر بنجاح!');
    setTab('items');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 animate-fadeIn" dir="rtl">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between mb-10 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-3xl">⚙️</div>
          <div><h2 className="text-2xl font-black">لوحة التحكم</h2><p className="text-slate-400 font-bold text-sm">إدارة المحتوى والمتجر</p></div>
        </div>
        <button onClick={onLogout} className="mt-4 md:mt-0 px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-black">خروج</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <button onClick={() => setTab('items')} className={`px-8 py-4 rounded-2xl font-black ${tab === 'items' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-900'}`}>📦 المحتوى</button>
        <button onClick={() => setTab('new')} className={`px-8 py-4 rounded-2xl font-black ${tab === 'new' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900'}`}>➕ إضافة جديد</button>
        <button onClick={() => setTab('ads')} className={`px-8 py-4 rounded-2xl font-black ${tab === 'ads' ? 'bg-orange-600 text-white' : 'bg-white dark:bg-slate-900'}`}>💰 إعلانات</button>
        <button onClick={() => setTab('settings')} className={`px-8 py-4 rounded-2xl font-black ${tab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900'}`}>⚙️ إعدادات</button>
      </div>

      {tab === 'items' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map(a => (
            <div key={a.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 truncate">
                <img src={a.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                <span className="font-black truncate">{a.name} <small className="text-emerald-500">{a.isProduct ? '(منتج)' : '(مقال)'}</small></span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onPreviewArticle(a)} className="p-2 bg-blue-50 text-blue-600 rounded-xl">👁️</button>
                <button onClick={() => onUpdateArticles(articles.filter(i => i.id !== a.id))} className="p-2 bg-red-50 text-red-600 rounded-xl">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'new' && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-2xl font-black mb-6">إضافة {newItem.isProduct ? 'منتج' : 'مقال'} جديد</h3>
            <div className="flex gap-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button onClick={() => setNewItem({...newItem, isProduct: false})} className={`flex-1 py-3 rounded-xl font-black transition-all ${!newItem.isProduct ? 'bg-white shadow-md' : ''}`}>مقال</button>
              <button onClick={() => setNewItem({...newItem, isProduct: true})} className={`flex-1 py-3 rounded-xl font-black transition-all ${newItem.isProduct ? 'bg-white shadow-md' : ''}`}>منتج</button>
            </div>
            <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" placeholder="العنوان..." value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            {newItem.isProduct && (
              <input type="number" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" placeholder="السعر..." value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
            )}
            <textarea className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" placeholder="المحتوى..." value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
            <button onClick={handlePublish} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl">نشر الآن 🚀</button>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[40px] border-2 border-dashed border-slate-200">
            <h4 className="font-black mb-4 flex items-center gap-2">👁️ معاينة حية</h4>
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm">
              <div className="h-40 bg-slate-200"><img src={newItem.image} className="w-full h-full object-cover" /></div>
              <div className="p-6">
                <span className="text-xs font-black text-emerald-500">{newItem.category}</span>
                <h5 className="font-black text-lg mt-2">{newItem.name || 'العنوان يظهر هنا'}</h5>
                {newItem.isProduct && <p className="text-emerald-600 font-black">{newItem.price} د.م</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-2xl font-black mb-8 text-center">إعدادات الأمان 🔒</h3>
          <div className="relative mb-6">
            <label className="block text-xs font-black text-slate-400 mb-2 mr-2">كلمة سر اللوحة</label>
            <input 
              type={showPass ? "text" : "password"} 
              className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 transition-all" 
              value={localSettings.dashboardPassword} 
              onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} 
            />
            <button onClick={() => setShowPass(!showPass)} className="absolute left-4 top-11 text-xl">
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          <button onClick={() => {onUpdateSettings(localSettings); alert('تم الحفظ!');}} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl">حفظ التغييرات 💾</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
