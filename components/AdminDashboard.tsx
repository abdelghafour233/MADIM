
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

type AdminTab = 'list' | 'editor' | 'ads';

const AdminDashboard: React.FC<AdminProps> = ({ posts, settings, onUpdate, onUpdateSettings, onLogout, darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const [form, setForm] = useState<Partial<Article>>({
    title: '', excerpt: '', content: '', image: '', category: Category.TECH, author: 'عبدو التقني'
  });

  const handleSavePost = () => {
    if (!form.title || !form.content) return alert('يرجى كتابة العنوان والمحتوى!');
    
    if (editingPostId) {
      // تعديل مقال موجود
      const updatedPosts = posts.map(p => p.id === editingPostId ? { ...p, ...form as Article } : p);
      onUpdate(updatedPosts);
      alert('تم تحديث المقال بنجاح! ✏️');
    } else {
      // إضافة مقال جديد
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
    alert('تم حفظ الإعدادات بنجاح! 💰');
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
      <div className={`p-8 md:p-10 rounded-[40px] mb-12 flex flex-col md:flex-row justify-between items-center gap-6 transition-all ${darkMode ? 'glass' : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50'}`}>
        <div className="text-center md:text-right">
          <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>لوحة التحكم</h2>
          <p className={`font-bold text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>إدارة المحتوى والإعلانات لـ {settings.siteName}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onLogout} className="px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all">تسجيل الخروج</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button 
          onClick={() => setActiveTab('list')}
          className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'list' ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm')}`}
        >
          📝 المقالات
        </button>
        <button 
          onClick={() => { resetForm(); setActiveTab('editor'); }}
          className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'editor' && !editingPostId ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm')}`}
        >
          ➕ مقال جديد
        </button>
        <button 
          onClick={() => setActiveTab('ads')}
          className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'ads' ? 'bg-orange-500 text-white shadow-lg' : (darkMode ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm')}`}
        >
          💰 إعلانات أدسنس
        </button>
      </div>

      {/* Articles List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className={`text-2xl font-black mb-8 px-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>أرشيف المحتوى ({posts.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(p => (
              <div key={p.id} className={`p-6 rounded-[35px] flex items-center justify-between group transition-all border ${darkMode ? 'glass border-transparent hover:border-emerald-500/30' : 'bg-white border-slate-100 shadow-sm hover:border-emerald-200'}`}>
                <div className="flex items-center gap-6 overflow-hidden">
                  <img src={p.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg flex-shrink-0" alt="" />
                  <div className="truncate">
                    <h4 className={`font-black text-lg line-clamp-1 group-hover:text-emerald-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{p.title || p.name}</h4>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{p.category} • {p.views} مشاهدة</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(p)} className="w-12 h-12 flex items-center justify-center bg-blue-600/10 text-blue-500 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">✏️</button>
                  <button onClick={() => onUpdate(posts.filter(item => item.id !== p.id))} className="w-12 h-12 flex items-center justify-center bg-red-600/10 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Tab (Add/Edit) */}
      {activeTab === 'editor' && (
        <div className={`p-10 rounded-[50px] space-y-6 animate-fadeIn transition-all ${darkMode ? 'glass' : 'bg-white border border-slate-100 shadow-xl'}`}>
          <h3 className={`text-2xl font-black mb-8 border-b pb-4 ${darkMode ? 'border-white/5' : 'border-slate-100 text-slate-800'}`}>
            {editingPostId ? 'تعديل المقال الحالي ✍️' : 'كتابة مقال جديد ✍️'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <label className="block text-sm font-bold opacity-60 mr-2">العنوان</label>
              <input 
                className={`w-full p-5 rounded-2xl outline-none font-bold border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent focus:border-emerald-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-500 text-slate-800'}`} 
                placeholder="عنوان المقال..." 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
              />
              
              <label className="block text-sm font-bold opacity-60 mr-2">وصف قصير</label>
              <textarea 
                className={`w-full h-32 p-5 rounded-2xl outline-none font-bold resize-none border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent' : 'bg-slate-50 border-slate-100 text-slate-800'}`} 
                placeholder="وصف موجز يظهر في الرئيسية..." 
                value={form.excerpt} 
                onChange={e => setForm({...form, excerpt: e.target.value})} 
              />

              <label className="block text-sm font-bold opacity-60 mr-2">رابط الصورة</label>
              <input 
                className={`w-full p-5 rounded-2xl outline-none font-bold border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent' : 'bg-slate-50 border-slate-100 text-slate-800'}`} 
                placeholder="رابط الصورة المباشر..." 
                value={form.image} 
                onChange={e => setForm({...form, image: e.target.value})} 
              />
            </div>

            <div className="space-y-6">
              <label className="block text-sm font-bold opacity-60 mr-2">التصنيف</label>
              <select 
                className={`w-full p-5 rounded-2xl outline-none font-bold cursor-pointer border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent' : 'bg-slate-50 border-slate-100 text-slate-800'}`} 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value as Category})}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label className="block text-sm font-bold opacity-60 mr-2">المحتوى الكامل</label>
              <textarea 
                className={`w-full h-80 p-5 rounded-2xl outline-none font-medium leading-relaxed border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent' : 'bg-slate-50 border-slate-100 text-slate-800'}`} 
                placeholder="اكتب تفاصيل المقال هنا..." 
                value={form.content} 
                onChange={e => setForm({...form, content: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="flex gap-4 pt-6">
            <button onClick={handleSavePost} className="flex-grow py-6 bg-emerald-600 text-white rounded-[30px] font-black text-2xl shadow-xl shadow-emerald-600/10 hover:bg-emerald-500 transition-all">
              {editingPostId ? 'تحديث المقال الآن' : 'نشر المقال الآن'} 🚀
            </button>
            {editingPostId && (
              <button onClick={resetForm} className="px-10 py-6 bg-slate-500 text-white rounded-[30px] font-black text-xl hover:bg-slate-600 transition-all">إلغاء</button>
            )}
          </div>
        </div>
      )}

      {/* AdSense Settings Tab */}
      {activeTab === 'ads' && (
        <div className={`p-10 rounded-[50px] space-y-8 animate-fadeIn transition-all max-w-2xl mx-auto ${darkMode ? 'glass' : 'bg-white border border-slate-100 shadow-xl'}`}>
          <div className="text-center mb-10">
            <span className="text-6xl mb-6 block">💰</span>
            <h3 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>إعدادات Google AdSense</h3>
            <p className="opacity-60 font-bold">تحكم في إعلانات الموقع من مكان واحد</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold opacity-60 mr-2">اسم الموقع</label>
              <input 
                className={`w-full p-5 rounded-2xl outline-none font-bold border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500 text-slate-800'}`} 
                placeholder="مثال: عبدو ويب" 
                value={localSettings.siteName} 
                onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold opacity-60 mr-2">معرف الناشر (Publisher ID)</label>
              <input 
                className={`w-full p-5 rounded-2xl outline-none font-bold border-2 transition-all ${darkMode ? 'bg-black/40 border-transparent focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500 text-slate-800'}`} 
                placeholder="ca-pub-xxxxxxxxxxxxxxxx" 
                value={localSettings.adsenseCode} 
                onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} 
              />
              <p className="text-xs opacity-50 px-2 font-bold mt-2">سيتم تطبيق هذا الكود على جميع وحدات الإعلانات في الموقع تلقائياً.</p>
            </div>

            <button onClick={handleSaveSettings} className="w-full py-6 bg-orange-500 text-white rounded-[30px] font-black text-xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all">
              حفظ الإعدادات 💾
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
