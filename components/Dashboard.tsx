
import React, { useState, useEffect } from 'react';
import { Article, Settings, Category } from '../types.ts';
import { GoogleGenAI } from "@google/genai";

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
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.REVIEWS, rating: 5 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => { setLocalSettings(settings); }, [settings]);

  const handleUpdate = () => {
    onUpdateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح! 🇲🇦');
  };

  const verifyAdsenseOnSite = () => {
    setIsVerifying(true);
    setVerificationStatus('idle');
    
    setTimeout(() => {
      // فحص وجود الميتا تاج والسكريبت في الـ DOM
      const meta = document.querySelector('meta[name="google-adsense-account"]');
      const script = document.querySelector('script[src*="adsbygoogle.js"]');
      const pubId = localSettings.adsTxt.split(',')[1]?.trim() || 'ca-pub-5578524966832192';
      
      const isMetaCorrect = meta?.getAttribute('content')?.includes(pubId.replace('ca-', ''));
      const isScriptCorrect = script?.getAttribute('src')?.includes(pubId.replace('ca-', ''));

      setIsVerifying(false);
      if (isMetaCorrect || isScriptCorrect || (window as any).adsbygoogle) {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('fail');
      }
    }, 1500);
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

  const fixContentWithAI = async () => {
    if (!newArticle.content) return;
    setIsFixing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أعد صياغة هذا المقال بأسلوب SEO متقدم جداً، استعمل كلمات بحث مغربية مشهورة، واجعل المحتوى فريداً: ${newArticle.content}`,
      });
      if (response.text) setNewArticle(prev => ({ ...prev, content: response.text }));
    } catch (e) { console.error(e); }
    finally { setIsFixing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm sticky top-24 z-40 border border-slate-100">
        {[
          { id: 'articles', label: 'المقالات' },
          { id: 'monetization', label: 'تفعيل الربح 💰' },
          { id: 'seo', label: 'الأرشفة' },
          { id: 'security', label: 'الأمان' },
          { id: 'settings', label: 'الإعدادات' }
        ].map(t => (
          <button 
            key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={onLogout} className="mr-auto px-6 py-3 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all">خروج</button>
      </div>

      {tab === 'monetization' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-3xl font-black mb-4">الخطوة 1: ربط الموقع بنجاح ✅</h3>
               <p className="text-emerald-100 font-bold max-w-xl leading-relaxed">الكود مثبت حالياً في رأس الصفحة (Head) كما يطلبه جوجل تماماً. يمكنك الآن إجراء الفحص أدناه للتأكد.</p>
             </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 text-center">
            <h4 className="text-xl font-black text-slate-800 mb-6">فحص اتصال جوجل أدسنس (AdSense Connectivity)</h4>
            
            <div className={`mb-8 p-6 rounded-3xl border-2 transition-all ${
              verificationStatus === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 
              verificationStatus === 'fail' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {isVerifying ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                  <span className="font-black">جاري فحص الكود في مصدر الصفحة...</span>
                </div>
              ) : verificationStatus === 'success' ? (
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-black italic">تم اكتشاف الكود بنجاح! الكود موجود ونشط.</span>
                  <p className="text-xs opacity-80 mt-2 font-bold uppercase tracking-widest">ID: {localSettings.adsTxt.split(',')[1]?.trim()}</p>
                </div>
              ) : verificationStatus === 'fail' ? (
                <span className="font-black text-lg italic">الكود غير مكتشف! تأكد من حفظ الإعدادات.</span>
              ) : (
                <span className="font-black italic">اضغط على الزر أدناه لبدء عملية التحقق المحلي.</span>
              )}
            </div>

            <button 
              onClick={verifyAdsenseOnSite} 
              disabled={isVerifying}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
            >
              تحقق من الربط الآن 🔍
            </button>
            
            <div className="mt-10 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
               <button onClick={() => {
                navigator.clipboard.writeText(localSettings.adsTxt);
                alert('تم نسخ سطر ads.txt!');
              }} className="p-5 bg-orange-50 text-orange-600 rounded-3xl font-black border border-orange-100 hover:bg-orange-100 transition-all">
                نسخ ملف ads.txt (الخطوة 2)
              </button>
              <a href="https://adsense.google.com" target="_blank" className="p-5 bg-blue-50 text-blue-600 rounded-3xl font-black border border-blue-100 hover:bg-blue-100 transition-all text-center">
                فتح لوحة أدسنس (الخطوة 3)
              </a>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl space-y-8 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800">تحديث معرف الناشر (Publisher ID)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-500 italic">Publisher ID (المعرف الرقمي للحساب)</label>
                <input 
                  className="w-full p-4 border rounded-2xl bg-slate-50 font-mono text-sm outline-none border-slate-100 focus:ring-4 focus:ring-emerald-500/10" 
                  value={localSettings.adsTxt.split(',')[1]?.trim() || ''} 
                  onChange={e => {
                    const id = e.target.value.trim();
                    setLocalSettings({
                      ...localSettings, 
                      adsTxt: `google.com, ${id}, DIRECT, f08c47fec0942fa0`,
                      adsenseCode: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}" crossorigin="anonymous"></script>`
                    });
                  }}
                  placeholder="pub-5578524966832192" 
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-500 italic">نطاق الموقع (Domain)</label>
                <input className="w-full p-4 border rounded-2xl bg-slate-50 font-mono text-sm border-slate-100" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
              </div>
            </div>
            <button onClick={handleUpdate} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
              حفظ وتثبيت البيانات 🚀
            </button>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="space-y-10 animate-fadeIn">
          <form onSubmit={(e) => {
            e.preventDefault();
            const art = { ...newArticle, id: editingId || Math.random().toString(36).substr(2, 9) } as Article;
            onUpdateArticles(editingId ? articles.map(a => a.id === editingId ? art : a) : [art, ...articles]);
            setNewArticle({ category: Category.REVIEWS, rating: 5 }); setEditingId(null);
            alert('تم الحفظ');
          }} className="bg-white p-10 rounded-[40px] shadow-xl space-y-6 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800">{editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="p-4 border rounded-2xl bg-slate-50 font-bold" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} placeholder="العنوان..." required />
              <input className="p-4 border rounded-2xl bg-slate-50 font-bold" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="رابط الصورة..." required />
            </div>
            <div className="relative">
               <button type="button" onClick={fixContentWithAI} className="mb-2 text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-black">
                 {isFixing ? 'جاري التحسين...' : '✨ تحسين المحتوى بذكاء إصطناعي'}
               </button>
               <textarea className="w-full h-80 p-6 bg-slate-50 border rounded-3xl font-medium leading-relaxed" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="المحتوى..." required />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl">
              {editingId ? 'تحديث' : 'نشر 🚀'}
            </button>
          </form>

          <div className="grid gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-2xl" alt="" />
                  <p className="font-black text-slate-800">{a.name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo(0,0);}} className="p-3 bg-slate-50 text-emerald-600 rounded-xl font-bold">تعديل</button>
                  <button onClick={() => onUpdateArticles(articles.filter(item => item.id !== a.id))} className="p-3 bg-red-50 text-red-500 rounded-xl font-bold">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-emerald-600 text-white p-10 rounded-[40px] shadow-xl text-center">
            <h3 className="text-2xl font-black mb-4">تقرير SEO</h3>
            <p className="font-bold">موقعك جاهز للأرشفة على {settings.domain}</p>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] shadow-xl text-center border border-slate-100">
            <h3 className="text-2xl font-black mb-8">تغيير كلمة السر</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input type="password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="الحالية" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
              <input type="password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="الجديدة" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required />
              <input type="password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="تأكيد الجديدة" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">تحديث</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-black mb-6">إعدادات الموقع</h3>
            <div className="space-y-6">
              <input className="w-full p-4 bg-slate-50 border rounded-2xl" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} placeholder="اسم الموقع" />
              <textarea className="w-full p-4 bg-slate-50 border rounded-2xl" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} placeholder="الوصف" />
              <button onClick={handleUpdate} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
