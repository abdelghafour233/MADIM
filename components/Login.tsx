
import React, { useState } from 'react';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (pass === '1234') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 text-center animate-fadeIn">
      <div className="glass p-12 rounded-[40px] shadow-2xl">
        <div className="text-5xl mb-8">🔒</div>
        <h2 className="text-3xl font-black mb-4">منطقة الإدارة</h2>
        <p className="text-slate-500 font-bold mb-10 text-sm tracking-wide">يرجى إدخال كلمة السر الخاصة بعبدو</p>
        
        <input 
          type="password"
          className={`w-full p-5 bg-black/40 rounded-2xl outline-none font-bold text-lg mb-6 text-center border-2 transition-all ${error ? 'border-red-500' : 'border-transparent focus:border-emerald-500'}`}
          placeholder="••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        
        <button onClick={handleLogin} className="w-full py-5 bg-emerald-600 rounded-2xl font-black text-xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20">
          دخول للنظام 🚀
        </button>
      </div>
    </div>
  );
};

export default Login;
