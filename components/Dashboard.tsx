
import React, { useState } from 'react';
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
    alert('تم الحفظ');
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap items-center gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm border border-slate-100 sticky top-24 z-40">
        {[
          { id: 'articles', label: 'المحتوى', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { id: 'monetization', label: 'الربح (أدسنس)', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { id: 'settings', label: 'الموقع', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066' },
          { id: 'pixels', label: 'التتبع', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z' },
          { id: 'security', label: 'الأمان', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6z' }
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
      </div>

      {tab === 'monetization' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8 animate-fadeIn mt-10">
          <div className="flex items-center gap-4 border-b pb-6">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">ربط Google AdSense</h3>
              <p className="text-slate-400 font-bold text-sm">أدخل كود الربح لتحويل الزوار إلى دولارات 🇲🇦 💰</p>
            </div>
          </div>
          
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <h4 className="font-black text-emerald-800 mb-2 text-sm">كيف تربط حسابك؟</h4>
            <ol className="text-emerald-700 text-xs space-y-2 font-medium">
              <li>1. اذهب إلى حسابك في Google AdSense.</li>
              <li>2. اختر "المواقع" ثم "إضافة موقع".</li>
              <li>3. انسخ "كود أدسنس" (AdSense Code Snippet).</li>
              <li>4. الصقه في المربع أدناه واحفظ الإعدادات.</li>
            </ol>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-700 mr-2">كود أدسنس (Snippet)</label>
            <textarea 
              className="w-full p-6 border border-slate-100 rounded-[28px] h-48 outline-none bg-slate-50 font-mono text-xs" 
              value={localSettings.adsenseCode} 
              onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} 
              placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>'
            />
          </div>
          
          <button 
            onClick={() => { onUpdateSettings(localSettings); alert('تم ربط أدسنس بنجاح! سيظهر الكود الآن في موقعك.'); }} 
            className="w-full bg-amber-500 text-white py-5 rounded-3xl font-black text-lg hover:bg-amber-600 shadow-xl shadow-amber-100 transition-all"
          >
            تفعيل وحفظ كود الربح
          </button>
        </div>
      )}

      {tab === 'articles' && (
        <div className="space-y-12 animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-10">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-50 pb-6">
              {editingId ? 'تحرير المقال' : 'نشر مقال جديد'}
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
                <button type="button" onClick={fixContentWithAI} disabled={isFixing} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black">{isFixing ? 'جاري التحسين...' : '✨ تصحيح ذكي'}</button>
              </div>
              <textarea className="w-full p-6 border border-slate-100 rounded-[28px] h-[350px] outline-none bg-slate-50 font-medium" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required placeholder="اكتب المحتوى هنا..." />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl">حفظ ونشر</button>
          </form>
          <div className="grid grid-cols-1 gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-2xl" />
                  <div><p className="font-black text-slate-800">{a.name}</p><span className="text-[10px] bg-emerald-50 px-2 rounded-full text-emerald-600 font-bold">{a.category}</span></div>
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
          <h3 className="text-2xl font-black text-slate-800">إعدادات الموقع</h3>
          <input className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} placeholder="اسم الموقع" />
          <textarea className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none h-24" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} placeholder="الوصف" />
          <button onClick={() => onUpdateSettings(localSettings)} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg">حفظ الإعدادات</button>
        </div>
      )}

      {tab === 'pixels' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8 animate-fadeIn mt-10">
          <h3 className="text-2xl font-black text-slate-800">أكواد التتبع</h3>
          <input className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none" value={localSettings.fbPixel} onChange={e => setLocalSettings({...localSettings, fbPixel: e.target.value})} placeholder="Facebook Pixel ID" />
          <input className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none" value={localSettings.tiktokPixel} onChange={e => setLocalSettings({...localSettings, tiktokPixel: e.target.value})} placeholder="TikTok Pixel ID" />
          <button onClick={() => onUpdateSettings(localSettings)} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg">تحديث البيكسلات</button>
        </div>
      )}

      {tab === 'security' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-xl mx-auto space-y-8 animate-fadeIn mt-10 text-center">
          <h3 className="text-2xl font-black text-slate-800">تغيير كلمة السر</h3>
          <input type="text" className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none text-center font-black" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة" />
          <button onClick={() => {onUpdateSettings({...settings, dashboardPassword: newPassword}); setNewPassword(''); alert('تم التحديث');}} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg">تحديث</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
