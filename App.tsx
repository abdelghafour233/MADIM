
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
    id: 'olive-oil-crisis-morocco-2025',
    title: 'أزمة أسعار زيت الزيتون بالمغرب: الأسباب والحلول وتوقعات الموسم القادم',
    excerpt: 'تحليل معمق للارتفاع غير المسبوق في أسعار زيت الزيتون بالمغرب وتأثير الجفاف على الإنتاج الوطني لعام 2025.',
    content: `تعتبر مادة زيت الزيتون ركيزة أساسية في المائدة المغربية، إلا أن الموسمين الأخيرين شهدا طفرة غير مسبوقة في الأسعار أثارت قلق المستهلكين. يعود السبب الرئيسي لهذا الارتفاع إلى توالي سنوات الجفاف وتأثر حقينات السدود، مما أدى إلى تراجع الإنتاج في مناطق رئيسية مثل قلعة السراغنة ووزان. تتدخل الحكومة حالياً عبر تقييد التصدير لضمان تزويد السوق الوطنية بأسعار معقولة، وسط توقعات ببدء استقرار الأسعار مع تحسن التساقطات المطرية الأخيرة. ننصح المستهلكين بالتحقق من جودة الزيت وتجنب الاقتناء من مصادر غير موثوقة لضمان السلامة الصحية.`,
    // تم تحديث الرابط هنا لضمان الظهور
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '22 مارس 2025',
    views: 85200,
    author: 'عبدو المحلل',
    isTrending: true
  },
  {
    id: 'morocco-dirham-float-2025-deep-analysis',
    title: 'تعويم الدرهم المغربي في 2025: هل تنجح المملكة في تحقيق التوازن المالي؟',
    excerpt: 'دراسة اقتصادية حول مسار مرونة سعر صرف الدرهم وتأثيراته على القدرة الشرائية والميزان التجاري.',
    content: `يواصل المغرب نهج سياسة التعويم التدريجي للدرهم بخطى ثابتة ومدروسة من طرف بنك المغرب. يهدف هذا الإصلاح الهيكلي إلى جعل الاقتصاد الوطني أكثر قدرة على امتصاص الصدمات الخارجية وتعزيز التنافسية الدولية للصادرات المغربية. رغم المخاوف من تأثير تقلبات العملة على أسعار المواد المستوردة، إلا أن المؤشرات الحالية تؤكد توفر المغرب على احتياطات كافية من العملة الصعبة لضمان استقرار نسبي. إن الانتقال من نظام صرف ثابت إلى مرن هو رحلة ضرورية للاندماج الكامل في الاقتصاد العالمي.`,
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '21 مارس 2025',
    views: 42300,
    author: 'عبدو الاقتصادي',
    isTrending: false
  },
  {
    id: 'morocco-vs-zambia-can-2025-hype',
    title: 'مواجهة الحسم: أسود الأطلس ضد زامبيا في ليلة العبور نحو المجد الأفريقي',
    excerpt: 'تتجه الأنظار صوب الملعب الكبير لمتابعة مباراة المنتخب المغربي الحاسمة ضد زامبيا في الكان.',
    content: `يعيش الشارع الرياضي المغربي حالة من الترقب الكبير لمباراة المنتخب الوطني ضد زامبيا. كتيبة وليد الركراكي تدخل المباراة بكامل نجومها، مع طموح كبير لتأكيد الريادة الأفريقية. التحضيرات التقنية والذهنية في أعلى مستوياتها، والجمهور المغربي يستعد للتنقل بكثافة لمساندة الأسود.`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '20 مارس 2025',
    views: 125400,
    author: 'عبدو الرياضي',
    isTrending: false
  },
  {
    id: 'ai-tools-for-students-2025',
    title: 'أفضل 5 أدوات ذكاء اصطناعي للطلبة في المغرب: كيف تدرس بذكاء؟',
    excerpt: 'دليل شامل لأدوات تقنية ستساعدك في البحث العلمي وكتابة الأطروحات وتلخيص الدروس باحترافية.',
    content: `لم يعد الذكاء الاصطناعي مجرد رفاهية، بل أصبح ضرورة للطلبة والباحثين. في هذا المقال نستعرض أدوات مثل ChatGPT للتلخيص، وPerplexity للبحث الموثق، وGrammarly لتحسين الكتابة بالإنجليزية. هذه التقنيات تساعد الطالب المغربي على توفير الوقت والتركيز على الإبداع والتحليل بدلاً من المهام الروتينية.`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '19 مارس 2025',
    views: 33100,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'e-commerce-success-morocco',
    title: 'دليل النجاح في التجارة الإلكترونية بالمغرب: كيف تبدأ من الصفر؟',
    excerpt: 'خطوات عملية لإنشاء مشروعك الخاص في الدفع عند الاستلام (COD) بالسوق المغربية.',
    content: `التجارة الإلكترونية في المغرب تعيش عصرها الذهبي. للبدء، تحتاج أولاً لاختيار "نيش" مطلوب، ثم إنشاء متجر بسيط، والتعاقد مع شركة توصيل موثوقة. التركيز على جودة المنتج وخدمة العملاء هو السر الحقيقي للنمو والاستدامة في هذا المجال التنافسي.`,
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '18 مارس 2025',
    views: 29800,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'mental-health-tech-age',
    title: 'الصحة النفسية في عصر الشاشات: كيف تحافظ على هدوئك الرقمي؟',
    excerpt: 'نصائح عملية للتخلص من إدمان الهاتف والتعامل مع ضغوط منصات التواصل الاجتماعي.',
    content: `نقضي ساعات طويلة أمام الشاشات مما يؤثر على جودة نومنا وتركيزنا. الصيام الرقمي لمدة ساعة يومياً قبل النوم، وتعطيل الإشعارات غير الضرورية، وممارسة التأمل هي خطوات بسيطة لاستعادة السلام النفسي والتحكم في وقتنا الثمين.`,
    image: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '17 مارس 2025',
    views: 18400,
    author: 'عبدو الموجه',
    isTrending: false
  },
  {
    id: 'iphone-16-pro-max-morocco-price',
    title: 'آيفون 16 برو ماكس: السعر في المغرب ومراجعة الأداء الفعلي',
    excerpt: 'هل يستحق الهاتف سعره الحالي في الأسواق المغربية؟ تحليل للكاميرا والبطارية.',
    content: `يأتي آيفون 16 برو ماكس بمواصفات مبهرة، خاصة في تصوير الفيديو. في المغرب، تتراوح الأسعار حسب الموزعين. الهاتف يقدم أداءً استثنائياً بفضل معالج A18 Pro، لكن إذا كنت تملك النسخة السابقة، فقد لا تحتاج للترقية الفورية.`,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '16 مارس 2025',
    views: 55200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'morning-routine-high-performance',
    title: 'الروتين الصباحي للناجحين: كيف تبدأ يومك بطاقة متجددة؟',
    excerpt: 'عادات صباحية بسيطة طبقها مشاهير رواد الأعمال لتحسين إنتاجيتهم وصحتهم البدنية.',
    content: `الاستيقاظ الباكر، شرب الماء، ممارسة الرياضة الخفيفة، والقراءة. هذه العادات تشكل فارقاً كبيراً في أدائك اليومي. السر ليس في كثرة المهام بل في جودة البداية والالتزام بالاستمرارية.`,
    image: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '15 مارس 2025',
    views: 21600,
    author: 'عبدو الموجه',
    isTrending: false
  },
  {
    id: 'morocco-tourism-2025-records',
    title: 'السياحة في المغرب 2025: أرقام قياسية ووجهات جديدة تخطف الأنظار',
    excerpt: 'كيف تحول المغرب إلى الوجهة الأولى في أفريقيا بفضل استراتيجية الترويج الجديدة؟',
    content: `تشهد مدن مراكش، أكادير، وشفشاون تدفقاً سياحياً غير مسبوق. الاستثمارات في البنية التحتية والفنادق بدأت تؤتي ثمارها، مما يعزز مكانة المغرب كقبلة عالمية للسياح الباحثين عن الأصالة والحداثة.`,
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '14 مارس 2025',
    views: 39400,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'samsung-s25-ultra-leaks',
    title: 'تسريبات سامسونج S25 ألترا: الوحش القادم الذي سيغير قواعد اللعبة',
    excerpt: 'كل ما نعرفه عن تصميم وكاميرا هاتف سامسونج القادم لمنافسة آيفون.',
    content: `تشير التسريبات إلى تغيير جذري في التصميم ليصبح أكثر راحة في اليد، مع مستشعرات كاميرا هي الأقوى في تاريخ الهواتف الذكية. سامسونج تراهن على الذكاء الاصطناعي المدمج بشكل كامل في النظام.`,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '13 مارس 2025',
    views: 47200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'freelance-market-morocco-2025',
    title: 'سوق العمل الحر بالمغرب: أفضل المجالات المطلوبة للعمل من المنزل',
    excerpt: 'دليل البرمجة، التصميم، وكتابة المحتوى للشباب المغربي الباحث عن دخل إضافي.',
    content: `العمل الحر (Freelance) أصبح ملاذاً للكثير من الشباب المغربي. البرمجة بلغة Python، تصميم واجهة المستخدم UI/UX، والتسويق الرقمي هي أكثر المجالات طلباً حالياً على منصات مثل Upwork وخمسات.`,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '12 مارس 2025',
    views: 31200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'casablanca-metro-project-updates',
    title: 'مترو الدار البيضاء: هل يقترب الحلم من التحقق في 2025؟',
    excerpt: 'آخر أخبار مشاريع النقل الكبرى في العاصمة الاقتصادية وتأثيرها على حركة السير.',
    content: `تتواصل الأشغال في خطوط الترامواي والحافلات عالية الجودة بالدار البيضاء، وسط نقاشات حول إمكانية إنشاء خط مترو مستقبلي لتخفيف الضغط المروري الخانق. العاصمة الاقتصادية تستعد لثورة في قطاع النقل.`,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '11 مارس 2025',
    views: 28400,
    author: 'عبدو المحلل',
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
        // تحديث إجباري وشامل لضمان ظهور الصور وتصحيح المحتوى
        if (
          mergedPosts[existingIndex].image !== initialPost.image || 
          mergedPosts[existingIndex].title !== initialPost.title ||
          mergedPosts[existingIndex].content !== initialPost.content ||
          mergedPosts[existingIndex].excerpt !== initialPost.excerpt
        ) {
          mergedPosts[existingIndex] = { ...mergedPosts[existingIndex], ...initialPost };
          changed = true;
        }
      }
    });

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
              وجهتكم المغربية الموثوقة لأخبار التكنولوجيا، تطوير الذات، والتحليلات الاقتصادية والرياضية الحصرية. نحن نحدث المحتوى يومياً لنقدم لكم الأفضل.
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
            <h4 className="font-black mb-4">أدسنس</h4>
            <p className="text-xs opacity-50 mb-4">جميع المقالات حصرية ومكتوبة باحترافية لتلائم شروط جوجل أدسنس.</p>
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
