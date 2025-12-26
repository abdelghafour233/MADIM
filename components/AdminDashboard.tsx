
import React, { useState } from 'react';
import { Article, Category } from '../types';

interface AdminProps {
  posts: Article[];
  onUpdate: (posts: Article[]) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminProps> = ({ posts, onUpdate, onLogout }) => {
  const [newItem, setNewItem] = useState<Partial<Article>>({
    title: '', excerpt: '', content: '', image: '', category: Category.TECH, author: 'عبدو'
  });

  const handlePublish = () => {
    if (!newItem.title || !newItem.content) return alert('أكمل البيانات!');
    const p: Article = {
      ...newItem as Article,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-MA'),
      views: 0
    };
    onUpdate([p, ...posts]);
    setNewItem({ title: '', excerpt: '', content: '', image: '', category: Category.TECH, author: 'عبدو' });
    alert('تم النشر بنجاح! 🎉');
  };

  const deletePost = (id: string) => {
    if (confirm('هل تريد الحذف؟')) {
      onUpdate(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="glass p-10 rounded-[40px] mb-12 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">غرفة القيادة</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">إدارة محتوى عبدو ويب</p>
        </div>
        <button onClick={onLogout} className="px-8 py-3 bg-red-600/20 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all">خروج</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Editor */}
        <div className="glass p-10 rounded-[40px] space-y-6">
          <h3 className="text-2xl font-black mb-6">نشر مقال جديد ✨</h3>
          <input className="w-full p-4 bg-black/40 rounded-xl outline-none font-bold" placeholder="العنوان..." value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
          <textarea className="w-full h-24 p-4 bg-black/40 rounded-xl outline-none font-bold" placeholder="وصف قصير..." value={newItem.excerpt} onChange={e => setNewItem({...newItem, excerpt: e.target.value})} />
          <input className="w-full p-4 bg-black/40 rounded-xl outline-none font-bold" placeholder="رابط الصورة..." value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
          <select className="w-full p-4 bg-black/40 rounded-xl outline-none font-bold" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as Category})}>
            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea className="w-full h-64 p-4 bg-black/40 rounded-xl outline-none font-bold" placeholder="المحتوى الكامل..." value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
          <button onClick={handlePublish} className="w-full py-5 bg-emerald-600 rounded-2xl font-black text-xl shadow-xl shadow-emerald-600/10 hover:bg-emerald-500 transition-all">نشر فوراً 🚀</button>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black mb-6 px-4">المقالات الحالية</h3>
          {posts.map(p => (
            <div key={p.id} className="glass p-6 rounded-3xl flex items-center justify-between group">
              <div className="flex items-center gap-5">
                <img src={p.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                <div>
                  <h4 className="font-black text-lg group-hover:text-emerald-500 transition-colors">{p.title}</h4>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{p.category} • {p.date}</p>
                </div>
              </div>
              <button onClick={() => deletePost(p.id)} className="w-12 h-12 flex items-center justify-center bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
