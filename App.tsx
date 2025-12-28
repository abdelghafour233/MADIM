
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
  dashboardPassword: '1234',
  totalVisits: 0
};

const INITIAL_DATA: Article[] = [
  {
    id: 'winter-vitamin-d-mental-health-2025',
    title: 'شمس الشتاء الغائبة: كيف يؤثر نقص فيتامين "د" على نفسيتك؟ دليل شامل لتجاوز كآبة الموسم',
    excerpt: 'لماذا نشعر بالحزن والخمول المفاجئ مع حلول الشتاء؟ نكشف لكم العلاقة العلمية بين نقص فيتامين الشمس واضطرابات المزاج، وكيف تحمي نفسك من الاكتئاب الموسمي.',
    content: `مع تراجع ساعات النهار وغياب الشمس خلف الغيوم في فصل الشتاء، يبدأ الكثيرون في الشعور بنوع من "الخمول النفسي" أو ما يسميه الأطباء بـ "الاكتئاب الموسمي". والسر غالباً ما يكمن في قطرة كيميائية تسمى فيتامين "د".

لماذا يلقب بفيتامين الشمس؟
فيتامين "د" ليس مجرد فيتامين عادي، بل هو هرمون يتم تصنيعه في الجلد عند التعرض للأشعة فوق البنفسجية. في الشتاء، تنخفض هذه الأشعة بشكل حاد، مما يؤدي إلى تراجع مستويات هذا الفيتامين في الجسم.

تأثير نقص فيتامين "د" على الصحة النفسية:
1. هرمون السعادة (السيروتونين): يلعب فيتامين "د" دوراً حيوياً في تنظيم مستويات السيروتونين في الدماغ. عندما ينقص الفيتامين، ينخفض هذا الهرمون المسؤول عن استقرار المزاج، مما يؤدي للشعور بالحزن والتوتر.
2. هرمون النوم (الميلاتونين): يؤثر النقص أيضاً على دورة النوم، مما يجعلك تشعر بالنعاس المستمر نهاراً والأرق ليلاً.
3. التعب المزمن: الشعور بالإرهاق الجسدي الناتج عن نقص الفيتامين ينعكس فوراً على رغبتك في الإنجاز وتفاعلك الاجتماعي.

أعراض يجب ألا تتجاهلها:
- تقلب المزاج المفاجئ بدون سبب واضح.
- الشعور بـ "ثقل" في الأطراف وصعوبة في النهوض من الفراش.
- الرغبة الشديدة في تناول السكريات والنشويات.
- ضعف التركيز وتشتت الانتباه.

كيف تعالج الموقف وتستعيد طاقتك؟
1. التعرض للشمس: حتى في الأيام الغائمة، حاول الخروج للمشي لمدة 15 دقيقة في وقت الذروة (بين 10 صباحاً و 3 ظهراً).
2. الغذاء الغني: ركز على الأسماك الدهنية (السردين، السلمون)، صفار البيض، والفطر.
3. المكملات الغذائية: بعد استشارة الطبيب وإجراء فحص الدم، قد تكون "الجرعات التدعيمية" ضرورية جداً خلال شهور الشتاء.
4. العلاج بالضوء: استخدام مصابيح تحاكي ضوء الشمس في المنزل أثبت فعالية كبيرة في تحسين المزاج.

خاتمة:
نفسيتك ليست مجرد "مشاعر"، بل هي توازن كيميائي في جسدك. الاهتمام بمستويات فيتامين "د" هو استثمار حقيقي في سعادتك وصحتك العقلية خلال فصل الشتاء. لا تدع البرد يطفئ نور إبداعك!`,
    image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '11 مارس 2025',
    views: 112000,
    author: 'عبدو التقني',
    isTrending: true
  },
  {
    id: 'morocco-mali-afcon-2025-backlash',
    title: 'تعادل بطعم الخسارة: هل انتهى مفعول "رأس لافوكا"؟ تذمر واسع بين المغاربة من "عناد" الركراكي التكتيكي',
    excerpt: 'انقسام حاد في الشارع الرياضي المغربي بعد التعادل المخيب أمام مالي في كأس إفريقيا. الجماهير تفتح النار على اختيارات الركراكي وتطالب بتغيير "الأسلوب المكشوف".',
    content: `سادت حالة من الإحباط والغضب وسط الجماهير المغربية عقب صافرة نهاية مباراة "أسود الأطلس" ضد منتخب مالي...`,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    category: Category.MOROCCO_NEWS,
    date: '10 مارس 2025',
    views: 156800,
    author: 'هيئة التحرير الرياضية',
    isTrending: false
  },
  {
    id: 'books-wealth-financial-awareness-2025',
    title: 'قوة القراءة: كيف تساهم كتب الثراء في بناء وعيك المالي وتغيير واقعك الاقتصادي؟',
    excerpt: 'هل القراءة تجلب المال فعلاً؟ نكشف لكم كيف نجحت كتب الثراء العالمية في تحويل آلاف الأشخاص من الفقر إلى الاستقلال المالي عبر تغيير "عقلية الندرة" إلى "عقلية الوفرة".',
    content: `لطالما كان الفرق بين الغني والفقير يبدأ من "العقل"...`,
    image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1200',
    category: Category.SELF_DEV,
    date: '10 مارس 2025',
    views: 92300,
    author: 'عبدو التقني',
    isTrending: false
  },
  {
    id: 'temu-leather-jackets-2025',
    title: 'أناقة الشتاء: مراجعة لأفضل الجواكيت الجلدية من تيمو (Temu) في المغرب - جودة عالية وأثمان صادمة',
    excerpt: 'هل تبحث عن الأناقة والتدفئة بسعر معقول؟ جربنا لكم أرقى الجواكيت الجلدية المتوفرة على منصة تيمو، والنتائج كانت مذهلة من حيث التصميم والمتانة.',
    content: `تعتبر الجواكيت الجلدية قطعة أساسية في خزانة كل شاب مغربي يبحث عن إطلالة عصرية وفخمة...
https://temu.to/k/ej9j3nai23s`,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200',
    category: Category.REVIEWS,
    date: '9 مارس 2025',
    views: 85200,
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
    const isReturningVisitor = sessionStorage.getItem('visited_session');
    const savedSettings = localStorage.getItem('abdou_settings');
    let currentSettings = savedSettings ? JSON.parse(savedSettings) : INITIAL_SETTINGS;

    if (!isReturningVisitor) {
      currentSettings.totalVisits = (currentSettings.totalVisits || 0) + 1;
      setSettings(currentSettings);
      localStorage.setItem('abdou_settings', JSON.stringify(currentSettings));
      sessionStorage.setItem('visited_session', 'true');
    } else {
      setSettings(currentSettings);
    }
  }, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem('abdou_blog_v2');
    if (savedPosts) {
      const parsed: Article[] = JSON.parse(savedPosts);
      const newPostIds = [
        'winter-vitamin-d-mental-health-2025',
        'morocco-mali-afcon-2025-backlash',
        'books-wealth-financial-awareness-2025'
      ];
      
      let updatedPosts = [...parsed];
      let needsUpdate = false;

      newPostIds.forEach(id => {
        if (!updatedPosts.some(p => p.id === id)) {
          const freshPost = INITIAL_DATA.find(d => d.id === id);
          if (freshPost) {
            updatedPosts = [freshPost, ...updatedPosts];
            needsUpdate = true;
          }
        }
      });

      if (needsUpdate) {
        setPosts(updatedPosts);
        localStorage.setItem('abdou_blog_v2', JSON.stringify(updatedPosts));
      } else {
        setPosts(parsed);
      }
    } else {
      setPosts(INITIAL_DATA);
      localStorage.setItem('abdou_blog_v2', JSON.stringify(INITIAL_DATA));
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

  const handlePostClick = (p: Article) => {
    const updatedPosts = posts.map(item => 
      item.id === p.id ? { ...item, views: item.views + 1 } : item
    );
    updatePosts(updatedPosts);
    setSelectedPost({ ...p, views: p.views + 1 });
    setView('post');
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
        toggleDarkMode={() => {
          const newMode = !darkMode;
          setDarkMode(newMode);
          localStorage.setItem('theme', newMode ? 'dark' : 'light');
        }}
        cartCount={0}
        onOpenCart={() => {}}
      />

      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow">
        {view === 'home' && <Home posts={posts} onPostClick={handlePostClick} darkMode={darkMode} />}
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
             <h4 className="text-xl font-black mb-6">إحصائيات سريعة</h4>
             <div className="flex flex-col gap-2 opacity-60 font-black text-sm">
                <span>👥 زوار الموقع: {settings.totalVisits?.toLocaleString()}</span>
                <span>📝 عدد المقالات: {posts.length}</span>
             </div>
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
