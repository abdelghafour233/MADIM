
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
    rating: 5,
    price: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // إحصائيات لوحة التحكم
  const stats = {
    total: articles.length,
    guides: articles.filter(a => a.category === Category.GUIDES).length,
    avgRating: (articles.reduce((acc, a) => acc + a.rating, 0) / (articles.length || 1)).toFixed(1),
    topPrice: Math.max(...articles.map(a => a.price), 0)
  };

  const fixContentWithAI = async () => {
    if (!newArticle.content) {
      alert("يرجى كتابة محتوى المقال أولاً ليقوم الذكاء الاصطناعي بتدقيقه.");
      return;
    }

    setIsFixing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `قم بتصحيح الأخطاء الإملائية والنحوية في النص العربي التالي. 
        اجعل الأسلوب تسويقياً، جذاباً، واحترافياً مناسباً للجمهور المغربي. 
        حافظ على الروابط (URLs) كما هي بالضبط دون أي تغيير. 
        النص: ${newArticle.content}`,
        config: {
          systemInstruction: "أنت خبير تدقيق لغوي وكاتب محتوى تسويقي محترف متخصص في السوق المغربي. مهمتك تحسين النصوص لجعلها أكثر إقناعاً وخالية من الأخطاء.",
        }
      });

      const fixedText = response.text;
      if (fixedText) {
        setNewArticle(prev => ({ ...prev, content: fixedText }));
        alert("تم التصحيح والتحسين بنجاح بواسطة Gemini AI!");
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى التأكد من مفتاح API الخاص بك.");
    } finally {
      setIsFixing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    
    setNewArticle({ category: Category.REVIEWS, rating: 5, price: 0 });
    setEditingId(null);
    alert('تم الحفظ بنجاح في الموقع');
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      alert('كلمة المرور يجب أن لا تقل عن 4 رموز');
      return;
    }
    onUpdateSettings({ ...settings, dashboardPassword: newPassword });
    setNewPassword('');
    alert('تم تحديث رمز الدخول بنجاح');
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      {/* قسم الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase mb-1">المقالات</p>
          <p className="text-2xl font-black text-emerald-600">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase mb-1">أدلة الشراء</p>
          <p className="text-2xl font-black text-blue-600">{stats.guides}</p>
        </div>
        <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase mb-1">التقييم العام</p>
          <p className="text-2xl font-black text-amber-500">{stats.avgRating}</p>
        </div>
        <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase mb-1">أعلى سعر</p>
          <p className="text-2xl font-black text-slate-800">{stats.topPrice} <small className="text-xs">د.م.</small></p>
        </div>
      </div>

      {/* شريط التنقل للوحة التحكم */}
      <div className="flex flex-wrap items-center gap-2 mb-10 bg-white p-2 rounded-[24px] shadow-sm border border-slate-100 sticky top-24 z-40 overflow-x-auto">
        {[
          { id: 'articles', label: 'المحتوى', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { id: 'settings', label: 'الموقع', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066' },
          { id: 'pixels', label: 'التتبع', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { id: 'security', label: 'الأمان', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setTab(item.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${tab === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
        <div className="flex-grow"></div>
        <button onClick={onLogout} className="px-6 py-3 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-12 animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-50 pb-6">
              {editingId ? 'تحرير المقال' : 'نشر مقال جديد'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 mr-2">العنوان</label>
                <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required placeholder="عنوان المقال..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 mr-2">رابط الصورة</label>
                <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 mr-2">القسم</label>
                <select className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 mr-2">السعر (د.م.)</label>
                  <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none" type="number" value={newArticle.price || ''} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 mr-2">التقييم</label>
                  <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 font-bold outline-none" type="number" max="5" min="1" step="0.5" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-sm font-black text-slate-700">محتوى المقال</label>
                <button 
                  type="button" 
                  onClick={fixContentWithAI} 
                  disabled={isFixing}
                  className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 border border-emerald-100"
                >
                  {isFixing ? 'جاري التحسين...' : '✨ تصحيح ذكي بـ Gemini'}
                </button>
              </div>
              <textarea 
                className="w-full p-6 border border-slate-100 rounded-[28px] h-[350px] outline-none bg-slate-50 font-medium leading-relaxed text-lg" 
                value={newArticle.content || ''} 
                onChange={e => setNewArticle({...newArticle, content: e.target.value})} 
                required 
                placeholder="اكتب المحتوى هنا..."
              />
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">
              {editingId ? 'حفظ التعديلات' : 'نشر المقال الآن'}
            </button>
          </form>

          {/* قائمة المقالات */}
          <div className="grid grid-cols-1 gap-4">
            <h3 className="font-black text-xl text-slate-800 px-4">إدارة المقالات المنشورة ({articles.length})</h3>
            {articles.map(a => (
              <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-16 h-16 object-cover rounded-2xl" />
                  <div>
                    <p className="font-black text-slate-800">{a.name}</p>
                    <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full text-emerald-600 font-bold">{a.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo({top: 0, behavior: 'smooth'})}} className="p-3 bg-slate-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">تعديل</button>
                  <button onClick={() => { if(confirm('حذف؟')) onUpdateArticles(articles.filter(item => item.id !== a.id)) }} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8 animate-fadeIn mt-10">
          <h3 className="text-2xl font-black text-slate-800">إعدادات الموقع</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">اسم الموقع</label>
              <input className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">الوصف (SEO)</label>
              <textarea className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none h-24" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم الحفظ'); }} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-black transition-all">حفظ الإعدادات</button>
        </div>
      )}

      {tab === 'pixels' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8 animate-fadeIn mt-10">
          <h3 className="text-2xl font-black text-slate-800">أكواد التتبع</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-blue-600 mb-2">Facebook Pixel ID</label>
              <input className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none font-mono" value={localSettings.fbPixel} onChange={e => setLocalSettings({...localSettings, fbPixel: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-black text-pink-600 mb-2">TikTok Pixel ID</label>
              <input className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none font-mono" value={localSettings.tiktokPixel} onChange={e => setLocalSettings({...localSettings, tiktokPixel: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم التحديث'); }} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-emerald-100">تحديث البيكسلات</button>
        </div>
      )}

      {tab === 'security' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl max-w-xl mx-auto space-y-8 animate-fadeIn mt-10 text-center">
          <h3 className="text-2xl font-black text-slate-800">تغيير كلمة السر</h3>
          <form onSubmit={updatePassword} className="space-y-6 text-right">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">كلمة المرور الجديدة</label>
              <input 
                type="text"
                className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none text-center font-black tracking-widest"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="****"
                required
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-black transition-all">تحديث كلمة السر</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
