
import React, { useState } from 'react';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = () => {
    // كلمة السر هي 1234
    if (pass === '1234') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 text-center animate-fadeIn">
      <div className="glass p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="text-5xl mb-8">🔒</div>
        <h2 className="text-3xl font-black mb-4">منطقة الإدارة</h2>
        <p className="text-slate-500 font-bold mb-10 text-sm tracking-wide">
          كلمة السر الافتراضية هي <span className="text-emerald-500">1234</span>
        </p>
        
        <div className="relative mb-8">
          <input 
            type={showPass ? "text" : "password"}
            className={`w-full p-6 bg-black/40 rounded-2xl outline-none font-black text-2xl text-center border-2 transition-all ${error ? 'border-red-500 animate-shake' : 'border-transparent focus:border-emerald-500'}`}
            placeholder="••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-emerald-500 transition-colors"
          >
            {showPass ? (
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
        
        <button onClick={handleLogin} className="w-full py-5 bg-emerald-600 rounded-2xl font-black text-xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
          دخول للنظام 🚀
        </button>
      </div>
    </div>
  );
};

export default Login;
