
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
    id: 'can-opening-morocco-2025-historical',
    title: 'افتتاح تاريخي لكأس أمم أفريقيا بالمغرب: ليلة أبهرت القارة السمراء والعالم',
    excerpt: 'المغرب يبهر العالم بحفل افتتاح أسطوري يمزج بين التراث المغربي العريق والحداثة التقنية، مؤكداً جاهزيته الاستثنائية لاحتضان العرس الأفريقي.',
    content: `عاش المغرب ليلة تاريخية بامتياز مع انطلاق نهائيات كأس أمم أفريقيا، حيث تحول الملعب الكبير بالرباط إلى لوحة فنية عالمية أبهرت الملايين حول العالم. حفل الافتتاح لم يكن مجرد بداية لبطولة كروية، بل كان تجسيداً للهوية المغربية المتجذرة في التاريخ والمنفتحة على المستقبل.

تفاصيل الحفل الأسطوري:
1. اللوحات التراثية: تضمن الحفل عروضاً فنية استعرضت تنوع الثقافات المغربية من طنجة إلى الكويرة، مع استخدام تقنيات "الهولوغرام" لرسم معالم تاريخية مغربية في سماء الملعب.
2. الموسيقى والأنغام: شهد الحفل مشاركة نجوم عالميين ومغاربة قدموا أغنية البطولة التي مزجت بين الإيقاعات الأفريقية الحماسية والروح المغربية المضيافة.
3. التكنولوجيا الرقمية: تم استخدام أكثر من 500 طائرة "درون" رسمت خريطة القارة الأفريقية وشعار البطولة في عرض بصري غير مسبوق في تاريخ القارة.

الجاهزية المغربية:
أكد المسؤولون والوفود الحاضرة أن المغرب رفع سقف التنظيم إلى مستويات عالمية، تليق بحلم استضافة كأس العالم 2030. الملاعب، البنية التحتية، والجوانب اللوجستية كانت في أوج عطائها، مما جعل "الكان" في المغرب نسخة استثنائية بكل المقاييس.

أصداء عالمية:
تصدر حفل الافتتاح ترند منصات التواصل الاجتماعي عالمياً، حيث أشادت الصحافة الدولية بقدرة المغرب على تنظيم أحداث كبرى بهذا الحجم، واصفة الحفل بأنه "أفضل افتتاح في تاريخ بطولات أفريقيا".

نتمنى لأسود الأطلس ولجميع المنتخبات العربية والأفريقية رحلة كروية مليئة بالإبداع والروح الرياضية العالية.`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '15 مارس 2025',
    views: 85200,
    author: 'عبدو التقني',
    isTrending: true
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
    const savedSettings = localStorage.getItem('abdou_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedCart = localStorage.getItem('abdou_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // تحديث البيانات لعرض المقال الجديد فوراً
    const savedPosts = localStorage.getItem('abdou_blog_v2');
    if (savedPosts) {
      const parsed: Article[] = JSON.parse(savedPosts);
      const exists = parsed.some(p => p.id === INITIAL_DATA[0].id);
      if (!exists) {
        const updated = [INITIAL_DATA[0], ...parsed];
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
