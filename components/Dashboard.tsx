
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
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.REVIEWS, rating: 5 });
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
      alert('✅ تم استعادة المقالات الأصلية بنجاح! الصور ستظهر الآن.');
    }
  };

  const verifyAdsenseOnSite = () => {
    setIsVerifying(true);
    setVerificationStatus('idle');
    
    setTimeout(() => {
      const meta = document.querySelector('meta[name="google-adsense-account"]');
      const script = document.querySelector('script[src*="adsbygoogle.js"]');
      const currentPubId = localSettings.adsTxt.match(/pub-\d+/)?.[0] || 'pub-5578524966832192';
      
      const hasCorrectMeta = meta?.getAttribute('content')?.includes(currentPubId);
      const hasCorrectScript = script?.getAttribute('src')?.includes(currentPubId);

      setIsVerifying(false);
      if (hasCorrectMeta || hasCorrectScript) {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('fail');
      }
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

  const fixContentWithAI = async () => {
    if (!newArticle.content) return;
    setIsFixing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أعد صياغة هذا المقال بأسلوب SEO متقدم جداً للسوق المغربي: ${newArticle.content}`,
      });
      if (response.text) setNewArticle(prev => ({ ...prev, content: response.text }));
    } catch (e) { console.error(e); }
    finally { setIsFixing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm sticky top-24 z-40 border border-slate-100 overflow-x-auto no-scrollbar text-xs md:text-base">
        {[
          { id: 'articles', label: 'المقالات' },
          { id: 'monetization', label: 'تفعيل الربح 💰' },
          { id: 'seo', label: 'الأرشفة' },
          { id: 'security', label: 'الأمان' },
          { id: 'settings', label: 'الإعدادات' }
        ].map(t => (
          <button 
            key={t.id} onClick={() => {setTab(t.id as any); setVerificationStatus('idle');}}
            className={`flex-shrink-0 px-4 md:px-6 py-3 rounded-2xl font-black transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={onLogout} className="mr-auto px-4 md:px-6 py-3 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-10 animate-fadeIn">
          <div className="flex justify-between items-center bg-amber-50 p-6 rounded-3xl border border-amber-100">
            <div>
              <h4 className="font-black text-amber-800">هل تواجه مشكلة في الصور؟</h4>
              <p className="text-sm text-amber-700">اضغط على الزر لاستعادة الصور الأصلية المصححة.</p>
            </div>
            <button 
              onClick={resetToDefaults}
              className="bg-amber-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
            >
              استعادة الصور 🛠️
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const art = { ...newArticle, id: editingId || Math.random().toString(36).substr(2, 9) } as Article;
            onUpdateArticles(editingId ? articles.map(a => a.id === editingId ? art : a) : [art, ...articles]);
            setNewArticle({ category: Category.REVIEWS, rating: 5 }); setEditingId(null);
            alert('تم حفظ المقال');
          }} className="bg-white p-10 rounded-[40px] shadow-xl space-y-6 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800">{editingId ? 'تعديل المقال' : 'نشر مقال جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="p-4 border rounded-2xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} placeholder="العنوان..." required />
              <input className="p-4 border rounded-2xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="رابط الصورة..." required />
            </div>
            <div className="relative">
               <button type="button" onClick={fixContentWithAI} className="mb-2 text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-black hover:bg-emerald-100 transition-colors">
                 {isFixing ? 'جاري التحسين...' : '✨ تحسين المحتوى بذكاء إصطناعي'}
               </button>
               <textarea className="w-full h-80 p-6 bg-slate-50 border rounded-3xl font-medium leading-relaxed outline-none focus:ring-2 focus:ring-emerald-500/20" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="محتوى المقال..." required />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all">
              {editingId ? 'تحديث المقال' : 'نشر المقال الآن 🚀'}
            </button>
          </form>

          <div className="grid gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-2xl shadow-sm" alt="" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200'} />
                  <p className="font-black text-slate-800">{a.name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo(0,0);}} className="p-3 bg-slate-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100">تعديل</button>
                  <button onClick={() => {if(confirm('حذف؟')) onUpdateArticles(articles.filter(item => item.id !== a.id))}} className="p-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'monetization' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-3xl font-black mb-4">نظام الربح التلقائي 💰</h3>
               <p className="text-emerald-100 font-bold max-w-xl leading-relaxed">بمجرد إدخال معرّف الناشر (Publisher ID) وحفظ البيانات، سيقوم الموقع بتحديث كود أدسنس في كل الصفحات فوراً.</p>
             </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 text-center">
            <h4 className="text-xl font-black text-slate-800 mb-6 italic">1. فحص الاتصال بجوجل أدسنس</h4>
            
            <div className={`mb-8 p-6 rounded-3xl border-2 transition-all ${
              verificationStatus === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 
              verificationStatus === 'fail' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {isVerifying ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                  <span className="font-black">جاري البحث عن الكود...</span>
                </div>
              ) : verificationStatus === 'success' ? (
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-black">الكود نشط ومرتبط بالحساب بنجاح!</span>
                </div>
              ) : verificationStatus === 'fail' ? (
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-black text-lg">لم يتم اكتشاف الكود. هل قمت بالحفظ؟</span>
                </div>
              ) : (
                <span className="font-black italic">اضغط للتحقق من وجود الكود في الموقع</span>
              )}
            </div>

            <button 
              onClick={verifyAdsenseOnSite} 
              disabled={isVerifying}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              تحقق من الربط الآن 🔍
            </button>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl space-y-8 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800">إعدادات الهوية المالية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-500 italic">Publisher ID (مثال: pub-5578524966832192)</label>
                <input 
                  className="w-full p-5 border rounded-2xl bg-slate-50 font-mono text-lg outline-none border-slate-100 focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                  value={localSettings.adsTxt.match(/pub-\d+/)?.[0] || ''} 
                  onChange={e => {
                    const rawId = e.target.value.trim();
                    const cleanId = rawId.includes('pub-') ? rawId : `pub-${rawId.replace(/\D/g, '')}`;
                    setLocalSettings({
                      ...localSettings, 
                      adsTxt: `google.com, ${cleanId}, DIRECT, f08c47fec0942fa0`,
                      adsenseCode: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${cleanId}" crossorigin="anonymous"></script>`
                    });
                  }}
                  placeholder="pub-XXXXXXXXXXXXXXXX" 
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-500 italic">نطاق الموقع المربوط</label>
                <input className="w-full p-5 border rounded-2xl bg-slate-50 font-mono text-lg border-slate-100 outline-none focus:ring-4 focus:ring-emerald-500/10" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
              </div>
            </div>
            
            <button 
              onClick={handleUpdate} 
              disabled={isSaving}
              className={`w-full py-6 rounded-3xl font-black text-2xl transition-all shadow-xl flex items-center justify-center gap-3 ${
                isSaving ? 'bg-slate-400 text-white cursor-wait' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري حفظ البيانات...
                </>
              ) : (
                <>حفظ وتفعيل الكود فوراً 🚀</>
              )}
            </button>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 mb-6">إعدادات الموقع العامة</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500">اسم الموقع</label>
                <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500">الوصف (SEO)</label>
                <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
              </div>
              <button 
                onClick={handleUpdate} 
                disabled={isSaving}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl disabled:opacity-50"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] shadow-xl text-center border border-slate-100">
            <h3 className="text-2xl font-black mb-8">تغيير كلمة السر</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 text-right">
              <input type="password" title="الحالية" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="كلمة السر الحالية" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
              <input type="password" title="الجديدة" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="كلمة السر الجديدة" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required />
              <input type="password" title="تأكيد" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="تأكيد كلمة السر الجديدة" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black mt-4 hover:bg-emerald-600 transition-all">تحديث الأمان</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
