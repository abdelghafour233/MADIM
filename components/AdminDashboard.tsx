
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

  const [form, setForm] = useState<Partial<Article>>({
    title: '', 
    excerpt: '', 
    content: '', 
    image: '', 
    category: Category.TEMU, 
    author: 'عبدو التقني',
    affiliateLink: '',
    couponCode: '',
    isTrending: false,
    price: 0,
    marketPrice: 0
  });

  const handleSavePost = () => {
    if (!form.title || !form.content) return alert('يرجى كتابة العنوان والمحتوى!');
    if (editingPostId) {
      const updatedPosts = posts.map(p => p.id === editingPostId ? { ...p, ...form as Article, name: form.title } : p);
      onUpdate(updatedPosts);
    } else {
      const p: Article = { 
        ...form as Article, 
        id: Date.now().toString(), 
        date: new Date().toLocaleDateString('ar-MA'), 
        views: 0,
        name: form.title 
      } as Article;
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
      isTrending: p.isTrending || false,
      price: p.price || 0,
      marketPrice: p.marketPrice || 0
    });
    setActiveTab('editor');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 2 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEditingPostId(null);
    setForm({ title: '', excerpt: '', content: '', image: '', category: Category.TEMU, author: 'عبدو التقني', affiliateLink: '', couponCode: '', isTrending: false, price: 0, marketPrice: 0 });
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20 px-4" dir="rtl">
      <div className={`p-6 md:p-8 rounded-[30px] md:rounded-[40px] mb-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 border border-white/10`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">⚙️</div>
          <h2 className="text-xl md:text-2xl font-black">إدارة abdouweb affiliate</h2>
        </div>
        <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
          <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5'}`}>العروض</button>
          <button onClick={() => setActiveTab('ads')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'ads' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5'}`}>الأرباح</button>
          <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5'}`}>الأمان</button>
          <button onClick={onLogout} className="px-4 py-2 bg-red-600/20 text-red-500 rounded-xl font-bold text-sm border border-red-500/30">خروج</button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button onClick={() => {resetForm(); setActiveTab('editor');}} className="p-10 border-4 border-dashed border-white/10 rounded-[40px] font-black text-slate-500 hover:border-emerald-500/50 hover:text-emerald-500 transition-all group min-h-[200px]">
             <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">➕</span>
             إضافة منتج أو عرض
          </button>
          {posts.map(p => (
            <div key={p.id} className="p-6 bg-white/5 border border-white/5 rounded-[40px] flex flex-col justify-between group hover:border-white/20 transition-all shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <img src={p.image} className="w-20 h-20 rounded-2xl object-cover border border-white/5" alt="" />
                <div className="truncate">
                  <h4 className="font-black truncate text-lg">{p.title}</h4>
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">{p.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => handleEditClick(p)} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg">تعديل</button>
                 <button onClick={() => {if(confirm('حذف هذا العرض؟')) onUpdate(posts.filter(i => i.id !== p.id))}} className="p-3 bg-red-600/20 text-red-500 rounded-2xl border border-red-500/20">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="p-6 md:p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-8 md:space-y-10 shadow-2xl">
           <div className="flex justify-between items-center">
             <h3 className="text-2xl font-black">{editingPostId ? 'تعديل البيانات' : 'إضافة عرض جديد'}</h3>
             <button onClick={() => setActiveTab('list')} className="text-slate-500 font-bold">إلغاء ✕</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">عنوان المنتج</label>
                <input className="w-full p-5 bg-black/40 rounded-2xl font-black text-lg outline-none border-2 border-transparent focus:border-emerald-500 transition-all" placeholder="مثلاً: ساعة الترا 9 برو" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">التصنيف</label>
                <select className="w-full p-5 bg-black/40 rounded-2xl font-black outline-none border-2 border-transparent focus:border-emerald-500 transition-all appearance-none" value={form.category} onChange={e => setForm({...form, category: e.target.value as Category})}>
                   {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
           </div>

           {/* قسم تحميل الصورة المطور */}
           <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">صورة المنتج (تحميل أو رابط)</label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="lg:col-span-1 border-4 border-dashed border-white/10 rounded-[30px] p-8 text-center cursor-pointer hover:border-emerald-500/50 transition-all bg-black/20 group relative overflow-hidden h-48 flex flex-col items-center justify-center"
                >
                  {form.image ? (
                    <img src={form.image} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity" alt="" />
                  ) : null}
                  <div className="relative z-10">
                    <span className="text-4xl block mb-2">📸</span>
                    <span className="font-black text-sm text-white">تحميل صورة من الجهاز</span>
                    <p className="text-[10px] opacity-40 mt-1">تنسيقات: JPG, PNG, WEBP</p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                
                <div className="lg:col-span-2 space-y-4">
                  <div className="relative">
                    <input className="w-full p-5 bg-black/40 rounded-2xl font-mono text-xs outline-none border-2 border-transparent focus:border-emerald-500 transition-all pr-12" placeholder="أو ضع رابط الصورة هنا مباشرة..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">🔗</span>
                  </div>
                  <div className="bg-emerald-600/10 p-4 rounded-2xl border border-emerald-500/20">
                    <p className="text-[11px] font-bold text-emerald-400 leading-relaxed">💡 نصيحة: يفضل تحميل صورة مربعة الأبعاد (1:1) وبحجم أقل من 1 ميجابايت لضمان سرعة تحميل الموقع للزوار.</p>
                  </div>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">رابط الأفلييت / الشراء</label>
                <input className="w-full p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl font-bold outline-none focus:border-emerald-500" placeholder="https://..." value={form.affiliateLink} onChange={e => setForm({...form, affiliateLink: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">كود الخصم (اختياري)</label>
                <input className="w-full p-5 bg-orange-500/10 border border-orange-500/30 rounded-2xl font-bold outline-none focus:border-orange-500" placeholder="PROMO20" value={form.couponCode} onChange={e => setForm({...form, couponCode: e.target.value})} />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">ثمن البيع (د.م)</label>
                <input type="number" className="w-full p-5 bg-black/40 rounded-2xl font-black outline-none border-2 border-transparent focus:border-emerald-500" placeholder="199" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">ثمن السوق (للمقارنة)</label>
                <input type="number" className="w-full p-5 bg-black/40 rounded-2xl font-black outline-none border-2 border-transparent focus:border-emerald-500" placeholder="450" value={form.marketPrice} onChange={e => setForm({...form, marketPrice: Number(e.target.value)})} />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">وصف المنتج وتفاصيل الهمزة</label>
              <textarea className="w-full h-48 p-5 bg-black/40 rounded-2xl leading-relaxed outline-none border-2 border-transparent focus:border-emerald-500 resize-none" placeholder="اشرح للزبون مميزات هاد المنتج ولماذا يجب أن يشتريه الآن..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
           </div>

           <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-black text-orange-500">تمييز المنتج 🔥</h4>
                <p className="text-[10px] opacity-40 font-bold">سيظهر كأول عرض في واجهة الموقع الرئيسية (Hero Section)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={form.isTrending} onChange={e => setForm({...form, isTrending: e.target.checked})} />
                <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
           </div>

           <button onClick={handleSavePost} className="w-full py-6 bg-emerald-600 text-white rounded-[30px] font-black text-2xl shadow-xl shadow-emerald-600/20 hover:scale-[1.01] active:scale-95 transition-all">
             {editingPostId ? 'تحديث البيانات 🔄' : 'نشر الهمزة فوراً 🚀'}
           </button>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-emerald-600/10 border-2 border-emerald-500/20 p-8 rounded-[40px] space-y-4">
            <h3 className="text-2xl font-black text-emerald-500">💰 إعدادات الأرباح المتقدمة</h3>
            <p className="font-bold opacity-80 leading-relaxed text-sm">لديك الآن 3 قنوات للربح من أدستيرا في موقعك:</p>
            <ul className="text-xs space-y-2 opacity-70 list-disc pr-5 font-bold">
              <li><b>Social Bar:</b> يظهر كإشعار ذكي لجميع الزوار.</li>
              <li><b>Native Banners:</b> إعلانات مندمجة تظهر داخل المقالات.</li>
              <li><b>Direct Link:</b> رابط مباشر يظهر كـ "هدية" لزيادة النقرات.</li>
            </ul>
          </div>

          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-10 shadow-2xl">
              <div className="space-y-4">
                <label className="block text-sm font-black text-emerald-500 uppercase tracking-widest">كود Social Bar / Popunder Script</label>
                <textarea className="w-full h-32 p-5 bg-black/40 rounded-2xl font-mono text-xs text-left border-2 border-transparent focus:border-emerald-500" dir="ltr" placeholder="<script ...></script>" value={localSettings.globalAdsCode} onChange={e => setLocalSettings({...localSettings, globalAdsCode: e.target.value})} />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-orange-500 uppercase tracking-widest">الرابط المباشر - Direct Link</label>
                <input className="w-full p-5 bg-black/40 rounded-2xl font-mono text-xs text-left border-2 border-transparent focus:border-orange-500" dir="ltr" placeholder="https://www.example.com/..." value={localSettings.directLinkCode} onChange={e => setLocalSettings({...localSettings, directLinkCode: e.target.value})} />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black text-blue-500 uppercase tracking-widest">كود Native Banner</label>
                <textarea className="w-full h-32 p-5 bg-black/40 rounded-2xl font-mono text-xs text-left border-2 border-transparent focus:border-blue-500" dir="ltr" placeholder="<div id='...'></div>" value={localSettings.alternativeAdsCode} onChange={e => setLocalSettings({...localSettings, alternativeAdsCode: e.target.value})} />
              </div>

              <button onClick={() => {onUpdateSettings(localSettings); alert('✅ تم حفظ جميع إعدادات الأرباح!');}} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all">حفظ التغييرات 💾</button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-md mx-auto p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-8 shadow-2xl animate-fadeIn">
           <div className="text-center">
             <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 mx-auto mb-4">🔑</div>
             <h3 className="text-xl font-black">إعدادات الأمان</h3>
             <p className="text-slate-500 font-bold text-xs mt-2">تحديث بيانات الدخول واسم الموقع</p>
           </div>
           
           <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 mr-2 uppercase">اسم الموقع</label>
               <input className="w-full p-5 bg-black/40 rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-500" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 mr-2 uppercase">كلمة المرور الجديدة</label>
               <input type="password" placeholder="••••••••" className="w-full p-5 bg-black/40 rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-500 text-center" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
             </div>
           </div>
           
           <button onClick={() => {onUpdateSettings(localSettings); alert('✅ تم تحديث بيانات الأمان!');}} className="w-full py-5 bg-blue-600 text-white rounded-[30px] font-black text-xl shadow-xl hover:scale-105 transition-all">حفظ التعديلات 💾</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
