
import React, { useState, useRef } from 'react';
import { Article, Settings, Category } from '../types.ts';
import { GoogleGenAI } from "@google/genai";

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
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.REVIEWS, rating: 5, image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveSettings = () => {
    onUpdateSettings(localSettings);
    alert('✅ تم حفظ الإعدادات');
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      likes: 0, views: 100, comments: []
    } as Article;

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? art : a));
    } else {
      onUpdateArticles([art, ...articles]);
    }
    setEditingId(null);
    setNewArticle({ category: Category.REVIEWS, rating: 5, image: '' });
    alert('✅ تم الحفظ');
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex gap-4 mb-10 bg-white p-4 rounded-3xl shadow-sm overflow-x-auto">
        <button onClick={() => setTab('articles')} className={`px-6 py-3 rounded-xl font-bold ${tab === 'articles' ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>المقالات</button>
        <button onClick={() => setTab('adsense')} className={`px-6 py-3 rounded-xl font-bold ${tab === 'adsense' ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>الأدسنس 💰</button>
        <button onClick={() => setTab('settings')} className={`px-6 py-3 rounded-xl font-bold ${tab === 'settings' ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>الإعدادات</button>
        <button onClick={onLogout} className="mr-auto text-red-500 font-bold">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border">
            <h2 className="text-xl font-black mb-6">{editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}</h2>
            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <input className="w-full p-4 bg-slate-50 rounded-xl border" placeholder="العنوان" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
              <textarea className="w-full p-4 bg-slate-50 rounded-xl border h-40" placeholder="المحتوى" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />
              <input className="w-full p-4 bg-slate-50 rounded-xl border" placeholder="رابط الصورة" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} />
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold">نشر المقال</button>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
                <span className="font-bold truncate max-w-[200px]">{a.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo(0,0);}} className="text-emerald-600 font-bold text-sm">تعديل</button>
                  <button onClick={() => onUpdateArticles(articles.filter(i => i.id !== a.id))} className="text-red-500 font-bold text-sm">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'adsense' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border space-y-6">
          <h2 className="text-xl font-black">إعدادات الأرباح (AdSense)</h2>
          <div className="space-y-2">
            <label className="block font-bold">كود السكربت الكامل:</label>
            <textarea className="w-full p-4 bg-slate-50 rounded-xl border h-32 font-mono text-sm" value={localSettings.adsenseCode} onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="block font-bold">ملف ads.txt:</label>
            <textarea className="w-full p-4 bg-slate-50 rounded-xl border h-20 font-mono text-sm" value={localSettings.adsTxt} onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})} />
          </div>
          <button onClick={saveSettings} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">حفظ التغييرات ✅</button>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border space-y-6">
          <h2 className="text-xl font-black">إعدادات الموقع العامة</h2>
          <input className="w-full p-4 bg-slate-50 rounded-xl border" placeholder="اسم الموقع" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
          <input className="w-full p-4 bg-slate-50 rounded-xl border" placeholder="كلمة مرور الإدارة" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
          <button onClick={saveSettings} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold">حفظ الإعدادات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
