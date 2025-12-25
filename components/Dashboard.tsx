
import React, { useState } from 'react';
import { Article, Settings } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout }) => {
  const [tab, setTab] = useState<'articles' | 'ads'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    alert('تم الحفظ بنجاح');
  };

  return (
    <div className="max-w-4xl mx-auto py-10" dir="rtl">
      <div className="flex items-center justify-between mb-10 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-black">لوحة التحكم ⚙️</h2>
        <button onClick={onLogout} className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-xl">خروج</button>
      </div>

      <div className="flex gap-4 mb-10">
        <button onClick={() => setTab('articles')} className={`flex-1 py-4 rounded-2xl font-black ${tab === 'articles' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900'}`}>المقالات</button>
        <button onClick={() => setTab('ads')} className={`flex-1 py-4 rounded-2xl font-black ${tab === 'ads' ? 'bg-orange-600 text-white' : 'bg-white dark:bg-slate-900'}`}>الإعلانات والأرباح</button>
      </div>

      {tab === 'ads' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm space-y-6">
          <div>
            <label className="block font-black mb-2 text-slate-500">رقم ناشر أدسنس</label>
            <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-mono" value={localSettings.adsenseCode} onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} />
          </div>
          <div>
            <label className="block font-black mb-2 text-slate-500">كود Ezoic (Header)</label>
            <textarea className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-mono text-xs" value={localSettings.ezoicCode} onChange={e => setLocalSettings({...localSettings, ezoicCode: e.target.value})} />
          </div>
          <div>
            <label className="block font-black mb-2 text-slate-500">محتوى ads.txt</label>
            <textarea className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-mono text-xs" value={localSettings.adsTxt} onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})} />
          </div>
          <button onClick={handleSave} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black">حفظ الإعدادات</button>
        </div>
      )}

      {tab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map(a => (
            <div key={a.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border flex items-center justify-between">
              <span className="font-bold truncate ml-4">{a.name}</span>
              <div className="flex gap-2">
                <button className="text-emerald-500 font-bold text-xs">تعديل</button>
                <button className="text-red-500 font-bold text-xs">حذف</button>
              </div>
            </div>
          ))}
          <div className="p-6 border-2 border-dashed rounded-2xl text-center font-black text-slate-400 cursor-pointer">إضافة مقالة جديدة +</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
