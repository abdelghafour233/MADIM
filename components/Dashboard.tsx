
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
  const [tab, setTab] = useState<'articles' | 'settings' | 'pixels' | 'security'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ 
    category: Category.REVIEWS, 
    rating: 5
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // إحصائيات سريعة
  const stats = {
    totalArticles: articles.length,
    totalReviews: articles.filter(a => a.category === Category.REVIEWS).length,
    avgRating: (articles.reduce((acc, a) => acc + a.rating, 0) / (articles.length || 1)).toFixed(1),
    mostExpensive: Math.max(...articles.map(a => a.price), 0)
  };

  const fixContentWithAI = async () => {
    if (!newArticle.content) {
      alert("يرجى كتابة نص المقال أولاً ليتم تصحيحه.");
      return;
    }

    setIsFixing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `قم بتصحيح الأخطاء الإملائية والنحوية في النص العربي التالي. 
        اجعل الأسلوب تسويقياً واحترافياً ومناسباً للجمهور المغربي. 
        حافظ على الروابط (URLs) كما هي بالضبط دون أي تغيير. 
        النص: ${newArticle.content}`,
        config: {
          systemInstruction: "أنت خبير تدقيق لغوي ومسوق محتوى محترف للمغرب. مهمتك هي إصلاح الأخطاء اللغوية وجعل النص أكثر إقناعاً وجاذبية.",
        }
      });

      const fixedText = response.text;
      if (fixedText) {
        setNewArticle(prev => ({ ...prev, content: fixedText }));
        alert("تم التصحيح والتدقيق بنجاح!");
      }
    } catch (error) {
      console.error("AI Fix Error:", error);
      alert("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    } finally {
      setIsFixing(false);
    }
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const articleData: Article = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: newArticle.name || '',
      price: Number(newArticle.price) || 0,
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
    setNewArticle({ category: Category.REVIEWS, rating: 5 });
    setEditingId(null);
    alert('تم الحفظ بنجاح');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      alert('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
      return;
    }
    onUpdateSettings({ ...settings, dashboardPassword: newPassword });
    setNewPassword('');
    alert('تم تغيير كلمة السر بنجاح');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fadeIn">
      {/* Dashboard Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <span className="text-slate-400 text-xs font-black uppercase mb-1">إجمالي المقالات</span>
          <span className="text-3xl font-black text-emerald-600">{stats.totalArticles}</span>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <span className="text-slate-400 text-xs font-black uppercase mb-1">المراجعات</span>
          <span className="text-3xl font-black text-blue-600">{stats.totalReviews}</span>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <span className="text-slate-400 text-xs font-black uppercase mb-1">متوسط التقييم</span>
          <span className="text-3xl font-black text-amber-500">{stats.avgRating}/5</span>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <span className="text-slate-400 text-xs font-black uppercase mb-1">أغلى منتج</span>
          <span className="text-xl font-black text-slate-800">{stats.mostExpensive} <small className="text-[10px]">د.م.</small></span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-2 rounded-3xl shadow-sm border border-slate-100 sticky top-24 z-40 glass overflow-x-auto">
        {[
          { id: 'articles', label: 'المحتوى', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
          { id: 'settings', label: 'الإعدادات', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066' },
          { id: 'pixels', label: 'التتبع', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { id: 'security', label: 'الأمان', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id as any)} 
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
        <div className="flex-grow"></div>
        <button onClick={onLogout} className="px-6 py-3 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-12 animate-fadeIn">
          <form onSubmit={handleAddArticle} className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10">
            <div className="flex items-center justify-between border-b border-slate-50 pb-8">
              <h3 className="text-3xl font-black text-slate-800">{editingId ? 'تحرير المقال' : 'نشر مقال جديد'}</h3>
              {editingId && (
                <button type="button" onClick={() => {setEditingId(null); setNewArticle({ category: Category.REVIEWS, rating: 5 });}} className="text-slate-400 font-bold hover:text-red-500 text-sm">إلغاء التعديل</button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700">عنوان المقال</label>
                <input className="w-full p-5 border border-slate-100 rounded-[22px] bg-slate-50/50 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700">رابط الصورة</label>
                <input className="w-full p-5 border border-slate-100 rounded-[22px] bg-slate-50/50 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700">القسم</label>
                <select className="w-full p-5 border border-slate-100 rounded-[22px] bg-slate-50/50 font-bold outline-none" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-700">السعر (د.م.)</label>
                  <input className="w-full p-5 border border-slate-100 rounded-[22px] bg-slate-50/50 font-bold outline-none" type="number" value={newArticle.price || ''} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} required />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-700">التقييم (1-5)</label>
                  <input className="w-full p-5 border border-slate-100 rounded-[22px] bg-slate-50/50 font-bold outline-none" type="number" max="5" min="1" step="0.5" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: Number(e.target.value)})} />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-sm font-black text-slate-700">محتوى المقال</label>
                <button 
                  type="button" onClick={fixContentWithAI} disabled={isFixing}
                  className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-2xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {isFixing ? 'جاري التدقيق...' : 'التدقيق الذكي (Gemini AI)'}
                </button>
              </div>
              <textarea 
                className="w-full p-8 border border-slate-100 rounded-[32px] h-[450px] outline-none bg-slate-50/50 font-medium leading-relaxed text-lg" 
                value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required 
              />
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-[28px] font-black text-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">
              {editingId ? 'تحديث المقال' : 'نشر المقال'}
            </button>
          </form>

          <div className="grid grid-cols-1 gap-6">
            <h3 className="font-black text-2xl text-slate-800 px-4">المقالات المنشورة</h3>
            {articles.map(a => (
              <div key={a.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between hover:shadow-xl transition-all group">
                <div className="flex items-center gap-6">
                  <img src={a.image} className="w-20 h-20 object-cover rounded-2xl" />
                  <div>
                    <p className="font-black text-slate-800 text-lg">{a.name}</p>
                    <span className="text-[10px] bg-emerald-50 px-3 py-1 rounded-full text-emerald-600 font-black">{a.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo({top: 0, behavior: 'smooth'})}} className="bg-slate-50 text-emerald-600 px-6 py-3 rounded-2xl font-black hover:bg-emerald-600 hover:text-white transition-all">تعديل</button>
                  <button onClick={() => { if(confirm('حذف المقال؟')) onUpdateArticles(articles.filter(item => item.id !== a.id)) }} className="bg-red-50 text-red-500 px-6 py-3 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-2xl mx-auto space-y-8 animate-fadeIn">
          <h3 className="text-3xl font-black text-slate-800">إعدادات الموقع</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">اسم الموقع</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50/50 outline-none font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">وصف SEO</label>
              <textarea className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50/50 outline-none h-32" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">الدومين</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50/50 outline-none font-mono text-sm" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم الحفظ'); }} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-black transition-all">حفظ الإعدادات العامة</button>
        </div>
      )}

      {tab === 'pixels' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-2xl mx-auto space-y-8 animate-fadeIn">
          <h3 className="text-3xl font-black text-slate-800">أكواد التتبع</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-[#1877F2] mb-2">Facebook Pixel ID</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50/50 outline-none font-mono" value={localSettings.fbPixel} onChange={e => setLocalSettings({...localSettings, fbPixel: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-black text-[#EE1D52] mb-2">TikTok Pixel ID</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50/50 outline-none font-mono" value={localSettings.tiktokPixel} onChange={e => setLocalSettings({...localSettings, tiktokPixel: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-black text-[#4285F4] mb-2">Google Analytics ID</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50/50 outline-none font-mono" value={localSettings.googleAnalytics} onChange={e => setLocalSettings({...localSettings, googleAnalytics: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم تحديث البيكسلات'); }} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100">تنشيط التتبع</button>
        </div>
      )}

      {tab === 'security' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-2xl mx-auto space-y-8 animate-fadeIn text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-800">حماية الإدارة</h3>
          <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm">قم بتغيير كلمة المرور الخاصة بلوحة التحكم لضمان عدم دخول أي شخص آخر.</p>
          
          <form onSubmit={handlePasswordChange} className="space-y-6 text-right">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 mr-2">كلمة المرور الجديدة</label>
              <input 
                type="text"
                className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50/50 outline-none text-center font-black tracking-widest"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="****"
                required
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-black transition-all">تحديث كلمة السر</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
