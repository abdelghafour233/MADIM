
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
    id: 'morocco-rainfall-impact-2025',
    title: 'أمطار الخير في المغرب: تنفس الصعداء للفلاح المغربي وانتعاشة مرتقبة للاقتصاد الوطني',
    excerpt: 'تحليل شامل لأثر التساقطات المطرية الأخيرة على حقينة السدود، الموسم الفلاحي، وتوقعات النمو الاقتصادي للمملكة في ظل التحديات المناخية.',
    content: `عادت الابتسامة لتعلوا وجوه الفلاحين المغاربة بعد التساقطات المطرية الأخيرة التي شهدتها مختلف جهات المملكة، والتي جاءت في وقت حاسم لإنقاذ الموسم الفلاحي وتخفيف حدة الإجهاد المائي الذي طبع السنوات الأخيرة.

أولاً: أثر الأمطار على حقينة السدود والفرشة المائية
شهدت السدود المغربية انتعاشة ملموسة، حيث ارتفعت نسب الملء في أحواض مائية حيوية مثل حوض سبو واللوكوس. هذا الارتفاع لا يضمن فقط مياه الشرب للمدن الكبرى، بل يمنح نفساً جديداً للمناطق المسقية التي عانت من قيود صارمة في توزيع المياه. كما ساهمت هذه الأمطار في تغذية الفرشة المائية الباطنية، مما يقلل من تكاليف الضخ على الفلاحين الصغار.

ثانياً: النتائج المباشرة على القطاع الفلاحي
1. المحاصيل الخريفية: ساعدت الأمطار في تسريع عملية نمو الحبوب (القمح والشعير) في مناطق الشاوية والحوز والسايس.
2. الكساء النباتي والمراعي: توفر المراعي الطبيعية سيقلل من لجوء الكسابة لشراء الأعلاف المصنعة الغالية، مما سينعكس إيجاباً على أسعار اللحوم الحمراء في الأسواق الوطنية.
3. الأشجار المثمرة: استفادت أشجار الزيتون والحوامض بشكل مباشر، مما يبشر بإنتاجية وافرة وجودة عالية للمنتوج الوطني.

ثالثاً: الانعكاسات على الاقتصاد الوطني
يرتبط نمو الاقتصاد المغربي بشكل وثيق بالقيمة المضافة الفلاحية. التساقطات الأخيرة تعني:
- تقليص العجز التجاري من خلال خفض الحاجة لاستيراد الحبوب من الخارج.
- انتعاش الرواج التجاري في الأوساط القروية، مما يحرك عجلة الاستهلاك الداخلي.
- تحسن توقعات نسبة النمو التي يسطرها بنك المغرب والمندوبية السامية للتخطيط، حيث يساهم الموسم الفلاحي الجيد في رفع الناتج الداخلي الخام بنقاط ملموسة.

ختاماً، تبقى هذه التساقطات بارقة أمل كبيرة، لكنها تذكرنا أيضاً بأهمية مواصلة سياسة "تشييد السدود" وتحلية مياه البحر التي نهجها المغرب، لضمان سيادة غذائية ومائية مستدامة بعيداً عن تقلبات المناخ.`,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '17 مارس 2025',
    views: 42300,
    author: 'فريق التحرير',
    isTrending: true
  },
  {
    id: 'can-opening-morocco-2025-historical',
    title: 'افتتاح تاريخي لكأس أمم أفريقيا بالمغرب: ليلة أبهرت القارة السمراء والعالم',
    excerpt: 'المغرب يبهر العالم بحفل افتتاح أسطوري يمزج بين التراث المغربي العريق والحداثة التقنية، مؤكداً جاهزيته الاستثنائية لاحتضان العرس الأفريقي.',
    content: `عاش المغرب ليلة تاريخية بامتياز مع انطلاق نهائيات كأس أمم أفريقيا، حيث تحول الملعب الكبير بالرباط إلى لوحة فنية عالمية أبهرت الملايين حول العالم. حفل الافتتاح لم يكن مجرد بداية لبطولة كروية، بل كان تجسيداً للهوية المغربية المتجذرة في التاريخ والمنفتحة على المستقبل.`,
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

    // دمج المقالات مع تحديث البيانات للمقالات الأصلية (مثل تحديث الصورة)
    let mergedPosts = [...currentPosts];
    let changed = false;

    INITIAL_DATA.forEach(initialPost => {
      const existingIndex = mergedPosts.findIndex(p => p.id === initialPost.id);
      if (existingIndex === -1) {
        mergedPosts = [initialPost, ...mergedPosts];
        changed = true;
      } else {
        // إذا كان المقال موجوداً ولكن رابط الصورة اختلف في الكود، نقوم بتحديثه
        if (mergedPosts[existingIndex].image !== initialPost.image) {
          mergedPosts[existingIndex] = { ...mergedPosts[existingIndex], image: initialPost.image };
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
