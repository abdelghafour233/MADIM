
import React, { useState, useEffect } from 'react';
import { View, Article, Category, CartItem } from './types.ts';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import Cart from './components/Cart.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const INITIAL_DATA: Article[] = [
  {
    id: '1',
    title: 'مستقبل الذكاء الاصطناعي في المغرب 2025',
    name: 'مستقبل الذكاء الاصطناعي في المغرب 2025',
    excerpt: 'كيف تساهم التقنيات الحديثة في تغيير المشهد الاقتصادي والتعليمي في المملكة.',
    content: 'يعتبر الذكاء الاصطناعي اليوم المحرك الأساسي للابتكار العالمي، والمغرب ليس استثناءً. من خلال استراتيجية "المغرب الرقمي"، تسعى المملكة لتبني حلول ذكية في مجالات الفلاحة، الصحة، والصناعة.\n\nإن البنية التحتية التي يتم بناؤها الآن ستشكل الركيزة الأساسية للجيل القادم من رواد الأعمال المغاربة.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '27 فبراير 2025',
    views: 1540,
    author: 'عبدو',
    isProduct: false
  },
  {
    id: 'prod_1',
    name: 'ساعة Abdou Pro الذكية',
    content: 'أحدث ساعة ذكية تدعم اللغة العربية بالكامل، مع تتبع ضربات القلب ونظام GPS مغربي دقيق. تصميم فخم بلمسة عصرية.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '27 فبراير 2025',
    views: 340,
    author: 'متجر عبدو',
    price: 499,
    isProduct: true,
    rating: 5
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [selectedItem, setSelectedItem] = useState<Article | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('abdou_v13_posts_final');
      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        setPosts(INITIAL_DATA);
        localStorage.setItem('abdou_v13_posts_final', JSON.stringify(INITIAL_DATA));
      }
    } catch (e) {
      console.error("Storage Error", e);
      setPosts(INITIAL_DATA);
    }
  }, []);

  const navigateTo = (v: View, p?: Article) => {
    if (p) setSelectedItem(p);
    setView(v);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Article) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <nav className="sticky top-0 z-50 glass h-20 flex items-center shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-3xl font-black cursor-pointer tracking-tighter" onClick={() => navigateTo('home')}>
            <span className="text-emerald-500 font-black">ABDO</span>WEB
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCart(true)} 
              className="relative p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            <button onClick={() => navigateTo('admin')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors px-2">الإدارة</button>
            <button onClick={() => navigateTo('home')} className="px-6 py-2 bg-emerald-600 rounded-xl font-black text-sm hover:bg-emerald-500 transition-all shadow-lg">الرئيسية</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8 flex-grow animate-fadeIn">
        {view === 'home' && (
          <Home 
            posts={posts} 
            onPostClick={(p) => navigateTo('post', p)} 
          />
        )}
        
        {view === 'post' && selectedItem && (
          selectedItem.isProduct ? (
            <ProductDetail 
              product={selectedItem} 
              onAddToCart={addToCart} 
              onBack={() => setView('home')} 
              darkMode={true}
            />
          ) : (
            <PostDetail post={selectedItem} onBack={() => setView('home')} />
          )
        )}

        {view === 'admin' && (
          !isAuth ? (
            <Login onSuccess={() => setIsAuth(true)} />
          ) : (
            <AdminDashboard 
              posts={posts} 
              onUpdate={(newPosts) => { 
                setPosts(newPosts); 
                localStorage.setItem('abdou_v13_posts_final', JSON.stringify(newPosts)); 
              }}
              onLogout={() => setIsAuth(false)}
            />
          )
        )}
      </main>

      <footer className="border-t border-white/5 py-12 mt-20 text-center opacity-60">
        <p className="font-bold">جميع الحقوق محفوظة © 2025 عبدو ويب</p>
      </footer>

      {showCart && (
        <Cart 
          items={cart} 
          onRemove={(id) => setCart(cart.filter(i => i.id !== id))}
          onUpdateQuantity={(id, q) => setCart(cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, q) } : i))}
          onCheckout={() => { alert('شكراً لطلبك! سنتصل بك قريباً.'); setShowCart(false); }}
          onClose={() => setShowCart(false)}
          darkMode={true}
        />
      )}

      <WhatsAppButton />
    </div>
  );
};

export default App;
