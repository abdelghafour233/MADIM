
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
  const [tab, setTab] = useState<'articles' | 'settings' | 'pixels' | 'monetization' | 'security'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ 
    category: Category.REVIEWS, 
    rating: 5,
    price: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassChange, setShowPassChange] = useState(false);

  // Validation States
  const [isAdsenseValid, setIsAdsenseValid] = useState(false);
  const [isAdsTxtValid, setIsAdsTxtValid] = useState(false);

  useEffect(() => {
    setIsAdsenseValid(localSettings.adsenseCode.includes('ca-pub-'));
    setIsAdsTxtValid(localSettings.adsTxt.includes('google.com') && localSettings.adsTxt.includes('DIRECT'));
  }, [localSettings.adsenseCode, localSettings.adsTxt]);

  const fixContentWithAI = async () => {
    if (!newArticle.content) return;
    setIsFixing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `صحح النص العربي واجعله تسويقياً جذاباً للمغاربة وحافظ على الروابط: ${newArticle.content}`,
      });
      if (response.text) setNewArticle(prev => ({ ...prev, content: response.text }));
    } catch (error) { console.error(error); } finally { setIsFixing(false); }
  };

  const handlePasswordUpdate = () => {
    if (!newPassword) return alert('يرجى كتابة كلمة مرور جديدة');
    if (newPassword !== confirmPassword) return alert('كلمتا السر غير متطابقتين!');
    onUpdateSettings({...settings, dashboardPassword: newPassword}); 
    setNewPassword(''); 
    setConfirmPassword('');
    setShowPassChange(false);
    alert('تم تحديث كلمة السر بنجاح! 🇲🇦');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const articleData: Article = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: newArticle.name || '',
      price: 0,
      content: newArticle.content || '',
      image: newArticle.image || '',
      category: newArticle.category as Category,
      rating: Number(newArticle.rating) || 5
    };
    if (editingId) onUpdateArticles(articles.map(a => a.id === editingId ? articleData : a));
    else onUpdateArticles([articleData, ...articles]);
    setNewArticle({ category: Category.REVIEWS, rating: 5, price: 0 });
    setEditingId(null);
    alert('تم الحفظ بنجاح 🇲🇦');
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap items-center gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm border border-slate-100 sticky top-24 z-40">
        {[
          { id: 'articles', label: 'المقالات', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { id: 'monetization', label: 'أدسنس والربح', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { id: 'settings', label: 'الإعدادات', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066' },
          { id: 'security', label: 'الأمان', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setTab(item.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${tab === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
        <button onClick={onLogout} className="mr-auto ml-2 px-6 py-3 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-all">خروج</button>
      </div>

      {tab === 'monetization' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 animate-fadeIn">
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-12">
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-2">تفعيل الربح الآلي 💰</h3>
              <p className="text-slate-400 font-bold mb-8">ضع الأكواد هنا، وسيقوم النظام بتوزيعها تلقائياً في كل الموقع.</p>
              
              <div className="space-y-10">
                {/* Step 1 */}
                <div className="relative border-r-4 border-emerald-500 pr-8 py-2">
                  <div className="absolute top-0 -right-[14px] w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">1</div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">كود الربط (Header)</h4>
                      <p className="text-xs text-slate-400 font-bold">انسخ الكود الذي يبدأ بـ &lt;script من حسابك في أدسنس</p>
                    </div>
                    {isAdsenseValid && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full font-black">جاهز للعمل ✓</span>}
                  </div>
                  <textarea 
                    className={`w-full p-6 border rounded-[28px] h-44 outline-none font-mono text-xs transition-all ${isAdsenseValid ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 focus:ring-4 focus:ring-amber-500/10'}`}
                    value={localSettings.adsenseCode} 
                    onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} 
                    placeholder='إلصق الكود هنا...'
                  />
                </div>

                {/* Step 2 */}
                <div className="relative border-r-4 border-emerald-500 pr-8 py-2">
                  <div className="absolute top-0 -right-[14px] w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">2</div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">ملف التحقق (ads.txt)</h4>
                      <p className="text-xs text-slate-400 font-bold">انسخ السطر البرمجي من أدسنس لحماية أرباحك</p>
                    </div>
                    {isAdsTxtValid && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full font-black">تم التحقق ✓</span>}
                  </div>
                  <textarea 
                    className={`w-full p-4 border rounded-2xl h-24 outline-none font-mono text-xs transition-all ${isAdsTxtValid ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 focus:ring-4 focus:ring-amber-500/10'}`}
                    value={localSettings.adsTxt} 
                    onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})} 
                    placeholder='google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0'
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => { onUpdateSettings(localSettings); alert('تم تفعيل النظام التلقائي! 🚀 موقعك الآن جاهز لعرض الإعلانات.'); }} 
              className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-600 shadow-2xl transition-all active:scale-95"
            >
              حفظ وتفعيل النظام التلقائي
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-black text-xl mb-4">الحالة الحالية</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isAdsenseValid ? 'bg-white animate-pulse' : 'bg-emerald-800'}`}></div>
                    <span className="text-sm font-bold">{isAdsenseValid ? 'الإعلانات مفعلة في الرأس' : 'بانتظار كود Header'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isAdsTxtValid ? 'bg-white animate-pulse' : 'bg-emerald-800'}`}></div>
                    <span className="text-sm font-bold">{isAdsTxtValid ? 'ملف ads.txt جاهز' : 'بانتظار سطر التحقق'}</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg">
              <h4 className="font-black text-slate-800 mb-6 text-lg border-b pb-4">لماذا هذا الكود؟</h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed mb-4">
                هذا الكود هو "هوية" موقعك في جوجل. بمجرد وضعه:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2 text-[11px] font-black text-slate-600 items-start">
                  <span className="text-emerald-500">●</span> تظهر الإعلانات تلقائياً في أماكن احترافية.
                </li>
                <li className="flex gap-2 text-[11px] font-black text-slate-600 items-start">
                  <span className="text-emerald-500">●</span> تبدأ جوجل في حساب "الدرهم" مقابل كل زيارة.
                </li>
                <li className="flex gap-2 text-[11px] font-black text-slate-600 items-start">
                  <span className="text-emerald-500">●</span> تحصل على إحصائيات دقيقة في حسابك بأدسنس.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-xl mx-auto space-y-10 animate-fadeIn mt-10 text-center">
          <div className="space-y-4">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-800">تعديل كلمة السر</h3>
          </div>
          <div className="space-y-6">
            <input type={showPassChange ? "text" : "password"} className="w-full p-6 border border-slate-100 rounded-[30px] bg-slate-50 outline-none text-center font-black text-2xl" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة" />
            <input type={showPassChange ? "text" : "password"} className="w-full p-6 border border-slate-100 rounded-[30px] bg-slate-50 outline-none text-center font-black text-2xl" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="تأكيد كلمة المرور" />
            <button onClick={handlePasswordUpdate} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-slate-800 shadow-2xl transition-all">تحديث وحفظ</button>
          </div>
        </div>
      )}

      {/* Articles Tab Content */}
      {tab === 'articles' && (
        <div className="space-y-12 animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-10">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-50 pb-6">
              {editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required placeholder="عنوان المقال..." />
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required placeholder="رابط صورة الغلاف..." />
              <select className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none" type="number" max="5" min="1" step="0.5" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: Number(e.target.value)})} placeholder="التقييم 1-5" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-700">المحتوى</label>
                <button type="button" onClick={fixContentWithAI} disabled={isFixing} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black">{isFixing ? 'جاري التحسين...' : '✨ تصحيح وتحسين ذكي'}</button>
              </div>
              <textarea className="w-full p-6 border border-slate-100 rounded-[28px] h-[350px] outline-none bg-slate-50 font-medium" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required placeholder="اكتب المحتوى هنا..." />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl">حفظ وتحديث المحتوى</button>
          </form>
          <div className="grid grid-cols-1 gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-2xl" />
                  <div><p className="font-black text-slate-800 line-clamp-1">{a.name}</p><span className="text-[10px] bg-emerald-50 px-2 rounded-full text-emerald-600 font-bold">{a.category}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo(0,0)}} className="p-3 bg-slate-50 text-emerald-600 rounded-xl font-bold">تعديل</button>
                  <button onClick={() => onUpdateArticles(articles.filter(item => item.id !== a.id))} className="p-3 bg-red-50 text-red-500 rounded-xl font-bold">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8 animate-fadeIn mt-10">
          <h3 className="text-2xl font-black text-slate-800">إعدادات الموقع العامة</h3>
          <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
          <textarea className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none h-32" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم حفظ الإعدادات!'); }} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all">حفظ التغييرات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
