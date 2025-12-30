
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
    category: Category.TECH_REVIEWS, 
    author: 'عبدو التقني',
    affiliateLink: '',
    couponCode: ''
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
    setForm({ 
      title: p.title || p.name, 
      excerpt: p.excerpt, 
      content: p.content, 
      image: p.image, 
      category: p.category, 
      author: p.author,
      affiliateLink: p.affiliateLink || '',
      couponCode: p.couponCode || ''
    });
    setActiveTab('editor');
  };

  const resetForm = () => {
    setEditingPostId(null);
    setForm({ title: '', excerpt: '', content: '', image: '', category: Category.TECH_REVIEWS, author: 'عبدو التقني', affiliateLink: '', couponCode: '' });
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20" dir="rtl">
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
        <div className="max-w-4xl mx-auto space-y-12">
          {/* شرح تعليمي لاستخراج الأكواد */}
          <div className="bg-emerald-600/10 border-2 border-emerald-500/20 p-8 rounded-[40px] space-y-4">
            <h3 className="text-2xl font-black text-emerald-500 flex items-center gap-3">
              <span>💡</span> كيف تحصل على الأكواد الصحيحة من Adsterra؟
            </h3>
            <ul className="list-decimal list-inside space-y-3 font-bold opacity-80 leading-relaxed">
              <li>سجل دخولك في <a href="https://adsterra.com/" target="_blank" className="underline text-emerald-500">Adsterra</a> كـ Publisher.</li>
              <li>اذهب لـ <span className="text-orange-500">Websites</span> من القائمة اليسرى.</li>
              <li>بجانب رابط موقعك، ستجد زر <span className="bg-emerald-500 px-2 py-0.5 rounded text-white text-xs font-black">All codes</span>، اضغط عليه.</li>
              <li>ستظهر لك قائمة بالوحدات الإعلانية التي أنشأتها (مثلاً Social Bar أو Native Banner).</li>
              <li>اضغط على زر <span className="text-emerald-500 font-black">Get Code</span> الموجود بجانب كل وحدة.</li>
              <li>انسخ النص البرمجي الطويل (يبدأ بـ &lt;script...) والصقه في الخانات أدناه.</li>
            </ul>
          </div>

          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-12">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📡</span>
              <h3 className="text-2xl font-black text-orange-500">تفعيل أرباح Adsterra</h3>
              <p className="text-slate-400 mt-2">لا تضع المعرف (ID) فقط، بل انسخ الكود البرمجي بالكامل</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="block text-sm font-black text-emerald-500">1. كود إعلانات الإشعارات (Social Bar)</label>
                </div>
                <p className="text-[11px] opacity-60 leading-relaxed">هذا هو الأهم للمغرب. يظهر كإشعار جذّاب. الصق الكود البرمجي بالكامل هنا.</p>
                <textarea 
                  className="w-full h-48 p-5 bg-black/40 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none font-mono text-[10px] text-left"
                  dir="ltr"
                  placeholder="<script type='text/javascript' src='//...'></script>"
                  value={localSettings.globalAdsCode}
                  onChange={e => setLocalSettings({...localSettings, globalAdsCode: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-blue-500">2. كود البنرات داخل المقال (Native Banner)</label>
                <p className="text-[11px] opacity-60 leading-relaxed">يظهر وسط مقالات الأفلييت. انسخ كود الـ Banner أو Native Ads بالكامل هنا.</p>
                <textarea 
                  className="w-full h-48 p-5 bg-black/40 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-mono text-[10px] text-left"
                  dir="ltr"
                  placeholder="<div id='container-...'></div><script ...></script>"
                  value={localSettings.alternativeAdsCode}
                  onChange={e => setLocalSettings({...localSettings, alternativeAdsCode: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={() => {onUpdateSettings(localSettings); alert('✅ تم حفظ الأكواد! الإعلانات ستظهر الآن لزوارك فوراً.');}} 
              className="w-full py-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-3xl font-black text-2xl hover:scale-[1.01] transition-all shadow-2xl"
            >حفظ وتفعيل الأرباح الآن 💰</button>
          </div>
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-black opacity-50 mr-2">عنوان المقال</label>
                <input className="w-full p-5 bg-black/40 rounded-2xl font-black text-xl" placeholder="مثلاً: أفضل صفقات تيمو اليوم" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black opacity-50 mr-2">التصنيف</label>
                <select className="w-full p-5 bg-black/40 rounded-2xl font-black" value={form.category} onChange={e => setForm({...form, category: e.target.value as Category})}>
                   {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-black text-emerald-500 mr-2">رابط الأفلييت (Affiliate Link)</label>
                <input className="w-full p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl font-bold" placeholder="رابط تيمو أو أمازون الخاص بك..." value={form.affiliateLink} onChange={e => setForm({...form, affiliateLink: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-orange-500 mr-2">كود الخصم (Coupon Code)</label>
                <input className="w-full p-5 bg-orange-500/10 border border-orange-500/30 rounded-2xl font-bold" placeholder="مثلاً: EPM88" value={form.couponCode} onChange={e => setForm({...form, couponCode: e.target.value})} />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-xs font-black opacity-50 mr-2">محتوى المقال (شرح العرض)</label>
              <textarea className="w-full h-80 p-5 bg-black/40 rounded-2xl leading-relaxed" placeholder="اشرح للزائر لماذا هذا العرض رائع..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
           </div>

           <div className="space-y-4">
              <label className="text-xs font-black opacity-50 mr-2">رابط صورة المنتج</label>
              <input className="w-full p-5 bg-black/40 rounded-2xl" placeholder="رابط الصورة المباشر من جوجل أو تيمو..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
           </div>

           <button onClick={handleSavePost} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-500 transition-all">نشر العرض الآن 🚀</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
