
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
    id: 'world-war-3-ukraine-analysis-2025',
    title: 'هل العالم على أعتاب حرب عالمية ثالثة؟ الأزمة الأوكرانية: الجذور، المآلات، وماذا بعد؟',
    excerpt: 'تحليل جيوسياسي معمق للصراع الروسي الأوكراني وتداعياته الدولية، وهل تنزلق القوى العظمى نحو صدام عالمي شامل؟ استشراف للمستقبل في ظل التوترات المتصاعدة.',
    content: `منذ اندلاع الصراع الروسي الأوكراني في فبراير 2022، لم يعد العالم كما كان. ما بدأ كعملية عسكرية محدودة تحول إلى أطول استنزاف عسكري في أوروبا منذ الحرب العالمية الثانية، مما أثار تساؤلات جدية حول ما إذا كنا نعيش بالفعل فصولاً تمهيدية لحرب عالمية ثالثة.

جذور الصراع وتصاعد المواجهة:
لا يمكن فهم الحرب الحالية دون العودة إلى تمدد حلف شمال الأطلسي (الناتو) شرقاً، وهو ما اعتبرته موسكو تهديداً وجودياً لأمنها القومي. من جهة أخرى، يرى الغرب في الغزو الروسي اعتداءً صارخاً على سيادة الدول ومحاولة لإعادة رسم خارطة العالم بالقوة. هذا الصدام الأيديولوجي والجغرافي وضع القوى العظمى في مواجهة مباشرة، وإن كانت "بالوكالة" حتى الآن.

عوامل التصعيد.. هل تقترب ساعة الصفر؟
1. التسليح النوعي: انتقال الدعم الغربي من الخوذ والدروع إلى الدبابات الثقيلة، الصواريخ بعيدة المدى، وطائرات F-16، جعل الخطوط الحمراء الروسية تتلاشى تدريجياً.
2. التهديد النووي: تكرار التلميحات الروسية باستخدام الأسلحة النووية التكتيكية وضع العالم في حالة تأهب لم يشهدها منذ أزمة الصواريخ الكوبية عام 1962.
3. التكتلات الدولية: بروز تحالفات قوية (الصين، روسيا، كوريا الشمالية، إيران) في مقابل المعسكر الغربي، يعيد للأذهان مشهد الانقسامات التي سبقت الحربين العالميتين الأولى والثانية.

التداعيات الاقتصادية: "حرب لقمة العيش"
لم تقتصر آثار الحرب على الميدان العسكري؛ فقد تأثرت سلاسل الإمداد العالمية بشكل عنيف:
- أزمة الطاقة: عانى العالم، وخاصة أوروبا، من ارتفاع جنوني في أسعار الغاز والكهرباء.
- الأمن الغذائي: بصفتهما "سلة غذاء العالم"، أدى تعثر صادرات القمح والزيوت من روسيا وأوكرانيا إلى موجات تضخم غير مسبوقة، مست جيب المواطن في كل مكان، بما في ذلك دولنا العربية والمغاربية.

ماذا بعد؟ سيناريوهات المستقبل:
- السيناريو الأول (الجمود الطويل): استمرار الحرب كصراع استنزاف لسنوات دون منتصر واضح، مما ينهك اقتصاديات الجميع.
- السيناريو الثاني (الحل التفاوضي): الوصول إلى تسوية "مؤلمة" للطرفين تتضمن تنازلات جغرافية مقابل ضمانات أمنية، وهو أمر يبدو بعيد المنال حالياً.
- السيناريو الثالث (الانزلاق نحو الصدام المباشر): خطأ في التقدير أو حادث حدودي قد يجر الناتو وروسيا إلى مواجهة مباشرة، وهو السيناريو الذي يعني فعلياً بداية الحرب العالمية الثالثة.

خاتمة:
يبقى العالم رهيناً لإرادات سياسية متصادمة وطموحات توسعية، وفي ظل غياب لغة الحوار الحقيقية، يظل السؤال "ماذا بعد؟" معلقاً بانتظار ما ستسفر عنه الشهور القادمة من تحولات ميدانية وسياسية. الشيء الوحيد المؤكد هو أن تكلفة السلام، مهما غلت، تظل أرخص بكثير من تكلفة حرب شاملة لن تبقي ولن تذر.`,
    image: 'https://images.unsplash.com/photo-1547721064-36203693e3d9?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '21 مارس 2025',
    views: 125400,
    author: 'عبدو المحلل',
    isTrending: true
  },
  {
    id: 'morocco-vs-zambia-can-2025-hype',
    title: 'مواجهة الحسم: المغاربة يترقبون موقعة "أسود الأطلس" ضد زامبيا في ليلة العبور نحو المجد الأفريقي',
    excerpt: 'تتجه أنظار الملايين من عشاق الكرة المغربية صوب الملعب الكبير لمتابعة المباراة الحاسمة ضد المنتخب الزامبي، وسط آمال عريضة بتأكيد الصدارة ومواصلة المسار الناجح في الكان.',
    content: `تعيش الشوارع المغربية منذ الساعات الأولى من صباح اليوم حالة من الغليان الرياضي والترقب الكبير...`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '20 مارس 2025',
    views: 94200,
    author: 'عبدو الرياضي',
    isTrending: false
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
        if (
          mergedPosts[existingIndex].image !== initialPost.image || 
          mergedPosts[existingIndex].title !== initialPost.title || 
          mergedPosts[existingIndex].isTrending !== initialPost.isTrending ||
          mergedPosts[existingIndex].content !== initialPost.content
        ) {
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
