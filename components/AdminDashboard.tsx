
import React, { useState } from 'react';
import { Article, Category } from '../types';

interface AdminProps {
  posts: Article[];
  onUpdate: (posts: Article[]) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminProps> = ({ posts, onUpdate, onLogout }) => {
  const [newItem, setNewItem] = useState<Partial<Article>>({
    title: '', excerpt: '', content: '', image: '', category: Category.TECH, author: 'عبدو التقني'
  });

  const handlePublish = () => {
    if (!newItem.title || !newItem.content) return alert('يرجى كتابة العنوان والمحتوى!');
    const p: Article = {
      ...newItem as Article,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-MA'),
      views: 0
    };
    onUpdate([p, ...posts]);
    setNewItem({ title: '', excerpt: '', content: '', image: '', category: Category.TECH, author: 'عبدو التقني' });
    alert('تم نشر المقال بنجاح! 🎊');
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto">
      <div className="glass p-10 rounded-[40px] mb-12 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">غرفة الأخبار</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">أنت الآن تتحكم في محتوى عبدو ويب</p>
        </div>
        <button onClick={onLogout} className="px-8 py-3 bg-red-600/20 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all">تسجيل الخروج</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass p-10 rounded-[50px] space-y-6">
          <h3 className="text-2xl font-black mb-8 border-b border-white/5 pb-4">مقال جديد ✍️</h3>
          <input className="w-full p-5 bg-black/40 rounded-2xl outline-none font-bold focus:border-emerald-500 border-2 border-transparent transition-all" placeholder="عنوان المقال..." value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
          <textarea className="w-full h-32 p-5 bg-black/40 rounded-2xl outline-none font-bold resize-none" placeholder="وصف موجز يظهر في الرئيسية..." value={newItem.excerpt} onChange={e => setNewItem({...newItem, excerpt: e.target.value})} />
          <input className="w-full p-5 bg-black/40 rounded-2xl outline-none font-bold" placeholder="رابط الصورة (Unsplash)..." value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
          <select className="w-full p-5 bg-black/40 rounded-2xl outline-none font-bold cursor-pointer" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as Category})}>
            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea className="w-full h-80 p-5 bg-black/40 rounded-2xl outline-none font-medium leading-relaxed" placeholder="اكتب القصة هنا..." value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
          <button onClick={handlePublish} className="w-full py-6 bg-emerald-600 rounded-[30px] font-black text-2xl shadow-xl shadow-emerald-600/10 hover:bg-emerald-500 transition-all">نشر المقال الآن 🚀</button>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-black mb-8 px-4">أرشيف المقالات</h3>
          <div className="space-y-4 max-h-[900px] overflow-y-auto no-scrollbar">
            {posts.map(p => (
              <div key={p.id} className="glass p-6 rounded-[35px] flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-6">
                  <img src={p.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg" alt="" />
                  <div>
                    <h4 className="font-black text-lg line-clamp-1 group-hover:text-emerald-500 transition-colors">{p.title}</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{p.category} • {p.views} مشاهدة</p>
                  </div>
                </div>
                <button onClick={() => onUpdate(posts.filter(item => item.id !== p.id))} className="w-12 h-12 flex items-center justify-center bg-red-600/10 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all">🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
