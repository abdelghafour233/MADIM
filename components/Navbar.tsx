
import React, { useState } from 'react';
import { View } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  siteName: string;
  onSearch: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView, siteName, onSearch, darkMode, toggleDarkMode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-[100] backdrop-blur-2xl border-b transition-all duration-300 ${darkMode ? 'bg-black/40 border-white/5' : 'bg-white/80 border-slate-200'}`}>
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="text-xl md:text-3xl font-black cursor-pointer tracking-tighter flex items-center gap-2 md:gap-3" onClick={() => setView('home')}>
          <span className="bg-emerald-600 text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl shadow-lg shadow-emerald-600/20">A</span>
          <span className={darkMode ? 'text-white' : 'text-slate-900'}>{siteName.split(' | ')[0]}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <div className={`relative transition-all duration-500 overflow-hidden ${isSearchOpen ? 'w-40 sm:w-48 md:w-64' : 'w-10'}`}>
            <input 
              type="text" 
              placeholder="ابحث..."
              className={`w-full py-2 pr-10 pl-4 rounded-xl bg-slate-100 dark:bg-white/5 outline-none font-bold text-xs border-2 border-transparent focus:border-emerald-500/50 transition-all ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
              onChange={(e) => onSearch(e.target.value)}
            />
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="absolute right-0 top-0 w-10 h-10 flex items-center justify-center text-lg md:text-xl hover:bg-emerald-500/10 rounded-xl transition-colors"
            >
              {isSearchOpen ? '✕' : '🔍'}
            </button>
          </div>

          <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-lg md:text-xl hover:scale-110 active:scale-95 transition-all">
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button 
            onClick={() => setView('admin')} 
            className="flex px-3 md:px-6 py-2 md:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] md:text-sm transition-all shadow-lg shadow-emerald-600/20"
          >
            <span className="hidden xs:inline">الإدارة</span> ⚙️
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
