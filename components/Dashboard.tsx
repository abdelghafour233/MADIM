
import React, { useState, useRef } from 'react';
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
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.REVIEWS, rating: 5 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const articleData: Article = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: newArticle.name || '',
      price: Number(newArticle.price) || 0,
      content: newArticle.content || '',
      image: newArticle.image || '',
      category: newArticle.category as Category,
      affiliateLink: newArticle.affiliateLink || '',
      rating: Number(newArticle.rating) || 5
    };

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? articleData : a));
    } else {
      onUpdateArticles([articleData, ...articles]);
    }
    setNewArticle({ category: Category.REVIEWS, rating: 5 });
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-4 mb-8">
        <button onClick={() => setTab('articles')} className={`px-6 py-2 rounded-lg font-bold ${tab === 'articles' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>المقالات</button>
        <button onClick={() => setTab('settings')} className={`px-6 py-2 rounded-lg font-bold ${tab === 'settings' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>إعدادات المدونة</button>
        <button onClick={onLogout} className="mr-auto text-red-500 font-bold">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-8">
          <form onSubmit={handleAddArticle} className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'تعديل مقال' : 'إضافة مقال/عرض جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="p-4 border rounded-xl" placeholder="عنوان المقال" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
              <input className="p-4 border rounded-xl" placeholder="السعر" type="number" value={newArticle.price || ''} onChange={e => setNewArticle({...newArticle, price: e.target.value})} required />
              <input className="p-4 border rounded-xl" placeholder="رابط الأفلييت" value={newArticle.affiliateLink || ''} onChange={e => setNewArticle({...newArticle, affiliateLink: e.target.value})} required />
              <select className="p-4 border rounded-xl" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input className="p-4 border rounded-xl" placeholder="رابط الصورة" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required />
              <input className="p-4 border rounded-xl" placeholder="التقييم (1-5)" type="number" max="5" min="1" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: e.target.value})} />
            </div>
            <textarea className="w-full p-4 border rounded-xl h-40" placeholder="محتوى المقال..." value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />
            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold">{editingId ? 'تحديث' : 'نشر المقال'}</button>
          </form>

          <div className="space-y-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-lg" />
                  <span className="font-bold">{a.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a)}} className="text-blue-500 px-3">تعديل</button>
                  <button onClick={() => onUpdateArticles(articles.filter(item => item.id !== a.id))} className="text-red-500 px-3">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <h3 className="text-xl font-bold">الإعدادات العامة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">اسم الموقع</label>
              <input className="w-full p-4 border rounded-xl" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">وصف الموقع</label>
              <input className="w-full p-4 border rounded-xl" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">كلمة مرور الإدارة</label>
              <input className="w-full p-4 border rounded-xl" type="password" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
            </div>
          </div>
          <button onClick={() => onUpdateSettings(localSettings)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold">حفظ التغييرات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
