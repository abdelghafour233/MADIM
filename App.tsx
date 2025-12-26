
import React, { useState, useEffect } from 'react';
import { View, Article, Category } from './types.ts';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const INITIAL_DATA: Article[] = [
  {
    id: '1',
    title: 'ثورة الـ 5G في المغرب: كيف ستغير حياتنا اليومية؟',
    excerpt: 'تغطية شاملة لاستعدادات شركات الاتصالات المغربية لإطلاق الجيل الخامس والفرص الاقتصادية الواعدة.',
    content: 'يعتبر المغرب اليوم من الدول الرائدة في التحول الرقمي بإفريقيا. مع اقتراب إطلاق شبكات الجيل الخامس، ننتظر قفزة نوعية في سرعات الإنترنت وتقنيات المدن الذكية...\n\nإن البنية التحتية المتطورة ستسمح بظهور جيل جديد من الشركات الناشئة المعتمدة على إنترنت الأشياء والبيانات الضخمة.',
    image: 'https://images.unsplash.com/photo-1562408590-e3290b08433b?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '28 فبراير 2025',
    views: 4200,
    author: 'عبدو التقني'
  },
  {
    id: '2',
    title: 'أفضل 5 حواسيب للمبرمجين في السوق المغربي 2025',
    excerpt: 'مراجعة دقيقة للأداء، البطارية، والسعر لتساعدك في اختيار رفيق دربك في عالم الكود.',
    content: 'اختيار الحاسوب المناسب هو أول خطوة للنجاح في مسارك المهني كمبرمج. في هذه المقالة نستعرض أحدث أجهزة MacBook Pro ومعالجات M4 الجديدة، بالإضافة إلى بدائل قوية من Dell و Lenovo متوفرة حالياً في المغرب.',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '27 فبراير 2025',
    views: 12500,
    author: 'عبدو التقني'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('abdou_blog_v1');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v1', JSON.stringify(INITIAL_DATA));
    }
  }, []);

  const navigateTo = (v: View, p?: Article) => {
    if (p) setSelectedPost(p);
    setView(v);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <nav className="sticky top-0 z-50 glass h-20 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-3xl font-black cursor-pointer tracking-tighter" onClick={() => navigateTo('home')}>
            <span className="text-emerald-500 font-black">ABDO</span>WEB
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('admin')} className="text-xs font-bold text-slate-500 hover:text-white transition-colors">لوحة التحكم</button>
            <button onClick={() => navigateTo('home')} className="px-8 py-2 bg-emerald-600 rounded-2xl font-black text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10">الرئيسية</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 flex-grow">
        {view === 'home' && <Home posts={posts} onPostClick={(p) => navigateTo('post', p)} />}
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} />}
        {view === 'admin' && (
          !isAuth ? <Login onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            onUpdate={(newPosts) => { setPosts(newPosts); localStorage.setItem('abdou_blog_v1', JSON.stringify(newPosts)); }}
            onLogout={() => setIsAuth(false)}
          />
        )}
      </main>

      <footer className="border-t border-white/5 py-16 mt-20 text-center">
        <div className="text-xl font-black mb-4"><span className="text-emerald-500">ABDO</span>WEB</div>
        <p className="text-slate-500 font-medium">مصدرك الأول لأخبار التقنية والمراجعات في المغرب</p>
        <p className="mt-8 text-[10px] text-slate-700 font-black uppercase tracking-[0.3em]">جميع الحقوق محفوظة © 2025</p>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default App;
