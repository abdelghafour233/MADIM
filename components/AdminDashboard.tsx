
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

type AdminTab = 'list' | 'editor' | 'ads' | 'security';

const AdminDashboard: React.FC<AdminProps> = ({ posts, settings, onUpdate, onUpdateSettings, onLogout, darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const adsActive = settings.globalAdsCode && settings.globalAdsCode.length > 10;
  
  const [form, setForm] = useState<Partial<Article>>({
    title: '', excerpt: '', content: '', image: '', category: Category.TEMU, author: 'عبدو التقني', affiliateLink: '', couponCode: '', isTrending: false, price: 0, marketPrice: 0
  });

  const handleSavePost = () => {
    if (!form.title || !form.content) return alert('يرجى كتابة العنوان والمحتوى!');
    if (editingPostId) {
      const updatedPosts = posts.map(p => p.id === editingPostId ? { ...p, ...form as Article, name: form.title } : p);
      onUpdate(updatedPosts);
    } else {
      const p: Article = { ...form as Article, id: Date.now().toString(), date: new Date().toLocaleDateString('ar-MA'), views: 0, name: form.title } as Article;
      onUpdate([p, ...posts]);
    }
    resetForm();
    setActiveTab('list');
  };

  const handleEditClick = (p: Article) => {
    setEditingPostId(p.id);
    setForm({ ...p, title: p.title, name: p.name });
    setActiveTab('editor');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEditingPostId(null);
    setForm({ title: '', excerpt: '', content: '', image: '', category: Category.TEMU, author: 'عبدو التقني', affiliateLink: '', couponCode: '', isTrending: false, price: 0, marketPrice: 0 });
  };

  const forceFullRefresh = () => {
    if(confirm('سيتم حذف كل البيانات المخزنة محلياً وإعادة التحميل من السيرفر لتجاوز كاش كلود فلير. هل أنت متأكد؟')) {
      localStorage.clear();
      window.location.href = window.location.pathname + "?refresh=" + Date.now();
    }
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20 px-4" dir="rtl">
      <div className="p-6 md:p-10 rounded-[40px] mb-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 border border-white/10 shadow-2xl relative">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl">🚀</div>
          <div>
            <h2 className="text-2xl font-black">إدارة abdouweb</h2>
            <p className="text-slate-500 font-bold text-sm">الإصدار الحالي: v1.4.0</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={() => setActiveTab('list')} className={`px-5 py-2.5 rounded-xl font-black text-xs ${activeTab === 'list' ? 'bg-emerald-600' : 'bg-white/5'}`}>العروض</button>
          <button onClick={() => setActiveTab('ads')} className={`px-5 py-2.5 rounded-xl font-black text-xs ${activeTab === 'ads' ? 'bg-orange-600' : 'bg-white/5'}`}>الإعلانات</button>
          <button onClick={() => setActiveTab('security')} className={`px-5 py-2.5 rounded-xl font-black text-xs ${activeTab === 'security' ? 'bg-blue-600' : 'bg-white/5'}`}>الأمان</button>
          <button onClick={forceFullRefresh} className="px-5 py-2.5 bg-yellow-600/20 text-yellow-500 rounded-xl font-black text-xs border border-yellow-500/20">تحديث الكاش</button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button onClick={() => {resetForm(); setActiveTab('editor');}} className="p-10 border-4 border-dashed border-white/10 rounded-[40px] font-black text-slate-500 hover:text-emerald-500 transition-all bg-white/5 min-h-[200px]">
             إضافة عرض جديد +
          </button>
          {posts.map(p => (
            <div key={p.id} className="p-6 bg-white/5 border border-white/5 rounded-[40px] flex flex-col justify-between group">
              <div className="flex items-center gap-4 mb-4">
                <img src={p.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                <h4 className="font-black truncate flex-1">{p.title}</h4>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => handleEditClick(p)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-xs">تعديل</button>
                 <button onClick={() => {if(confirm('حذف؟')) onUpdate(posts.filter(i => i.id !== p.id))}} className="p-3 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="p-10 bg-white/5 border border-white/10 rounded-[50px] space-y-8">
            <h3 className="text-2xl font-black text-orange-500">💰 إعدادات الربح Adsterra</h3>
            <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400">كود Social Bar</label>
                <textarea className="w-full h-40 p-6 bg-black/40 rounded-3xl font-mono text-[10px]" dir="ltr" value={localSettings.globalAdsCode} onChange={e => setLocalSettings({...localSettings, globalAdsCode: e.target.value})} />
            </div>
            <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400">Direct Link URL</label>
                <input className="w-full p-6 bg-black/40 rounded-3xl font-mono text-xs" dir="ltr" value={localSettings.directLinkCode} onChange={e => setLocalSettings({...localSettings, directLinkCode: e.target.value})} />
            </div>
            <button onClick={() => {onUpdateSettings(localSettings); alert('تم الحفظ!');}} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black">حفظ الأكواد 💾</button>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-md mx-auto p-10 bg-white/5 border border-white/10 rounded-[50px] space-y-8">
           <h3 className="text-xl font-black text-center">🔐 أمان الموقع</h3>
           <input type="password" placeholder="كلمة المرور الجديدة" className="w-full p-6 bg-black/40 rounded-3xl text-center" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
           <button onClick={() => {onUpdateSettings(localSettings); alert('تم التحديث!');}} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black">تغيير كلمة المرور</button>
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="p-10 bg-white/5 border border-white/10 rounded-[50px] space-y-8">
           <input className="w-full p-6 bg-black/40 rounded-3xl font-black" placeholder="عنوان العرض" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
           <textarea className="w-full h-48 p-6 bg-black/40 rounded-3xl" placeholder="المحتوى" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
           <div className="grid grid-cols-2 gap-4">
              <input type="number" className="p-6 bg-black/40 rounded-3xl" placeholder="السعر" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              <input className="p-6 bg-black/40 rounded-3xl" placeholder="رابط الأفلييت" value={form.affiliateLink} onChange={e => setForm({...form, affiliateLink: e.target.value})} />
           </div>
           <button onClick={handleSavePost} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black">نشر / تحديث 🚀</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
