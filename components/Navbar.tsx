
import React, { useState } from 'react';
import { View, Category } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: any, item?: any, cat?: any) => void;
  siteName: string;
  onSearch: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, siteName, onSearch, darkMode, toggleDarkMode, cartCount, onOpenCart }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[150]">
      <nav className={`glass border-b transition-all duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-100 text-slate-900'} backdrop-blur-md`}>
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black cursor-pointer flex items-center gap-2" onClick={() => setView('home')}>
            <span className="bg-emerald-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg">A</span>
            <span className="hidden sm:inline tracking-tighter">{siteName.split(' | ')[0]}</span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-40 md:w-64' : 'w-10'}`}>
              <input 
                type="text" 
                placeholder="بحث..." 
                className={`w-full h-10 pr-10 pl-4 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none font-bold text-sm transition-opacity ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onChange={(e) => onSearch(e.target.value)}
              />
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="absolute right-0 top-0 w-10 h-10 flex items-center justify-center text-xl">
                {isSearchOpen ? '✕' : '🔍'}
              </button>
            </div>

            <button onClick={onOpenCart} className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 transition-transform active:scale-90">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xl transition-all hover:rotate-12">
               {darkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
