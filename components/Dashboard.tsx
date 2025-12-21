
import React, { useState, useRef } from 'react';
import { Article, Settings, Category, AffiliateLink } from '../types.ts';

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
    rating: 5,
    links: [] 
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // حقول مؤقتة لإضافة رابط جديد
  const [tempLinkLabel, setTempLinkLabel] = useState('');
  const [tempLinkUrl, setTempLinkUrl] = useState('');

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const articleData: Article = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: newArticle.name || '',
      price: Number(newArticle.price) || 0,
      content: newArticle.content || '',
      image: newArticle.image || '',
      category: newArticle.category as Category,
      links: newArticle.links || [],
      rating: Number(newArticle.rating) || 5
    };

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? articleData : a));
    } else {
      onUpdateArticles([articleData, ...articles]);
    }
    setNewArticle({ category: Category.REVIEWS, rating: 5, links: [] });
    setEditingId(null);
    alert('تم حفظ المقال بنجاح');
  };

  const addLinkToArticle = () => {
    if (!tempLinkLabel || !tempLinkUrl) return;
    const updatedLinks = [...(newArticle.links || []), { label: tempLinkLabel, url: tempLinkUrl }];
    setNewArticle({ ...newArticle, links: updatedLinks });
    setTempLinkLabel('');
    setTempLinkUrl('');
  };

  const removeLinkFromArticle = (index: number) => {
    const updatedLinks = (newArticle.links || []).filter((_, i) => i !== index);
    setNewArticle({ ...newArticle, links: updatedLinks });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-4 mb-8">
        <button onClick={() => setTab('articles')} className={`px-6 py-2 rounded-lg font-bold transition ${tab === 'articles' ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-600'}`}>إدارة المقالات</button>
        <button onClick={() => setTab('settings')} className={`px-6 py-2 rounded-lg font-bold transition ${tab === 'settings' ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-600'}`}>إعدادات الموقع</button>
        <button onClick={onLogout} className="mr-auto text-red-500 font-bold hover:underline">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-8 animate-fadeIn">
          <form onSubmit={handleAddArticle} className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{editingId ? 'تعديل مقال' : 'إضافة مراجعة أو عرض جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="عنوان المقال (مثلاً: مراجعة آيفون 15)" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
              <input className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="السعر التقريبي بالدرهم" type="number" value={newArticle.price || ''} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} required />
              <input className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="رابط صورة المنتج" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required />
              <div className="grid grid-cols-2 gap-2">
                <select className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="التقييم 1-5" type="number" max="5" min="1" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: Number(e.target.value)})} />
              </div>
            </div>
            
            <textarea className="w-full p-4 border rounded-xl h-40 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="محتوى المقال أو المراجعة بالتفصيل..." value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />

            {/* إدارة الروابط الخارجية */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
              <h4 className="font-bold text-gray-700 mb-4">روابط الشراء الخارجية (الأفلييت):</h4>
              
              <div className="space-y-3 mb-4">
                {(newArticle.links || []).map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border">
                    <div>
                      <span className="font-bold text-gray-800 ml-2">{link.label}:</span>
                      <span className="text-xs text-gray-400 truncate max-w-[200px] inline-block">{link.url}</span>
                    </div>
                    <button type="button" onClick={() => removeLinkFromArticle(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <input className="flex-1 p-3 border rounded-xl text-sm" placeholder="اسم المتجر (مثلاً: أمازون)" value={tempLinkLabel} onChange={e => setTempLinkLabel(e.target.value)} />
                <input className="flex-[2] p-3 border rounded-xl text-sm" placeholder="رابط الأفلييت الخاص بك" value={tempLinkUrl} onChange={e => setTempLinkUrl(e.target.value)} />
                <button type="button" onClick={addLinkToArticle} className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-200 transition">
                  إضافة الرابط
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg">
              {editingId ? 'تحديث المقال الآن' : 'نشر المقال في المدونة'}
            </button>
          </form>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-500">المقالات المنشورة مؤخراً:</h3>
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
                  <div>
                    <p className="font-bold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.category} | {a.links?.length || 0} روابط</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo({top: 0, behavior: 'smooth'})}} className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-bold hover:bg-emerald-100 transition">تعديل</button>
                  <button onClick={() => { if(confirm('حذف هذا المقال؟')) onUpdateArticles(articles.filter(item => item.id !== a.id)) }} className="text-red-600 bg-red-50 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition">حذف</button>
                </div>
              </div>
            ))}
            {articles.length === 0 && <p className="text-center py-10 text-gray-400 italic">لا توجد مقالات منشورة بعد.</p>}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-4">الإعدادات العامة للمدونة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-600">اسم الموقع</label>
              <input className="w-full p-4 border rounded-xl bg-gray-50" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-600">وصف الموقع (SEO)</label>
              <input className="w-full p-4 border rounded-xl bg-gray-50" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-600">كلمة مرور الإدارة</label>
              <input className="w-full p-4 border rounded-xl bg-gray-50" type="password" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم حفظ الإعدادات'); }} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition">حفظ جميع التغييرات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
