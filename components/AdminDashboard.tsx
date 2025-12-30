
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
  const directLinkActive = settings.directLinkCode && settings.directLinkCode.startsWith('http');

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

  const clearAppCache = () => {
    if(confirm('سيتم تسجيل خروجك ومسح كل الكاش لضمان تحميل أحدث نسخة من السكريبت وتجاوز أخطاء كلود فلير. هل أنت متأكد؟')) {
      localStorage.clear();
      // القيمة 1.2.0-final تجبر المتصفح على تحميل جديد
      window.location.href = window.location.pathname + "?refresh=" + Date.now();
    }
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20 px-4" dir="rtl">
      <div className="p-6 md:p-10 rounded-[40px] mb-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20">🚀</div>
          <div>
            <h2 className="text-2xl font-black">إدارة abdouweb</h2>
            <p className="text-slate-500 font-bold text-sm">مرحباً بك يا عبدو، الأرباح في ازدياد!</p>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 flex-wrap justify-center relative z-10">
          <button onClick={() => setActiveTab('list')} className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}>العروض</button>
          <button onClick={() => setActiveTab('ads')} className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'ads' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}>الأرباح</button>
          <button onClick={() => setActiveTab('security')} className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}>الأمان</button>
          <button onClick={onLogout} className="px-6 py-3 bg-red-600/10 text-red-500 rounded-2xl font-black text-sm border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">خروج</button>
        </div>
      </div>

      {activeTab === 'list' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
             <div className="bg-white/5 border border-white/10 p-6 rounded-[35px] text-center">
                <span className="text-xs font-black text-slate-500 uppercase block mb-1">إجمالي المشاهدات</span>
                <span className="text-3xl font-black text-emerald-500">{totalViews.toLocaleString()}</span>
             </div>
             <div className="bg-white/5 border border-white/10 p-6 rounded-[35px] text-center">
                <span className="text-xs font-black text-slate-500 uppercase block mb-1">عدد العروض</span>
                <span className="text-3xl font-black text-white">{posts.length}</span>
             </div>
             <div className="bg-white/5 border border-white/10 p-6 rounded-[35px] text-center relative overflow-hidden group">
                <span className="text-xs font-black text-slate-500 uppercase block mb-1">حالة الإعلانات</span>
                <div className="flex items-center justify-center gap-2">
                   <span className={`w-3 h-3 rounded-full ${adsActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                   <span className="text-xl font-black">{adsActive ? 'نشطة ✅' : 'متوقفة ❌'}</span>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 p-6 rounded-[35px] text-center">
                <span className="text-xs font-black text-slate-500 uppercase block mb-1">Direct Link</span>
                <span className={`text-xl font-black ${directLinkActive ? 'text-orange-500' : 'text-slate-500'}`}>{directLinkActive ? 'مفعل 🔥' : 'غير مبرمج'}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button onClick={() => {resetForm(); setActiveTab('editor');}} className="p-10 border-4 border-dashed border-white/10 rounded-[40px] font-black text-slate-500 hover:border-emerald-500/50 hover:text-emerald-500 transition-all group min-h-[250px] flex flex-col items-center justify-center bg-white/5">
               <span className="text-5xl block mb-4 group-hover:scale-125 transition-transform duration-500">➕</span>
               إضافة منتج أو عرض جديد
            </button>
            {posts.map(p => (
              <div key={p.id} className="p-6 bg-white/5 border border-white/5 rounded-[40px] flex flex-col justify-between group hover:border-emerald-500/30 transition-all shadow-xl hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <img src={p.image} className="w-20 h-20 rounded-2xl object-cover border border-white/5 shadow-lg" alt="" />
                  <div className="truncate">
                    <h4 className="font-black truncate text-lg group-hover:text-emerald-500 transition-colors">{p.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">{p.category}</span>
                      <span className="text-[9px] font-black text-slate-500">👁️ {p.views || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleEditClick(p)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-500 transition-colors">تعديل</button>
                   <button onClick={() => {if(confirm('حذف هذا العرض نهائياً؟')) onUpdate(posts.filter(i => i.id !== p.id))}} className="p-4 bg-red-600/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'editor' && (
        <div className="p-6 md:p-12 bg-white/5 border border-white/10 rounded-[50px] space-y-8 md:space-y-12 shadow-2xl">
           <div className="flex justify-between items-center">
             <h3 className="text-3xl font-black text-emerald-500">{editingPostId ? 'تعديل البيانات' : 'إضافة عرض جديد لـ abdouweb'}</h3>
             <button onClick={() => setActiveTab('list')} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-500 font-bold hover:bg-red-500 hover:text-white transition-all">✕</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">عنوان المنتج</label>
                <input className="w-full p-6 bg-black/40 rounded-3xl font-black text-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all" placeholder="مثلاً: ساعة الترا 9 برو" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">التصنيف</label>
                <select className="w-full p-6 bg-black/40 rounded-3xl font-black outline-none border-2 border-transparent focus:border-emerald-500 transition-all appearance-none cursor-pointer" value={form.category} onChange={e => setForm({...form, category: e.target.value as Category})}>
                   {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">صورة المنتج</label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="lg:col-span-1 border-4 border-dashed border-white/10 rounded-[40px] p-10 text-center cursor-pointer hover:border-emerald-500/50 transition-all bg-black/20 group relative overflow-hidden h-64 flex flex-col items-center justify-center"
                >
                  {form.image ? (
                    <img src={form.image} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" alt="" />
                  ) : null}
                  <div className="relative z-10">
                    <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">📸</span>
                    <span className="font-black text-sm text-white bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md">تحميل صورة</span>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                
                <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
                  <div className="relative">
                    <input className="w-full p-6 bg-black/40 rounded-3xl font-mono text-sm outline-none border-2 border-transparent focus:border-emerald-500 transition-all pr-14" placeholder="أو ضع رابط الصورة هنا..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 text-2xl">🔗</span>
                  </div>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">رابط الشراء (أفلييت)</label>
                <input className="w-full p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl font-bold outline-none focus:border-emerald-500 focus:bg-emerald-500/10 transition-all" placeholder="https://..." value={form.affiliateLink} onChange={e => setForm({...form, affiliateLink: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">كود الخصم</label>
                <input className="w-full p-6 bg-orange-500/5 border border-orange-500/20 rounded-3xl font-black text-center text-2xl tracking-widest outline-none focus:border-orange-500 focus:bg-orange-500/10 transition-all" placeholder="ABDO2025" value={form.couponCode} onChange={e => setForm({...form, couponCode: e.target.value})} />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">ثمن البيع (د.م)</label>
                <input type="number" className="w-full p-6 bg-black/40 rounded-3xl font-black text-2xl outline-none border-2 border-transparent focus:border-emerald-500" placeholder="199" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">ثمن السوق (للمقارنة)</label>
                <input type="number" className="w-full p-6 bg-black/40 rounded-3xl font-black text-2xl outline-none border-2 border-transparent focus:border-emerald-500 opacity-60" placeholder="450" value={form.marketPrice} onChange={e => setForm({...form, marketPrice: Number(e.target.value)})} />
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">وصف المنتج (Content)</label>
              <textarea className="w-full h-64 p-8 bg-black/40 rounded-[40px] leading-relaxed text-lg outline-none border-2 border-transparent focus:border-emerald-500 resize-none font-medium" placeholder="اكتب تفاصيل المنتج هنا بشكل يجذب المشتري..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
           </div>

           <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-black text-orange-500 text-xl">تمييز المنتج في الواجهة 🔥</h4>
                <p className="text-xs opacity-40 font-bold">سيظهر كـ "همزة اليوم" في أعلى الصفحة الرئيسية.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer scale-125">
                <input type="checkbox" className="sr-only peer" checked={form.isTrending} onChange={e => setForm({...form, isTrending: e.target.checked})} />
                <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
           </div>

           <button onClick={handleSavePost} className="w-full py-8 bg-emerald-600 text-white rounded-[40px] font-black text-3xl shadow-2xl hover:bg-emerald-500 hover:scale-[1.01] active:scale-95 transition-all">
             {editingPostId ? 'تحديث البيانات 🔄' : 'نشر الهمزة فوراً 🚀'}
           </button>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
          <div className="bg-orange-600/10 border-2 border-orange-500/20 p-10 rounded-[50px] space-y-4">
            <h3 className="text-3xl font-black text-orange-500">💰 محرك أرباح Adsterra</h3>
            <p className="font-bold opacity-80 leading-relaxed text-lg">هنا تضع الأكواد التي تجعل "العداد" يتحرك في حسابك. تأكد من صحة الكود قبل الحفظ.</p>
          </div>

          <div className="p-10 md:p-16 bg-white/5 border border-white/10 rounded-[60px] space-y-12 shadow-2xl">
              <div className="space-y-6">
                <label className="block text-lg font-black text-emerald-500 uppercase tracking-widest">كود Social Bar</label>
                <textarea className="w-full h-48 p-8 bg-black/40 rounded-[40px] font-mono text-xs text-left border-2 border-transparent focus:border-emerald-500 leading-relaxed shadow-inner" dir="ltr" value={localSettings.globalAdsCode} onChange={e => setLocalSettings({...localSettings, globalAdsCode: e.target.value})} placeholder="الصق كود الـ Social Bar هنا..." />
              </div>

              <div className="space-y-6">
                <label className="block text-lg font-black text-orange-500 uppercase tracking-widest">Direct Link URL</label>
                <input className="w-full p-8 bg-black/40 rounded-[35px] font-mono text-sm text-left border-2 border-transparent focus:border-orange-500 shadow-inner" dir="ltr" value={localSettings.directLinkCode} onChange={e => setLocalSettings({...localSettings, directLinkCode: e.target.value})} placeholder="https://www.example.com/..." />
              </div>

              <button onClick={() => {onUpdateSettings(localSettings); alert('✅ تم حفظ أكواد الإعلانات بنجاح!');}} className="w-full py-8 bg-orange-600 text-white rounded-[40px] font-black text-2xl shadow-xl hover:bg-orange-500 transition-all">حفظ وتفعيل الأرباح 💾</button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-md mx-auto p-12 bg-white/5 border border-white/10 rounded-[60px] space-y-10 shadow-2xl animate-fadeIn">
           <div className="text-center">
             <div className="w-20 h-20 bg-blue-600 rounded-[30px] flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20 mx-auto mb-6">🔑</div>
             <h3 className="text-2xl font-black">أمان الموقع</h3>
           </div>
           
           <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 mr-4 uppercase tracking-tighter">اسم الموقع</label>
               <input className="w-full p-6 bg-black/40 rounded-3xl font-black outline-none border-2 border-transparent focus:border-blue-500 text-center" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 mr-4 uppercase tracking-tighter">كلمة مرور اللوحة</label>
               <input type="password" placeholder="••••••••" className="w-full p-6 bg-black/40 rounded-3xl font-black outline-none border-2 border-transparent focus:border-blue-500 text-center text-xl tracking-widest" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
             </div>
           </div>

           <div className="pt-6 border-t border-white/5">
             <button onClick={clearAppCache} className="w-full py-4 bg-yellow-600/10 text-yellow-500 rounded-2xl font-black text-sm border border-yellow-500/20 hover:bg-yellow-600 hover:text-white transition-all mb-4">تحديث النظام (إصلاح الكاش) ⚡</button>
             <button onClick={() => {onUpdateSettings(localSettings); alert('✅ تم حفظ التعديلات!');}} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-blue-500 transition-all">حفظ التعديلات 💾</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
