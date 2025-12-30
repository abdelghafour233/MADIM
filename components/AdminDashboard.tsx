
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
    title: '', 
    excerpt: '', 
    content: '', 
    image: '', 
    category: Category.TEMU, 
    author: 'عبدو التقني',
    affiliateLink: '',
    couponCode: '',
    isTrending: false
  });

  const handleSavePost = () => {
    if (!form.title || !form.content) return alert('يرجى كتابة العنوان والمحتوى!');
    if (editingPostId) {
      const updatedPosts = posts.map(p => p.id === editingPostId ? { ...p, ...form as Article } : p);
      onUpdate(updatedPosts);
    } else {
      const p: Article = { ...form as Article, id: Date.now().toString(), date: new Date().toLocaleDateString('ar-MA'), views: 0 } as Article;
      onUpdate([p, ...posts]);
    }
    resetForm();
    setActiveTab('list');
  };

  const handleEditClick = (p: Article) => {
    setEditingPostId(p.id);
    setForm({ 
      title: p.title, 
      excerpt: p.excerpt, 
      content: p.content, 
      image: p.image, 
      category: p.category, 
      author: p.author,
      affiliateLink: p.affiliateLink || '',
      couponCode: p.couponCode || '',
      isTrending: p.isTrending || false
    });
    setActiveTab('editor');
  };

  const resetForm = () => {
    setEditingPostId(null);
    setForm({ title: '', excerpt: '', content: '', image: '', category: Category.TEMU, author: 'عبدو التقني', affiliateLink: '', couponCode: '', isTrending: false });
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20" dir="rtl">
      <div className={`p-8 rounded-[40px] mb-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 border border-white/10`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl">⚙️</div>
          <h2 className="text-2xl font-black">إدارة العروض والأرباح</h2>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={() => setActiveTab('list')} className={`px-5 py-2 rounded-xl font-bold transition-all ${activeTab === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5'}`}>العروض</button>
          <button onClick={() => setActiveTab('ads')} className={`px-5 py-2 rounded-xl font-bold transition-all ${activeTab === 'ads' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5'}`}>أرباح Adsterra</button>
          <button onClick={() => setActiveTab('security')} className={`px-5 py-2 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5'}`}>الأمان</button>
          <button onClick={onLogout} className="px-5 py-2 bg-red-600/20 text-red-500 rounded-xl font-bold border border-red-500/30">خروج</button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button onClick={() => {resetForm(); setActiveTab('editor');}} className="p-10 border-4 border-dashed border-white/10 rounded-[40px] font-black text-slate-500 hover:border-emerald-500/50 hover:text-emerald-500 transition-all group">
             <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">➕</span>
             إضافة مراجعة أفلييت
          </button>
          {posts.map(p => (
            <div key={p.id} className="p-6 bg-white/5 border border-white/5 rounded-[40px] flex flex-col justify-between group hover:border-white/20 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <img src={p.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                <div className="truncate">
                  <h4 className="font-black truncate">{p.title}</h4>
                  <span className="text-[10px] font-black uppercase text-emerald-500">{p.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => handleEditClick(p)} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold">تعديل</button>
                 <button onClick={() => {if(confirm('حذف هذا العرض؟')) onUpdate(posts.filter(i => i.id !== p.id))}} className="p-3 bg-red-600/20 text-red-500 rounded-2xl">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-emerald-600/10 border-2 border-emerald-500/20 p-8 rounded-[40px] space-y-4">
            <h3 className="text-2xl font-black text-emerald-500">💰 إعدادات الأرباح المتقدمة</h3>
            <p className="font-bold opacity-80 leading-relaxed text-sm">لديك الآن 3 قنوات للربح من أدستيرا في موقعك:</p>
            <ul className="text-xs space-y-2 opacity-70 list-disc pr-5">
              <li><b>Social Bar:</b> يظهر كإشعار ذكي لجميع الزوار.</li>
              <li><b>Native Banners:</b> إعلانات مندمجة تظهر داخل المقالات.</li>
              <li><b>Direct Link:</b> رابط مباشر يظهر كـ "هدية" لزيادة النقرات.</li>
            </ul>
          </div>

          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-10">
              <div className="space-y-4">
                <label className="block text-sm font-black text-emerald-500">كود Social Bar / Popunder Script</label>
                <textarea className="w-full h-32 p-5 bg-black/40 rounded-2xl font-mono text-xs text-left" dir="ltr" placeholder="<script ...></script>" value={localSettings.globalAdsCode} onChange={e => setLocalSettings({...localSettings, globalAdsCode: e.target.value})} />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-orange-500">الرابط المباشر - Direct Link (مثال الآيدي 5500631)</label>
                <input className="w-full p-5 bg-black/40 rounded-2xl font-mono text-xs text-left" dir="ltr" placeholder="https://www.example.com/..." value={localSettings.directLinkCode} onChange={e => setLocalSettings({...localSettings, directLinkCode: e.target.value})} />
                <p className="text-[10px] text-orange-400 font-bold">انسخ الرابط الكامل الذي يبدأ بـ http من حسابك في أدستيرا.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-blue-500">كود Native Banner (داخل المقالات)</label>
                <textarea className="w-full h-32 p-5 bg-black/40 rounded-2xl font-mono text-xs text-left" dir="ltr" placeholder="<div id='...'></div>" value={localSettings.alternativeAdsCode} onChange={e => setLocalSettings({...localSettings, alternativeAdsCode: e.target.value})} />
              </div>

              <button onClick={() => {onUpdateSettings(localSettings); alert('✅ تم حفظ جميع إعدادات الأرباح!');}} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-2xl shadow-xl">حفظ التغييرات 💾</button>
          </div>
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-10">
           <h3 className="text-2xl font-black">{editingPostId ? 'تعديل العرض' : 'إضافة عرض جديد'}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="w-full p-5 bg-black/40 rounded-2xl font-black text-xl outline-none" placeholder="عنوان العرض (جذاب)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <select className="w-full p-5 bg-black/40 rounded-2xl font-black outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value as Category})}>
                   {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="w-full p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl font-bold" placeholder="رابط الأفلييت (تيمو/أمازون)" value={form.affiliateLink} onChange={e => setForm({...form, affiliateLink: e.target.value})} />
              <input className="w-full p-5 bg-orange-500/10 border border-orange-500/30 rounded-2xl font-bold" placeholder="كود الخصم إن وجد" value={form.couponCode} onChange={e => setForm({...form, couponCode: e.target.value})} />
           </div>
           <textarea className="w-full h-64 p-5 bg-black/40 rounded-2xl leading-relaxed" placeholder="اكتب المراجعة هنا بأسلوب مقنع..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="w-full p-5 bg-black/40 rounded-2xl outline-none" placeholder="رابط صورة العرض" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-2xl">
                  <input type="checkbox" className="w-6 h-6 rounded-lg accent-emerald-500" checked={form.isTrending} onChange={e => setForm({...form, isTrending: e.target.checked})} />
                  <span className="font-black text-orange-500">همزة اليوم (الواجهة الرئيسية)</span>
              </label>
           </div>
           <button onClick={handleSavePost} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-2xl shadow-xl">نشر العرض 🚀</button>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-md mx-auto p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-8">
           <h3 className="text-xl font-black text-center">إعدادات الأمان</h3>
           <input className="w-full p-4 bg-black/40 rounded-xl" placeholder="اسم الموقع" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
           <input type="password" placeholder="كلمة المرور الجديدة" className="w-full p-4 bg-black/40 rounded-xl" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
           <button onClick={() => {onUpdateSettings(localSettings); alert('✅ تم التحديث!');}} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">حفظ التغييرات 💾</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
