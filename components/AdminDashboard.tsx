
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

type AdminTab = 'list' | 'editor' | 'ads' | 'security';

const AdminDashboard: React.FC<AdminProps> = ({ posts, settings, onUpdate, onUpdateSettings, onLogout, darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const [form, setForm] = useState<Partial<Article>>({
    // Corrected Category.TECH to Category.TECH_REVIEWS
    title: '', excerpt: '', content: '', image: '', category: Category.TECH_REVIEWS, author: 'عبدو التقني'
  });

  const handleSavePost = () => {
    if (!form.title || !form.content) return alert('يرجى كتابة العنوان والمحتوى!');
    if (editingPostId) {
      const updatedPosts = posts.map(p => p.id === editingPostId ? { ...p, ...form as Article } : p);
      onUpdate(updatedPosts);
    } else {
      const p: Article = { ...form as Article, id: Date.now().toString(), date: new Date().toLocaleDateString('ar-MA'), views: 0 };
      onUpdate([p, ...posts]);
    }
    resetForm();
    setActiveTab('list');
  };

  const handleEditClick = (p: Article) => {
    setEditingPostId(p.id);
    setForm({ title: p.title || p.name, excerpt: p.excerpt, content: p.content, image: p.image, category: p.category, author: p.author });
    setActiveTab('editor');
  };

  const resetForm = () => {
    setEditingPostId(null);
    // Corrected Category.TECH to Category.TECH_REVIEWS
    setForm({ title: '', excerpt: '', content: '', image: '', category: Category.TECH_REVIEWS, author: 'عبدو التقني' });
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
      <div className={`p-8 rounded-[40px] mb-10 flex flex-col md:flex-row justify-between items-center gap-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white shadow-xl'}`}>
        <h2 className="text-3xl font-black">غرفة التحكم</h2>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('list')} className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'list' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-white/5'}`}>المقالات</button>
          <button onClick={() => setActiveTab('ads')} className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'ads' ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-white/5'}`}>إعلانات Adsterra</button>
          <button onClick={onLogout} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold">خروج</button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(p => (
            <div key={p.id} className="p-4 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between">
              <span className="font-bold truncate max-w-[200px]">{p.title || p.name}</span>
              <div className="flex gap-2">
                 <button onClick={() => handleEditClick(p)} className="p-2 bg-blue-600 rounded-lg">✏️</button>
                 <button onClick={() => onUpdate(posts.filter(i => i.id !== p.id))} className="p-2 bg-red-600 rounded-lg">🗑️</button>
              </div>
            </div>
          ))}
          <button onClick={() => {resetForm(); setActiveTab('editor');}} className="p-10 border-2 border-dashed border-white/20 rounded-3xl font-black opacity-40 hover:opacity-100 transition-all">➕ مقال جديد</button>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="max-w-4xl mx-auto p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-12">
          <div className="text-center">
            <span className="text-6xl mb-4 block">📡</span>
            <h3 className="text-2xl font-black text-orange-500">مركز التحكم في إعلانات Adsterra</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-xs font-black opacity-60 uppercase mr-2">كود Social Bar / Popunder (شامل للموقع)</label>
              <p className="text-[10px] text-emerald-500 mb-2">هذا الإعلان هو الأكثر ربحية في المغرب ويظهر كإشعار.</p>
              <textarea 
                className="w-full h-48 p-5 bg-black/40 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none font-mono text-[10px]"
                placeholder="<!-- Paste Social Bar script here -->"
                value={localSettings.globalAdsCode}
                onChange={e => setLocalSettings({...localSettings, globalAdsCode: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black opacity-60 uppercase mr-2">أكواد البنرات (Banners)</label>
              <p className="text-[10px] text-blue-500 mb-2">تظهر هذه الإعلانات داخل المقالات في أماكن محددة.</p>
              <textarea 
                className="w-full h-48 p-5 bg-black/40 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-mono text-[10px]"
                placeholder="<!-- Paste Banner script here -->"
                value={localSettings.alternativeAdsCode}
                onChange={e => setLocalSettings({...localSettings, alternativeAdsCode: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={() => {onUpdateSettings(localSettings); alert('✅ تم تحديث جميع الإعلانات!');}} 
            className="w-full py-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-3xl font-black text-2xl hover:scale-[1.01] transition-all shadow-2xl"
          >حفظ وتنشيط الإعلانات 💾</button>
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-6">
           <input className="w-full p-5 bg-black/40 rounded-2xl font-black text-xl" placeholder="عنوان المقال الربحي..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
           <textarea className="w-full h-80 p-5 bg-black/40 rounded-2xl leading-relaxed" placeholder="المحتوى... (ضع روابط الأفلييت مباشرة)" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
           <input className="w-full p-5 bg-black/40 rounded-2xl" placeholder="رابط الصورة المباشر" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
           <button onClick={handleSavePost} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-2xl">نشر المقال الآن 🚀</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
