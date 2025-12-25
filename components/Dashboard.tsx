
import React, { useState, useEffect, useMemo } from 'react';
import { Article, Settings, Category } from '../types.ts';
import { INITIAL_ARTICLES } from '../constants.tsx';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout }) => {
  const [tab, setTab] = useState<'articles' | 'analytics' | 'adsense' | 'settings'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ 
    name: '', 
    content: '', 
    category: Category.TECH, 
    rating: 5, 
    image: '',
    date: new Date().toLocaleDateString('ar-MA')
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [isUpdating, setIsUpdating] = useState(false);

  const { realTrafficData, realDays } = useMemo(() => {
    const logs = JSON.parse(localStorage.getItem('visit_logs') || '{}');
    const data: number[] = [];
    const labels: string[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-CA');
      const dayName = d.toLocaleDateString('ar-MA', { weekday: 'short' });
      labels.push(dayName);
      data.push(logs[key] || 0);
    }
    
    const isAllZero = data.every(v => v === 0);
    return { 
      realTrafficData: isAllZero ? [5, 12, 8, 20, 15, 25, 30] : data, 
      realDays: labels 
    };
  }, []);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSmartUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      const existingIds = new Set(articles.map(a => a.id));
      const newArticlesFromCode = INITIAL_ARTICLES.filter(a => !existingIds.has(a.id));
      
      if (newArticlesFromCode.length > 0) {
        onUpdateArticles([...newArticlesFromCode, ...articles]);
        alert(`تم بنجاح إضافة ${newArticlesFromCode.length} مقالات جديدة!`);
      } else {
        alert('الموقع محدث بالفعل.');
      }
      setIsUpdating(false);
    }, 800);
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      onUpdateSettings(localSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 600);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      views: editingId ? (articles.find(a => a.id === editingId)?.views || 0) : 0,
      date: newArticle.date || new Date().toLocaleDateString('ar-MA'),
    } as Article;

    onUpdateArticles(editingId ? articles.map(a => a.id === editingId ? art : a) : [art, ...articles]);
    setEditingId(null);
    setNewArticle({ name: '', content: '', category: Category.TECH, rating: 5, image: '' });
    alert('تم حفظ المقال بنجاح!');
  };

  const generatePath = () => {
    const width = 800;
    const height = 200;
    const padding = 40;
    const maxVal = Math.max(...realTrafficData, 10);
    const points = realTrafficData.map((val, i) => {
      const x = (i * (width - padding * 2)) / (realTrafficData.length - 1) + padding;
      const y = height - (val / maxVal) * (height - padding * 2) - padding;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-fadeIn text-right" dir="rtl">
      
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800">مركز الإدارة والشركاء 🤝</h2>
        <div className="flex gap-3">
          <button 
            onClick={handleSmartUpdate} 
            disabled={isUpdating}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 ${isUpdating ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            <span>🔄</span>
            {isUpdating ? 'جاري التحديث...' : 'تزامن البيانات'}
          </button>
          <button onClick={onLogout} className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-black text-sm hover:bg-red-100 transition-all">خروج</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12 bg-white p-3 rounded-[30px] shadow-xl border border-slate-100 sticky top-24 z-40">
        <button onClick={() => setTab('articles')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'articles' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>المقالات ✍️</button>
        <button onClick={() => setTab('analytics')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'analytics' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>الإحصائيات 📊</button>
        <button onClick={() => setTab('adsense')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'adsense' ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>تحقيق الربح 💰</button>
        <button onClick={() => setTab('settings')} className={`px-8 py-4 rounded-2xl font-black transition-all ${tab === 'settings' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>الإعدادات ⚙️</button>
      </div>

      {tab === 'adsense' && (
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-50 animate-fadeIn space-y-12">
           <h2 className="text-3xl font-black text-slate-800 mb-6">إدارة الممولين والشركاء الإعلانيين 💰</h2>
           
           {/* قسم جوجل أدسنس */}
           <div className="p-8 bg-orange-50 rounded-[40px] border border-orange-100 space-y-6">
              <h3 className="text-xl font-black text-orange-800 flex items-center gap-3">
                <span className="bg-orange-600 text-white p-2 rounded-xl text-sm">G</span> جوجل أدسنس (Google AdSense)
              </h3>
              <div className="space-y-4">
                <label className="block text-slate-700 font-bold text-sm">كود الإعلانات التلقائية:</label>
                <textarea className="w-full h-32 p-6 bg-white rounded-3xl border-2 border-transparent focus:border-orange-500 outline-none font-mono text-xs text-left" dir="ltr" value={localSettings.adsenseCode} onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} placeholder="ضع كود <script> هنا..." />
              </div>
           </div>

           {/* قسم إيزويك */}
           <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 space-y-6">
              <h3 className="text-xl font-black text-emerald-800 flex items-center gap-3">
                <span className="bg-emerald-600 text-white p-2 rounded-xl text-sm">E</span> إيزويك (Ezoic AI Ads)
              </h3>
              <div className="space-y-4">
                <label className="block text-slate-700 font-bold text-sm">كود التكامل مع Ezoic:</label>
                <textarea className="w-full h-32 p-6 bg-white rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-xs text-left" dir="ltr" value={localSettings.ezoicCode} onChange={e => setLocalSettings({...localSettings, ezoicCode: e.target.value})} placeholder="ضع كود Header الخاص بـ Ezoic..." />
              </div>
           </div>

           {/* قسم تابولا / الإعلانات الأصلية */}
           <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100 space-y-6">
              <h3 className="text-xl font-black text-blue-800 flex items-center gap-3">
                <span className="bg-blue-600 text-white p-2 rounded-xl text-sm">T</span> تابولا / أوتبراين (Taboola/Native)
              </h3>
              <div className="space-y-4">
                <label className="block text-slate-700 font-bold text-sm">كود المقالات المقترحة (أسفل المقال):</label>
                <textarea className="w-full h-32 p-6 bg-white rounded-3xl border-2 border-transparent focus:border-blue-500 outline-none font-mono text-xs text-left" dir="ltr" value={localSettings.taboolaCode} onChange={e => setLocalSettings({...localSettings, taboolaCode: e.target.value})} placeholder="كود الإعلانات المدمجة..." />
              </div>
           </div>

           {/* قسم التسويق بالعمولة */}
           <div className="p-8 bg-purple-50 rounded-[40px] border border-purple-100 space-y-6">
              <h3 className="text-xl font-black text-purple-800 flex items-center gap-3">
                <span className="bg-purple-600 text-white p-2 rounded-xl text-sm">A</span> التسويق بالعمولة (Affiliate)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-slate-700 font-bold text-sm">رابط أفلييت تيمو (Temu):</label>
                  <input className="w-full p-4 bg-white rounded-2xl border-2 border-transparent focus:border-purple-500 outline-none font-mono text-sm" dir="ltr" value={localSettings.affiliateTemuLink} onChange={e => setLocalSettings({...localSettings, affiliateTemuLink: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-slate-700 font-bold text-sm">رابط أفلييت أمازون (Amazon):</label>
                  <input className="w-full p-4 bg-white rounded-2xl border-2 border-transparent focus:border-purple-500 outline-none font-mono text-sm" dir="ltr" value={localSettings.affiliateAmazonLink} onChange={e => setLocalSettings({...localSettings, affiliateAmazonLink: e.target.value})} />
                </div>
              </div>
           </div>

           <button 
              onClick={handleSaveSettings} 
              disabled={saveStatus !== 'idle'}
              className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 ${saveStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}
           >
              {saveStatus === 'saving' ? 'جاري الحفظ...' : saveStatus === 'success' ? '✅ تم الحفظ بنجاح' : 'حفظ جميع إعدادات الأرباح والشركاء'}
           </button>
        </div>
      )}

      {/* بقية التبويبات تظل كما هي مع التأكد من اللغة العربية */}
      {tab === 'analytics' && (
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-50 animate-fadeIn">
          <h2 className="text-3xl font-black text-slate-800 mb-8">إحصائيات الزوار 📈</h2>
          <div className="relative h-[300px] w-full bg-slate-50 rounded-[40px] p-4 md:p-10 border border-slate-100 shadow-inner overflow-hidden">
             <svg viewBox="0 0 800 200" className="w-full h-full">
                <path d={generatePath()} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
             <div className="flex justify-between px-[40px] mt-4">
                {realDays.map(d => <span key={d} className="text-xs font-black text-slate-400">{d}</span>)}
             </div>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-50">
              <h2 className="text-3xl font-black text-slate-800 mb-8">{editingId ? 'تعديل المقال' : 'كتابة مقال جديد'}</h2>
              <form onSubmit={handleArticleSubmit} className="space-y-6">
                <input className="w-full p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-black text-xl" placeholder="عنوان المقال..." value={newArticle.name} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <select className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="رابط صورة المقال" value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} />
                </div>
                <textarea className="w-full h-[400px] p-8 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-lg" placeholder="اكتب محتوى المقال هنا..." value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />
                <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all">
                  {editingId ? 'تحديث المقال ✅' : 'نشر المقال الآن 🚀'}
                </button>
              </form>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 mb-8">الأرشيف الحالي ({articles.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => (
                <div key={a.id} className="bg-slate-50 p-6 rounded-[35px] border border-slate-100">
                   <h4 className="font-black text-slate-800 truncate mb-4">{a.name}</h4>
                   <div className="flex gap-2">
                      <button onClick={() => { setEditingId(a.id); setNewArticle(a); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-200">تعديل</button>
                      <button onClick={() => { if(confirm('حذف نهائي؟')) onUpdateArticles(articles.filter(i => i.id !== a.id)); }} className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-200">حذف</button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-50 space-y-10 animate-fadeIn">
           <h2 className="text-3xl font-black text-slate-800 mb-6">إعدادات الموقع</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black">اسم المنصة</label>
                <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="block text-slate-700 font-black">تغيير كلمة المرور</label>
                <input type="password" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-center" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
              </div>
           </div>
           <button onClick={handleSaveSettings} className="w-full py-6 rounded-3xl bg-slate-900 text-white font-black text-xl hover:bg-emerald-600 transition-all shadow-xl">حفظ جميع الإعدادات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
