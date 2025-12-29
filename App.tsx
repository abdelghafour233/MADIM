
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
    id: 'morocco-olive-oil-2025-price-drop',
    title: 'زيت الزيتون بالمغرب: "الذهب الأخضر" يستعيد بريقه ووفرة الإنتاج تدفع الأسعار نحو الانخفاض',
    excerpt: 'بعد سنتين من الغلاء التاريخي، تشهد الأسواق المغربية تراجعاً ملموساً في أسعار زيت الزيتون بفضل الموسم الفلاحي الواعد، مما يبعث على التفاؤل بين المستهلكين.',
    content: `يعتبر زيت الزيتون ركيزة أساسية في المطبخ المغربي، ورمزاً للجودة والأصالة. وبعد فترة من الترقب والقلق بسبب الارتفاع الكبير في الأسعار الذي ميز الموسم الماضي، تزف الضيعات الفلاحية ومعاصر الزيتون أخباراً سارة للمغاربة هذا العام.

انتعاشة الإنتاج في المناطق الكبرى:
بفضل التساقطات المطرية الأخيرة التي شهدتها مناطق مثل "قلعة السراغنة"، "تاونات"، و"بني ملال"، استعادت أشجار الزيتون حيويتها. وتشير التقارير الميدانية إلى أن جودة الثمار هذا الموسم استثنائية، مما انعكس إيجاباً على كمية الزيت المستخلصة (المردودية).

خارطة الأسعار: من الغلاء إلى الوفرة
سجلت أسعار زيت الزيتون في الأسواق الأسبوعية وبنقاط البيع المباشرة انخفاضاً يتراوح بين 15% إلى 25% مقارنة بنفس الفترة من العام الماضي. هذا التراجع يعود لعدة أسباب:
1. الوفرة الملموسة: زيادة العرض في الأسواق المحلية قلص من حدة المضاربات.
2. الإجراءات الحكومية: تقييد التصدير لضمان تزويد السوق الوطنية أولاً ساهم في استقرار الأثمان.
3. وعي المستهلك: توجه الأسر المغربية نحو الشراء المباشر من المعاصر الموثوقة قلل من دور الوسطاء.

الأثر الاقتصادي والاجتماعي:
انخفاض ثمن لتر زيت الزيتون يعني تخفيف العبء عن القفة اليومية للمواطن المغربي، خاصة وأن هذه المادة تستهلك بشكل يومي. كما أن انتعاش هذا القطاع يحرك عجلة الاقتصاد القروي ويوفر آلاف فرص الشغل الموسمية للشباب في المناطق الفلاحية.

نصيحة للمستهلك:
يدعو الخبراء المواطنين إلى التأكد من مصدر الزيت واقتنائه من المعاصر المعتمدة التي تخضع للمراقبة الصحية، لتجنب الزيوت المغشوشة والاستفادة من القيمة الغذائية الكاملة لزيت الزيتون المغربي البكر.

في الختام، يبدو أن "عام الخير" قد حل على شجر الزيتون بالمغرب، ليعيد لهذه المادة مكانتها الطبيعية في كل بيت مغربي بأثمنة معقولة وجودة عالمية.`,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '18 مارس 2025',
    views: 56400,
    author: 'عبدو التقني',
    isTrending: true
  },
  {
    id: 'morocco-rainfall-impact-2025',
    title: 'أمطار الخير في المغرب: تنفس الصعداء للفلاح المغربي وانتعاشة مرتقبة للاقتصاد الوطني',
    excerpt: 'تحليل شامل لأثر التساقطات المطرية الأخيرة على حقينة السدود، الموسم الفلاحي، وتوقعات النمو الاقتصادي للمملكة في ظل التحديات المناخية.',
    content: `عادت الابتسامة لتعلوا وجوه الفلاحين المغاربة بعد التساقطات المطرية الأخيرة التي شهدتها مختلف جهات المملكة...`,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '17 مارس 2025',
    views: 42300,
    author: 'فريق التحرير'
  },
  {
    id: 'can-opening-morocco-2025-historical',
    title: 'افتتاح تاريخي لكأس أمم أفريقيا بالمغرب: ليلة أبهرت القارة السمراء والعالم',
    excerpt: 'المغرب يبهر العالم بحفل افتتاح أسطوري يمزج بين التراث المغربي العريق والحداثة التقنية، مؤكداً جاهزيته الاستثنائية لاحتضان العرس الأفريقي.',
    content: `عاش المغرب ليلة تاريخية بامتياز مع انطلاق نهائيات كأس أمم أفريقيا، حيث تحول الملعب الكبير بالرباط إلى لوحة فنية عالمية أبهرت الملايين حول العالم...`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '15 مارس 2025',
    views: 85200,
    author: 'عبدو التقني'
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
