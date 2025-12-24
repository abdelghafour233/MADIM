
import React, { useState, useEffect, useMemo } from 'react';
import { Article, Settings, Category } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout }) => {
  const [tab, setTab] = useState<'articles' | 'adsense' | 'settings' | 'stats'>('stats');
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.TECH, rating: 5, image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [copyAdsStatus, setCopyAdsStatus] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const stats = useMemo(() => {
    const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
    return { totalArticles: articles.length, totalViews, topArticles };
  }, [articles]);

  const handleCopyAdsTxt = () => {
    navigator.clipboard.writeText(localSettings.adsTxt).then(() => {
      setCopyAdsStatus(true);
      setTimeout(() => setCopyAdsStatus(false), 3000);
    });
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    try {
      onUpdateSettings(localSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.name || !newArticle.content) return alert('يرجى ملء البيانات الأساسية');
    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      likes: editingId ? (articles.find(a => a.id === editingId)?.likes || 0) : 0,
      views: editingId ? (articles.find(a => a.id === editingId)?.views || 10) : 10,
      comments: editingId ? (articles.find(a => a.id === editingId)?.comments || []) : [],
    } as Article;
    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? art : a));
    } else {
      onUpdateArticles([art, ...articles]);
    }
    setEditingId(null);
    setNewArticle({ category: Category.TECH, rating: 5, image: '' });
  };

  const startEditing = (a: Article) => {
    setEditingId(a.id);
    setNewArticle(a);
    setTab('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-3 rounded-[28px] shadow-lg border border-slate-100 sticky top-24 z-40 overflow-x-auto no-scrollbar">
        <button type="button" onClick={() => setTab('stats')} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'stats' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>الإحصائيات 📊</button>
        <button type="button" onClick={() => setTab('articles')} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'articles' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>المقالات 📝</button>
        <button type="button" onClick={() => setTab('adsense')} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'adsense' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>الأرباح 💰</button>
        <button type="button" onClick={() => setTab('settings')} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>الإعدادات ⚙️</button>
        <button type="button" onClick={onLogout} className="mr-auto px-6 py-4 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-colors">خروج آمن</button>
      </div>

      {tab === 'stats' && (
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-50 text-right">
            <h2 className="text-3xl font-black text-slate-800 mb-8">نظرة عامة 📊</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-10 rounded-[40px] border border-emerald-100 text-center">
                <div className="text-4xl font-black text-emerald-600">{stats.totalArticles}</div>
                <div className="text-sm font-bold text-emerald-400 uppercase">مقال منشور</div>
              </div>
              <div className="bg-blue-50 p-10 rounded-[40px] border border-blue-100 text-center">
                <div className="text-4xl font-black text-blue-600">{stats.totalViews}</div>
                <div className="text-sm font-bold text-blue-400 uppercase">مشاهدة إجمالية</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="space-y-12">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-50">
            <h2 className="text-2xl font-black text-slate-800 mb-8">{editingId ? 'تعديل المقال' : 'نشر مقال جديد'}</h2>
            <form onSubmit={handleArticleSubmit} className="space-y-6">
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-xl" placeholder="عنوان المقال..." value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
              <textarea className="w-full h-96 p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-medium leading-relaxed" placeholder="محتوى المقال..." value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />
              <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all">حفظ</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'adsense' && (
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-50 text-right">
            <h2 className="text-3xl font-black text-slate-800 mb-6 italic underline decoration-emerald-500">لماذا يظهر موقعي "غير موجود" (Introuvable)؟ 🛠️</h2>
            
            <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100 mb-10 space-y-6">
              <h4 className="font-black text-indigo-900 flex items-center gap-3 text-lg">
                💡 إليك التشخيص النهائي لمشكلتك:
              </h4>
              <ul className="space-y-4 text-indigo-800 font-bold leading-relaxed pr-4">
                <li className="flex items-start gap-3">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-1">1</span>
                  <span><strong>النطاق (Domain):</strong> تأكد أنك أضفت موقعك في أدسنس بصيغة <code className="bg-white px-2 py-0.5 rounded">abdouweb.online</code> (بدون www). إذا كان موقعك يفتح بـ www، يجب إضافته بها.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-1">2</span>
                  <span><strong>سرعة الزاحف:</strong> جوجل "رأت" الكود عند وضعه، لكن الزاحف الآلي عندما عاد لاحقاً وجد الصفحة فارغة (لأنها تتطلب جافا سكريبت). لقد قمت الآن بإضافة نصوص ثابتة يراها الزاحف فوراً.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-1">3</span>
                  <span><strong>طلب المراجعة:</strong> إذا كنت قد قمت بكل شيء، فالمسألة مسألة وقت (قد تصل لـ 14 يوم). جوجل "تحفظ" آخر حالة للزاحف، وسيتم تحديثها تلقائياً.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">محتوى ملف Ads.txt (انسخه الآن):</label>
                <div className="relative">
                  <textarea className="w-full h-24 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm text-left" dir="ltr" readOnly value={localSettings.adsTxt} />
                  <button onClick={handleCopyAdsTxt} className={`absolute left-4 bottom-4 px-4 py-2 rounded-xl text-xs font-black transition-all ${copyAdsStatus ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {copyAdsStatus ? 'تم النسخ!' : 'نسخ الكود'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">كود الإعلانات (للمراجعة فقط):</label>
                <textarea className="w-full h-40 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm text-left" dir="ltr" value={localSettings.adsenseCode} onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} />
              </div>

              <button type="button" onClick={handleSaveSettings} className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl ${saveStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}>
                {saveStatus === 'saving' ? 'جاري الحفظ...' : saveStatus === 'success' ? '✅ تم تحديث الإعدادات' : 'تحديث إعدادات الأرباح'}
              </button>
            </div>
            
            <div className="mt-12 p-6 bg-amber-50 rounded-3xl border border-amber-100 text-amber-900 font-bold text-sm leading-relaxed">
              ⚠️ <strong>تنبيه هام حول "تأكيد الهوية":</strong> <br/>
              لا تقلق بشأن الهوية حالياً. جوجل لن تطلب منك البطاقة الوطنية أو جواز السفر إلا **بعد** قبول الموقع رسمياً وبداية ظهور الإعلانات عليه. رسالة "غير موجود" هي مشكلة تقنية تم حلها في الكود البرمجي الآن.
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-50 text-right">
            <h2 className="text-3xl font-black text-slate-800 mb-10">إعدادات الموقع ⚙️</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">اسم الموقع</label>
                <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">كلمة المرور</label>
                <input type={showPassword ? "text" : "password"} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-rose-500 outline-none font-bold text-center" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="button" onClick={handleSaveSettings} className="w-full py-6 rounded-[32px] bg-slate-900 text-white font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl">
            حفظ التغييرات ✅
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
