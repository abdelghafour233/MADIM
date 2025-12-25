
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
    <header className="sticky top-0 z-[150]">
      <nav className={`glass border-b transition-colors duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-100 text-slate-900'} backdrop-blur-md`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div 
            className="text-2xl font-black cursor-pointer flex items-center gap-3 group" 
            onClick={() => {setView('home'); setSearchValue(''); onSearch('');}}
          >
            <div className="bg-emerald-600 text-white p-2 rounded-xl">✍️</div>
            <span className="hidden sm:block font-black tracking-tighter text-2xl">{siteName}</span>
          </div>

          <div className="flex-grow max-w-lg relative hidden md:block">
            <input 
              type="text" 
              placeholder="ابحث عن مقالة أو مراجعة..." 
              value={searchValue}
              onChange={(e) => {setSearchValue(e.target.value); onSearch(e.target.value);}}
              className={`w-full rounded-2xl py-3 px-6 font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500 transition-all ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
            />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 transition-all">
               {darkMode ? '🌙' : '☀️'}
            </button>
            <button 
              onClick={() => setView('dashboard')} 
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm hidden sm:block hover:bg-emerald-600 transition-all"
            >
              الإدارة
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
