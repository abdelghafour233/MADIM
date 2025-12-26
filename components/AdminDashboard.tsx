
import React, { useState } from 'react';
import { Article, Category, Settings } from '../types';

interface AdminProps {
  posts: Article[];
  settings: Settings;
  onUpdate: (posts: Article[]) => void;
  onUpdateSettings: (settings: Settings) => void;
  onLogout: () => void;
  darkMode?: boolean;
}

type AdminTab = 'list' | 'editor' | 'ads' | 'security';

const AdminDashboard: React.FC<AdminProps> = ({ posts, settings, onUpdate, onUpdateSettings, onLogout, darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState<Partial<Article>>({
    title: '', excerpt: '', content: '', image: '', category: Category.TECH, author: 'عبدو التقني'
  });

  const handleSavePost = () => {
    if (!form.title || !form.content) return alert('يرجى كتابة العنوان والمحتوى!');
    
    if (editingPostId) {
      const updatedPosts = posts.map(p => p.id === editingPostId ? { ...p, ...form as Article } : p);
      onUpdate(updatedPosts);
      alert('تم تحديث المقال بنجاح! ✏️');
    } else {
      const p: Article = {
        ...form as Article,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ar-MA'),
        views: 0
      };
      onUpdate([p, ...posts]);
      alert('تم نشر المقال بنجاح! 🎊');
    }
    
    resetForm();
    setActiveTab('list');
  };

  const handleEditClick = (p: Article) => {
    setEditingPostId(p.id);
    setForm({
      title: p.title || p.name,
      excerpt: p.excerpt,
      content: p.content,
      image: p.image,
      category: p.category,
      author: p.author
    });
    setActiveTab('editor');
  };

  const resetForm = () => {
    setEditingPostId(null);
    setForm({ title: '', excerpt: '', content: '', image: '', category: Category.TECH, author: 'عبدو التقني' });
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح! ✅');
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
      <div className={`p-6 md:p-10 rounded-[30px] md:rounded-[40px] mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-center gap-6 transition-all ${darkMode ? 'glass' : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50'}`}>
        <div className="text-center md:text-right">
          <h2 className={`text-2xl md:text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>لوحة التحكم</h2>
          <p className={`font-bold text-[10px] md:text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>إدارة المحتوى لـ {settings.siteName}</p>
        </div>
        <button onClick={onLogout} className="w-full md:w-auto px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl font-black text-xs md:text-sm hover:bg-red-600 hover:text-white transition-all">تسجيل الخروج</button>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-10">
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm transition-all ${activeTab === 'list' ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm')}`}
        >
          📝 المقالات
        </button>
        <button 
          onClick={() => { resetForm(); setActiveTab('editor'); }}
          className={`flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm transition-all ${activeTab === 'editor' && !editingPostId ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm')}`}
        >
          ➕ جديد
        </button>
        <button 
          onClick={() => setActiveTab('ads')}
          className={`flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm transition-all ${activeTab === 'ads' ? 'bg-orange-500 text-white shadow-lg' : (darkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm')}`}
        >
          💰 إعلانات
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg' : (darkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm')}`}
        >
          🔑 أمان
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="space-y-4 md:space-y-6 animate-fadeIn">
          <h3 className={`text-xl md:text-2xl font-black mb-4 md:mb-8 px-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>أرشيف المحتوى ({posts.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {posts.map(p => (
              <div key={p.id} className={`p-4 md:p-6 rounded-[25px] md:rounded-[35px] flex items-center justify-between group transition-all border ${darkMode ? 'glass border-transparent hover:border-emerald-500/30' : 'bg-white border-slate-100 shadow-sm hover:border-emerald-200'}`}>
                <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
                  <img src={p.image} className="w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-2xl object-cover shadow-lg flex-shrink-0" alt="" />
                  <div className="truncate">
                    <h4 className={`font-black text-sm md:text-lg line-clamp-1 group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{p.title || p.name}</h4>
                    <p className={`text-[8px] md:text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{p.category} • {p.views} مشاهدة</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(p)} className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-blue-600/10 text-blue-500 rounded-lg md:rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-xs md:text-base">✏️</button>
                  <button onClick={() => {if(confirm('هل أنت متأكد؟')) onUpdate(posts.filter(item => item.id !== p.id))}} className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-red-600/10 text-red-500 rounded-lg md:rounded-2xl hover:bg-red-600 hover:text-white transition-all text-xs md:text-base">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'editor' && (
        <div className={`p-6 md:p-10 rounded-[30px] md:rounded-[50px] space-y-4 md:space-y-6 animate-fadeIn transition-all ${darkMode ? 'glass' : 'bg-white border border-slate-100 shadow-xl'}`}>
          <h3 className={`text-xl md:text-2xl font-black mb-4 md:mb-8 border-b pb-4 ${darkMode ? 'border-white/5' : 'border-slate-100 text-slate-800'}`}>
            {editingPostId ? 'تعديل المقال✍️' : 'كتابة مقال جديد ✍️'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6">
              <input 
                className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-bold border-2 transition-all text-sm md:text-base ${darkMode ? 'bg-black/40 border-transparent focus:border-emerald-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-500 text-slate-800'}`} 
                placeholder="عنوان المقال..." 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
              />
              <textarea 
                className={`w-full h-24 md:h-32 p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-bold resize-none border-2 transition-all text-sm md:text-base ${darkMode ? 'bg-black/40 border-transparent' : 'bg-slate-50 border-slate-100 text-slate-800'}`} 
                placeholder="وصف موجز..." 
                value={form.excerpt} 
                onChange={e => setForm({...form, excerpt: e.target.value})} 
              />
              <input 
                className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-bold border-2 transition-all text-sm md:text-base ${darkMode ? 'bg-black/40 border-transparent' : 'bg-slate-50 border-slate-100 text-slate-800'}`} 
                placeholder="رابط الصورة..." 
                value={form.image} 
                onChange={e => setForm({...form, image: e.target.value})} 
              />
            </div>
            <div className="space-y-4 md:space-y-6">
              <select 
                className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-bold cursor-pointer border-2 transition-all text-sm md:text-base ${darkMode ? 'bg-black/40 border-transparent' : 'bg-slate-50 border-slate-100 text-slate-800'}`} 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value as Category})}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea 
                className={`w-full h-48 md:h-80 p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-medium leading-relaxed border-2 transition-all text-sm md:text-base ${darkMode ? 'bg-black/40 border-transparent' : 'bg-slate-50 border-slate-100 text-slate-800'}`} 
                placeholder="المحتوى..." 
                value={form.content} 
                onChange={e => setForm({...form, content: e.target.value})} 
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-6">
            <button onClick={handleSavePost} className="flex-grow py-4 md:py-6 bg-emerald-600 text-white rounded-[20px] md:rounded-[30px] font-black text-lg md:text-2xl shadow-xl shadow-emerald-600/10 hover:bg-emerald-500 transition-all">
              {editingPostId ? 'تحديث' : 'نشر'} 🚀
            </button>
            {editingPostId && (
              <button onClick={resetForm} className="py-4 md:py-6 md:px-10 bg-slate-500 text-white rounded-[20px] md:rounded-[30px] font-black text-sm md:text-xl hover:bg-slate-600 transition-all">إلغاء</button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className={`p-6 md:p-10 rounded-[30px] md:rounded-[50px] space-y-6 md:space-y-8 animate-fadeIn transition-all max-w-2xl mx-auto ${darkMode ? 'glass' : 'bg-white border border-slate-100 shadow-xl'}`}>
          <div className="text-center mb-6 md:mb-10">
            <span className="text-4xl md:text-6xl mb-4 md:mb-6 block">💰</span>
            <h3 className={`text-2xl md:text-3xl font-black mb-2 md:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>إعدادات AdSense</h3>
          </div>
          <div className="space-y-4 md:space-y-6">
            <input 
              className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-bold border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500 text-slate-800'}`} 
              placeholder="اسم الموقع..." 
              value={localSettings.siteName} 
              onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} 
            />
            <input 
              className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-bold border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500 text-slate-800'}`} 
              placeholder="ca-pub-..." 
              value={localSettings.adsenseCode} 
              onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} 
            />
            <button onClick={handleSaveSettings} className="w-full py-4 md:py-6 bg-orange-500 text-white rounded-[20px] md:rounded-[30px] font-black text-sm md:text-xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all">
              حفظ 💾
            </button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className={`p-6 md:p-10 rounded-[30px] md:rounded-[50px] space-y-6 md:space-y-8 animate-fadeIn transition-all max-w-2xl mx-auto ${darkMode ? 'glass' : 'bg-white border border-slate-100 shadow-xl'}`}>
          <div className="text-center mb-6 md:mb-10">
            <span className="text-4xl md:text-6xl mb-4 md:mb-6 block">🔐</span>
            <h3 className={`text-2xl md:text-3xl font-black mb-2 md:mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>الأمان</h3>
          </div>
          <div className="space-y-4 md:space-y-6">
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"}
                className={`w-full p-4 md:p-5 pr-14 rounded-xl md:rounded-2xl outline-none font-bold border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-blue-500 text-slate-800'}`} 
                placeholder="كلمة مرور جديدة..." 
                value={localSettings.dashboardPassword} 
                onChange={e => setLocalSettings({...localSettings, dashboardPassword: e.target.value})} 
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-slate-500"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            <button onClick={handleSaveSettings} className="w-full py-4 md:py-6 bg-blue-600 text-white rounded-[20px] md:rounded-[30px] font-black text-sm md:text-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
              تثبيت 🔒
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
