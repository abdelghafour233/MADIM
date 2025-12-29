
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
import LegalPage from './components/LegalPage.tsx';

const INITIAL_SETTINGS: Settings = {
  siteName: 'عبدو ويب',
  adsenseCode: 'ca-pub-5578524966832192',
  dashboardPassword: '1234',
  totalVisits: 0
};

const INITIAL_DATA: Article[] = [
  {
    id: 'morocco-vs-zambia-can-2025-hype',
    title: 'مواجهة الحسم: المغاربة يترقبون موقعة "أسود الأطلس" ضد زامبيا في ليلة العبور نحو المجد الأفريقي',
    excerpt: 'تتجه أنظار الملايين من عشاق الكرة المغربية صوب الملعب الكبير لمتابعة المباراة الحاسمة ضد المنتخب الزامبي، وسط آمال عريضة بتأكيد الصدارة ومواصلة المسار الناجح في الكان.',
    content: `تعيش الشوارع المغربية منذ الساعات الأولى من صباح اليوم حالة من الغليان الرياضي والترقب الكبير، حيث لا صوت يعلو فوق صوت الموقعة المرتقبة التي ستجمع أسود الأطلس بمنتخب زامبيا برسم نهائيات كأس أمم أفريقيا. الأجواء في المقاهي والشوارع من طنجة إلى الكويرة، استعدت المقاهي والساحات العمومية لاستقبال الجماهير عبر شاشات عملاقة، في مشهد يعيد للأذهان ملحمة مونديال قطر. الأعلام الوطنية تزين الشرفات، والقمصان الحمراء والخضراء باتت الزي الرسمي للمغاربة اليوم، في تعبير صريح عن الدعم اللامشروط لكتيبة وليد الركراكي. يدخل المنتخب المغربي المباراة وعينه على النقاط الثلاث ليس فقط لضمان التأهل، بل لتوجيه رسالة قوية للمنافسين مفادها أن "الأسود" جاؤوا للمنافسة على اللقب القاري.`,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '20 مارس 2025',
    views: 98400,
    author: 'عبدو الرياضي',
    isTrending: true
  },
  {
    id: 'ai-impact-morocco-2025',
    title: 'الذكاء الاصطناعي في المغرب: كيف سيغير المشهد الاقتصادي والتعليمي في أفق 2025؟',
    excerpt: 'استكشاف شامل للتحولات التقنية الكبرى التي تشهدها المملكة في مجالات الذكاء الاصطناعي وتأثيرها على سوق الشغل المغربي.',
    content: 'يشهد المغرب تحولاً رقمياً متسارعاً يضع الذكاء الاصطناعي في قلب الاستراتيجيات التنموية. من قطاع الخدمات المالية إلى الفلاحة الذكية، تتبنى المقاولات المغربية تقنيات تعلم الآلة لتعزيز الكفاءة وتطوير المنتجات. إن الحكومة المغربية تعمل على خلق بيئة محفزة للابتكار من خلال دعم الشركات الناشئة وتحديث المناهج التعليمية لتشمل علوم البيانات والبرمجة المتقدمة. التحدي الأكبر يكمن في سد الفجوة الرقمية وتكوين جيل قادر على المنافسة في اقتصاد المعرفة العالمي.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '21 مارس 2025',
    views: 45200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'time-management-for-success',
    title: 'إدارة الوقت في العصر الرقمي: 5 نصائح ذهبية للنجاح في حياتك المهنية والشخصية',
    excerpt: 'تعرف على أفضل التقنيات العلمية لتنظيم يومك وزيادة إنتاجيتك بعيداً عن مشتتات الهواتف الذكية.',
    content: 'في عالم مليء بالمشتتات الرقمية، تصبح إدارة الوقت هي المهارة الأهم للنجاح. أولاً، قاعدة 80/20: ركز على 20% من المهام التي تمنحك 80% من النتائج. ثانياً، تقنية بومودورو: اعمل لمدة 25 دقيقة ثم خذ استراحة قصيرة. ثالثاً، ابدأ بالمهام الصعبة أول الصباح. رابعاً، قلل من تفقد الإشعارات. خامساً، خطط ليومك القادم في المساء. الالتزام بهذه القواعد سيغير حياتك بشكل جذري.',
    image: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '18 مارس 2025',
    views: 22100,
    author: 'عبدو الموجه',
    isTrending: false
  },
  {
    id: 'iphone-16-morocco-review',
    title: 'مراجعة آيفون 16 في المغرب: السعر والمميزات وهل يستحق الشراء فعلاً؟',
    excerpt: 'نقدم لكم تفاصيل أداء أحدث هواتف آبل في السوق المغربية، مع مقارنة الأسعار في الدار البيضاء والرباط.',
    content: 'يأتي آيفون 16 بتغييرات ملحوظة في الكاميرا والمعالج، لكن السؤال الذي يشغل المغاربة هو السعر مقابل القيمة. في هذه المراجعة، نستعرض أداء البطارية تحت ضغط الاستخدام اليومي، وكفاءة زر التحكم في الكاميرا الجديد. كما نتطرق لأسعار الهاتف لدى الموزعين المعتمدين في المغرب والفرق بينه وبين النسخة السابقة. إذا كنت تملك آيفون 15، فربما الترقية ليست ضرورية، أما لمستخدمي الموديلات الأقدم، فهو قفزة نوعية.',
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '17 مارس 2025',
    views: 67300,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'morocco-dirham-float-2025-analysis',
    title: 'تعويم الدرهم المغربي: رحلة الانتقال نحو المرونة والنمو الاقتصادي',
    excerpt: 'تحليل اقتصادي لمسار تعويم العملة الوطنية وتأثيراتها على أسعار الاستهلاك وتنافسية المقاولات.',
    content: 'يعد قرار إصلاح نظام سعر صرف الدرهم، أو ما يعرف بـ "التعويم"، أحد أبرز التحولات الهيكلية في الاقتصاد المغربي خلال العقد الأخير. هذا المسار الذي نهجه بنك المغرب بشكل تدريجي ومحكم، يهدف إلى تعزيز مناعة الاقتصاد الوطني ضد الصدمات الخارجية وتحسين التنافسية الدولية للمملكة. تعني المرونة قدرة العملة على التكيف مع تقلبات الأسواق العالمية مما يشجع التصدير وجلب العملة الصعبة.',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '19 مارس 2025',
    views: 38200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'startup-opportunities-morocco',
    title: 'الشركات الناشئة في المغرب: فرص وتحديات التمويل في سنة 2025',
    excerpt: 'دليل شامل لرواد الأعمال الشباب حول كيفية الحصول على تمويل لمشاريعهم التقنية في المغرب.',
    content: 'أصبح المغرب منصة إقليمية هامة للشركات الناشئة في أفريقيا والشرق الأوسط. بفضل برامج الدعم الحكومي ومسرعات الأعمال، يجد المقاولون الشباب فرصاً واعدة في قطاعات التكنولوجيا المالية والتجارة الإلكترونية. التمويل يظل التحدي الأبرز، لكن ظهور شبكات المستثمرين الملائكة وصناديق رأس المال الاستثماري بدأ يغير المعادلة. ننصح كل رائد أعمال بالتركيز على بناء نموذج عمل قابل للتطوير قبل البحث عن التمويل.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '15 مارس 2025',
    views: 15400,
    author: 'عبدو التقني',
    isTrending: false
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View | 'about' | 'privacy' | 'contact'>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedItem, setSelectedItem] = useState<Article | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('abdou_settings_v3');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedCart = localStorage.getItem('abdou_cart_v3');
    if (savedCart) setCart(JSON.parse(savedCart));

    const consent = localStorage.getItem('abdou_cookie_consent');
    if (consent) setCookieConsent(true);

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
        // تحديث البيانات إذا تم تعديلها في الكود (مهم جداً للصور والمحتوى)
        if (
          mergedPosts[existingIndex].image !== initialPost.image || 
          mergedPosts[existingIndex].title !== initialPost.title ||
          mergedPosts[existingIndex].content !== initialPost.content ||
          mergedPosts[existingIndex].isTrending !== initialPost.isTrending
        ) {
          mergedPosts[existingIndex] = { ...mergedPosts[existingIndex], ...initialPost };
          changed = true;
        }
      }
    });

    // فرز المقالات حسب حالة Trending أولاً
    const sortedPosts = [...mergedPosts].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    setPosts(sortedPosts);
    if (changed || !savedPostsRaw) {
      localStorage.setItem('abdou_blog_v3', JSON.stringify(sortedPosts));
    }
  }, []);

  const handleItemClick = (p: Article) => {
    const updatedPosts = posts.map(item => 
      item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item
    );
    setPosts(updatedPosts);
    localStorage.setItem('abdou_blog_v3', JSON.stringify(updatedPosts));
    setSelectedItem({ ...p, views: (p.views || 0) + 1 });
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view as any}
        setView={setView as any}
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
          onRemove={(id) => setCart(cart.filter(i => i.id !== id))}
          onUpdateQuantity={(id, q) => setCart(cart.map(i => i.id === id ? {...i, quantity: q} : i))}
          onCheckout={() => { setView('checkout'); setShowCart(false); }}
          darkMode={darkMode}
        />
      )}

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && <Home posts={posts} onPostClick={handleItemClick} darkMode={darkMode} />}
        {view === 'post' && selectedItem && <PostDetail post={selectedItem} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedItem && <ProductDetail product={selectedItem} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} onBack={() => setView('home')} darkMode={darkMode} />}
        {view === 'checkout' && <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={() => { alert('تم الطلب!'); setCart([]); setView('home'); }} />}
        
        {(view === 'privacy' || view === 'about' || view === 'contact') && (
          <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />
        )}

        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_blog_v3', JSON.stringify(newPosts));}}
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_settings_v3', JSON.stringify(s));}}
            onLogout={() => setIsAuth(false)}
            darkMode={darkMode}
          />
        )}
      </main>

      <footer className={`mt-20 py-12 border-t ${darkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-black mb-4 tracking-tighter">{settings.siteName}</h3>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              وجهتكم المغربية الموثوقة لأخبار التكنولوجيا، تطوير الذات، والتحليلات الاقتصادية والرياضية الحصرية.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-4">أقسام الموقع</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm opacity-80">
              <li><button onClick={() => setView('home')} className="hover:text-emerald-500">الرئيسية</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-emerald-500">من نحن</button></li>
              <li><button onClick={() => setView('privacy')} className="hover:text-emerald-500">سياسة الخصوصية</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-emerald-500">اتصل بنا</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-4">إحصائيات</h4>
            <p className="text-xs opacity-50 mb-4">نحن نحدث المحتوى يومياً لنقدم لكم الأفضل في المغرب.</p>
            <div className="flex gap-4">
               <span className="opacity-40 text-[10px] font-black uppercase">© 2025 Abdou Web - جميع الحقوق محفوظة</span>
            </div>
          </div>
        </div>
      </footer>

      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-[300] bg-emerald-600 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <p className="text-sm font-bold">نستخدم ملفات تعريف الارتباط لضمان حصولك على أفضل تجربة على موقعنا.</p>
          <button 
            onClick={() => {setCookieConsent(true); localStorage.setItem('abdou_cookie_consent', 'true');}}
            className="px-8 py-2 bg-white text-emerald-600 rounded-xl font-black text-sm"
          >أوافق</button>
        </div>
      )}

      <WhatsAppButton />
    </div>
  );
};

export default App;
