
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

  useEffect(() => { setLocalSettings(settings); }, [settings]);

  const generateSitemap = () => {
    const baseUrl = `https://${settings.domain || 'souq-morocco.com'}`;
    return [`${baseUrl}/`, ...articles.map(a => `${baseUrl}/article/${a.id}`)].join('\n');
  };

  const generateRobotsTxt = () => {
    return `User-agent: *\nAllow: /\nSitemap: https://${settings.domain || 'souq-morocco.com'}/sitemap.xml`;
  };

  const checkSEOStatus = () => {
    const issues = [];
    if (articles.length < 15) issues.push("جوجل يفضل المواقع التي تملك أكثر من 15 مقالاً (تملك الآن " + articles.length + ")");
    if (!settings.domain.includes('.')) issues.push("يجب إعداد نطاق (Domain) حقيقي ليتمكن جوجل من أرشفتك.");
    if (articles.some(a => a.content.length < 500)) issues.push("بعض مقالاتك قصيرة؛ جوجل يعشق المحتوى التفصيلي (أكثر من 500 كلمة).");
    return issues;
  };

  const handleUpdate = () => {
    onUpdateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح! 🇲🇦');
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
      {/* القائمة العلوية للوحة التحكم */}
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm sticky top-24 z-40 overflow-x-auto no-scrollbar">
        {[
          { id: 'articles', label: 'المقالات' },
          { id: 'monetization', label: 'أدسنس والربح' },
          { id: 'seo', label: 'مدقق الأرشفة' },
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

      {tab === 'seo' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-emerald-600 text-white p-10 rounded-[40px] shadow-xl">
            <h3 className="text-2xl font-black mb-4">تقرير جودة الأرشفة (SEO Report) 🔍</h3>
            {checkSEOStatus().length > 0 ? (
              <ul className="space-y-4">
                {checkSEOStatus().map((issue, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                    <span className="text-xl">⚠️</span>
                    <span className="font-bold">{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-white/10 p-6 rounded-2xl font-black text-center">
                🎉 رائع! موقعك مستعد تماماً لتصدر نتائج البحث.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-100">
              <h4 className="font-black text-slate-800 mb-4">خريطة الموقع (Sitemap)</h4>
              <p className="text-xs text-slate-400 mb-4 font-bold">انسخ الروابط وقدمها في Google Search Console:</p>
              <textarea readOnly className="w-full h-40 bg-slate-50 p-4 rounded-2xl font-mono text-xs outline-none border border-slate-100" value={generateSitemap()} />
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-100">
              <h4 className="font-black text-slate-800 mb-4">ملف Robots.txt</h4>
              <p className="text-xs text-slate-400 mb-4 font-bold">هذا الملف يفتح الباب لعناكب جوجل لدخول موقعك:</p>
              <textarea readOnly className="w-full h-40 bg-slate-50 p-4 rounded-2xl font-mono text-xs outline-none border border-slate-100" value={generateRobotsTxt()} />
            </div>
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

      {tab === 'monetization' && (
        <div className="bg-white p-10 rounded-[40px] shadow-xl space-y-8 animate-fadeIn border border-slate-100">
          <h3 className="text-2xl font-black text-slate-800">إعدادات الربح (Google AdSense) 💰</h3>
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-500">كود أدسنس الرئيسي (Script)</label>
            <textarea className="w-full h-40 p-4 border rounded-2xl bg-slate-50 font-mono text-xs outline-none" value={localSettings.adsenseCode} onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} placeholder="إلصق الكود الذي أعطاك إياه أدسنس هنا..." />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-500">محتوى ملف ads.txt</label>
            <input className="w-full p-4 border rounded-2xl bg-slate-50 font-mono text-xs" value={localSettings.adsTxt} onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})} placeholder="google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0" />
          </div>
          <button onClick={handleUpdate} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl">حفظ إعدادات الأرباح</button>
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[40px] shadow-xl space-y-8 animate-fadeIn border border-slate-100 mt-10">
          <h3 className="text-2xl font-black text-slate-800">هوية الموقع (SEO Meta)</h3>
          <div className="space-y-4">
             <label className="font-black text-slate-500 text-sm">اسم الموقع</label>
             <input className="w-full p-4 border rounded-2xl bg-slate-50 font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
          </div>
          <div className="space-y-4">
             <label className="font-black text-slate-500 text-sm">وصف الموقع العام لمحركات البحث</label>
             <textarea className="w-full p-4 border rounded-2xl bg-slate-50 font-bold h-32" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
          </div>
          <div className="space-y-4">
             <label className="font-black text-slate-500 text-sm">رابط الدومين (بدون https)</label>
             <input className="w-full p-4 border rounded-2xl bg-slate-50 font-bold" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} placeholder="souq-morocco.com" />
          </div>
          <button onClick={handleUpdate} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all">حفظ التغييرات العامة</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
