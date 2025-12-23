
import React, { useState, useEffect, useRef } from 'react';
import { Article, Settings, Category } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout }) => {
  const [tab, setTab] = useState<'articles' | 'adsense' | 'settings'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.TECH, rating: 5, image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 800));
      onUpdateSettings(localSettings);
      alert('✅ تم تحديث كافة الإعدادات وكلمة السر بنجاح!');
    } catch (error) {
      alert('❌ حدث خطأ غير متوقع');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.name || !newArticle.content) return alert('يرجى ملء البيانات الأساسية');

    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      likes: editingId ? (articles.find(a => a.id === editingId)?.likes || 0) : 0,
      views: editingId ? (articles.find(a => a.id === editingId)?.views || 100) : 100,
      comments: editingId ? (articles.find(a => a.id === editingId)?.comments || []) : [],
    } as Article;

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? art : a));
    } else {
      onUpdateArticles([art, ...articles]);
    }

    setEditingId(null);
    setNewArticle({ category: Category.TECH, rating: 5, image: '' });
    alert('✅ تم حفظ المقال بنجاح');
  };

  const startEditing = (a: Article) => {
    setEditingId(a.id);
    setNewArticle(a);
    setTab('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-fadeIn">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-3 rounded-[28px] shadow-lg border border-slate-100 sticky top-24 z-40 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setTab('articles')} 
          className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'articles' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          المقالات 📝
        </button>
        <button 
          onClick={() => setTab('adsense')} 
          className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'adsense' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          الأدسنس والأرباح 💰
        </button>
        <button 
          onClick={() => setTab('settings')} 
          className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          إعدادات الموقع ⚙️
        </button>
        <button 
          onClick={onLogout} 
          className="mr-auto px-6 py-4 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-colors"
        >
          خروج الآمن
        </button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-12">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-50">
            <h2 className="text-2xl font-black mb-8 text-slate-800">{editingId ? 'تعديل المقال' : 'نشر مقال جديد'}</h2>
            <form onSubmit={handleArticleSubmit} className="space-y-6">
              <input 
                className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
                placeholder="عنوان المقال..."
                value={newArticle.name || ''}
                onChange={e => setNewArticle({...newArticle, name: e.target.value})}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select 
                  className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
                  value={newArticle.category}
                  onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
                  placeholder="رابط الصورة البارزة"
                  value={newArticle.image || ''}
                  onChange={e => setNewArticle({...newArticle, image: e.target.value})}
                />
              </div>
              <textarea 
                className="w-full h-80 p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-medium leading-relaxed"
                placeholder="محتوى المقال..."
                value={newArticle.content || ''}
                onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                required
              />
              <button 
                type="submit" 
                className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all"
              >
                {editingId ? 'حفظ التغييرات' : 'نشر المقال'}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
                <img src={a.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-black text-slate-800 truncate mb-2">{a.name}</h4>
                  <div className="flex gap-3">
                    <button onClick={() => startEditing(a)} className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100">تعديل</button>
                    <button onClick={() => {if(confirm('هل تريد حذف هذا المقال نهائياً؟')) onUpdateArticles(articles.filter(i => i.id !== a.id))}} className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'adsense' && (
        <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-50 space-y-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">الأرباح والسكربتات 💰</h2>
            <p className="text-slate-400 font-bold">إدارة أكواد AdSense وملفات الربح.</p>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-slate-700 font-black mr-2">كود Header (AdSense):</label>
              <textarea 
                className="w-full h-48 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm leading-relaxed"
                value={localSettings.adsenseCode}
                onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-slate-700 font-black mr-2">محتوى Ads.txt:</label>
              <textarea 
                className="w-full h-24 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm"
                value={localSettings.adsTxt}
                onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})}
              />
            </div>
            <button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className="w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl bg-slate-900 text-white hover:bg-emerald-600"
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات الإعلانية'}
            </button>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-50">
            <h2 className="text-3xl font-black text-slate-800 mb-10">إعدادات الموقع العامة ⚙️</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">اسم الموقع الظاهر</label>
                <input 
                  className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
                  value={localSettings.siteName}
                  onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">رابط الموقع (Domain)</label>
                <input 
                  className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-left"
                  dir="ltr"
                  value={localSettings.domain}
                  onChange={e => setLocalSettings({...localSettings, domain: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="block text-slate-700 font-black mr-2">وصف الموقع (لتحسين محركات البحث SEO)</label>
                <textarea 
                  className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-medium h-24"
                  value={localSettings.siteDescription}
                  onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-rose-50 border-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-800">الأمان والوصول</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">كلمة مرور لوحة التحكم الجديدة</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-rose-500 outline-none font-black text-2xl text-center pr-16"
                    placeholder="أدخل كلمة المرور الجديدة"
                    value={localSettings.dashboardPassword}
                    onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.04m4.533-4.533A10.01 10.01 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-4.225-4.225l-4.225-4.225m4.225 4.225L7 7m3.586 3.586a3 3 0 004.243 4.243" /></svg>
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-400 font-bold px-4">ملاحظة: سيتم طلب كلمة المرور هذه في المرة القادمة التي تحاول فيها الدخول للإدارة.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className={`w-full py-6 rounded-[32px] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-4 ${isSaving ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'}`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                جاري تحديث البيانات...
              </>
            ) : 'حفظ كافة التغييرات النهائية ✅'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
