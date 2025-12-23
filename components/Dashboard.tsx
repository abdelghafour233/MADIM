
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
  const [tab, setTab] = useState<'articles' | 'monetization' | 'security' | 'settings'>('articles');
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

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

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
    } catch (error) {
      console.error(error);
    } finally {
      setIsFixing(false);
    }
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
    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? articleData : a));
    } else {
      onUpdateArticles([articleData, ...articles]);
    }
    setNewArticle({ category: Category.REVIEWS, rating: 5, price: 0 });
    setEditingId(null);
    alert('تم حفظ المقال بنجاح 🇲🇦');
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm border border-slate-100 sticky top-24 z-40">
        {[
          { id: 'articles', label: 'المقالات', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
          { id: 'monetization', label: 'أدسنس وجوجل', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7' },
          { id: 'security', label: 'الأمان', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4' },
          { id: 'settings', label: 'الإعدادات', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setTab(item.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${tab === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {item.label}
          </button>
        ))}
        <button onClick={onLogout} className="mr-auto ml-2 px-6 py-3 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-all">خروج</button>
      </div>

      {/* Content based on Tabs */}
      {tab === 'articles' && (
        <div className="space-y-12 animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-10">
            <h3 className="text-2xl font-black text-slate-800">{editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} placeholder="عنوان المقال..." required />
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="رابط صورة الغلاف..." required />
              <select className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold" type="number" step="0.1" max="5" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: Number(e.target.value)})} placeholder="التقييم (1-5)" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-700">المحتوى العربي</label>
                <button type="button" onClick={fixContentWithAI} disabled={isFixing} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black">
                  {isFixing ? 'جاري التحسين بالذكاء الاصطناعي...' : '✨ تحسين النص تلقائياً'}
                </button>
              </div>
              <textarea className="w-full p-6 border border-slate-100 rounded-[28px] h-[350px] outline-none bg-slate-50 font-medium" value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="اكتب مراجعة المنتج هنا..." required />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
              {editingId ? 'تحديث المقال' : 'نشر المقال الآن'}
            </button>
          </form>

          <div className="grid grid-cols-1 gap-4">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-2xl" alt="" />
                  <div>
                    <p className="font-black text-slate-800 line-clamp-1">{a.name}</p>
                    <span className="text-[10px] bg-emerald-50 px-2 rounded-full text-emerald-600 font-bold">{a.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo(0,0)}} className="p-3 bg-slate-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50">تعديل</button>
                  <button onClick={() => {if(confirm('حذف؟')) onUpdateArticles(articles.filter(item => item.id !== a.id))}} className="p-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'monetization' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 animate-fadeIn">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <h3 className="text-2xl font-black text-slate-800">إعدادات جوجل أدسنس 💰</h3>
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-500">كود التحقق والربط (AdSense Code)</label>
              <textarea 
                className="w-full p-4 border rounded-2xl h-40 bg-slate-50 font-mono text-xs"
                value={localSettings.adsenseCode}
                onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-500">ملف ads.txt</label>
              <input 
                className="w-full p-4 border rounded-2xl bg-slate-50 font-mono text-xs"
                value={localSettings.adsTxt}
                onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})}
                placeholder="google.com, pub-5578524966832192, DIRECT, f08c47fec0942fa0"
              />
            </div>
            <button onClick={() => onUpdateSettings(localSettings)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">حفظ إعدادات الربح</button>
          </div>

          <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-xl space-y-6">
            <h3 className="text-2xl font-black">نصائح للأرشفة في جوجل 🔍</h3>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li className="flex gap-3">
                <span className="text-emerald-500">✓</span>
                <span>تأكد من إضافة موقعك في <b>Google Search Console</b>.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500">✓</span>
                <span>انشر مقالاً واحداً على الأقل يومياً لمدة 15 يوماً.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500">✓</span>
                <span>استخدم صوراً حصرية وغير منسوخة من مواقع أخرى.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500">✓</span>
                <span>أضف رابط موقعك في صفحات التواصل الاجتماعي الخاصة بك.</span>
              </li>
            </ul>
            <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-black mb-2">رقم حسابك الحالي</p>
              <p className="font-mono text-lg">ca-pub-5578524966832192</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-xl mx-auto space-y-10 animate-fadeIn mt-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800">تأمين لوحة التحكم</h3>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <input 
                type={showPassChange ? "text" : "password"} 
                className="w-full p-5 border rounded-2xl bg-slate-50 font-black text-xl text-center" 
                placeholder="كلمة المرور الجديدة"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button 
                onClick={() => setShowPassChange(!showPassChange)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600"
              >
                {showPassChange ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
            <input 
              type={showPassChange ? "text" : "password"} 
              className="w-full p-5 border rounded-2xl bg-slate-50 font-black text-xl text-center" 
              placeholder="تأكيد كلمة المرور"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button onClick={handlePasswordUpdate} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg">حفظ كلمة السر الجديدة</button>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8 animate-fadeIn mt-10">
          <h3 className="text-2xl font-black text-slate-800">هوية الموقع</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500">اسم الموقع</label>
              <input className="w-full p-5 border rounded-2xl bg-slate-50 font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500">وصف الموقع (للأرشفة)</label>
              <textarea className="w-full p-5 border rounded-2xl bg-slate-50 font-bold h-32" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
            </div>
            <button onClick={() => onUpdateSettings(localSettings)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg">حفظ التغييرات</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
