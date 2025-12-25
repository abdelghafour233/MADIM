
import React, { useState } from 'react';
import { View, Category } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: any, a?: any, c?: any) => void;
  siteName: string;
  onSearch: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, siteName, onSearch, darkMode, toggleDarkMode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[150]">
      <nav className={`glass border-b transition-all duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-100 text-slate-900'} backdrop-blur-md`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black cursor-pointer flex items-center gap-2" onClick={() => setView('home')}>
            <span className="bg-emerald-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg">A</span>
            <span className="tracking-tighter">{siteName.split(' | ')[0]}</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-black">
            {Object.values(Category).slice(0, 4).map(cat => (
              <span key={cat} onClick={() => setView('category', undefined, cat)} className="cursor-pointer hover:text-emerald-500 transition-colors">{cat}</span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-48 sm:w-64' : 'w-10'}`}>
              <input 
                type="text" 
                placeholder="بحث..." 
                className={`w-full h-10 pr-10 pl-4 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none font-bold text-sm transition-opacity ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onChange={(e) => onSearch(e.target.value)}
              />
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute right-0 top-0 w-10 h-10 flex items-center justify-center text-xl hover:scale-110 transition-transform"
              >
                {isSearchOpen ? '✕' : '🔍'}
              </button>
            </div>
            <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xl hover:rotate-12 transition-transform">
               {darkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
