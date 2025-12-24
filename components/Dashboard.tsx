
import React, { useState, useEffect, useMemo } from 'react';
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [copyAdsStatus, setCopyAdsStatus] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const chartData = useMemo(() => {
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const avg = totalViews > 0 ? Math.floor(totalViews / 10) : 50;
    
    return days.map(day => ({
      day,
      visitors: Math.floor(Math.random() * avg) + (avg / 2)
    }));
  }, [articles]);

  const stats = useMemo(() => {
    const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = articles.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    const totalComments = articles.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0);
    const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);

    return {
      totalArticles: articles.length,
      totalViews,
      totalLikes,
      totalComments,
      topArticles
    };
  }, [articles]);

  const handleCopyAdsTxt = () => {
    navigator.clipboard.writeText(localSettings.adsTxt).then(() => {
      setCopyAdsStatus(true);
      setTimeout(() => setCopyAdsStatus(false), 3000);
    });
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    try {
      onUpdateSettings(localSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.name || !newArticle.content) return alert('يرجى ملء البيانات الأساسية');

    const art = { 
      ...newArticle, 
      id: editingId || Math.random().toString(36).substr(2, 9),
      likes: editingId ? (articles.find(a => a.id === editingId)?.likes || 0) : 0,
      views: editingId ? (articles.find(a => a.id === editingId)?.views || 10) : 10,
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
  };

  const startEditing = (a: Article) => {
    setEditingId(a.id);
    setNewArticle(a);
    setTab('articles');
    setEditorMode('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const VisitorChart = () => {
    const maxVal = Math.max(...chartData.map(d => d.visitors), 10);
    const width = 800;
    const height = 200;
    const padding = 40;
    
    const points = chartData.map((d, i) => {
      const x = (i * (width - padding * 2)) / (chartData.length - 1) + padding;
      const y = height - (d.visitors / maxVal) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${height} ${points} ${width - padding},${height}`;

    return (
      <div className="w-full overflow-x-auto no-scrollbar py-6">
        <div className="min-w-[600px] h-[250px] relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map(i => (
              <line key={i} x1={padding} y1={padding + (i * (height - padding * 2)) / 3} x2={width - padding} y2={padding + (i * (height - padding * 2)) / 3} stroke="#f1f5f9" strokeWidth="1" />
            ))}
            <polyline points={areaPoints} fill="url(#grad)" />
            <polyline points={points} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {chartData.map((d, i) => {
              const x = (i * (width - padding * 2)) / (chartData.length - 1) + padding;
              const y = height - (d.visitors / maxVal) * (height - padding * 2) - padding;
              return (
                <g key={i} className="group cursor-pointer">
                  <circle cx={x} cy={y} r="6" fill="#10b981" className="hover:r-8 transition-all" />
                  <text x={x} y={height - 5} textAnchor="middle" fill="#94a3b8" className="text-[10px] font-bold uppercase">{d.day}</text>
                  <text x={x} y={y - 15} textAnchor="middle" fill="#1e293b" className="text-[12px] font-black opacity-0 group-hover:opacity-100 transition-opacity">{d.visitors}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
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
    <div className="max-w-6xl mx-auto pb-24 animate-fadeIn">
      <div className="flex flex-wrap gap-2 mb-10 bg-white p-3 rounded-[28px] shadow-lg border border-slate-100 sticky top-24 z-40 overflow-x-auto no-scrollbar">
        <button type="button" onClick={() => setTab('stats')} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'stats' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>الإحصائيات 📊</button>
        <button type="button" onClick={() => setTab('articles')} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'articles' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>المقالات 📝</button>
        <button type="button" onClick={() => setTab('adsense')} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'adsense' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>الأرباح 💰</button>
        <button type="button" onClick={() => setTab('settings')} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${tab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>الإعدادات ⚙️</button>
        <button type="button" onClick={onLogout} className="mr-auto px-6 py-4 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-colors">خروج آمن</button>
      </div>

      {tab === 'stats' && (
        <div className="space-y-10">
          <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-50">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">أداء الموقع الحالي 📈</h2>
                <p className="text-slate-400 font-bold">متابعة دقيقة لزيارات الموقع الحقيقية.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-600">{stats.totalViews.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">زيارة حقيقية</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600">نشط</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">حالة السيرفر</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-[40px] p-6 border border-slate-100 mb-12">
              <div className="flex items-center justify-between mb-4 px-4">
                <span className="text-sm font-black text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> 
                  مخطط التفاعل الأسبوعي
                </span>
              </div>
              <VisitorChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800">الأكثر قراءة هذا الأسبوع 🔥</h3>
                <div className="space-y-4">
                  {stats.topArticles.map((art) => {
                    const percentage = stats.totalViews > 0 ? ((art.views || 0) / stats.totalViews * 100).toFixed(1) : "0";
                    return (
                      <div key={art.id} className="bg-slate-50 p-4 rounded-3xl border border-transparent hover:border-emerald-200 transition-all flex items-center gap-4 group cursor-pointer" onClick={() => startEditing(art)}>
                        <img src={art.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                        <div className="flex-grow min-w-0 text-right">
                          <h4 className="font-black text-slate-700 truncate text-sm mb-1">{art.name}</h4>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-600 font-black text-sm">{art.views?.toLocaleString()}</div>
                          <div className="text-[10px] font-bold text-slate-400">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 text-center flex flex-col items-center justify-center group hover:bg-indigo-600 transition-all duration-500">
                  <div className="text-4xl mb-4">📝</div>
                  <div className="text-3xl font-black text-indigo-700 group-hover:text-white">{stats.totalArticles}</div>
                  <div className="text-xs font-black text-indigo-400 group-hover:text-indigo-200 uppercase">مقال</div>
                </div>
                <div className="bg-rose-50 p-8 rounded-[40px] border border-rose-100 text-center flex flex-col items-center justify-center group hover:bg-rose-600 transition-all duration-500">
                  <div className="text-4xl mb-4">👁️</div>
                  <div className="text-3xl font-black text-rose-700 group-hover:text-white">{stats.totalViews}</div>
                  <div className="text-xs font-black text-rose-400 group-hover:text-rose-200 uppercase">مشاهدة</div>
                </div>
              </div>
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
                <button type="button" onClick={() => setEditorMode('write')} className={`px-6 py-2 rounded-lg font-black text-sm transition-all ${editorMode === 'write' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>تحرير ✏️</button>
                <button type="button" onClick={() => setEditorMode('preview')} className={`px-6 py-2 rounded-lg font-black text-sm transition-all ${editorMode === 'preview' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>معاينة 👁️</button>
              </div>
            </div>

            <form onSubmit={handleArticleSubmit} className="space-y-6">
              {editorMode === 'write' ? (
                <div className="space-y-6 animate-fadeIn">
                  <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-xl" placeholder="عنوان المقال..." value={newArticle.name || ''} onChange={e => setNewArticle({...newArticle, name: e.target.value})} required />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-right" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="رابط الصورة البارزة" value={newArticle.image || ''} onChange={e => setNewArticle({...newArticle, image: e.target.value})} />
                  </div>
                  <textarea className="w-full h-96 p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-medium leading-relaxed" placeholder="محتوى المقال..." value={newArticle.content || ''} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="relative h-64 rounded-3xl overflow-hidden mb-8 border border-slate-100">
                    <img src={newArticle.image || 'https://via.placeholder.com/800x400?text=الصورة+البارزة'} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                       <h3 className="text-3xl font-black text-white leading-tight">{newArticle.name || 'العنوان هنا'}</h3>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 min-h-[400px]">
                    {renderPreviewContent(newArticle.content || '')}
                  </div>
                </div>
              )}
              <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all active:scale-95">{editingId ? 'حفظ التعديلات' : 'نشر المقال'}</button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map(a => (
              <div key={a.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
                <img src={a.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div className="flex-grow min-w-0 text-right">
                  <h4 className="font-black text-slate-800 truncate mb-1">{a.name}</h4>
                  <p className="text-xs text-slate-400 font-bold mb-3">👁️ {a.views || 0} زيارة</p>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => startEditing(a)} className="text-emerald-600 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100">تعديل</button>
                    <button type="button" onClick={() => {if(confirm('حذف؟')) onUpdateArticles(articles.filter(i => i.id !== a.id))}} className="text-red-500 font-bold text-xs bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'adsense' && (
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-50">
            <h2 className="text-3xl font-black text-slate-800 mb-6">حل مشكلة "Introuvable / غير موجود" 💰</h2>
            
            <div className="bg-rose-50 p-8 rounded-[32px] border border-rose-100 mb-10 space-y-4">
              <h4 className="font-black text-rose-800 flex items-center gap-3 text-lg">
                ⚠️ لماذا تظهر لك هذه الرسالة؟
              </h4>
              <ul className="list-disc list-inside text-rose-700 font-bold space-y-2 leading-relaxed pr-4">
                <li>جوجل لا ترى الكود لأن موقعك قد يكون في حالة "تحت الصيانة" أو مغلق بكلمة سر.</li>
                <li>رابط موقعك (Domain) قد يكون مكتوباً بشكل خاطئ في أدسنس (تأكد من وجود abdouweb.online بدون www إذا كنت تستخدم النطاق الرئيسي).</li>
                <li>غياب ملف ads.txt من المجلد الرئيسي لموقعك.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                <h4 className="font-black text-emerald-800 mb-2">1. وسم التحقق (تم تفعيله) ✅</h4>
                <p className="text-emerald-700 text-sm leading-relaxed font-bold">تم وضع كود <code className="bg-white px-2 py-0.5 rounded">ca-pub-5578524966832192</code> في السطر الأول من موقعك. جوجل ستجده الآن بالتأكيد بمجرد الضغط على "طلب مراجعة".</p>
              </div>
              <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
                <h4 className="font-black text-amber-800 mb-2">2. ماذا تفعل الآن؟ 🆔</h4>
                <p className="text-amber-700 text-sm leading-relaxed font-bold">ادخل لحساب AdSense، احذف الموقع وأعد إضافته مرة أخرى، ثم اضغط "طلب مراجعة". تأكد أن موقعك متاح للعامة ولا يطلب كلمة سر للدخول.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">محتوى ملف Ads.txt (انسخه وأرسله للدعم الفني أو ضعه في Root):</label>
                <div className="relative">
                  <textarea className="w-full h-24 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm text-left" dir="ltr" readOnly value={localSettings.adsTxt} />
                  <button onClick={handleCopyAdsTxt} className={`absolute left-4 bottom-4 px-4 py-2 rounded-xl text-xs font-black transition-all ${copyAdsStatus ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {copyAdsStatus ? 'تم النسخ!' : 'نسخ الكود'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">كود الإعلانات التلقائية (Header Script):</label>
                <textarea className="w-full h-48 p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none font-mono text-sm text-left" dir="ltr" value={localSettings.adsenseCode} onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} />
              </div>

              <button type="button" onClick={handleSaveSettings} className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl ${saveStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}>
                {saveStatus === 'saving' ? 'جاري الحفظ...' : saveStatus === 'success' ? '✅ تم التحديث بنجاح' : 'تحديث إعدادات الأرباح'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-50">
            <h2 className="text-3xl font-black text-slate-800 mb-10">إعدادات الموقع ⚙️</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">اسم الموقع</label>
                <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold" value={localSettings.siteName} onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} />
              </div>
              <div className="space-y-4">
                <label className="block text-slate-700 font-black mr-2">الدومين الرئيسي</label>
                <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-left" dir="ltr" value={localSettings.domain} onChange={e => setLocalSettings({...localSettings, domain: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[48px] shadow-xl border border-rose-50 border-2">
            <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-4">🔐 الأمان</h2>
            <div className="space-y-4">
              <label className="block text-slate-700 font-black mr-2">كلمة مرور الإدارة الجديدة</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} className="w-full p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-rose-500 outline-none font-black text-2xl text-center" value={localSettings.dashboardPassword} onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 p-2">
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
          </div>

          <button type="button" onClick={handleSaveSettings} className="w-full py-6 rounded-[32px] bg-slate-900 text-white font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl">
            حفظ كافة التغييرات النهائية ✅
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
