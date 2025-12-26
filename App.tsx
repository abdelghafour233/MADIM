
import React, { useState, useEffect } from 'react';
import { View, Article, Category, Settings } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import Login from './components/Login.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

const INITIAL_SETTINGS: Settings = {
  siteName: 'عبدو ويب',
  adsenseCode: 'ca-pub-5578524966832192',
  dashboardPassword: '1234'
};

const INITIAL_DATA: Article[] = [
  {
    id: 'morocco-dirham-float-2025',
    title: 'تعويم الدرهم المغربي: هل اقتربت ساعة الحسم؟ تحليل شامل للإيجابيات والسلبيات على جيب المواطن والاقتصاد الوطني',
    excerpt: 'مع تزايد التقارير الدولية حول ضرورة مرونة الصرف، نغوص في ملف تعويم الدرهم المغربي لنكشف تأثيراته المرتقبة على القدرة الشرائية ونمو الاقتصاد.',
    content: `يعود ملف "تعويم الدرهم" أو الانتقال إلى نظام صرف أكثر مرونة ليتصدر واجهة النقاش الاقتصادي في المغرب. وبينما يرى الخبراء الدوليون في هذه الخطوة ضرورة حتمية، يترقب المواطن المغربي بحذر تأثيراتها على معيشه اليومي.

ماذا يعني تعويم الدرهم؟
ببساطة، هو الانتقال من نظام يحدد فيه البنك المركزي قيمة الدرهم بناءً على سلة عملات (الأورو والدولار)، إلى نظام تحدد فيه السوق (العرض والطلب) قيمة العملة. المغرب بدأ هذه الرحلة تدريجياً منذ 2018، والآن يدور الحديث عن مراحل أكثر تقدماً.

الإيجابيات: لماذا يحتاج المغرب للتعويم؟
1. تشجيع الصادرات: عندما تنخفض قيمة العملة محلياً، تصبح المنتجات المغربية (مثل الفوسفاط والسيارات) أكثر تنافسية في الأسواق الدولية.
2. جذب الاستثمارات: مرونة العملة تعطي إشارات إيجابية للمستثمرين الأجانب حول نضج النظام المالي المغربي.
3. حماية الاحتياطيات: يقلل النظام المرن من استنزاف احتياطيات العملة الصعبة للدفاع عن قيمة ثابتة للعملة في وقت الأزمات.

السلبيات: ما هي المخاطر المتوقعة؟
1. التضخم المستورد: المغرب يستورد معظم احتياجاته من الطاقة (البترول والغاز) والقمح بالدولار، وأي انخفاض في قيمة الدرهم سيعني ارتفاعاً مباشراً في أسعار هذه المواد بالسوق الوطنية.
2. تراجع القدرة الشرائية: الارتفاع المرتقب في أسعار المواد المستوردة سينعكس سلباً على تكلفة المعيشة للطبقات الوسطى والفقيرة.
3. عدم استقرار الأسعار: تقلبات العملة قد تجعل من الصعب على الشركات تخطيط ميزانياتها على المدى الطويل بسبب تذبذب تكلفة المواد الأولية.

تأثير التعويم على جيب المواطن
بالنسبة للمواطن العادي، التأثير الأبرز قد يظهر في أسعار المحروقات والإلكترونيات والسفر للخارج. ومع ذلك، يطمئن بنك المغرب دائماً بأن الانتقال سيكون "تدريجياً ومتحكماً فيه" لتفادي الصدمات العنيفة كما حدث في تجارب دول أخرى.

الخلاصة
تعويم الدرهم هو سلاح ذو حدين؛ فهو ضرورة لربط الاقتصاد المغربي بالسوق العالمية، لكنه يتطلب يقظة اجتماعية وإجراءات مرافقة لحماية الفئات الهشة من تقلبات الأسعار. يبقى الرهان على قدرة النسيج الإنتاجي الوطني على الاستفادة من هذه الخطوة لرفع وتيرة النمو.`,
    image: 'https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '8 مارس 2025',
    views: 142000,
    author: 'هيئة التحرير',
    isTrending: true
  },
  {
    id: 'morocco-rainfall-economy-2025',
    title: 'أمطار الخير تعيد الأمل: التساقطات المطرية الأخيرة تنعش السدود وتدفع عجلة الاقتصاد المغربي نحو آفاق واعدة',
    excerpt: 'استبشر المغاربة خيراً بالتساقطات المطرية والثلجية الأخيرة التي عمت مختلف ربوع المملكة، مما أنعش حقينة السدود وأحيا الآمال في موسم فلاحي يعيد التوازن للاقتصاد الوطني.',
    content: `شهدت المملكة المغربية خلال الأيام القليلة الماضية تساقطات مطرية هامة شملت معظم المناطق، وهي التساقطات التي جاءت في وقت حاسم لتنقذ الموسم الفلاحي وتخفف من حدة الإجهاد المائي الذي عانت منه البلاد لسنوات.

انتعاشة السدود والأمن المائي
سجلت المديرية العامة للمياه تحسناً ملحوظاً في نسبة ملء السدود الكبرى، خاصة في أحواض اللكوس، سبو، وأم الربيع. هذا الارتفاع لا يعني فقط تأمين مياه الشرب للمدن الكبرى، بل يضمن أيضاً استمرارية النشاط في المناطق السقوية التي تشكل عصب الصادرات الفلاحية المغربية.

القطاع الفلاحي: الرابح الأكبر
يعتبر القطاع الفلاحي المساهم الرئيسي في الناتج المحلي الإجمالي بالمغرب، وقد أدت هذه الأمطار إلى تحسين وضعية المراعي، مما سيخفض تكاليف إنتاج اللحوم والألبان عبر تقليل الاعتماد على الأعلاف المشتراة. كما أن الزراعات الربيعية والخريفية، خاصة الحبوب والقطاني، ستستفيد بشكل مباشر من رطوبة التربة الحالية.

الأثر الاقتصادي والاجتماعي
من المتوقع أن تؤدي هذه الأمطار إلى خفض معدلات التضخم في المواد الغذائية، حيث بدأت أسعار بعض الخضروات والفواكه تشهد استقراراً نسبياً. كما أن الانتعاش الفلاحي يساهم في خلق فرص شغل واسعة في العالم القروي، مما يحد من الهجرة نحو المدن وينشط الحركة التجارية في الأسواق الأسبوعية.

تفاؤل حذر واستشراف للمستقبل
رغم هذه الإيجابيات، يشدد الخبراء على ضرورة مواصلة سياسة ترشيد استهلاك المياه والاستمرار في بناء محطات تحلية مياه البحر، لضمان استقرار اقتصادي طويل الأمد لا يرتبط كلياً بالتقلبات المناخية. إن أمطار 2025 هي رسالة طمأنة للسوق المغربية، وبداية لتعافي اقتصادي مرتقب يلمسه المواطن في معيشه اليومي.`,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '7 مارس 2025',
    views: 125400,
    author: 'هيئة التحرير',
    isTrending: false
  },
  {
    id: 'sports-preview-egypt-morocco-2025',
    title: 'ترقب عربي كبير: الجماهير المغربية والعربية تترقب صدامات القمة بين مصر ضد جنوب إفريقيا والمغرب ضد مالي',
    excerpt: 'قمة نارية في الأفق.. كيف يرى الشارع الرياضي المغربي والعربي حظوظ "الفراعنة" و"أسود الأطلس" في مواجهات الحسم الأفريقية؟',
    content: `تتجه أنظار الملايين من عشاق الساحرة المستديرة في الوطن العربي والقارة السمراء نحو الملاعب التي ستحتضن مواجهتين من العيار الثقيل...`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '6 مارس 2025',
    views: 105200,
    author: 'عبدو الرياضي',
    isTrending: false
  },
  {
    id: 'morocco-olive-oil-abundance-2025',
    title: 'زيت الزيتون بالمغرب: وفرة استثنائية في الإنتاج وتراجع كبير في الأسعار يثلج صدور المغاربة',
    excerpt: 'بعد سنوات من الغلاء الفاحش، يشهد الموسم الفلاحي الحالي وفرة غير مسبوقة في محاصيل الزيتون، مما أدى إلى انخفاض ملحوظ في أثمان "الذهب الأخضر" بمختلف جهات المملكة.',
    content: `يعيش المواطن المغربي خلال هذه الأسابيع على وقع خبر سار طال انتظاره، حيث سجلت أسواق زيت الزيتون في مختلف ربوع المملكة تراجعاً ملحوظاً في الأسعار...`,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '5 مارس 2025',
    views: 89400,
    author: 'هيئة التحرير',
    isTrending: false
  },
  {
    id: 'temu-shopping-guide-morocco',
    title: 'دليلك الشامل للتسوق من تيمو (Temu) في المغرب: أسعار خيالية وشحن مجاني حتى باب منزلك',
    excerpt: 'لماذا أصبح تيمو التطبيق الأول للتسوق في المغرب؟ نكشف لكم أسرار الأسعار الرخيصة وكيفية الحصول على الشحن المجاني وحزم القسائم.',
    content: `يعتبر تطبيق تيمو (Temu) حالياً ظاهرة عالمية في عالم التجارة الإلكترونية، حيث استطاع جذب ملايين المستخدمين في المغرب بفضل عروضه التي لا تقاوم وتنوعه الهائل الذي يشمل كل شيء من الإلكترونيات إلى الملابس والأدوات المنزلية.

كيف تحصل على أفضل العروض؟
السر يكمن في استخدام روابط الإحالة المباشرة التي تمنحك وصولاً حصرياً لـ "حزم قسائم المستخدم الجديد". هذه القسائم توفر لك مبالغ مالية مهمة تخصم مباشرة من مجموع مشترياتك الأولى.

هدية خاصة لمتابعي "عبدو ويب":
اضغط على الزر أسفله للحصول فوراً على حزمة قسائم بقيمة 1000 درهم مغربي وشحن مجاني لطلبك الأول:

https://temu.to/k/u6zpr84k5n5

لماذا يفضل المغاربة تيمو؟
بالإضافة إلى الأثمان المنافسة، يوفر التطبيق حماية للمشتري وضماناً لاسترداد الأموال في حال لم يكن المنتج مطابقاً للتوقعات. كما أن سرعة الشحن نحو المغرب تحسنت بشكل كبير في الشهور الأخيرة.`,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '4 مارس 2025',
    views: 78200,
    author: 'عبدو التقني',
    isTrending: false
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [posts, setPosts] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (view === 'home') {
      document.title = `${settings.siteName} | أخبار المغرب والتقنية`;
    } else if (view === 'post' && selectedPost) {
      document.title = `${selectedPost.title || selectedPost.name} | ${settings.siteName}`;
    } else if (view === 'admin') {
      document.title = `لوحة التحكم | ${settings.siteName}`;
    }
  }, [view, selectedPost, settings.siteName]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('abdou_blog_v2');
    
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts);
      const dirhamPostId = 'morocco-dirham-float-2025';
      
      // التحقق مما إذا كان مقال الدرهم موجوداً، إذا لم يكن موجوداً أضفه في البداية
      const hasDirhamPost = parsed.some((p: Article) => p.id === dirhamPostId);
      let updatedPosts = [...parsed];
      
      if (!hasDirhamPost) {
        const freshPost = INITIAL_DATA.find(d => d.id === dirhamPostId);
        if (freshPost) updatedPosts = [freshPost, ...updatedPosts];
      }

      // تحديث قسري لمحتوى مقال تيمو لضمان الروابط الجديدة
      updatedPosts = updatedPosts.map((p: Article) => {
        if (p.id === 'temu-shopping-guide-morocco') {
          const freshTemu = INITIAL_DATA.find(d => d.id === 'temu-shopping-guide-morocco');
          return freshTemu ? { ...p, content: freshTemu.content } : p;
        }
        return p;
      });

      setPosts(updatedPosts);
      localStorage.setItem('abdou_blog_v2', JSON.stringify(updatedPosts));
    } else {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v2', JSON.stringify(INITIAL_DATA));
    }

    const savedSettings = localStorage.getItem('abdou_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('abdou_settings', JSON.stringify(INITIAL_SETTINGS));
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setDarkMode(false);
  }, []);

  const updatePosts = (newPosts: Article[]) => {
    setPosts(newPosts);
    localStorage.setItem('abdou_blog_v2', JSON.stringify(newPosts));
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('abdou_settings', JSON.stringify(newSettings));
  };

  const navigateTo = (v: View, p?: Article) => {
    if (p) setSelectedPost(p);
    setView(v);
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
        cartCount={0}
        onOpenCart={() => {}}
      />

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && <Home posts={posts} onPostClick={(p) => navigateTo('post', p)} darkMode={darkMode} />}
        {view === 'post' && selectedPost && <PostDetail post={selectedPost} onBack={() => setView('home')} darkMode={darkMode} settings={settings} />}
        {view === 'admin' && (
          !isAuth ? <Login correctPassword={settings.dashboardPassword || '1234'} onSuccess={() => setIsAuth(true)} /> : 
          <AdminDashboard 
            posts={posts} 
            settings={settings}
            onUpdate={updatePosts}
            onUpdateSettings={updateSettings}
            onLogout={() => setIsAuth(false)}
            darkMode={darkMode}
          />
        )}
      </main>

      <footer className={`mt-20 py-16 border-t transition-all ${darkMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200 shadow-inner'}`}>
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
          <div>
            <div className="text-3xl font-black mb-6"><span className="text-emerald-500">ABDO</span>WEB</div>
            <p className="opacity-60 leading-relaxed font-bold">منصتك المغربية الرائدة لاستكشاف عالم التقنية، تطوير الذات، وآخر الأخبار المحلية بلمسة إبداعية.</p>
          </div>
          <div>
            <h4 className="text-xl font-black mb-6">الأقسام الرئيسية</h4>
            <ul className="space-y-4 opacity-60 font-bold">
              {Object.values(Category).map(c => <li key={c} className="hover:text-emerald-500 cursor-pointer transition-colors">{c}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-black mb-6">تواصل معنا</h4>
            <p className="opacity-60 font-bold mb-4">الدعم الفني والتعاون الإعلاني متوفر 24/7</p>
          </div>
        </div>
        <div className="text-center mt-20 pt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
          جميع الحقوق محفوظة © 2025 لـ {settings.siteName}
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
};

export default App;
