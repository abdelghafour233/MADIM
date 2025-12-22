
import React, { useState } from 'react';
import { Article, Settings, Category } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout }) => {
  const [tab, setTab] = useState<'articles' | 'settings'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ 
    category: Category.REVIEWS, 
    rating: 5
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const articleData: Article = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: newArticle.name || '',
      price: Number(newArticle.price) || 0,
      content: newArticle.content || '',
      image: newArticle.image || '',
      category: newArticle.category as Category,
      rating: Number(newArticle.rating) || 5
    };

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? articleData : a));
    } else {
      onUpdateArticles([articleData, ...articles]);
    }
    setNewArticle({ category: Category.REVIEWS, rating: 5 });
    setEditingId(null);
    alert('تم حفظ المقال بنجاح');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-4 mb-8">
        <button onClick={() => setTab('articles')} className={`px-6 py-2 rounded-lg font-bold transition ${tab === 'articles' ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-600'}`}>المقالات</button>
        <button onClick={() => setTab('settings')} className={`px-6 py-2 rounded-lg font-bold transition ${tab === 'settings' ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-600'}`}>إعدادات الموقع</button>
        <button onClick={onLogout} className="mr-auto text-red-500 font-bold hover:underline">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-8 animate-fadeIn">
          <form onSubmit={handleAddArticle} className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{editingId ? 'تعديل المقال' : 'نشر مقال/مراجعة جديدة'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="عنوان المقال" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
              <input className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="السعر التقريبي" type="number" value={newArticle.price || ''} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} required />
              <input className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="رابط صورة الغلاف" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required />
              <div className="grid grid-cols-2 gap-2">
                <select className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="التقييم 1-5" type="number" max="5" min="1" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: Number(e.target.value)})} />
              </div>
            </div>
            
            <textarea className="w-full p-4 border rounded-xl h-64 outline-none focus:ring-2 focus:ring-emerald-500 font-sans" placeholder="اكتب مراجعتك هنا... يمكنك وضع روابطك الخاصة يدوياً داخل النص." value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />

            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg">
              {editingId ? 'تحديث المقال الآن' : 'نشر المقال في المدونة'}
            </button>
          </form>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">المقالات المنشورة:</h3>
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
                  <div>
                    <p className="font-bold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo({top: 0, behavior: 'smooth'})}} className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-bold hover:bg-emerald-100 transition text-sm">تعديل</button>
                  <button onClick={() => { if(confirm('هل أنت متأكد من حذف هذا المقال؟')) onUpdateArticles(articles.filter(item => item.id !== a.id)) }} className="text-red-600 bg-red-50 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition text-sm">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-4">إعدادات المدونة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-600">اسم الموقع</label>
              <input className="w-full p-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-600">وصف الموقع</label>
              <input className="w-full p-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم حفظ الإعدادات'); }} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition">حفظ التغييرات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
