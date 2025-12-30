
import React, { useState, useRef } from 'react';
import { Article, Category, Settings } from '../types';

interface AdminProps {
  posts: Article[];
  settings: Settings;
  onUpdate: (posts: Article[]) => void;
  onUpdateSettings: (settings: Settings) => void;
  onLogout: () => void;
  darkMode?: boolean;
}

type AdminTab = 'list' | 'editor' | 'ads' | 'security' | 'stats';

const AdminDashboard: React.FC<AdminProps> = ({ posts, settings, onUpdate, onUpdateSettings, onLogout, darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleSavePost = () => {
    if (!form.title) return;
    if (editingPostId) {
      onUpdate(posts.map(p => p.id === editingPostId ? { ...p, ...form as Article, name: form.title } : p));
    } else {
      const p: Article = { ...form as Article, id: Date.now().toString(), date: new Date().toLocaleDateString('ar-MA'), views: 0, name: form.title } as Article;
      onUpdate([p, ...posts]);
    }
    setActiveTab('list');
  };

  const [form, setForm] = useState<Partial<Article>>({
    title: '', content: '', image: '', category: Category.TEMU, affiliateLink: '', price: 0
  });

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4" dir="rtl">
      <div className="p-6 md:p-10 rounded-[40px] mb-10 bg-white/5 border border-white/10 flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-2xl font-black">لوحة التحكم</h2>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-xl text-xs font-black ${activeTab === 'list' ? 'bg-emerald-600' : 'bg-white/5'}`}>العروض</button>
          <button onClick={() => setActiveTab('ads')} className={`px-4 py-2 rounded-xl text-xs font-black ${activeTab === 'ads' ? 'bg-orange-600' : 'bg-white/5'}`}>الإعلانات 💰</button>
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
                    <label className="text-[10px] font-black opacity-40 mb-2 block">Popunder Script (أعلى ربح)</label>
                    <textarea className="w-full h-24 p-4 bg-black/40 rounded-2xl font-mono text-[10px]" value={localSettings.popunderCode} onChange={e => setLocalSettings({...localSettings, popunderCode: e.target.value})} />
                 </div>
              </div>
           </div>

           <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-6">
              <h3 className="text-xl font-black text-emerald-500">إعلانات المحتوى والروابط</h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black opacity-40 mb-2 block">Direct Link URL</label>
                    <input className="w-full p-4 bg-black/40 rounded-2xl text-xs" value={localSettings.directLinkCode} onChange={e => setLocalSettings({...localSettings, directLinkCode: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[10px] font-black opacity-40 mb-2 block">Native Banner (داخل المقال)</label>
                    <textarea className="w-full h-24 p-4 bg-black/40 rounded-2xl font-mono text-[10px]" value={localSettings.nativeAdCode} onChange={e => setLocalSettings({...localSettings, nativeAdCode: e.target.value})} />
                 </div>
              </div>
              <button onClick={() => {onUpdateSettings(localSettings); alert('تم التحديث!');}} className="w-full py-4 bg-emerald-600 rounded-2xl font-black">حفظ التغييرات 💾</button>
           </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={() => setActiveTab('editor')} className="p-10 border-2 border-dashed border-white/10 rounded-[40px] font-black opacity-40">اضافة عرض +</button>
          {posts.map(p => (
            <div key={p.id} className="p-4 bg-white/5 rounded-3xl flex items-center justify-between">
               <span className="font-black truncate flex-1 ml-4">{p.title}</span>
               <button onClick={() => onUpdate(posts.filter(i => i.id !== p.id))} className="text-red-500">🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
