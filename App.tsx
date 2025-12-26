
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
    id: 'sports-preview-egypt-morocco-2025',
    title: 'ترقب عربي كبير: الجماهير المغربية والعربية تترقب صدامات القمة بين مصر ضد جنوب إفريقيا والمغرب ضد مالي',
    excerpt: 'قمة نارية في الأفق.. كيف يرى الشارع الرياضي المغربي والعربي حظوظ "الفراعنة" و"أسود الأطلس" في مواجهات الحسم الأفريقية؟',
    content: `تتجه أنظار الملايين من عشاق الساحرة المستديرة في الوطن العربي والقارة السمراء نحو الملاعب التي ستحتضن مواجهتين من العيار الثقيل، حيث يصطدم المنتخب المصري بنظيره الجنوب أفريقي، بينما يواجه المنتخب المغربي "أسود الأطلس" طموح المنتخب المالي القوي.

مصر ضد جنوب إفريقيا: صراع التاريخ والسرعة
يرى الجمهور المغربي والعربي أن مواجهة مصر وجنوب إفريقيا دائماً ما تحمل طابعاً خاصاً. التوقعات تشير إلى مباراة تكتيكية بامتياز، حيث يعتمد "الفراعنة" على خبرة لاعبيهم الدولية والروح القتالية العالية. الشارع الرياضي العربي يمني النفس بفوز مصري يعيد الهيبة للكرة العربية في المحافل القارية، رغم الحذر الشديد من سرعة ومرونة لاعبي "بافانا بافانا" الذين دائماً ما يشكلون عقبة صعبة في الأدوار الإقصائية.

المغرب ضد مالي: اختبار القوة والانسجام
أما عن "أسود الأطلس"، فالآمال معقودة على كتيبة وليد الركراكي لمواصلة التألق. الجماهير المغربية تبدو متفائلة ولكن بحذر، فمنتخب مالي يمتلك قوة بدنية هائلة ولاعبين ينشطون في أكبر الدوريات الأوروبية. التوقعات في المقاهي والشوارع المغربية تشير إلى أن مفتاح الفوز يكمن في السيطرة على وسط الميدان واستغلال الكرات الثابتة، مع مؤازرة جماهيرية غفيرة ستكون هي اللاعب رقم 12.

التضامن العربي في الملاعب
ما يميز هذه النسخة من التوقعات هو حجم التضامن الكبير؛ حيث تعلن الجماهير المغربية عبر منصات التواصل الاجتماعي عن دعمها الكامل للمنتخب المصري، وفي المقابل، تترقب الجماهير من المحيط إلى الخليج تأهل الأسود، في صورة تجسد وحدة المصير الرياضي العربي.

ختاماً، تبقى هذه المباريات مفتوحة على كل الاحتمالات، لكن الطموح العربي لا يرضى بأقل من العبور المشترك نحو الأدوار النهائية لكتابة تاريخ جديد للكرة العربية في إفريقيا.`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '6 مارس 2025',
    views: 105200,
    author: 'عبدو الرياضي',
    isTrending: true
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
    title: 'دليلك الشامل للتسوق من تيمو (Temu) in المغرب: أسعار خيالية وشحن مجاني حتى باب منزلك',
    excerpt: 'لماذا أصبح تيمو التطبيق الأول للتسوق في المغرب؟ نكشف لكم أسرار الأسعار الرخيصة وكيفية الحصول على الشحن المجاني وحزم القسائم.',
    content: `يعتبر تطبيق تيمو (Temu) حالياً ظاهرة عالمية في عالم التجارة الإلكترونية... هو وجهتك المثالية التي تجمع بين التنوع والتوفير. يمكنكم التسجيل عبر الرابط التالي للحصول على خصومات: https://temu.to/k/u6zpr84k5n5`,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '4 مارس 2025',
    views: 78200,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'afcon-2025-opening-v2',
    title: 'المغرب يبهر العالم: حفل افتتاح "الكان" يكتب تاريخاً جديداً للكرة الإفريقية',
    excerpt: 'بمزيج بين العراقة والتكنولوجيا، المملكة المغربية تفتتح كأس أمم أفريقيا بحفل أسطوري حبس أنفاس الملايين حول العالم.',
    content: 'بألوان العلم المغربي وصيحات آلاف المشجعين التي هزت أركان الملعب، انطلقت رسمياً نهائيات كأس أمم إفريقيا...',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '3 مارس 2025',
    views: 52400,
    author: 'هيئة التحرير',
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
      setPosts(JSON.parse(savedPosts));
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
