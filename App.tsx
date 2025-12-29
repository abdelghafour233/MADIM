
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
    id: 'morocco-dirham-float-2025-analysis',
    title: 'تعويم الدرهم المغربي: رحلة الانتقال نحو المرونة وتأثيراتها على الجيب والنمو الاقتصادي',
    excerpt: 'تحليل اقتصادي شامل لمسار تعويم العملة الوطنية المغربية، الأهداف الاستراتيجية لبنك المغرب، والتداعيات المباشرة على أسعار الاستهلاك وتنافسية المقاولات.',
    content: `يعد قرار إصلاح نظام سعر صرف الدرهم، أو ما يعرف بـ "التعويم"، أحد أبرز التحولات الهيكلية في الاقتصاد المغربي خلال العقد الأخير. هذا المسار الذي نهجه بنك المغرب بشكل تدريجي ومحكم، يهدف إلى تعزيز مناعة الاقتصاد الوطني ضد الصدمات الخارجية وتحسين التنافسية الدولية للمملكة.

ماذا يعني تعويم الدرهم في السياق المغربي؟
خلافاً للتعويم الكلي، اختار المغرب "التعويم التدريجي" أو الانتقال نحو نظام صرف أكثر مرونة. بدأ المسار في 2018 بتوسيع نطاق تقلب الدرهم من ±0.3% إلى ±2.5%، ثم تلاه توسيع آخر ليصل إلى ±5% في 2020. هذا يعني أن قيمة الدرهم تتحدد بناءً على العرض والطلب في السوق، ولكن ضمن حدود يراقبها البنك المركزي.

لماذا لجأ المغرب لهذه الخطوة؟
1. تعزيز التنافسية: مرونة العملة تسمح بامتصاص الصدمات الاقتصادية وتجعل الصادرات المغربية أكثر جاذبية في الأسواق العالمية.
2. جذب الاستثمارات: النظام المرن يعطي إشارات إيجابية للمستثمرين الدوليين حول استقرار السياسة النقدية وواقعية المؤشرات الماكرو-اقتصادية.
3. الحفاظ على احتياطي العملة: يقلل النظام المرن من حاجة البنك المركزي للتدخل المستمر بالعملة الصعبة لدعم الدرهم.

التداعيات على المواطن والقدرة الشرائية:
رغم الفوائد الاقتصادية الكبرى، يطرح التعويم تحديات مباشرة على جيب المواطن:
- أسعار المواد المستوردة: أي انخفاض في قيمة الدرهم ينعكس مباشرة على أسعار السلع التي يستوردها المغرب بالدولار أو الأورو، مثل المحروقات، القمح، والمواد الإلكترونية.
- التضخم: تقلبات سعر الصرف قد تساهم في ارتفاع معدلات التضخم، مما يتطلب من بنك المغرب تدخلاً عبر أدوات أخرى مثل "سعر الفائدة الرئيسي".

التداعيات على المقاولة المغربية:
تجد الشركات المغربية نفسها أمام واقع جديد يتطلب تدبيراً دقيقاً للمخاطر الصرفية. فبينما تستفيد الشركات المصدرة من انخفاض قيمة العملة لرفع مبيعاتها، تعاني الشركات التي تعتمد على المواد الأولية المستوردة من ارتفاع تكلفة الإنتاج.

خاتمة وتوقعات:
يبقى تعويم الدرهم "شراً لابد منه" في طريق الحداثة الاقتصادية. النجاح في هذا الانتقال يعتمد بشكل كبير على قدرة الاقتصاد الوطني على تنويع صادراته وتقليل الارتباط بالموارد المستوردة، خاصة الطاقية منها. وفي ظل الأزمات الجيوسياسية الحالية، يثبت بنك المغرب يوماً بعد يوم أن سياسة "التدرج" كانت الخيار الأكثر حكمة لحماية التوازنات المالية للمملكة.`,
    image: 'https://images.unsplash.com/photo-1611974715853-288e1e6639b0?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '19 مارس 2025',
    views: 38200,
    author: 'عبدو التقني',
    isTrending: true
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
    author: 'عبدو التقني'
  },
  {
    id: 'morocco-rainfall-impact-2025',
    title: 'أمطار الخير في المغرب: تنفس الصعداء للفلاح المغربي وانتعاشة مرتقبة للاقتصاد الوطني',
    excerpt: 'تحليل شامل لأثر التساقطات المطرية الأخيرة على حقينة السدود، الموسم الفلاحي، وتوقعات النمو الاقتصادي للمملكة في ظل التحديات المناخية.',
    content: `عادت الابتسامة لتعلوا وجوه الفلاحين المغاربة...`,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '17 مارس 2025',
    views: 42300,
    author: 'فريق التحرير'
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
        if (mergedPosts[existingIndex].image !== initialPost.image || mergedPosts[existingIndex].title !== initialPost.title) {
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
