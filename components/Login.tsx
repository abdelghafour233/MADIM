
import React, { useState } from 'react';

interface LoginProps {
  correctPassword: string;
  onSuccess: () => void;
  darkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ correctPassword, onSuccess, darkMode }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 animate-slideUp">
      <div className={`p-10 rounded-[40px] shadow-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 mx-auto mb-6">🔒</div>
          <h2 className="text-3xl font-black mb-2">منطقة محظورة</h2>
          <p className="text-slate-400 font-bold">يرجى إدخال كلمة سر الإدارة للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block font-black mb-3 text-slate-500 mr-2">كلمة السر</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"}
                className={`w-full p-5 pl-14 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-lg border-2 transition-all ${error ? 'border-red-500 animate-shake' : 'border-transparent focus:border-emerald-500'}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs font-black mt-2 mr-2">كلمة السر غير صحيحة! حاول مجدداً.</p>}
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            دخول للوحة التحكم 🔓
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs font-bold">
          كلمة السر الافتراضية هي <span className="text-emerald-600">1234</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
