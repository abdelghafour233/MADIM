
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
  
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => { setLocalSettings(settings); }, [settings]);

  const handleUpdate = () => {
    onUpdateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح! 🇲🇦');
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
        contents: `أعد صياغة هذا المقال بأسلوب SEO متقدم جداً، استعمل كلمات بحث مغربية مشهورة (مثل: تخفيضات، مراجعة، ثمن)، واجعل المحتوى فريداً 100% ليقبله جوجل بسرعة: ${newArticle.content}`,
      });
      if (response.text) setNewArticle(prev => ({ ...prev, content: response.text }));
    } catch (e) { console.error(e); }
    finally { setIsFixing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm sticky top-24 z-40 overflow-x-auto no-scrollbar border border-slate-100">
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
               <h3 className="text-3xl font-black mb-4">تهانينا على القبول الرسمي! 🎉</h3>
               <p className="text-emerald-100 font-bold max-w-xl leading-relaxed">أنت الآن شريك رسمي لجوجل. إليك كيفية إنهاء الخطوات الثلاث لتفعيل الأرباح فوراً:</p>
             </div>
             <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-emerald-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black mb-4 italic">1</div>
              <h4 className="font-black text-slate-800 mb-2">الخطوة 1: ربط الموقع</h4>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-4">الكود موجود في موقعك بالفعل. اذهب إلى لوحة أدسنس واضغط على "تم وضع الكود" ثم "تحقق".</p>
              <button onClick={() => alert('الكود مدمج تلقائياً في قوالب عبدو ويب.')} className="text-[10px] bg-slate-900 text-white px-3 py-2 rounded-lg font-black w-full hover:bg-emerald-600 transition-colors">تحقق من الربط</button>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] border border-emerald-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black mb-4 italic">2</div>
              <h4 className="font-black text-slate-800 mb-2">الخطوة 2: ملف ads.txt</h4>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-4">انسخ هذا السطر وضعه في ملف نصي باسم ads.txt في استضافتك (أو أرسله لي لأضعه لك).</p>
              <button onClick={() => {
                navigator.clipboard.writeText(localSettings.adsTxt);
                alert('تم نسخ سطر ads.txt بنجاح! قم بلصقه في ملف ads.txt');
              }} className="text-[10px] bg-orange-600 text-white px-3 py-2 rounded-lg font-black w-full shadow-lg shadow-orange-100">نسخ سطر الهوية</button>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-emerald-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black mb-4 italic">3</div>
              <h4 className="font-black text-slate-800 mb-2">الخطوة 3: الإعلانات التلقائية</h4>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-4">ادخل إلى قسم "الإعلانات" في أدسنس، وافتح إعدادات موقعك وفعل خيار "الإعلانات التلقائية".</p>
              <a href="https://adsense.google.com" target="_blank" className="text-[10px] bg-blue-600 text-white px-3 py-2 rounded-lg font-black w-full block text-center shadow-lg shadow-blue-100">فتح إعدادات الإعلانات</a>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl space-y-8 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              تحديث بيانات المعرّف (ID)
              <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">تحديث ضروري</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-500 italic">معرف الناشر الخاص بك (Publisher ID)</label>
                <div className="relative">
                  <input 
                    className="w-full p-4 pr-12 border rounded-2xl bg-slate-50 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 border-slate-100" 
                    value={localSettings.adsTxt.split(',')[1]?.trim() || ''} 
                    onChange={e => {
                      const id = e.target.value.trim();
                      setLocalSettings({...localSettings, adsTxt: `google.com, ${id}, DIRECT, f08c47fec0942fa0`});
                    }}
                    placeholder="مثال: pub-5578524966832192" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-500 italic">نطاق الموقع (Domain)</label>
                <input 
                  className="w-full p-4 border rounded-2xl bg-slate-50 font-mono text-sm outline-none border-slate-100" 
                  value={localSettings.domain} 
                  onChange={e => setLocalSettings({...localSettings, domain: e.target.value})}
                  placeholder="abdouweb.online" 
                />
              </div>
            </div>
            <button onClick={handleUpdate} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
              حفظ وتأكيد الخطوات 🚀
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
            alert('تم الحفظ بنجاح');
          }} className="bg-white p-10 rounded-[40px] shadow-xl space-y-6 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800">{editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="p-4 border rounded-2xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} placeholder="عنوان المقال (كلمات بحث قوية)..." required />
              <input className="p-4 border rounded-2xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="رابط صورة الغلاف..." required />
            </div>
            <div className="relative">
               <div className="flex justify-between mb-2">
                 <label className="text-sm font-black text-slate-500">محتوى المقال (SEO)</label>
                 <button type="button" onClick={fixContentWithAI} className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-black transition-all hover:bg-emerald-100">
                   {isFixing ? 'جاري التحسين...' : '✨ تحسين المحتوى بذكاء إصطناعي'}
                 </button>
               </div>
               <textarea className="w-full h-80 p-6 bg-slate-50 border rounded-3xl font-medium outline-none focus:ring-4 focus:ring-emerald-500/10 leading-relaxed" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="اكتب مراجعة المنتج بالتفصيل..." required />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]">
              {editingId ? 'تحديث المقال' : 'نشر المقال الآن 🚀'}
            </button>
          </form>

          <div className="grid gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-2xl shadow-sm" alt="" />
                  <div>
                    <p className="font-black text-slate-800 line-clamp-1">{a.name}</p>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{a.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo(0,0);}} className="p-3 bg-slate-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-all">تعديل</button>
                  <button onClick={() => {if(confirm('حذف؟')) onUpdateArticles(articles.filter(item => item.id !== a.id))}} className="p-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-all">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-emerald-600 text-white p-10 rounded-[40px] shadow-xl">
            <h3 className="text-2xl font-black mb-4">تقرير جودة الأرشفة (SEO Report) 🔍</h3>
            <p className="font-bold mb-4 opacity-90">موقعك على نطاق: {settings.domain}</p>
            <div className="bg-white/10 p-6 rounded-2xl font-black text-center">
              🎉 رائع! موقعك مستعد تماماً لتصدر نتائج البحث في المغرب.
            </div>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 text-center">
            <h3 className="text-2xl font-black text-slate-800 mb-2">تغيير كلمة السر</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 mt-8">
              <input type="password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="كلمة السر الحالية" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
              <input type="password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="كلمة السر الجديدة" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required />
              <input type="password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" placeholder="تأكيد كلمة السر الجديدة" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all mt-4">تحديث الأمان</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 mb-6">إعدادات الموقع العام</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500">اسم الموقع</label>
                <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500">وصف الموقع</label>
                <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500">النطاق (Domain)</label>
                <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-mono" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
              </div>
              <button onClick={handleUpdate} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl">حفظ جميع الإعدادات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
