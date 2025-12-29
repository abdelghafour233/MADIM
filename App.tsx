
import React, { useState, useEffect } from 'react';
import { View, Article, Category, Settings, CartItem } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './components/Checkout.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const INITIAL_SETTINGS: Settings = {
  siteName: 'عبدو ويب',
  adsenseCode: 'ca-pub-5578524966832192',
  dashboardPassword: '1234',
  totalVisits: 0
};

const INITIAL_DATA: Article[] = [
  {
    id: 'temu-winter-boots-review-2025',
    title: 'أناقة ودفء: مراجعة الحذاء الشتوي الأكثر مبيعاً على تيمو (Temu) للموسم الحالي',
    excerpt: 'هل تبحث عن حذاء يجمع بين المتانة والشكل العصري؟ جربنا لكم هذا الحذاء الشتوي من تيمو الذي أثار ضجة كبيرة، وإليكم الخلاصة الصادمة حول جودته.',
    content: `مع انخفاض درجات الحرارة في المغرب، يصبح البحث عن حذاء يجمع بين التدفئة المركزية والأناقة أمراً صعباً، خاصة إذا كنت تبحث عن سعر معقول. اليوم نشارككم تجربتنا لهذا الحذاء الشتوي المتميز من منصة تيمو.

مميزات الحذاء التي أبهرتنا:
1. البطانة الداخلية: يأتي الحذاء ببطانة فرو اصطناعي عالية الجودة توفر دفئاً فورياً حتى في الأيام الأكثر برودة.
2. التصميم الخارجي: يتميز بجلد مقاوم للرطوبة وسهل التنظيف، مما يجعله مثاليأ للأجواء الماطرة في المدن المغربية.
3. النعل المرن: نعل مطاطي مضاد للانزلاق يوفر راحة كبيرة أثناء المشي لمسافات طويلة.
4. خفة الوزن: على عكس الأحذية الشتوية الضخمة، هذا الحذاء خفيف جداً ولا يسبب إرهاقاً للقدم.

لماذا ننصح به؟
بعد مقارنة السعر مع الجودة المتوفرة في الأسواق المحلية، وجدنا أن هذا المنتج يقدم قيمة استثنائية. التصميم يتناسب تماماً مع الجينز أو سراويل الكارجو، مما يمنحك مظهراً "كاجوال" فخماً.

نصيحة عند الطلب:
تأكد من اختيار قياسك المعتاد، فالقوالب مطابقة للمقاييس العالمية. الشحن عبر تيمو إلى المغرب حالياً سريع جداً مقارنة بالسابق.

رابط الشراء المباشر:
https://temu.to/k/ega2jxg103h`,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '12 مارس 2025',
    views: 45200,
    author: 'عبدو التقني',
    isTrending: true
  },
  {
    id: 'ultra-watch-series-9-clone',
    name: 'ساعة Ultra Smart Watch - الجيل الجديد 2025',
    title: 'ساعة Ultra Smart Watch - الجيل الجديد 2025',
    excerpt: 'أفضل بديل للساعات الذكية الفاخرة في المغرب. مقاومة للماء، قياس ضربات القلب، وشاشة AMOLED مذهلة بسعر لا يقاوم.',
    content: `اكتشف القوة والأناقة مع ساعة Ultra Smart Watch الجديدة.
- شاشة 2.12 بوصة بدقة عالية جداً.
- بطارية تدوم حتى 7 أيام من الاستخدام المتواصل.
- تدعم المكالمات مباشرة من الساعة (Bluetooth Call).
- نظام GPS متطور للرياضيين.
توصيل مجاني في المغرب والدفع عند الاستلام.`,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '12 مارس 2025',
    views: 12400,
    author: 'فريق المراجعات',
    price: 399,
    isProduct: true,
    rating: 5
  },
  {
    id: 'winter-vitamin-d-mental-health-2025',
    title: 'شمس الشتاء الغائبة: كيف يؤثر نقص فيتامين "د" على نفسيتك؟ دليل شامل لتجاوز كآبة الموسم',
    excerpt: 'لماذا نشعر بالحزن والخمول المفاجئ مع حلول الشتاء؟ نكشف لكم العلاقة العلمية بين نقص فيتامين الشمس واضطرابات المزاج، وكيف تحمي نفسك من الاكتئاب الموسمي.',
    content: `مع تراجع ساعات النهار وغياب الشمس خلف الغيوم في فصل الشتاء، يبدأ الكثيرون في الشعور بنوع من "الخمول النفسي"...`,
    image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '11 مارس 2025',
    views: 112000,
    author: 'عبدو التقني',
    isTrending: false
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedItem, setSelectedItem] = useState<Article | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('abdou_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedPosts = localStorage.getItem('abdou_blog_v2');
    if (savedPosts) {
      const parsed: Article[] = JSON.parse(savedPosts);
      // Logic to sync new hardcoded posts into local storage if they don't exist
      const newPostIds = INITIAL_DATA.map(d => d.id);
      let updated = [...parsed];
      let needsUpdate = false;

      INITIAL_DATA.forEach(initialPost => {
        if (!updated.some(p => p.id === initialPost.id)) {
          updated = [initialPost, ...updated];
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        setPosts(updated);
        localStorage.setItem('abdou_blog_v2', JSON.stringify(updated));
      } else {
        setPosts(parsed);
      }
    } else {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v2', JSON.stringify(INITIAL_DATA));
    }
  }, []);

  const addToCart = (product: Article) => {
    const existing = cart.find(i => i.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem('abdou_cart', JSON.stringify(newCart));
    setShowCart(true);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart(newCart);
    localStorage.setItem('abdou_cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return removeFromCart(id);
    const newCart = cart.map(i => i.id === id ? { ...i, quantity: q } : i);
    setCart(newCart);
    localStorage.setItem('abdou_cart', JSON.stringify(newCart));
  };

  const handleItemClick = (p: Article) => {
    const updatedPosts = posts.map(item => 
      item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item
    );
    setPosts(updatedPosts);
    localStorage.setItem('abdou_blog_v2', JSON.stringify(updatedPosts));
    
    setSelectedItem({ ...p, views: (p.views || 0) + 1 });
    if (p.isProduct) {
      setView('product');
    } else {
      setView('post');
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view}
        setView={setView}
        siteName={settings.siteName}
        onSearch={() => {}}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setShowCart(true)}
      />

      {showCart && (
        <Cart 
          items={cart} 
          onClose={() => setShowCart(false)} 
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => { setView('checkout'); setShowCart(false); }}
          darkMode={darkMode}
        />
      )}

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && <Home posts={posts} onPostClick={handleItemClick} darkMode={darkMode} />}
        {view === 'post' && selectedItem && <PostDetail post={selectedItem} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedItem && <ProductDetail product={selectedItem} onAddToCart={addToCart} onBack={() => setView('home')} darkMode={darkMode} />}
        {view === 'checkout' && <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={(data) => { alert('تم استلام طلبك بنجاح! سنتصل بك قريباً.'); setCart([]); setView('home'); }} />}
        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={(p) => { setPosts(p); localStorage.setItem('abdou_blog_v2', JSON.stringify(p)); }}
            onUpdateSettings={(s) => { setSettings(s); localStorage.setItem('abdou_settings', JSON.stringify(s)); }}
            onLogout={() => setIsAuth(false)}
            darkMode={darkMode}
          />
        )}
      </main>

      <footer className="mt-20 py-16 border-t border-white/5 opacity-60 text-center font-bold">
        {settings.siteName} - وجهتك للتقنية والتسوق في المغرب © 2025
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
