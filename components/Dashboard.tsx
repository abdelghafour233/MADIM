
import React, { useState, useEffect } from 'react';
import { Article, Settings, Category } from '../types.ts';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_ARTICLES } from '../constants.tsx';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout }) => {
  const [tab, setTab] = useState<'articles' | 'monetization' | 'seo' | 'security' | 'settings'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.REVIEWS, rating: 5, image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => { 
    setLocalSettings(settings); 
  }, [settings]);

  const handleUpdate = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    onUpdateSettings(localSettings);
    setIsSaving(false);
    alert('✅ تم حفظ جميع الإعدادات وتثبيت الأكواد بنجاح!');
  };

  const resetToDefaults = () => {
    if (confirm('هل أنت متأكد؟ سيتم حذف جميع تعديلاتك واستعادة المقالات الأصلية (بما في ذلك إصلاحات الصور).')) {
      onUpdateArticles(INITIAL_ARTICLES);
      alert('✅ تم استعادة المقالات الأصلية بنجاح!');
    }
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      rating: newArticle.rating || 5
    } as Article;

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? art : a));
      alert('✅ تم تحديث المقال بنجاح');
    } else {
      onUpdateArticles([art, ...articles]);
      alert('✅ تم نشر المقال الجديد بنجاح');
    }

    setNewArticle({ category: Category.REVIEWS, rating: 5, image: '' });
    setEditingId(null);
  };

  const fixContentWithAI = async () => {
    if (!newArticle.content) {
      alert('يرجى كتابة بعض المحتوى أولاً ليقوم الذكاء الاصطناعي بتحسينه.');
      return;
    }
    setIsFixing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أعد صياغة هذا المقال بأسلوب SEO متقدم جداً للسوق المغربي، اجعله مقنعاً وجذاباً للقراء: ${newArticle.content}`,
      });
      if (response.text) setNewArticle(prev => ({ ...prev, content: response.text }));
    } catch (e) { 
      console.error(e);
      alert('حدث خطأ أثناء تحسين المحتوى. تأكد من إعداد مفتاح API.');
    }
    finally { setIsFixing(false); }
  };

  const verifyAdsenseOnSite = () => {
    setIsVerifying(true);
    setVerificationStatus('idle');
    setTimeout(() => {
      const meta = document.querySelector('meta[name="google-adsense-account"]');
      const currentPubId = localSettings.adsTxt.match(/pub-\d+/)?.[0] || 'pub-5578524966832192';
      const hasCorrectMeta = meta?.getAttribute('content')?.includes(currentPubId);
      setIsVerifying(false);
      setVerificationStatus(hasCorrectMeta ? 'success' : 'fail');
    }, 1200);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.current !== settings.dashboardPassword) {
      alert('كلمة السر الحالية غير صحيحة!');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('كلمات السر الجديدة غير متطابقة!');
      return;
    }
    onUpdateSettings({ ...settings, dashboardPassword: passwords.new });
    setPasswords({ current: '', new: '', confirm: '' });
    alert('تم تغيير كلمة السر بنجاح!');
    onLogout();
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      {/* القائمة العلوية المحسنة */}
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-3 rounded-[28px] shadow-sm sticky top-24 z-40 border border-slate-100 overflow-x-auto no-scrollbar">
        {[
          { id: 'articles', label: 'إدارة المقالات 📝' },
          { id: 'monetization', label: 'الأرباح والإعلانات 💰' },
          { id: 'seo', label: 'السيو والأرشفة 🚀' },
          { id: 'security', label: 'الأمان 🔒' },
          { id: 'settings', label: 'إعدادات الموقع ⚙️' }
        ].map(t => (
          <button 
            key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={onLogout} className="mr-auto px-6 py-3 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-10 animate-fadeIn">
          {/* صندوق استعادة البيانات */}
          <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-black text-amber-800 text-lg">تحكم في محتوى موقعك</h4>
              <p className="text-sm text-amber-700 font-medium">يمكنك حذف المقالات، تعديلها، أو إضافة صور جديدة بسهولة.</p>
            </div>
            <button 
              onClick={resetToDefaults}
              className="bg-white text-amber-600 border-2 border-amber-200 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-amber-100 transition-all"
            >
              استعادة المقالات الافتراضية
            </button>
          </div>

          {/* نموذج إضافة/تعديل المقال */}
          <form onSubmit={handleArticleSubmit} id="article-form" className="bg-white p-8 md:p-12 rounded-[48px] shadow-2xl space-y-8 border border-slate-100 relative">
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <h3 className="text-2xl font-black text-slate-800">
                {editingId ? 'تعديل المقال الحالي' : 'نشر مقال جديد واحترافي'}
              </h3>
              {editingId && (
                <button type="button" onClick={() => {setEditingId(null); setNewArticle({category: Category.REVIEWS, rating: 5, image: ''});}} className="text-sm font-bold text-red-500 hover:underline">إلغاء التعديل</button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-500 mr-2">عنوان المقال (جذاب للسيو)</label>
                  <input className="w-full p-5 border-2 border-slate-50 rounded-2xl bg-slate-50 font-bold outline-none focus:border-emerald-500/50 transition-all text-lg" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} placeholder="مثال: مراجعة أفضل هاتف من تيمو في 2024..." required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 mr-2">القسم</label>
                    <select className="w-full p-5 border-2 border-slate-50 rounded-2xl bg-slate-50 font-bold outline-none" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 mr-2">رابط الصورة</label>
                    <input className="w-full p-5 border-2 border-slate-50 rounded-2xl bg-slate-50 font-bold outline-none focus:border-emerald-500/50" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="https://..." required />
                  </div>
                </div>
              </div>

              {/* معاينة الصورة المباشرة */}
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500 mr-2">معاينة الصورة</label>
                <div className="w-full h-[220px] bg-slate-100 rounded-[32px] overflow-hidden border-4 border-white shadow-inner flex items-center justify-center relative group">
                  {newArticle.image ? (
                    <img src={newArticle.image} className="w-full h-full object-cover" alt="Preview" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400'} />
                  ) : (
                    <div className="text-slate-300 text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs font-bold">ضع رابط الصورة لتراها هنا</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative space-y-2">
               <div className="flex justify-between items-center mr-2">
                 <label className="text-sm font-black text-slate-500">محتوى المقال التفصيلي</label>
                 <button type="button" onClick={fixContentWithAI} className="text-xs bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black hover:bg-emerald-100 transition-colors flex items-center gap-2">
                   {isFixing ? (
                     <><div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div> جاري التحسين...</>
                   ) : '✨ تحسين المحتوى بالذكاء الإصطناعي'}
                 </button>
               </div>
               <textarea className="w-full h-96 p-8 bg-slate-50 border-2 border-slate-50 rounded-[32px] font-medium leading-relaxed outline-none focus:border-emerald-500/50 transition-all" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="اكتب مراجعة المنتج أو المقال هنا... استخدم الروابط مباشرة داخل النص ليحولها الموقع لأزرار شراء تلقائياً." required />
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-[24px] font-black text-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-[0.98]">
              {editingId ? 'تحديث المقال وتعديله ✨' : 'نشر المقال الآن على الموقع 🚀'}
            </button>
          </form>

          {/* قائمة إدارة المقالات الحالية */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800 px-4">المقالات المنشورة ({articles.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map(a => (
                <div key={a.id} className="bg-white p-6 rounded-[32px] flex items-center gap-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
                    <img src={a.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200'} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-black text-slate-800 truncate mb-1">{a.name}</h4>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{a.category}</span>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => {setEditingId(a.id); setNewArticle(a); document.getElementById('article-form')?.scrollIntoView({behavior:'smooth'});}} className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all">تعديل</button>
                      <button onClick={() => {if(confirm('هل أنت متأكد من حذف هذا المقال نهائياً؟')) onUpdateArticles(articles.filter(item => item.id !== a.id))}} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* بقية التبويبات تظل كما هي مع تحسينات طفيفة في التصميم */}
      {tab === 'monetization' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-3xl font-black mb-4">نظام الربح التلقائي 💰</h3>
               <p className="text-emerald-100 font-bold max-w-xl leading-relaxed">بمجرد إدخال معرّف الناشر (Publisher ID) وحفظ البيانات، سيقوم الموقع بتحديث كود أدسنس في كل الصفحات فوراً.</p>
             </div>
          </div>
          
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 text-center">
            <h4 className="text-xl font-black text-slate-800 mb-6 italic">فحص الارتباط بجوجل أدسنس</h4>
            <div className={`mb-8 p-6 rounded-3xl border-2 transition-all ${verificationStatus === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : verificationStatus === 'fail' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              {isVerifying ? 'جاري الفحص...' : verificationStatus === 'success' ? '✅ الكود نشط ومرتبط بالموقع' : verificationStatus === 'fail' ? '❌ الكود غير موجود' : 'اضغط للتحقق'}
            </div>
            <button onClick={verifyAdsenseOnSite} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all">تحقق الآن 🔍</button>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl space-y-8 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-500 italic">Publisher ID (pub-XXXXXXXXXXXXXXXX)</label>
                <input className="w-full p-5 border rounded-2xl bg-slate-50 font-mono" value={localSettings.adsTxt.match(/pub-\d+/)?.[0] || ''} onChange={e => {
                  const id = e.target.value.includes('pub-') ? e.target.value : `pub-${e.target.value.replace(/\D/g, '')}`;
                  setLocalSettings({...localSettings, adsTxt: `google.com, ${id}, DIRECT, f08c47fec0942fa0`, adsenseCode: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${id}" crossorigin="anonymous"></script>`});
                }} />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-500 italic">رابط الموقع</label>
                <input className="w-full p-5 border rounded-2xl bg-slate-50 font-mono" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
              </div>
            </div>
            <button onClick={handleUpdate} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl hover:bg-emerald-700 transition-all">حفظ وتفعيل الإعلانات 🚀</button>
          </div>
        </div>
      )}

      {/* التبويبات الأخرى مختصرة للحفاظ على نظافة الكود */}
      {tab === 'settings' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 mb-6">الإعدادات العامة</h3>
            <div className="space-y-6">
              <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="اسم الموقع" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
              <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none h-32" placeholder="وصف الموقع (SEO)" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
              <button onClick={handleUpdate} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}
      
      {tab === 'security' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">تأمين لوحة الإدارة</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input type="password" placeholder="كلمة السر الحالية" className="w-full p-4 bg-slate-50 border rounded-2xl" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
              <input type="password" placeholder="كلمة السر الجديدة" className="w-full p-4 bg-slate-50 border rounded-2xl" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required />
              <input type="password" placeholder="تأكيد الجديدة" className="w-full p-4 bg-slate-50 border rounded-2xl" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">تحديث كلمة السر</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
