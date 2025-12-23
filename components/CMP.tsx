
import React, { useState, useEffect } from 'react';

const CMP: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('google_consent_choice');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateConsent = (status: 'granted' | 'denied') => {
    const consentConfig = {
      'ad_storage': status,
      'ad_user_data': status,
      'ad_personalization': status,
      'analytics_storage': status,
    };

    // تحديث Google Tag Manager / AdSense
    // @ts-ignore
    window.gtag('consent', 'update', consentConfig);
    
    // حفظ في التخزين المحلي
    localStorage.setItem('google_consent_choice', JSON.stringify(consentConfig));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1000] p-4 md:p-8 flex justify-center items-end pointer-events-none">
      <div className="glass w-full max-w-4xl rounded-[32px] shadow-2xl border border-white/50 p-6 md:p-10 pointer-events-auto animate-slideUp">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-right">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              الخصوصية وتفضيلات الكوكيز
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              نحن وشركاؤنا نستخدم تقنيات مثل ملفات تعريف الارتباط لمعالجة البيانات الشخصية لتقديم إعلانات مخصصة وقياس أدائها. يمكنك اختيار موافقتك أدناه.
            </p>
          </div>

          <div className="flex flex-col w-full md:w-auto gap-3 min-w-[240px]">
            <button 
              onClick={() => updateConsent('granted')}
              className="w-full bg-emerald-600 text-white py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
            >
              Autoriser / أوافق
            </button>
            <button 
              onClick={() => updateConsent('denied')}
              className="w-full bg-slate-100 text-slate-600 py-4 px-8 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all active:scale-95"
            >
              Ne pas consentir / رفض
            </button>
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="w-full text-slate-400 py-2 font-bold text-sm hover:text-emerald-600 transition-colors underline decoration-dotted underline-offset-4"
            >
              Gérer les options / إدارة الخيارات
            </button>
          </div>
        </div>

        {showOptions && (
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {[
              { id: 'ads', label: 'إعلانات مخصصة (Personalized Ads)', desc: 'تسمح لنا بعرض منتجات تهمك بناءً على تصفحك.' },
              { id: 'stats', label: 'إحصائيات الاستخدام (Analytics)', desc: 'تساعدنا في فهم كيفية تحسين الموقع.' }
            ].map(opt => (
              <div key={opt.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                <div className="w-5 h-5 mt-1 bg-emerald-500 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">{opt.label}</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CMP;
