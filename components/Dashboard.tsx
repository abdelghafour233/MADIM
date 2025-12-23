
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Article, Settings, Category } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout }) => {
  const [tab, setTab] = useState<'articles' | 'adsense' | 'settings' | 'stats'>('stats');
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({ category: Category.TECH, rating: 5, image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Calculate Stats
  const stats = useMemo(() => {
    const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = articles.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    const totalComments = articles.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0);
    const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

    return {
      totalArticles: articles.length,
      totalViews,
      totalLikes,
      totalComments,
      topArticles
    };
  }, [articles]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      onUpdateSettings(localSettings);
      alert('✅ تم تحديث كافة الإعدادات وكلمة السر بنجاح!');
    } catch (error) {
      alert('❌ حدث خطأ غير متوقع');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.name || !newArticle.content) return alert('يرجى ملء البيانات الأساسية');

    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      likes: editingId ? (articles.find(a => a.id === editingId)?.likes || 0) : 0,
      views: editingId ? (articles.find(a => a.id === editingId)?.views || 100) : 100,
      comments: editingId ? (articles.find(a => a.id === editingId)?.comments || []) : [],
    } as Article;

    if (editingId) {
      onUpdateArticles(articles.map(a => a.id === editingId ? art : a));
    } else {
      onUpdateArticles([art, ...articles]);
    }

    setEditingId(null);
    setNewArticle({ category: Category.TECH, rating: 5, image: '' });
    setEditorMode('write');
    alert('✅ تم حفظ المقال بنجاح');
  };

  const startEditing = (a: Article) => {
    setEditingId(a.id);
    setNewArticle(a);
    setTab('articles');
    setEditorMode('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPreviewContent = (text: string) => {
    if (!text) return <p className="text-slate-300 italic">ابدأ الكتابة لرؤية المعاينة هنا...</p>;
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    return paragraphs.map((para, i) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = para.split(urlRegex);
      return (
        <p key={i} className="mb-6 leading-relaxed text-slate-700 text-lg">
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              return (
                <span key={index} className="block my-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 font-bold text-center break-all">
                  رابط مدمج: {part} 🔗
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-fadeIn">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-3 rounded-[28px] shadow-lg border border-slate-100 sticky top-24 z-40 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setTab('stats')} 
          className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'stats' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          الإحصائيات 📊
        </button>
        <button 
          onClick={() => setTab('articles')} 
          className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'articles' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          المقالات 📝
        </button>
        <button 
          onClick={() => setTab('adsense')} 
          className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'adsense' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          الأرباح 💰
        </button>
        <button 
          onClick={() => setTab('settings')} 
          className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          الإعدادات ⚙️
        </button>
        <button 
          onClick={onLogout} 
          className="mr-auto px-6 py-4 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-colors"
        >
          خروج آمن
        </button>
      </div>

      {tab === 'stats' && (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'إجمالي المشاهدات', val: stats.totalViews.toLocaleString(), icon: '👁️', color: 'bg-blue-50 text-blue-600' },
              { label: 'إجمالي الإعجابات', val: stats.totalLikes.toLocaleString(), icon: '❤️', color: 'bg-rose-50 text-rose-600' },
              { label: 'إجمالي التعليقات', val: stats.totalComments.toLocaleString(), icon: '💬', color: 'bg-amber-50 text-amber-600' },
              { label: 'المقالات المنشورة', val: stats.totalArticles.toLocaleString(), icon: '📑', color: 'bg-emerald-50 text-emerald-600' },
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-50 text-center animate-slideUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm`}>
                  {s.icon}
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">{s.val}</div>
                <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-50">
            <h2 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">📈</span>
              أفضل 5 مقالات أداءً (حسب المشاهدات)
            </h2>
            <div className="space-y-4">
              {stats.topArticles.map((art, idx) => (
                <div key={art.id} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className="text-2xl font-black text-slate-200 w-8">0{idx + 1}</div>
                  <img src={art.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-black text-slate-800 truncate text-lg group-hover:text-emerald-600 transition-colors">{art.name}</h4>
                    <div className="flex gap-4 text-xs font-bold text-slate-400">
                      <span>👁️ {art.views?.toLocaleString()} مشاهدة</span>
                      <span>❤️ {art.likes?.toLocaleString()} إعجاب</span>
                    </div>
                  </div>
                  <button onClick={() => startEditing(art)} className="bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-500 p-3 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="space-y-12">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800">{editingId ? 'تعديل المقال' : 'نشر مقال جديد'}</h2>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setEditorMode('write')}
                  className={`px-6 py-2 rounded-lg font-black text-sm transition-all ${editorMode === 'write' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  تحرير ✏️
                </button>
                <button 
                  onClick={() => setEditorMode('preview')}
                  className={`px-6 py-2 rounded-lg font-black text-sm transition-all ${editorMode === 'preview' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  معاينة 👁️
                </button>
              </div>
            </div>

            <form onSubmit={handleArticleSubmit} className="space-y-6">
              {editorMode === 'write' ? (
                <div className="space-y-6 animate-fadeIn">
                  <input 
                    className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-xl"
                    placeholder="عنوان المقال..."
                    value={newArticle.name || ''}
                    onChange={e => setNewArticle({...newArticle, name: e.target.value})}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select 
                      className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
                      value={newArticle.category}
                      onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}
                    >
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input 
                      className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
                      placeholder="رابط الصورة البارزة"
                      value={newArticle.image || ''}
                      onChange={e => setNewArticle({...newArticle, image: e.target.value})}
                    />
                  </div>
                  <textarea 
                    className="w-full h-96 p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-medium leading-relaxed"
                    placeholder="محتوى المقال... (استخدم السطر الجديد للفصل بين الفقرات)"
                    value={newArticle.content || ''}
                    onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                    required
                  />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="relative h-64 rounded-3xl overflow-hidden mb-8 border border-slate-100">
                    <img src={newArticle.image || 'https://via.placeholder.com/800x400?text=الصورة+البارزة'} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                       <h3 className="text-3xl font-black text-white leading-tight">{newArticle.name || 'عنوان المقال سيظهر هنا'}</h3>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 min-h-[400px]">
                    <div className="mb-6">
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-lg">
                        {newArticle.category}
                      </span>
                    </div>
                    {renderPreviewContent(newArticle.content || '')}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95"
              >
                {editingId ? 'حفظ التغييرات النهائية' : 'نشر المقال الآن'}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
                <img src={a.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-black text-slate-800 truncate mb-2">{a.name}</h4>
                  <div className="flex gap-3">
                    <button onClick={() => startEditing(a)} className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100">تعديل</button>
                    <button onClick={() => {if(confirm('هل تريد حذف هذا المقال نهائياً؟')) onUpdateArticles(articles.filter(i => i.id !== a.id))}} className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'adsense' && (
        <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-50 space-y-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">الأرباح والسكربتات 💰</h2>
            <p className="text-slate-400 font-bold">إدارة أكواد AdSense وملفات الربح.</p>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-slate-700 font-black mr-2">كود Header (AdSense):</label>
              <textarea 
                className="w-full h-48 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm leading-relaxed text-left"
                dir="ltr"
                value={localSettings.adsenseCode}
                onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-slate-700 font-black mr-2">محتوى Ads.txt:</label>
              <textarea 
                className="w-full h-24 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm text-left"
                dir="ltr"
                value={localSettings.adsTxt}
                onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})}
              />
            </div>
            <button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className="w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl bg-slate-900 text-white hover:bg-emerald-600"
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات الإعلانية'}
            </button>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-50">
            <h2 className="text-3xl font-black text-slate-800 mb-10">إعدادات الموقع العامة ⚙️</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">اسم الموقع الظاهر</label>
                <input 
                  className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
                  value={localSettings.siteName}
                  onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">رابط الموقع (Domain)</label>
                <input 
                  className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-left"
                  dir="ltr"
                  value={localSettings.domain}
                  onChange={e => setLocalSettings({...localSettings, domain: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="block text-slate-700 font-black mr-2">وصف الموقع (SEO)</label>
                <textarea 
                  className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-medium h-24"
                  value={localSettings.siteDescription}
                  onChange={e => setLocalSettings({...localSettings, siteDescription: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-rose-50 border-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-800">الأمان والوصول</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">تعديل كلمة مرور الإدارة</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-rose-500 outline-none font-black text-2xl text-center pr-4 pl-20 transition-all"
                    placeholder="أدخل كلمة المرور الجديدة"
                    value={localSettings.dashboardPassword}
                    onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors p-2"
                    title={showPassword ? "إخفاء الرموز" : "إظهار الرموز (رؤية ما أكتب)"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.04m4.533-4.533A10.01 10.01 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-4.225-4.225l-4.225-4.225m4.225 4.225L7 7m3.586 3.586a3 3 0 004.243 4.243" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-400 font-bold px-4 leading-relaxed">
                  💡 اضغط على <span className="text-rose-500 underline">أيقونة العين 👁️</span> باليسار لرؤية كلمة السر بوضوح أثناء الكتابة.
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className={`w-full py-6 rounded-[32px] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-4 ${isSaving ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'}`}
          >
            {isSaving ? 'جاري تحديث البيانات...' : 'حفظ كافة التغييرات النهائية ✅'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
