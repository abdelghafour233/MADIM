
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
    id: 'dirham-float-2025-deep-dive',
    title: 'تعويم الدرهم المغربي 2025: الحقائق، المخاوف، وتأثيره الحقيقي على جيب المواطن',
    excerpt: 'هل اقترب المغرب من المرحلة النهائية لتعويم الدرهم؟ تحليل شامل لقرارات بنك المغرب وتأثيرها على الأسعار والقدرة الشرائية.',
    content: `يعد ملف "تعويم الدرهم" من أكثر المواضيع الاقتصادية إثارة للجدل في الصالونات المغربية. مع حلول عام 2025، يكثر التساؤل: هل نحن بصدد مرحلة جديدة من مرونة سعر الصرف؟ 

في هذا المقال، نغوص في كواليس القرار الاقتصادي. إن نظام الصرف المرن الذي يتبناه المغرب تدريجياً يهدف في الأساس إلى تقوية مناعة الاقتصاد الوطني ضد الصدمات الخارجية. لكن، ما يهم المواطن البسيط هو: هل سترتفع الأسعار؟ 

الحقيقة أن بنك المغرب ينهج سياسة "التدرج الحذر". فمنذ عام 2018، تم توسيع نطاق تحرك الدرهم ليصل حالياً إلى 5% صعوداً وهبوطاً. هذا التدرج يحمينا من الانهيارات المفاجئة التي شهدتها عملات في دول أخرى. ومع ذلك، يظل التأثير على المواد المستوردة (مثل المحروقات والإلكترونيات) مرتبطاً بقوة الدرهم أمام الدولار والأورو.

نصيحة الخبراء في "عبدو ويب": التحول نحو المرونة هو دليل على نضج الاقتصاد، لكنه يتطلب من المستهلك المغربي وعياً مالياً أكبر والتركيز على المنتجات المحلية لتقليل الاعتماد على العملة الصعبة.`,
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '03 أبريل 2025',
    views: 3100,
    author: 'عبدو الاقتصادي',
    isTrending: true
  },
  {
    id: 'crypto-morocco-2025',
    title: 'العملات الرقمية في المغرب: هل يقترب "بنك المغرب" من تقنين الكريبتو؟',
    excerpt: 'تحليل شامل لمستقبل البيتكوين والعملات المشفرة بالمغرب في ظل التوجهات الجديدة لعام 2025.',
    content: `يشهد المغرب تحولاً كبيراً في النظرة إلى العملات الرقمية. بعد سنوات من "المنع"، تشير التقارير إلى أن بنك المغرب يشتغل على إطار قانوني لتنظيم الأصول المشفرة. يهدف هذا التوجه إلى حماية المستثمرين الشباب ومواكبة التطور المالي العالمي، مع ضمان عدم التأثير على استقرار العملة الوطنية. ننصح الراغبين في دخول هذا المجال بالتركيز على التعلم التقني قبل الاستثمار المالي.`,
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '02 أبريل 2025',
    views: 4500,
    author: 'عبدو المحلل'
  },
  {
    id: 'world-cup-2030-prep',
    title: 'المغرب 2030: كيف ستبدو المملكة خلال استضافة كأس العالم؟',
    excerpt: 'استعراض لمشاريع الملاعب العملاقة، القطار فائق السرعة، والتحولات السياحية الكبرى المرتقبة.',
    content: `تستعد المملكة المغربية لحدث تاريخي في 2030. من ملعب الحسن الثاني الكبير ببنسليمان إلى توسعة مطارات المملكة، كل شيء يتحرك بسرعة. هذا الحدث ليس مجرد كرة قدم، بل هو رافعة اقتصادية ستخلق آلاف فرص الشغل للشباب وستضع المغرب كوجهة سياحية ورياضية أولى عالمياً. تشمل الاستعدادات أيضاً رقمنة قطاع النقل وتطوير الخدمات الفندقية بجميع المدن المستضيفة.`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '02 أبريل 2025',
    views: 8900,
    author: 'عبدو الرياضي'
  },
  {
    id: 'freelancing-guide-maroc',
    title: 'دليل العمل الحر للمغاربة: كيف تحقق أول 1000 دولار من Upwork؟',
    excerpt: 'خطوات عملية للشباب المغربي لاحتراف العمل الحر، سحب الأرباح بالدرهم، والتعامل مع الضرائب.',
    content: `أصبح الـ Freelancing خياراً ممتازاً للمغاربة المتقنين للغات أو البرمجة أو التصميم. المفتاح هو بناء ملف شخصي قوي واستهداف نيتشات مطلوبة. بالنسبة لسحب الأرباح، يمكن الاعتماد على حسابات دولية أو ربطها بالبنوك المغربية مباشرة عبر التحويلات السلكية. يركز المقال أيضاً على أهمية إدارة الوقت والالتزام بالمواعيد لبناء سمعة طيبة مع الزبناء الدوليين.`,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '01 أبريل 2025',
    views: 12300,
    author: 'عبدو الموجه'
  },
  {
    id: 'mid-range-phones-2025',
    title: 'أفضل هواتف الفئة المتوسطة في المغرب لعام 2025: السعر مقابل الأداء',
    excerpt: 'مقارنة شاملة بين هواتف شاومي وسامسونج وريلمي المتاحة حالياً في الأسواق المغربية.',
    content: `إذا كنت تبحث عن هاتف بميزانية تتراوح بين 2500 و 4000 درهم، فالسوق المغربي مليء بالخيارات. يتصدر Samsung A55 و Xiaomi Redmi Note 14 القائمة بفضل الشاشات الرائعة والبطاريات طويلة الأمد. ننصح المشترين بالتأكد من توفر ضمان الوكيل الرسمي وتجربة الكاميرا قبل الشراء، خاصة مع التطور الكبير في مستشعرات التصوير الليلي لهذه السنة.`,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '01 أبريل 2025',
    views: 6700,
    author: 'عبدو التقني'
  },
  {
    id: 'temu-winter-jacket-2025',
    title: 'أفضل جاكيت شتوي من تيمو (Temu): مراجعة الجودة والسعر ورابط الشراء',
    excerpt: 'تجربتي الحصرية مع جاكيت شتوي أنيق من منصة تيمو، نكتشف معاً جودة القماش، سرعة التوصيل للمغرب وهل يستحق الشراء؟',
    content: `مع دخول موجة البرد في المغرب، أصبح البحث عن ملابس شتوية تجمع بين الأناقة والدفء والسعر المناسب أمراً ضرورياً. في هذا المقال، أشارككم مراجعة دقيقة لجاكيت شتوي قمت بطلبه مؤخراً من منصة تيمو الشهيرة. الجاكيت يتميز بتصميم عصري وخامة داخلية دافئة جداً. يمكنك الحصول على الجاكيت مباشرة من خلال الرابط الرسمي التالي:

https://temu.to/k/epmeiw8zeno`,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '01 أبريل 2025',
    views: 2250,
    author: 'عبدو المراجع'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View | 'about' | 'privacy' | 'contact' | 'terms'>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedItem, setSelectedItem] = useState<Article | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // الإصدار v13.0 لإضافة مقال تعويم الدرهم المغربي المحدث
  const DATA_VERSION = "v13.0_dirham_float_update"; 

  useEffect(() => {
    const savedSettings = localStorage.getItem('abdou_settings_v13');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedCart = localStorage.getItem('abdou_cart_v13');
    if (savedCart) setCart(JSON.parse(savedCart));

    const consent = localStorage.getItem('abdou_cookie_consent_v13');
    if (consent) setCookieConsent(true);

    const savedPostsRaw = localStorage.getItem('abdou_blog_v13');
    const savedVersion = localStorage.getItem('abdou_data_version_v13');
    
    if (savedVersion !== DATA_VERSION) {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v13', JSON.stringify(INITIAL_DATA));
      localStorage.setItem('abdou_data_version_v13', DATA_VERSION);
      
      // مسح النسخ السابقة لضمان الأداء
      ['v12', 'v11', 'v10', 'v9'].forEach(v => {
        localStorage.removeItem(`abdou_blog_${v}`);
        localStorage.removeItem(`abdou_data_version_${v}`);
      });
    } else {
      setPosts(savedPostsRaw ? JSON.parse(savedPostsRaw) : INITIAL_DATA);
    }
  }, []);

  const handleItemClick = (p: Article) => {
    const updatedPosts = posts.map(item => 
      item.id === p.id ? { ...item, views: (item.views || 0) + 1 } : item
    );
    setPosts(updatedPosts);
    localStorage.setItem('abdou_blog_v13', JSON.stringify(updatedPosts));
    setSelectedItem({ ...p, views: (p.views || 0) + 1 });
    setView(p.isProduct ? 'product' : 'post');
    window.scrollTo(0, 0);
  };

  const filteredPosts = posts.filter(p => 
    (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${darkMode ? 'bg-[#0a0a0b] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Navbar 
        currentView={view as any}
        setView={setView as any}
        siteName={settings.siteName}
        onSearch={setSearchQuery}
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
        {view === 'home' && <Home posts={filteredPosts} onPostClick={handleItemClick} darkMode={darkMode} />}
        {view === 'post' && selectedItem && <PostDetail post={selectedItem} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'product' && selectedItem && <ProductDetail product={selectedItem} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} onBack={() => setView('home')} darkMode={darkMode} />}
        {view === 'checkout' && <Checkout total={cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)} onPlaceOrder={() => { alert('تم الطلب!'); setCart([]); setView('home'); }} />}
        
        {(view === 'privacy' || view === 'about' || view === 'contact' || view === 'terms') && (
          <LegalPage type={view as any} darkMode={darkMode} siteName={settings.siteName} />
        )}

        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={(newPosts) => {setPosts(newPosts); localStorage.setItem('abdou_blog_v13', JSON.stringify(newPosts));}}
            onUpdateSettings={(s) => {setSettings(s); localStorage.setItem('abdou_settings_v13', JSON.stringify(s));}}
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
              وجهتكم المغربية الموثوقة لأخبار التكنولوجيا، تطوير الذات، والتحليلات الاقتصادية والرياضية الحصرية. نحن نحدث المحتوى يومياً لنقدم لكم الأفضل.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-4">أقسام الموقع</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm opacity-80">
              <li><button onClick={() => setView('home')} className="hover:text-emerald-500 text-right">الرئيسية</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-emerald-500 text-right">من نحن</button></li>
              <li><button onClick={() => setView('privacy')} className="hover:text-emerald-500 text-right">سياسة الخصوصية</button></li>
              <li><button onClick={() => setView('terms')} className="hover:text-emerald-500 text-right">شروط الاستخدام</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-4">أدسنس 2025</h4>
            <p className="text-xs opacity-50 mb-4">الموقع يضم حالياً 32 مقالاً حصرياً مكتوباً باحترافية لتلائم شروط القبول الصارمة.</p>
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
            onClick={() => {setCookieConsent(true); localStorage.setItem('abdou_cookie_consent_v13', 'true');}}
            className="px-8 py-2 bg-white text-emerald-600 rounded-xl font-black text-sm"
          >أوافق</button>
        </div>
      )}

      <WhatsAppButton />
    </div>
  );
};

export default App;
