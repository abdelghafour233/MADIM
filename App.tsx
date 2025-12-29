
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
    id: 'ww3-aftermath-future-scenarios',
    title: 'أعقاب الحرب العالمية الثالثة: سيناريوهات تقنية وجيوسياسية لمستقبل البشرية',
    excerpt: 'تحليل مستقبلي لما قد يؤول إليه العالم تقنياً وبيئياً في حال نشوب صراع عالمي كبير وتأثير ذلك على القارة الأفريقية.',
    content: `تعد فرضية الحرب العالمية الثالثة من أكثر المواضيع إثارة للقلق والتحليل في آن واحد. في هذا المقال، نستعرض كيف يمكن للتكنولوجيا أن تلعب دوراً مزدوجاً؛ كأداة للدمار وكوسيلة لإعادة الإعمار. أعقاب هذه الحرب لن تكون مجرد دمار مادي، بل ستشهد تحولاً جذرياً في سلاسل الإمداد العالمية، والاعتماد الكلي على الطاقة المتجددة المستقلة، وظهور أنظمة ذكاء اصطناعي لإدارة الموارد المتبقية. المغرب، بموقعه الاستراتيجي، قد يلعب دوراً محورياً كجسر للسلام أو كمركز لإعادة الربط القاري. إن الاستعداد لمثل هذه السيناريوهات يتطلب استثمارات ضخمة في الأمن السيبراني والأمن الغذائي المستدام. يتوقع المحللون أن تكون الحروب القادمة "سيبرانية" بالدرجة الأولى، حيث يتم شل البنية التحتية قبل إطلاق أي رصاصة، مما يجعل السيادة التقنية أهم سلاح في ترسانة الدول المعاصرة.`,
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '30 مارس 2025',
    views: 12400,
    author: 'عبدو المحلل',
    isTrending: true
  },
  {
    id: 'olive-oil-crisis-morocco-2025',
    title: 'أزمة أسعار زيت الزيتون بالمغرب: الأسباب والحلول وتوقعات الموسم القادم',
    excerpt: 'تحليل معمق للارتفاع غير المسبوق في أسعار زيت الزيتون بالمغرب وتأثير الجفاف على الإنتاج الوطني لعام 2025.',
    content: `تعتبر مادة زيت الزيتون ركيزة أساسية في المائدة المغربية، إلا أن الموسمين الأخيرين شهدا طفرة غير مسبوقة في الأسعار أثارت قلق المستهلكين. يعود السبب الرئيسي لهذا الارتفاع إلى توالي سنوات الجفاف وتأثر حقينات السدود، مما أدى إلى تراجع الإنتاج في مناطق رئيسية مثل قلعة السراغنة ووزان. تتدخل الحكومة حالياً عبر تقييد التصدير لضمان تزويد السوق الوطنية بأسعار معقولة، وسط توقعات ببدء استقرار الأسعار مع تحسن التساقطات المطرية الأخيرة. ننصح المستهلكين بالتحقق من جودة الزيت وتجنب الاقتناء من مصادر غير موثوقة لضمان السلامة الصحية.`,
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '22 مارس 2025',
    views: 85200,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'cnss-amo-morocco-2025-guide',
    title: 'دليل التغطية الصحية AMO في المغرب: كيف تستفيد من التعويضات؟',
    excerpt: 'كل ما تحتاج معرفته عن نظام التأمين الإجباري عن المرض وكيفية تسجيل أفراد أسرتك وتتبع ملفاتك.',
    content: `يشهد المغرب ثورة اجتماعية حقيقية عبر تعميم التغطية الصحية الإجبارية (AMO). في هذا المقال، نشرح للعمال غير الأجراء والأشخاص الذين كانوا يستفيدون من "راميد" سابقاً، كيفية تفعيل حساباتهم في الصندوق الوطني للضمان الاجتماعي (CNSS). تتيح البوابة الإلكترونية "MaCNSS" تتبع التعويضات عن الأدوية والعمليات الجراحية بكل سهولة، مما يضمن كرامة صحية لكل مواطن مغربي.`,
    image: 'https://images.unsplash.com/photo-1505751172107-5972297c3377?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '25 مارس 2025',
    views: 41200,
    author: 'عبدو المحلل',
    isTrending: false
  },
  {
    id: 'make-money-online-morocco-2025',
    title: 'أفضل طرق الربح من الإنترنت في المغرب 2025: دليل شامل للمبتدئين',
    excerpt: 'اكتشف كيف يمكنك تحقيق دخل إضافي بالدرهم من خلال العمل الحر، التجارة الإلكترونية، وصناعة المحتوى.',
    content: `الربح من الإنترنت في المغرب لم يعد مجرد حلم، بل أصبح واقعاً يعيشه آلاف الشباب. في هذا الدليل، نستعرض أكثر الطرق فعالية: أولاً، العمل الحر (Freelancing) في مجالات البرمجة والتصميم عبر منصات عالمية. ثانياً، التجارة الإلكترونية المحلية بنظام الدفع عند الاستلام (COD). ثالثاً، صناعة المحتوى على يوتيوب وتيك توك. السر يكمن في التخصص والصبر والتعلم المستمر.`,
    image: 'https://images.unsplash.com/photo-1591115765373-5a9214194c97?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '23 مارس 2025',
    views: 92400,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'argan-oil-future-morocco',
    title: 'مستقبل زيت الأركان المغربي: الذهب السائل بين تحديات المناخ والطلب العالمي',
    excerpt: 'تحليل لوضعية شجرة الأركان بالمغرب وكيف تساهم التعاونيات النسائية في حماية هذا الموروث العالمي.',
    content: `يظل زيت الأركان فخراً مغربياً خالصاً، لكنه يواجه تحديات بيئية كبيرة. التغيرات المناخية أثرت على مردودية الغابات بسوس وماسة، مما دفع الدولة لإطلاق مشاريع غرس آلاف الهكتارات الجديدة. الطلب العالمي المتزايد في قطاع التجميل يجعل من الضروري تثمين المنتج محلياً لضمان استفادة الساكنة المحلية والتعاونيات من هذه الثروة الطبيعية الفريدة.`,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '26 مارس 2025',
    views: 15600,
    author: 'عبدو المحلل',
    isTrending: false
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
    id: 'most-demanded-jobs-morocco-2025',
    title: 'أكثر 10 وظائف مطلوبة في المغرب لعام 2025: أين يوجه الشباب طموحاتهم؟',
    excerpt: 'تحليل لسوق الشغل المغربي والمهن التي تضمن دخلاً مرتفعاً في قطاعات التكنولوجيا والهندسة والخدمات.',
    content: `يتغير سوق الشغل في المغرب بسرعة مذهلة. المهن المرتبطة بتطوير البرمجيات، الأمن السيبراني، والطاقات المتجددة تتصدر القائمة. كما أن قطاع صناعة السيارات والطيران يطلب كفاءات تقنية عالية بشكل مستمر. ننصح الشباب بالتركيز على اللغات والمهارات الناعمة (Soft Skills) بجانب تخصصاتهم التقنية لضمان التميز في المقابلات الوظيفية.`,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1200',
    category: Category.TECH,
    date: '27 مارس 2025',
    views: 38900,
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
  const [searchQuery, setSearchQuery] = useState('');

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
            <h4 className="font-black mb-4">أدسنس 2025</h4>
            <p className="text-xs opacity-50 mb-4">الموقع يضم حالياً 26 مقالاً حصرياً مكتوباً باحترافية لتلائم شروط القبول.</p>
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
