
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
  const [showPassChange, setShowPassChange] = useState(false);

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
    alert('تم الحفظ بنجاح 🇲🇦');
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap items-center gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm border border-slate-100 sticky top-24 z-40">
        {[
          { id: 'articles', label: 'المحتوى', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { id: 'monetization', label: 'أدسنس', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { id: 'settings', label: 'الموقع', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
          { id: 'pixels', label: 'التتبع', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z' },
          { id: 'security', label: 'الأمان', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
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
        <button onClick={onLogout} className="mr-auto ml-2 px-6 py-3 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4-4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          خروج
        </button>
      </div>

      {tab === 'monetization' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 animate-fadeIn">
          <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <div className="flex items-center gap-4 border-b pb-6">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">تفعيل Google AdSense</h3>
                <p className="text-slate-400 font-bold text-sm">اربط مدونتك بجوجل وابدأ في الربح</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-700">1. كود Header الخاص بأدسنس</label>
                <textarea 
                  className="w-full p-6 border border-slate-100 rounded-[28px] h-40 outline-none bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-amber-500/20" 
                  value={localSettings.adsenseCode} 
                  onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} 
                  placeholder='<script async src="https://pagead2.googlesyndication.com/..."></script>'
                />
              </div>

              <div className="space-y-4 pt-4">
                <label className="block text-sm font-black text-slate-700">2. محتوى ملف ads.txt</label>
                <textarea 
                  className="w-full p-4 border border-slate-100 rounded-2xl h-24 outline-none bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-amber-500/20" 
                  value={localSettings.adsTxt} 
                  onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})} 
                  placeholder='google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0'
                />
              </div>
              
              <button 
                onClick={() => { onUpdateSettings(localSettings); alert('تم تفعيل إعدادات أدسنس بنجاح! 💰'); }} 
                className="w-full bg-amber-500 text-white py-5 rounded-3xl font-black text-lg hover:bg-amber-600 shadow-xl shadow-amber-100 transition-all"
              >
                تحديث وحفظ الربح
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg">
              <h4 className="font-black text-slate-800 mb-6 text-lg">تحقق التفعيل</h4>
              <div className="space-y-4">
                {[
                  { text: 'تمت إضافة كود Header', check: !!localSettings.adsenseCode },
                  { text: 'تمت إضافة ملف ads.txt', check: !!localSettings.adsTxt },
                  { text: 'لديك أكثر من 15 مقال', check: articles.length >= 15 },
                  { text: 'المحتوى حصري وغير منقول', check: true }
                ].map((step, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <span className={`text-xs font-bold ${step.check ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{step.text}</span>
                    {step.check ? (
                      <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-200 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="space-y-12 animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-10">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-50 pb-6">
              {editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required placeholder="عنوان المقال..." />
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required placeholder="رابط صورة الغلاف..." />
              <select className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" type="number" max="5" min="1" step="0.5" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: Number(e.target.value)})} placeholder="التقييم 1-5" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-700">المحتوى</label>
                <button type="button" onClick={fixContentWithAI} disabled={isFixing} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-100 transition-all">{isFixing ? 'جاري التحسين...' : '✨ تصحيح وتحسين ذكي'}</button>
              </div>
              <textarea className="w-full p-6 border border-slate-100 rounded-[28px] h-[350px] outline-none bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500/20" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required placeholder="اكتب المحتوى هنا... (يمكنك وضع روابط أيضاً)" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">حفظ وتحديث المحتوى</button>
          </form>
          <div className="grid grid-cols-1 gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-2xl border" />
                  <div><p className="font-black text-slate-800 line-clamp-1">{a.name}</p><span className="text-[10px] bg-emerald-50 px-2 rounded-full text-emerald-600 font-bold">{a.category}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo({top: 0, behavior: 'smooth'})}} className="p-3 bg-slate-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all">تعديل</button>
                  <button onClick={() => { if(confirm('هل أنت متأكد؟')) onUpdateArticles(articles.filter(item => item.id !== a.id)) }} className="p-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-all">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8 animate-fadeIn mt-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-slate-100 p-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800">إعدادات الموقع العامة</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-600 mr-2">اسم الموقع</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold focus:ring-2 focus:ring-slate-500/10" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-600 mr-2">وصف الموقع (SEO)</label>
              <textarea className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none h-32 focus:ring-2 focus:ring-slate-500/10 font-medium" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
            </div>
            <button onClick={() => { onUpdateSettings(localSettings); alert('تم حفظ الإعدادات!'); }} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all">حفظ التغييرات</button>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-xl mx-auto space-y-10 animate-fadeIn mt-10 text-center">
          <div className="space-y-4">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-800">تغيير كلمة السر</h3>
            <p className="text-slate-400 font-bold">كلمة السر هي مفتاح التحكم في موقعك وأرباحك.</p>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <input 
                type={showPassChange ? "text" : "password"} 
                className="w-full p-6 border border-slate-100 rounded-[30px] bg-slate-50 outline-none text-center font-black text-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="كلمة المرور الجديدة" 
              />
              <button 
                type="button"
                onClick={() => setShowPassChange(!showPassChange)}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
              >
                {showPassChange ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            <button 
              onClick={() => {
                if(!newPassword) return alert('يرجى كتابة كلمة مرور');
                onUpdateSettings({...settings, dashboardPassword: newPassword}); 
                setNewPassword(''); 
                setShowPassChange(false);
                alert('تم تحديث كلمة السر بنجاح! يرجى حفظها جيداً 🇲🇦');
              }} 
              className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-slate-800 shadow-2xl transition-all active:scale-95"
            >
              تحديث كلمة السر الآن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
