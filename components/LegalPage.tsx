
import React from 'react';
import { Settings } from '../types';

interface LegalPageProps {
  type: 'about' | 'privacy' | 'contact' | 'terms';
  darkMode: boolean;
  settings: Settings;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, darkMode, settings }) => {
  const content = {
    about: {
      title: 'من نحن - عبدو ويب',
      body: `مرحباً بكم في ${settings.siteName}، المنصة المغربية الرائدة والمتخصصة في تقديم المحتوى التقني والاقتصادي والاجتماعي برؤية عصرية. تأسس موقعنا في عام 2025 ليكون جسراً معرفياً يربط القارئ المغربي بآخر التطورات العالمية والمحلية.`
    },
    privacy: {
      title: 'سياسة الخصوصية',
      body: `في ${settings.siteName}، نعتبر خصوصية زوارنا من أولوياتنا القصوى. نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وعرض الإعلانات المناسبة.`
    },
    terms: {
      title: 'شروط الاستخدام',
      body: `باستخدامك لموقعنا، فإنك توافق على الالتزام بشروط الخدمة. جميع المحتويات هي ملكية فكرية لموقع ${settings.siteName}.`
    },
    contact: {
      title: 'اتصل بنا - نحن في خدمتك',
      body: `يسعدنا دائماً الاستماع إلى ملاحظاتكم. تواصلوا معنا عبر وسائل التواصل الرسمية أدناه:`
    }
  };

  const current = content[type];

  return (
    <div className="max-w-4xl mx-auto py-20 animate-fadeIn text-right px-4" dir="rtl">
      <div className={`p-8 md:p-20 rounded-[40px] md:rounded-[60px] shadow-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'}`}>
        <h1 className="text-3xl md:text-5xl font-black mb-10 text-emerald-500 inline-block">{current.title}</h1>
        <div className={`text-lg md:text-xl leading-[2] md:leading-[2.2] font-medium space-y-8 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          <p>{current.body}</p>
          
          {type === 'contact' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" className="bg-emerald-600/10 p-8 rounded-[35px] border border-emerald-500/20 text-center hover:bg-emerald-600/20 transition-all group">
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">💬</span>
                <span className="font-black text-sm block mb-2 uppercase opacity-50">واتساب</span>
                <span className="font-black text-lg text-emerald-500">راسلنا الآن</span>
              </a>
              
              <a href={settings.telegramLink} target="_blank" className="bg-blue-600/10 p-8 rounded-[35px] border border-blue-500/20 text-center hover:bg-blue-600/20 transition-all group">
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">✈️</span>
                <span className="font-black text-sm block mb-2 uppercase opacity-50">تيليجرام</span>
                <span className="font-black text-lg text-blue-500">انضم للقناة</span>
              </a>

              <a href={settings.facebookLink} target="_blank" className="bg-[#1877F2]/10 p-8 rounded-[35px] border border-[#1877F2]/20 text-center hover:bg-[#1877F2]/20 transition-all group">
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">👥</span>
                <span className="font-black text-sm block mb-2 uppercase opacity-50">فايسبوك</span>
                <span className="font-black text-lg text-[#1877F2]">صفحتنا الرسمية</span>
              </a>

              <a href={settings.instagramLink} target="_blank" className="bg-pink-600/10 p-8 rounded-[35px] border border-pink-500/20 text-center hover:bg-pink-600/20 transition-all group">
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">📸</span>
                <span className="font-black text-sm block mb-2 uppercase opacity-50">إنستغرام</span>
                <span className="font-black text-lg text-pink-500">تابعنا للمزيد</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
