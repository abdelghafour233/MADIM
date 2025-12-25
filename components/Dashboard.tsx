
import React, { useState } from 'react';
import { Article, Settings, Category } from '../types.ts';

interface DashboardProps {
  articles: Article[];
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onUpdateArticles: (a: Article[]) => void;
  onLogout: () => void;
  onPreviewArticle: (a: Article) => void; // وظيفة جديدة للمعاينة
}

const Dashboard: React.FC<DashboardProps> = ({ articles, settings, onUpdateSettings, onUpdateArticles, onLogout, onPreviewArticle }) => {
  const [tab, setTab] = useState<'articles' | 'ads' | 'new-article'>('articles');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  
  // حالات المقال الجديد للمعاينة الحية
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200');
  const [newCategory, setNewCategory] = useState<Category>(Category.TECH);

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert('✅ تم حفظ كافة الإعدادات بنجاح!');
  };

  const handleDeleteArticle = (id: string) => {
    if(window.confirm('هل أنت متأكد من رغبتك في حذف هذا المقال؟')) {
      onUpdateArticles(articles.filter(a => a.id !== id));
    }
  };

  const handlePublish = () => {
    if(!newTitle || !newContent) {
        alert('الرجاء ملء العنوان والمحتوى!');
        return;
    }
    const newArt: Article = {
        id: Date.now().toString(),
        name: newTitle,
        content: newContent,
        image: newImage,
        category: newCategory,
        rating: 5,
        views: 0,
        author: 'المدير',
        date: new Date().toLocaleDateString('ar-MA')
    };
    onUpdateArticles([newArt, ...articles]);
    alert('🚀 تم نشر المقال بنجاح!');
    setTab('articles');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 animate-fadeIn" dir="rtl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">🚀</div>
          <div>
            <h2 className="text-3xl font-black">لوحة القيادة</h2>
            <p className="text-slate-400 font-bold">مرحباً بك مجدداً في نظام إدارة عبدو ويب</p>
          </div>
        </div>
        <button onClick={onLogout} className="px-10 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-colors border border-red-200 shadow-sm">تسجيل الخروج</button>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        <button onClick={() => setTab('articles')} className={`px-10 py-5 rounded-2xl font-black text-lg transition-all ${tab === 'articles' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}>📦 المقالات</button>
        <button onClick={() => setTab('ads')} className={`px-10 py-5 rounded-2xl font-black text-lg transition-all ${tab === 'ads' ? 'bg-orange-600 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}>💰 الإعلانات</button>
        <button onClick={() => setTab('new-article')} className={`px-10 py-5 rounded-2xl font-black text-lg transition-all ${tab === 'new-article' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}>✍️ مقال جديد</button>
      </div>

      {tab === 'ads' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl space-y-8 border border-slate-100 dark:border-slate-800">
            <h3 className="text-2xl font-black text-orange-600 border-b pb-4 mb-8">إعدادات AdSense</h3>
            <div>
              <label className="block font-black mb-4 text-slate-500">رقم تعريف الناشر</label>
              <input 
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-mono text-emerald-600 border-2 border-transparent focus:border-emerald-500 transition-all" 
                value={localSettings.adsenseCode} 
                onChange={e => setLocalSettings({...localSettings, adsenseCode: e.target.value})} 
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block font-black mb-4 text-slate-500">محتوى ملف Ads.txt</label>
              <textarea 
                className="w-full h-40 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-mono text-xs text-slate-500 border-2 border-transparent focus:border-emerald-500 transition-all" 
                value={localSettings.adsTxt} 
                onChange={e => setLocalSettings({...localSettings, adsTxt: e.target.value})} 
              />
            </div>
            <button onClick={handleSaveSettings} className="w-full py-6 bg-slate-900 text-white rounded-[30px] font-black text-xl hover:bg-emerald-600 transition-all shadow-xl">تحديث الإعدادات 💾</button>
          </div>
        </div>
      )}

      {tab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map(a => (
            <div key={a.id} className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 truncate">
                <img src={a.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                <div className="truncate">
                  <span className="font-black text-lg block truncate">{a.name}</span>
                  <span className="text-xs font-bold text-slate-400">{a.category} • {a.views} مشاهدة</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onPreviewArticle(a)}
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  title="معاينة"
                >👁️</button>
                <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">✏️</button>
                <button onClick={() => handleDeleteArticle(a.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">🗑️</button>
              </div>
            </div>
          ))}
          <div 
            onClick={() => setTab('new-article')}
            className="p-10 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[35px] text-center font-black text-slate-400 cursor-pointer hover:border-emerald-500/50 hover:text-emerald-500 transition-all group"
          >
            <span className="text-4xl block mb-4 group-hover:scale-125 transition-transform">➕</span>
            إضافة مقال جديد
          </div>
        </div>
      )}

      {tab === 'new-article' && (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-3xl font-black mb-10 text-emerald-600">كتابة مقال جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                    <label className="block font-black mb-3 text-slate-500">عنوان المقال</label>
                    <input 
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-lg" 
                        placeholder="اكتب عنواناً جذاباً..." 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    </div>
                    <div>
                    <label className="block font-black mb-3 text-slate-500">القسم</label>
                    <select 
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as Category)}
                    >
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    </div>
                    <div>
                    <label className="block font-black mb-3 text-slate-500">رابط الصورة (URL)</label>
                    <input 
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-mono text-sm" 
                        placeholder="https://..." 
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                    />
                    </div>
                </div>
                <div>
                    <label className="block font-black mb-3 text-slate-500">محتوى المقال</label>
                    <textarea 
                        className="w-full h-[340px] p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none resize-none leading-relaxed" 
                        placeholder="ابدأ بكتابة المحتوى هنا..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    ></textarea>
                </div>
            </div>
            <button 
                onClick={handlePublish}
                className="w-full mt-10 py-6 bg-emerald-600 text-white rounded-[30px] font-black text-2xl shadow-xl hover:bg-emerald-700 transition-all"
            >نشر المقال فوراً 🚀</button>
            </div>

            {/* قسم المعاينة الحية (العين) */}
            <div className="bg-slate-100 dark:bg-slate-800/50 p-10 rounded-[50px] border-2 border-dashed border-slate-300 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">👁️</span>
                    <h3 className="text-2xl font-black">المعاينة الحية</h3>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-sm">
                    <img src={newImage} className="w-full h-48 object-cover" alt="Preview" />
                    <div className="p-8">
                        <span className="text-emerald-500 font-bold text-xs">{newCategory}</span>
                        <h4 className="text-2xl font-black mt-2 mb-4">{newTitle || 'عنوان المقال سيظهر هنا'}</h4>
                        <p className="text-slate-500 line-clamp-3 leading-relaxed whitespace-pre-line">
                            {newContent || 'محتوى المقال سيظهر هنا أثناء الكتابة...'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
