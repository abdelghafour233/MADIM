
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

// هذه المقالات ستبقى دائماً في الموقع ولن تحذف أبداً
const INITIAL_DATA: Article[] = [
  {
    id: 'morocco-vs-zambia-can-2025-hype',
    title: 'مواجهة الحسم: المغاربة يترقبون موقعة "أسود الأطلس" ضد زامبيا في ليلة العبور نحو المجد الأفريقي',
    excerpt: 'تتجه أنظار الملايين من عشاق الكرة المغربية صوب الملعب الكبير لمتابعة المباراة الحاسمة ضد المنتخب الزامبي، وسط آمال عريضة بتأكيد الصدارة ومواصلة المسار الناجح في الكان.',
    content: `تعيش الشوارع المغربية منذ الساعات الأولى من صباح اليوم حالة من الغليان الرياضي والترقب الكبير، حيث لا صوت يعلو فوق صوت الموقعة المرتقبة التي ستجمع أسود الأطلس بمنتخب زامبيا برسم نهائيات كأس أمم أفريقيا.

الأجواء في المقاهي والشوارع:
من طنجة إلى الكويرة، استعدت المقاهي والساحات العمومية لاستقبال الجماهير عبر شاشات عملاقة، في مشهد يعيد للأذهان ملحمة مونديال قطر. الأعلام الوطنية تزين الشرفات، والقمصان الحمراء والخضراء باتت الزي الرسمي للمغاربة اليوم، في تعبير صريح عن الدعم اللامشروط لكتيبة وليد الركراكي.

الأهمية التكتيكية للمباراة:
يدخل المنتخب المغربي المباراة وعينه على النقاط الثلاث ليس فقط لضمان التأهل، بل لتوجيه رسالة قوية للمنافسين مفادها أن "الأسود" جاؤوا للمنافسة على اللقب القاري. ويتوقع المحللون الرياضيون أن يعتمد الركراكي على نهج هجومي متوازن، مع الحذر من المرتدات السريعة للمنتخب الزامبي الذي يطمح بدوره لخلق المفاجأة.

تطلعات الجماهير المغربية:
تجمع آراء الجماهير في استطلاعات ميدانية على ثقتهم الكاملة في مهارات النجوم مثل حكيم زياش، أشرف حكيمي، وعز الدين أوناحي. ويرى الكثيرون أن هذه النسخة من الكان هي الفرصة الأنسب لكسر عقدة اللقب القاري الذي طال انتظاره منذ عام 1976.

رسائل الدعم عبر مواقع التواصل:
لم يقتصر الحماس على الشارع فقط، بل اجتاحت الأهازيج وشعارات "ديما مغرب" منصات التواصل الاجتماعي، حيث أطلق ناشطون وسوماً لدعم اللاعبين والرفع من معنوياتهم، مؤكدين أن الشعب المغربي بأكمله يقف صفاً واحداً خلف المنتخب الوطني.

في الختام، تبقى مباراة المغرب ضد زامبيا أكثر من مجرد مواجهة رياضية، بل هي لحظة توحد وطني ننتظر فيها زئيراً جديداً لأسودنا يؤكد ريادتهم الكروية في القارة السمراء.`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '20 مارس 2025',
    views: 94200,
    author: 'عبدو الرياضي',
    isTrending: true
  },
  {
    id: 'morocco-dirham-float-2025-analysis',
    title: 'تعويم الدرهم المغربي: رحلة الانتقال نحو المرونة وتأثيراتها على الجيب والنمو الاقتصادي',
    excerpt: 'تحليل اقتصادي شامل لمسار تعويم العملة الوطنية المغربية، الأهداف الاستراتيجية لبنك المغرب، والتداعيات المباشرة على أسعار الاستهلاك وتنافسية المقاولات.',
    content: `يعد قرار إصلاح نظام سعر صرف الدرهم، أو ما يعرف بـ "التعويم"، أحد أبرز التحولات الهيكلية في الاقتصاد المغربي...`,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '19 مارس 2025',
    views: 38200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'morocco-olive-oil-2025-price-drop',
    title: 'زيت الزيتون بالمغرب: "الذهب الأخضر" يستعيد بريقه ووفرة الإنتاج تدفع الأسعار نحو الانخفاض',
    excerpt: 'بعد سنتين من الغلاء التاريخي، تشهد الأسواق المغربية تراجعاً ملموساً في أسعار زيت الزيتون بفضل الموسم الفلاحي الواعد، مما يبعث على التفاؤل بين المستهلكين.',
    content: `يعتبر زيت الزيتون ركيزة أساسية في المطبخ المغربي...`,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '18 مارس 2025',
    views: 56400,
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
    const savedSettings = localStorage.getItem('abdou_settings_v3');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedCart = localStorage.getItem('abdou_cart_v3');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedPostsRaw = localStorage.getItem('abdou_blog_v3');
    let currentPosts: Article[] = savedPostsRaw ? JSON.parse(savedPostsRaw) : [];

    let mergedPosts = [...currentPosts];
    let changed = false;

    INITIAL_DATA.forEach(initialPost => {
      const existingIndex = mergedPosts.findIndex(p => p.id === initialPost.id);
      if (existingIndex === -1) {
        mergedPosts = [initialPost, ...mergedPosts];
        changed = true;
      } else {
        if (mergedPosts[existingIndex].image !== initialPost.image || mergedPosts[existingIndex].title !== initialPost.title || mergedPosts[existingIndex].isTrending !== initialPost.isTrending) {
          mergedPosts[existingIndex] = { ...mergedPosts[existingIndex], ...initialPost };
          changed = true;
        }
      }
    });

    setPosts(mergedPosts);
    if (changed || !savedPostsRaw) {
      localStorage.setItem('abdou_blog_v3', JSON.stringify(mergedPosts));
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
    localStorage.setItem('abdou_cart_v3', JSON.stringify(newCart));
    setShowCart(true);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart(newCart);
    localStorage.setItem('abdou_cart_v3', JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return removeFromCart(id);
    const newCart = cart.map(i => i.id === id ? { ...i, quantity: q } : i);
    setCart(newCart);
    localStorage.setItem('abdou_cart_v3', JSON.stringify(newCart));
  };

  const handleItemClick = (p: Article) => {
    const updatedPosts = posts.map(item => 
      item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item
    );
    setPosts(updatedPosts);
    localStorage.setItem('abdou_blog_v3', JSON.stringify(updatedPosts));
    
    setSelectedItem({ ...p, views: (p.views || 0) + 1 });
    if (p.isProduct) {
      setView('product');
    } else {
      setView('post');
    }
    window.scrollTo(0, 0);
  };

  const handleUpdatePosts = (newPosts: Article[]) => {
    setPosts(newPosts);
    localStorage.setItem('abdou_blog_v3', JSON.stringify(newPosts));
  };

  const handleUpdateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('abdou_settings_v3', JSON.stringify(newSettings));
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
            onUpdate={handleUpdatePosts}
            onUpdateSettings={handleUpdateSettings}
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
