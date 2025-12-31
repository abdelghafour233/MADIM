
import React, { useState } from 'react';
import { Article, Category, Settings } from '../types';

interface AdminProps {
  posts: Article[];
  settings: Settings;
  onUpdate: (posts: Article[]) => void;
  onUpdateSettings: (settings: Settings) => void;
  onLogout: () => void;
  darkMode?: boolean;
}

const AdminDashboard: React.FC<AdminProps> = ({ posts, settings, onUpdate, onUpdateSettings, onLogout, darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'ads'>('list');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleClearCache = () => {
    if (confirm("سيتم مسح كاش المتصفح وإعادة تحميل الموقع بشكل إجباري. هل أنت متأكد؟")) {
      localStorage.clear();
      // إضافة بارامتر عشوائي للرابط عند إعادة التحميل لكسر كاش السيرفر/CDN
      window.location.href = window.location.pathname + '?reload=' + Date.now();
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4" dir="rtl">
      <div className="p-6 md:p-10 rounded-[40px] mb-10 bg-white/5 border border-white/10 flex flex-wrap gap-4 justify-between items-center">
        <div>
           <h2 className="text-2xl font-black">لوحة التحكم</h2>
           <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-1">Admin Panel v2.5</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-xl text-xs font-black ${activeTab === 'list' ? 'bg-emerald-600' : 'bg-white/5'}`}>العروض</button>
          <button onClick={() => setActiveTab('ads')} className={`px-4 py-2 rounded-xl text-xs font-black ${activeTab === 'ads' ? 'bg-orange-600' : 'bg-white/5'}`}>الإعلانات 💰</button>
          <button onClick={handleClearCache} className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl text-xs font-black border border-blue-500/20">تحديث إجباري 🧹</button>
          <button onClick={onLogout} className="px-4 py-2 bg-red-600/10 text-red-500 rounded-xl text-xs font-black">خروج</button>
        </div>
      </div>

      {activeTab === 'ads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
           <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-6">
              <h3 className="text-xl font-black text-orange-500">إعلانات الواجهة (High CPM)</h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black opacity-40 mb-2 block">Social Bar Script</label>
                    <textarea className="w-full h-24 p-4 bg-black/40 rounded-2xl font-mono text-[10px]" value={localSettings.globalAdsCode} onChange={e => setLocalSettings({...localSettings, globalAdsCode: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[10px] font-black opacity-40 mb-2 block">Popunder Script</label>
                    <textarea className="w-full h-24 p-4 bg-black/40 rounded-2xl font-mono text-[10px]" value={localSettings.popunderCode} onChange={e => setLocalSettings({...localSettings, popunderCode: e.target.value})} />
                 </div>
              </div>
           </div>

           <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-6">
              <h3 className="text-xl font-black text-emerald-500">إعلانات المحتوى</h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black opacity-40 mb-2 block">Direct Link URL</label>
                    <input className="w-full p-4 bg-black/40 rounded-2xl text-xs" value={localSettings.directLinkCode} onChange={e => setLocalSettings({...localSettings, directLinkCode: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[10px] font-black opacity-40 mb-2 block">Native Banner (Banner 728x90 / Top)</label>
                    <textarea className="w-full h-24 p-4 bg-black/40 rounded-2xl font-mono text-[10px]" value={localSettings.alternativeAdsCode} onChange={e => setLocalSettings({...localSettings, alternativeAdsCode: e.target.value})} />
                 </div>
              </div>
              <button onClick={() => {onUpdateSettings(localSettings); alert('تم التحديث! سيتم تطبيق التغييرات فوراً.');}} className="w-full py-4 bg-emerald-600 rounded-2xl font-black">حفظ الإعدادات 💾</button>
           </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-10 border-2 border-dashed border-white/10 rounded-[40px] font-black opacity-40 text-center">أضف عرضاً جديداً</div>
          {posts.map(p => (
            <div key={p.id} className="p-4 bg-white/5 rounded-3xl flex items-center justify-between border border-white/5">
               <span className="font-black truncate flex-1 ml-4 text-xs">{p.title}</span>
               <button onClick={() => onUpdate(posts.filter(i => i.id !== p.id))} className="text-red-500 text-xs">حذف</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
