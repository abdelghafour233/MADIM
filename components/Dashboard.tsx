
import React, { useState, useEffect, useRef } from 'react';
import { Article, Settings, Category } from '../types.ts';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_ARTICLES } from '../constants.tsx';

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
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.REVIEWS, rating: 5, image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    setLocalSettings(settings); 
  }, [settings]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('الصورة كبيرة جداً! يرجى اختيار صورة أقل من 2 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewArticle(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSettings = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    onUpdateSettings(localSettings);
    setIsSaving(false);
    alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.image) {
      alert('يرجى تحميل صورة للمقال أولاً');
      return;
    }

    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      rating: newArticle.rating || 5
    } as Article;

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? art : a));
      alert('✅ تم تصحيح وتحديث المقال بنجاح');
    } else {
      onUpdateArticles([art, ...articles]);
      alert('✅ تم نشر المقال الجديد بنجاح');
    }

    setNewArticle({ category: Category.REVIEWS, rating: 5, image: '' });
    setEditingId(null);
  };

  const startEditing = (article: Article) => {
    setEditingId(article.id);
    setNewArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fixWithAI = async () => {
    if (!newArticle.content) return alert('اكتب مسودة المقال أولاً');
    setIsFixing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أنت خبير SEO مغربي، أعد صياغة هذا المقال ليكون احترافياً وجذاباً جداً مع الحفاظ على الروابط الموجودة فيه: ${newArticle.content}`,
      });
      if (response.text) setNewArticle(prev => ({ ...prev, content: response.text }));
    } catch (e) {
      alert('فشل الاتصال بنظام التحسين');
    } finally { setIsFixing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-3 rounded-[28px] shadow-sm sticky top-24 z-40 border border-slate-100 overflow-x-auto no-scrollbar">
        {[
          { id: 'articles', label: 'إدارة وتصحيح المقالات 📝' },
          { id: 'monetization', label: 'الأرباح 💰' },
          { id: 'settings', label: 'الإعدادات العامة ⚙️' }
        ].map(t => (
          <button 
            key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={onLogout} className="mr-auto px-6 py-3 text-red-500 font-black">خروج</button>
      </div>

      {tab === 'articles' && (
        <div className="space-y-12">
          <div className={`transition-all duration-500 p-8 md:p-12 rounded-[48px] border-2 ${editingId ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-50 shadow-2xl'}`}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-800">
                {editingId ? '🛠️ جارٍ تصحيح المقال الآن' : '🚀 نشر مقال جديد'}
              </h2>
              {editingId && (
                <button 
                  onClick={() => {setEditingId(null); setNewArticle({category: Category.REVIEWS, rating: 5, image: ''});}}
                  className="bg-white text-slate-500 px-4 py-2 rounded-xl font-bold border hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>

            <form onSubmit={handleArticleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-black text-slate-400 mb-2 mr-2">عنوان المقال</label>
                    <input 
                      className="w-full p-5 bg-slate-50 rounded-3xl font-black text-xl outline-none border-2 border-transparent focus:border-emerald-500/20 transition-all"
                      value={newArticle.name || ''}
                      onChange={e => setNewArticle({...newArticle, name: e.target.value})}
                      placeholder="مثلاً: مراجعة جاكيط تيمو الجديدة..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-slate-400 mb-2 mr-2">القسم</label>
                      <select 
                        className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500/20"
                        value={newArticle.category}
                        onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}
                      >
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-400 mb-2 mr-2">رابط صورة (اختياري)</label>
                      <input 
                        className="w-full p-5 bg-slate-50 rounded-2xl font-medium outline-none border-2 border-transparent focus:border-emerald-500/20"
                        value={newArticle.image && !newArticle.image.startsWith('data:') ? newArticle.image : ''}
                        onChange={e => setNewArticle({...newArticle, image: e.target.value})}
                        placeholder="أو ضع رابط URL مباشر هنا"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="block text-sm font-black text-slate-400 mb-2 mr-2">صورة المقال</label>
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative w-full h-[220px] bg-slate-50 border-4 border-dashed border-slate-200 rounded-[32px] overflow-hidden cursor-pointer hover:border-emerald-400 transition-all flex flex-col items-center justify-center gap-2"
                   >
                     {newArticle.image ? (
                       <>
                        <img src={newArticle.image} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black">
                          تغيير الصورة 📷
                        </div>
                       </>
                     ) : (
                       <>
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs font-black text-slate-400">إضغط لتحميل صورة من جهازك</p>
                       </>
                     )}
                   </div>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-sm font-black text-slate-400">محتوى المقال (وصف المنتج، المراجعة، الروابط)</label>
                  <button 
                    type="button" 
                    onClick={fixWithAI}
                    className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-xs hover:bg-emerald-100 transition-all flex items-center gap-2"
                  >
                    {isFixing ? 'جاري المراجعة...' : 'تحسين وتنسيق المحتوى ✨'}
                  </button>
                </div>
                <textarea 
                  className="w-full h-80 p-8 bg-slate-50 rounded-[40px] outline-none border-2 border-transparent focus:border-emerald-500/20 font-medium leading-relaxed text-lg"
                  value={newArticle.content || ''}
                  onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                  placeholder="اكتب هنا.. الروابط سيتم تحويلها لأزرار شراء تلقائياً."
                  required
                />
              </div>

              <button 
                type="submit"
                className={`w-full py-6 rounded-[28px] font-black text-2xl shadow-xl transition-all active:scale-[0.98] text-white ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}
              >
                {editingId ? 'حفظ التصحيحات الآن ✅' : 'نشر المقال فوراً 🚀'}
              </button>
            </form>
          </div>

          <div className="space-y-8">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-2xl font-black text-slate-800">المقالات المنشورة ({articles.length})</h3>
                <p className="text-sm font-bold text-slate-400">اضغط على "تعديل" لتصحيح أي مقال أعلاه</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(a => (
                  <div key={a.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                      <img src={a.image} className="w-full h-full object-cover" alt="" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200'} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-black text-slate-800 truncate mb-1">{a.name}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-black uppercase">{a.category}</span>
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => startEditing(a)}
                          className="flex-1 bg-emerald-50 text-emerald-600 py-2.5 rounded-xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          تعديل وتصحيح
                        </button>
                        <button 
                          onClick={() => {if(confirm('حذف نهائي؟')) onUpdateArticles(articles.filter(i => i.id !== a.id))}}
                          className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {tab === 'monetization' && (
        <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-slate-50 animate-fadeIn">
          <h3 className="text-3xl font-black text-slate-800 mb-8">إعدادات الأرباح 💰</h3>
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400">Publisher ID (AdSense)</label>
              <input 
                className="w-full p-5 bg-slate-50 rounded-2xl font-mono"
                value={localSettings.adsTxt.match(/pub-\d+/)?.[0] || ''}
                onChange={e => {
                  const id = e.target.value.startsWith('pub-') ? e.target.value : `pub-${e.target.value.replace(/\D/g, '')}`;
                  setLocalSettings({...localSettings, adsTxt: `google.com, ${id}, DIRECT, f08c47fec0942fa0`});
                }}
              />
            </div>
            <button onClick={handleUpdateSettings} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all">
              {isSaving ? 'جاري الحفظ...' : 'تحديث كود الإعلانات'}
            </button>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-slate-50 animate-fadeIn">
          <h3 className="text-3xl font-black text-slate-800 mb-8">هوية الموقع ⚙️</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400">اسم الموقع</label>
              <input className="w-full p-5 bg-slate-50 rounded-2xl outline-none" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400">الدومين</label>
              <input className="w-full p-5 bg-slate-50 rounded-2xl outline-none" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
            </div>
          </div>
          <button onClick={handleUpdateSettings} className="mt-8 bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black">حفظ التعديلات</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
