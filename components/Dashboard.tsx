
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
  const [tab, setTab] = useState<'articles' | 'ads' | 'new-article'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  
  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert('✅ تم حفظ كافة الإعدادات بنجاح!');
  };

  const handleDeleteArticle = (id: string) => {
    if(window.confirm('هل أنت متأكد من رغبتك في حذف هذا المقال؟')) {
      onUpdateArticles(articles.filter(a => a.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 animate-fadeIn" dir="rtl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">🚀</div>
          <div>
            <h2 className="text-3xl font-black">لوحة القيادة</h2>
            <p className="text-slate-400 font-bold">مرحباً بك مجدداً في نظام إدارة عبدو ويب</p>
          </div>
        </div>
        <button onClick={onLogout} className="px-10 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-colors border border-red-200 shadow-sm">تسجيل الخروج</button>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        <button onClick={() => setTab('articles')} className={`px-10 py-5 rounded-2xl font-black text-lg transition-all ${tab === 'articles' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}>📦 إدارة المحتوى</button>
        <button onClick={() => setTab('ads')} className={`px-10 py-5 rounded-2xl font-black text-lg transition-all ${tab === 'ads' ? 'bg-orange-600 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}>💰 الإعلانات والأرباح</button>
        <button onClick={() => setTab('new-article')} className={`px-10 py-5 rounded-2xl font-black text-lg transition-all ${tab === 'new-article' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}>✍️ كتابة مقال جديد</button>
      </div>

      {tab === 'ads' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl space-y-8 border border-slate-100 dark:border-slate-800">
            <h3 className="text-2xl font-black text-orange-600 border-b pb-4 mb-8">إعدادات Google AdSense</h3>
            <div>
              <label className="block font-black mb-4 text-slate-500">رقم تعريف الناشر (Publisher ID)</label>
              <input 
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-mono text-emerald-600 border-2 border-transparent focus:border-emerald-500 transition-all" 
                value={localSettings.adsenseCode} 
                onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} 
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              />
              <p className="text-xs text-slate-400 mt-2 font-bold">هذا الكود هو المسؤول عن ظهور إعلاناتك وأرباحك.</p>
            </div>
            <div>
              <label className="block font-black mb-4 text-slate-500">محتوى ملف Ads.txt</label>
              <textarea 
                className="w-full h-40 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-mono text-xs text-slate-500 border-2 border-transparent focus:border-emerald-500 transition-all" 
                value={localSettings.adsTxt} 
                onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})} 
              />
            </div>
            <button onClick={handleSaveSettings} className="w-full py-6 bg-slate-900 text-white rounded-[30px] font-black text-xl hover:bg-emerald-600 transition-all shadow-xl">تحديث الإعدادات 💾</button>
          </div>

          <div className="bg-slate-900 p-10 rounded-[50px] shadow-2xl text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-3xl font-black mb-8">إحصائيات سريعة</h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 p-8 rounded-[35px] backdrop-blur-md">
                     <span className="text-slate-400 block mb-2 font-bold">عدد المقالات</span>
                     <span className="text-4xl font-black text-emerald-400">{articles.length}</span>
                  </div>
                  <div className="bg-white/10 p-8 rounded-[35px] backdrop-blur-md">
                     <span className="text-slate-400 block mb-2 font-bold">إجمالي المشاهدات</span>
                     <span className="text-4xl font-black text-orange-400">{articles.reduce((s, a) => s + (a.views || 0), 0).toLocaleString()}</span>
                  </div>
               </div>
               <div className="mt-10 p-8 bg-emerald-600/20 rounded-[35px] border border-emerald-500/30">
                  <p className="text-sm font-bold text-emerald-400 leading-relaxed">نصيحة: المقالات التي تتجاوز 500 كلمة وتحتوي على صور عالية الجودة تحصل على أرباح أدسنس أعلى بنسبة 40%.</p>
               </div>
             </div>
             <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-x-32 -translate-y-32"></div>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map(a => (
            <div key={a.id} className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 truncate">
                <img src={a.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                <div className="truncate">
                  <span className="font-black text-lg block truncate">{a.name}</span>
                  <span className="text-xs font-bold text-slate-400">{a.category} • {a.views} مشاهدة</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">✏️</button>
                <button onClick={() => handleDeleteArticle(a.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">🗑️</button>
              </div>
            </div>
          ))}
          <div 
            onClick={() => setTab('new-article')}
            className="p-10 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[35px] text-center font-black text-slate-400 cursor-pointer hover:border-emerald-500/50 hover:text-emerald-500 transition-all group"
          >
            <span className="text-4xl block mb-4 group-hover:scale-125 transition-transform">➕</span>
            إضافة مقال جديد للموقع
          </div>
        </div>
      )}

      {tab === 'new-article' && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800">
           <h3 className="text-3xl font-black mb-10 text-emerald-600">كتابة مقال جديد</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div>
                   <label className="block font-black mb-3 text-slate-500">عنوان المقال</label>
                   <input className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-lg" placeholder="اكتب عنواناً جذاباً..." />
                 </div>
                 <div>
                   <label className="block font-black mb-3 text-slate-500">القسم</label>
                   <select className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold">
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block font-black mb-3 text-slate-500">رابط الصورة (URL)</label>
                   <input className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" placeholder="https://..." />
                 </div>
              </div>
              <div>
                 <label className="block font-black mb-3 text-slate-500">محتوى المقال</label>
                 <textarea className="w-full h-[340px] p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none resize-none leading-relaxed" placeholder="ابدأ بكتابة المحتوى هنا، استخدم الروابط والصور لزيادة التفاعل..."></textarea>
              </div>
           </div>
           <button className="w-full mt-10 py-6 bg-emerald-600 text-white rounded-[30px] font-black text-2xl shadow-xl hover:bg-emerald-700 transition-all">نشر المقال فوراً 🚀</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
