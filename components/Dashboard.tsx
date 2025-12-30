
import React, { useState } from 'react';
import { Article, Settings, Category } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
  onPreviewArticle: (a: Article) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout, onPreviewArticle }) => {
  const [tab, setTab] = useState<'items' | 'ads' | 'new' | 'settings'>('items');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [showPass, setShowPass] = useState(false);
  
  const [newItem, setNewItem] = useState<Partial<Article>>({
    // Corrected Category.TECH to Category.TECH_REVIEWS
    name: '', content: '', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200', category: Category.TECH_REVIEWS, isProduct: false, price: 0
  });

  const handlePublish = () => {
    if(!newItem.name || !newItem.content) return alert('يرجى ملء كافة البيانات!');
    const art: Article = {
      ...newItem as Article,
      id: Date.now().toString(),
      rating: 5, views: 0, author: 'المدير',
      date: new Date().toLocaleDateString('ar-MA')
    };
    onUpdateArticles([art, ...articles]);
    alert('🚀 تم النشر بنجاح على عبدو ويب!');
    setTab('items');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 animate-fadeIn px-4" dir="rtl">
      {/* رأس اللوحة */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] shadow-2xl flex flex-col md:flex-row items-center justify-between mb-10 border border-slate-100 dark:border-slate-800 transition-all">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-[20px] flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">⚙️</div>
          <div>
            <h2 className="text-2xl font-black">غرفة القيادة</h2>
            <p className="text-slate-400 font-bold text-sm">أنت الآن تتحكم في متجر ومدونة عبدو ويب</p>
          </div>
        </div>
        <button onClick={onLogout} className="mt-6 md:mt-0 px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-colors border border-red-200/30">تسجيل الخروج</button>
      </div>

      {/* التبويبات */}
      <div className="flex flex-wrap gap-3 mb-12">
        <button onClick={() => setTab('items')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'items' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>📦 كل المحتوى</button>
        <button onClick={() => setTab('new')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'new' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>➕ إضافة جديد</button>
        <button onClick={() => setTab('ads')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'ads' ? 'bg-orange-600 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>💰 الإعلانات</button>
        <button onClick={() => setTab('settings')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'settings' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>⚙️ إعدادات الأمان</button>
      </div>

      {/* قائمة العناصر */}
      {tab === 'items' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map(a => (
            <div key={a.id} className="bg-white dark:bg-slate-900 p-5 rounded-[35px] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="flex items-center gap-5 truncate">
                <img src={a.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                <div className="truncate">
                    <span className="font-black text-lg block truncate">{a.name}</span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg inline-block mt-1 ${a.isProduct ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {a.isProduct ? '🛒 منتج' : '📝 مقال'}
                    </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onPreviewArticle(a)} 
                  className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                  title="معاينة (العين)"
                >👁️</button>
                <button 
                  onClick={() => onUpdateArticles(articles.filter(i => i.id !== a.id))} 
                  className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                >🗑️</button>
              </div>
            </div>
          ))}
          <div 
            onClick={() => setTab('new')}
            className="p-10 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[35px] text-center font-black text-slate-400 cursor-pointer hover:border-emerald-500/50 hover:text-emerald-500 transition-all group"
          >
            <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">✨</span>
            أضف شيئاً جديداً للعالم
          </div>
        </div>
      )}

      {/* نموذج الإضافة مع المعاينة الحية */}
      {tab === 'new' && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-black mb-8 border-b pb-4">محرر المحتوى الذكي</h3>
            
            <div className="flex gap-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <button 
                onClick={() => setNewItem({...newItem, isProduct: false})} 
                className={`flex-1 py-4 rounded-xl font-black transition-all ${!newItem.isProduct ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600' : 'text-slate-400'}`}
              >📝 كتابة مقال</button>
              <button 
                onClick={() => setNewItem({...newItem, isProduct: true})} 
                className={`flex-1 py-4 rounded-xl font-black transition-all ${newItem.isProduct ? 'bg-white dark:bg-slate-700 shadow-md text-orange-600' : 'text-slate-400'}`}
              >🛒 إضافة منتج</button>
            </div>

            <div className="space-y-4">
                <input className="w-full p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-500 outline-none transition-all" placeholder="العنوان المثير..." value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                    <select className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-500 outline-none" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as Category})}>
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {newItem.isProduct && (
                        <input type="number" className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold border-2 border-transparent focus:border-orange-500 outline-none" placeholder="السعر (د.م)..." value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
                    )}
                </div>

                <input className="w-full p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-mono text-xs border-2 border-transparent focus:border-emerald-500 outline-none" placeholder="رابط الصورة المباشر..." value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                
                <textarea className="w-full h-48 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-500 outline-none resize-none leading-relaxed" placeholder="اكتب القصة أو وصف المنتج هنا..." value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
            </div>

            <button onClick={handlePublish} className="w-full py-6 bg-emerald-600 text-white rounded-[30px] font-black text-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all">نشر فوراً 🚀</button>
          </div>

          <div className="sticky top-24 h-fit">
            <h4 className="font-black mb-6 flex items-center gap-3 text-slate-400">
                <span className="text-2xl">👁️</span> معاينة حقيقية (Live)
            </h4>
            <div className={`rounded-[45px] overflow-hidden border-4 border-emerald-500/10 shadow-2xl ${newItem.isProduct ? 'max-w-xs mx-auto' : ''}`}>
               <div className="relative h-60 bg-slate-100">
                  <img src={newItem.image} className="w-full h-full object-cover" alt="Preview" />
                  {!newItem.isProduct && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  )}
               </div>
               <div className={`p-8 bg-white dark:bg-slate-800 ${newItem.isProduct ? 'text-center' : ''}`}>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{newItem.category}</span>
                  <h5 className="font-black text-xl mt-2 mb-4 leading-tight">{newItem.name || 'العنوان يظهر هنا...'}</h5>
                  {newItem.isProduct ? (
                      <p className="text-3xl font-black text-emerald-600">{newItem.price || 0} <small className="text-xs">د.م</small></p>
                  ) : (
                      <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{newItem.content || 'بداية المحتوى ستظهر هنا أثناء كتابتك...'}</p>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* إعدادات الأمان (العين في كلمة السر) */}
      {tab === 'settings' && (
        <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 p-12 rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 mx-auto mb-4">🔑</div>
            <h3 className="text-2xl font-black">حماية لوحة التحكم</h3>
            <p className="text-slate-400 font-bold">تغيير كلمة المرور الخاصة بالإدارة</p>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <label className="block text-xs font-black text-slate-400 mb-3 mr-2">كلمة السر الجديدة</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  className="w-full p-5 pl-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all" 
                  value={localSettings.dashboardPassword} 
                  onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {showPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-3 mr-2">اسم الموقع (البراند)</label>
              <input 
                className="w-full p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" 
                value={localSettings.siteName} 
                onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} 
              />
            </div>

            <button onClick={() => {onUpdateSettings(localSettings); alert('✅ تم تحديث بيانات الأمان بنجاح!');}} className="w-full py-6 bg-blue-600 text-white rounded-[30px] font-black text-xl shadow-xl hover:bg-blue-700 transition-all">تثبيت الإعدادات 💾</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
