
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
  const [tab, setTab] = useState<'articles' | 'settings' | 'pixels'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ 
    category: Category.REVIEWS, 
    rating: 5
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  // وظيفة تصحيح النص باستخدام الذكاء الاصطناعي
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
          systemInstruction: "أنت خبير تدقيق لغوي ومسوق محتوى محترف. مهمتك هي إصلاح الأخطاء اللغوية وجعل النص أكثر جاذبية.",
        }
      });

      const fixedText = response.text;
      if (fixedText) {
        setNewArticle(prev => ({ ...prev, content: fixedText }));
        alert("تم تصحيح النص بنجاح بواسطة الذكاء الاصطناعي!");
      }
    } catch (error) {
      console.error("AI Fix Error:", error);
      alert("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً.");
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
    alert('تم حفظ البيانات بنجاح');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-wrap gap-3 mb-10 bg-white p-3 rounded-[28px] shadow-sm border border-slate-100 sticky top-24 z-40 glass">
        <button 
          onClick={() => setTab('articles')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${tab === 'articles' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
          </svg>
          إدارة المقالات
        </button>
        <button 
          onClick={() => setTab('settings')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${tab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          الإعدادات العامة
        </button>
        <button 
          onClick={() => setTab('pixels')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${tab === 'pixels' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          البكسل والتتبع
        </button>
        <div className="flex-grow"></div>
        <button onClick={onLogout} className="px-6 py-3 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all">خروج آمن</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-12 animate-fadeIn">
          <form onSubmit={handleAddArticle} className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10">
            <div className="flex items-center justify-between border-b border-slate-50 pb-8">
              <div>
                <h3 className="text-3xl font-black text-slate-800">
                  {editingId ? 'تعديل المحتوى' : 'إنشاء مقال جديد'}
                </h3>
                <p className="text-slate-400 font-bold text-sm mt-1">أضف مراجعاتك ودلائل الشراء هنا</p>
              </div>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {setEditingId(null); setNewArticle({ category: Category.REVIEWS, rating: 5 });}}
                  className="bg-slate-50 text-slate-400 px-5 py-2.5 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 transition-all text-sm"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  عنوان المقال
                </label>
                <input className="w-full p-5 border border-slate-100 rounded-[20px] outline-none focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 font-bold transition-all" placeholder="مثلاً: مراجعة كاملة لموقع تيمو..." value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  رابط الصورة (Unsplash)
                </label>
                <input className="w-full p-5 border border-slate-100 rounded-[20px] outline-none focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 font-bold transition-all" placeholder="https://images.unsplash.com/..." value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} required />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  القسم المختار
                </label>
                <select className="w-full p-5 border border-slate-100 rounded-[20px] outline-none focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 font-bold transition-all" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    السعر
                  </label>
                  <input className="w-full p-5 border border-slate-100 rounded-[20px] outline-none focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 font-bold transition-all" type="number" value={newArticle.price || ''} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} required />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    التقييم
                  </label>
                  <input className="w-full p-5 border border-slate-100 rounded-[20px] outline-none focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 font-bold transition-all" type="number" max="5" min="1" step="0.5" value={newArticle.rating || ''} onChange={e => setNewArticle({...newArticle, rating: Number(e.target.value)})} />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  محتوى المقال
                </label>
                <button 
                  type="button"
                  onClick={fixContentWithAI}
                  disabled={isFixing}
                  className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {isFixing ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري التدقيق...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      تصحيح ذكي (AI)
                    </>
                  )}
                </button>
              </div>
              <textarea 
                className="w-full p-8 border border-slate-100 rounded-[32px] h-[500px] outline-none focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 font-medium leading-relaxed text-lg text-slate-700 shadow-inner" 
                placeholder="اكتب المقال هنا... استخدم الأسطر الجديدة لتنظيم الفقرات." 
                value={newArticle.content || ''} 
                onChange={e => setNewArticle({...newArticle, content: e.target.value})} 
                required 
              />
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-[24px] font-black text-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 transform hover:scale-[1.01] active:scale-[0.99]">
              {editingId ? 'حفظ وتثبيت التعديلات' : 'نشر المقال الآن'}
            </button>
          </form>

          <div className="space-y-6">
            <h3 className="font-black text-slate-800 text-2xl px-2">قائمة المقالات المنشورة ({articles.length}):</h3>
            <div className="grid grid-cols-1 gap-6">
              {articles.map(a => (
                <div key={a.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row items-center justify-between hover:shadow-2xl hover:shadow-slate-200/50 transition-all group gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="relative overflow-hidden w-24 h-24 rounded-[20px] shadow-sm">
                      <img src={a.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-xl mb-1">{a.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-emerald-50 px-3 py-1 rounded-full text-emerald-600 font-black uppercase tracking-wider">{a.category}</span>
                        <span className="text-[10px] bg-slate-50 px-3 py-1 rounded-full text-slate-400 font-black italic">{a.price} د.م.</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => {setEditingId(a.id); setNewArticle(a); window.scrollTo({top: 0, behavior: 'smooth'})}} 
                      className="flex-grow md:flex-grow-0 text-emerald-600 bg-emerald-50 px-8 py-4 rounded-2xl font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      تعديل
                    </button>
                    <button 
                      onClick={() => { if(confirm('هل أنت متأكد من حذف المقال؟ لا يمكن التراجع عن هذا الإجراء.')) onUpdateArticles(articles.filter(item => item.id !== a.id)) }} 
                      className="flex-grow md:flex-grow-0 text-red-500 bg-red-50 px-8 py-4 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10 animate-fadeIn max-w-3xl mx-auto mt-10">
          <div>
            <h3 className="text-3xl font-black text-slate-800">إعدادات الهوية</h3>
            <p className="text-slate-400 font-bold text-sm">تحكم في اسم الموقع ووصفه لمحركات البحث</p>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-700 mr-2">اسم الموقع (Branding)</label>
              <input className="w-full p-5 border border-slate-100 rounded-[20px] bg-slate-50/50 outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-700 mr-2">الوصف التعريفي (SEO)</label>
              <textarea className="w-full p-5 border border-slate-100 rounded-[20px] bg-slate-50/50 outline-none focus:ring-4 focus:ring-emerald-500/10 h-32 font-medium" value={localSettings.siteDescription} onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-700 mr-2">رابط الدومين الخاص بك</label>
              <input className="w-full p-5 border border-slate-100 rounded-[20px] bg-slate-50/50 outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم حفظ الإعدادات'); }} className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-xl shadow-xl hover:bg-black transition-all">تحديث الإعدادات</button>
        </div>
      )}

      {tab === 'pixels' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10 animate-fadeIn max-w-3xl mx-auto mt-10">
          <div>
            <h3 className="text-3xl font-black text-slate-800">أدوات التتبع (Pixels)</h3>
            <p className="text-slate-400 font-bold text-sm">أدخل معرفات البكسل لقياس أداء حملاتك الإعلانية</p>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#1877F2] rounded-full"></div>
                Facebook Pixel ID
              </label>
              <input className="w-full p-5 border border-slate-100 rounded-[20px] bg-slate-50/50 outline-none focus:ring-4 focus:ring-[#1877F2]/10 font-mono" placeholder="Ex: 123456789012345" value={localSettings.fbPixel} onChange={e => setLocalSettings({...localSettings, fbPixel: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#EE1D52] rounded-full"></div>
                TikTok Pixel ID
              </label>
              <input className="w-full p-5 border border-slate-100 rounded-[20px] bg-slate-50/50 outline-none focus:ring-4 focus:ring-[#EE1D52]/10 font-mono" placeholder="Ex: CBXXXXXXXXXXXX" value={localSettings.tiktokPixel} onChange={e => setLocalSettings({...localSettings, tiktokPixel: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#4285F4] rounded-full"></div>
                Google Analytics ID
              </label>
              <input className="w-full p-5 border border-slate-100 rounded-[20px] bg-slate-50/50 outline-none focus:ring-4 focus:ring-[#4285F4]/10 font-mono" placeholder="Ex: G-XXXXXXXXXX" value={localSettings.googleAnalytics} onChange={e => setLocalSettings({...localSettings, googleAnalytics: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { onUpdateSettings(localSettings); alert('تم تحديث أكواد التتبع بنجاح'); }} className="w-full bg-emerald-600 text-white py-6 rounded-[24px] font-black text-xl shadow-xl hover:bg-emerald-700 transition-all">حفظ وإطلاق التتبع</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
