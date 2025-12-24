
import React, { useState } from 'react';
import { View } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  siteName: string;
  onSearch: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, siteName, onSearch, darkMode, toggleDarkMode }) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="sticky top-0 z-50">
      <nav className={`glass border-b transition-colors duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-100 text-slate-900'} backdrop-blur-md`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div 
            className="text-2xl font-black cursor-pointer flex items-center gap-3 group" 
            onClick={() => {setView('home'); setSearchValue(''); onSearch('');}}
          >
            <div className="bg-emerald-600 text-white p-2.5 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="hidden sm:block font-black tracking-tighter text-2xl">{siteName}</span>
          </div>

          <div className="flex-grow max-w-lg relative hidden lg:block">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="ابحث عن مراجعة، خبر، أو مقال تقني..." 
              value={searchValue}
              onChange={(e) => {setSearchValue(e.target.value); onSearch(e.target.value);}}
              className={`w-full rounded-2xl py-3.5 pr-12 pl-4 font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500/50 transition-all ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
            />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 transition-all hover:scale-110">
               {darkMode ? '🌙' : '☀️'}
            </button>
            <button 
              onClick={() => setView('dashboard')} 
              className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-sm hidden md:block hover:bg-emerald-700 transition-all shadow-md active:scale-95"
            >
              لوحة التحكم
            </button>
            <button onClick={() => setView('dashboard')} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 md:hidden">⚙️</button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
