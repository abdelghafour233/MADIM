
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

  const checkSEOStatus = () => {
    const issues = [];
    if (articles.length < 15) issues.push("جوجل يفضل المواقع التي تملك أكثر من 15 مقالاً (تملك الآن " + articles.length + ")");
    if (!settings.domain.includes('.')) issues.push("يجب إعداد نطاق (Domain) حقيقي ليتمكن جوجل من أرشفتك.");
    if (articles.some(a => a.content.length < 300)) issues.push("بعض مقالاتك قصيرة جداً؛ جوجل يحب المحتوى الغني (أكثر من 300 كلمة).");
    return issues;
  };

  const handleUpdate = () => {
    onUpdateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح 🇲🇦');
  };

  const fixContentWithAI = async () => {
    if (!newArticle.content) return;
    setIsFixing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أعد صياغة هذا المقال بأسلوب SEO متقدم جداً، استعمل كلمات بحث مغربية مشهورة، واجعل المحتوى فريداً 100% ليقبله جوجل: ${newArticle.content}`,
      });
      if (response.text) setNewArticle(prev => ({ ...prev, content: response.text }));
    } catch (e) { console.error(e); }
    finally { setIsFixing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm sticky top-20 z-40 overflow-x-auto no-scrollbar">
        {['articles', 'monetization', 'seo', 'security', 'settings'].map(t => (
          <button 
            key={t} onClick={() => setTab(t as any)}
            className={`px-6 py-3 rounded-2xl font-black transition-all ${tab === t ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {t === 'articles' ? 'المقالات' : t === 'monetization' ? 'أدسنس' : t === 'seo' ? 'مدقق الأرشفة' : t === 'security' ? 'الأمان' : 'الإعدادات'}
          </button>
        ))}
        <button onClick={onLogout} className="mr-auto px-6 py-3 text-red-500 font-black">خروج</button>
      </div>

      {tab === 'seo' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-emerald-600 text-white p-10 rounded-[40px] shadow-xl">
            <h3 className="text-2xl font-black mb-4">حالة موقعك في محرك البحث 🔍</h3>
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
                🎉 ممتاز! موقعك مهيأ تقنياً بشكل كامل للأرشفة.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-100">
              <h4 className="font-black mb-4">خريطة الموقع (Sitemap)</h4>
              <p className="text-xs text-slate-400 mb-4 font-bold">قدم هذا النص في Google Search Console:</p>
              <textarea readOnly className="w-full h-40 bg-slate-50 p-4 rounded-2xl font-mono text-xs outline-none" value={generateSitemap()} />
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-100">
              <h4 className="font-black mb-4">خطوات عملية للأرشفة 🚀</h4>
              <ul className="text-sm font-bold text-slate-600 space-y-3">
                <li className="flex gap-2 text-emerald-600">1. سجل في Google Search Console.</li>
                <li className="flex gap-2 text-emerald-600">2. أضف رابط الـ Sitemap الخاص بك.</li>
                <li className="flex gap-2">3. انشر مقالاً جديداً كل يوم (الاستمرارية أهم شيء).</li>
                <li className="flex gap-2">4. شارك روابط مقالاتك في فيسبوك وواتساب.</li>
              </ul>
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
          }} className="bg-white p-10 rounded-[40px] shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="p-4 border rounded-2xl bg-slate-50 font-bold" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} placeholder="عنوان المقال (كلمات مفتاحية)" required />
              <input className="p-4 border rounded-2xl bg-slate-50 font-bold" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="رابط الصورة" required />
            </div>
            <div className="relative">
               <div className="flex justify-between mb-2">
                 <label className="text-sm font-black text-slate-500">محتوى المقال (SEO)</label>
                 <button type="button" onClick={fixContentWithAI} className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-black">{isFixing ? 'جاري التحسين...' : '✨ تحسين SEO بالذكاء الاصطناعي'}</button>
               </div>
               <textarea className="w-full h-64 p-6 bg-slate-50 border rounded-3xl font-medium outline-none" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl shadow-lg">{editingId ? 'تحديث' : 'نشر الآن'}</button>
          </form>

          <div className="grid gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-12 h-12 object-cover rounded-xl" />
                  <p className="font-black line-clamp-1">{a.name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a);}} className="text-emerald-600 font-bold">تعديل</button>
                  <button onClick={() => onUpdateArticles(articles.filter(item => item.id !== a.id))} className="text-red-500 font-bold">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[40px] shadow-xl space-y-8 animate-fadeIn">
          <div className="space-y-2">
             <label className="font-black text-slate-500 text-sm">رابط النطاق (بدون https)</label>
             <input className="w-full p-4 border rounded-2xl bg-slate-50 font-bold" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} placeholder="example.com" />
          </div>
          <div className="space-y-2">
             <label className="font-black text-slate-500 text-sm">وصف الموقع العام (SEO Meta Description)</label>
             <textarea className="w-full p-4 border rounded-2xl bg-slate-50 font-bold h-32" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
          </div>
          <button onClick={handleUpdate} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">حفظ كل التغييرات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
