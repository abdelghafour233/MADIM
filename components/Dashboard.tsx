
import React, { useState, useEffect, useMemo } from 'react';
import { Article, Settings, Category } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout }) => {
  const [tab, setTab] = useState<'articles' | 'adsense' | 'settings'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.TECH, rating: 5, image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    onUpdateSettings(localSettings);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      views: editingId ? (articles.find(a => a.id === editingId)?.views || 0) : 0,
      date: new Date().toLocaleDateString('ar-MA'),
    } as Article;

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? art : a));
    } else {
      onUpdateArticles([art, ...articles]);
    }
    setEditingId(null);
    setNewArticle({ category: Category.TECH, rating: 5, image: '' });
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn text-right" dir="rtl">
      <div className="flex flex-wrap gap-4 mb-12 bg-white p-4 rounded-3xl shadow-xl border border-slate-100 sticky top-24 z-40">
        <button onClick={() => setTab('articles')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'articles' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>المقالات 📝</button>
        <button onClick={() => setTab('adsense')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'adsense' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>الأرباح 💰</button>
        <button onClick={() => setTab('settings')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>الإعدادات ⚙️</button>
        <button onClick={onLogout} className="mr-auto px-6 py-4 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-colors">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-12">
          <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-50">
            <h2 className="text-3xl font-black text-slate-800 mb-8">{editingId ? 'تعديل المقال' : 'نشر مقال جديد'}</h2>
            <form onSubmit={handleArticleSubmit} className="space-y-6">
              <input className="w-full p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-black text-2xl" placeholder="عنوان المقال المثير..." value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="رابط صورة المقال" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} />
              </div>
              <textarea className="w-full h-96 p-8 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold leading-relaxed text-lg" placeholder="اكتب محتوى المقال هنا..." value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />
              <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all active:scale-95">{editingId ? 'حفظ التعديلات' : 'نشر المقال الآن'}</button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-6 rounded-[35px] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
                <img src={a.image} className="w-24 h-24 rounded-2xl object-cover shadow-inner" alt="" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-black text-slate-800 truncate text-lg mb-1">{a.name}</h4>
                  <p className="text-xs text-slate-400 font-bold mb-4 italic">{a.category} • {a.views} قراءة</p>
                  <div className="flex gap-3">
                    <button onClick={() => { setEditingId(a.id); setNewArticle(a); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-emerald-600 font-black text-xs bg-emerald-50 px-5 py-2.5 rounded-xl hover:bg-emerald-100">تعديل</button>
                    <button onClick={() => { if(confirm('هل أنت متأكد من حذف المقال؟')) onUpdateArticles(articles.filter(i => i.id !== a.id)); }} className="text-red-500 font-black text-xs bg-red-50 px-5 py-2.5 rounded-xl hover:bg-red-100">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'adsense' && (
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-50">
           <h2 className="text-3xl font-black text-slate-800 mb-10 italic underline decoration-emerald-500">تحسين أرباح AdSense للمدونة 💰</h2>
           <div className="grid gap-10">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black text-lg">كود ملف Ads.txt (إلزامي للقبول):</label>
                <textarea className="w-full h-32 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm text-left" dir="ltr" value={localSettings.adsTxt} onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="block text-slate-700 font-black text-lg">كود الإعلانات التلقائية (Header):</label>
                <textarea className="w-full h-48 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm text-left" dir="ltr" value={localSettings.adsenseCode} onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} />
              </div>
              <button onClick={handleSaveSettings} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl">
                 {saveStatus === 'success' ? '✅ تم تحديث الأكواد بنجاح' : 'تحديث إعدادات الأرباح'}
              </button>
           </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-50 space-y-10">
           <h2 className="text-3xl font-black text-slate-800 mb-6">إعدادات عامة</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black">اسم المدونة</label>
                <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="block text-slate-700 font-black">كلمة مرور الإدارة</label>
                <input type="password" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-center" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
              </div>
           </div>
           <button onClick={handleSaveSettings} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl">حفظ التغييرات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
