
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

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, siteName, onSearch, darkMode, toggleDarkMode, cartCount, onOpenCart }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className={`sticky top-0 z-[500] backdrop-blur-3xl border-b transition-all duration-300 ${darkMode ? 'bg-black/60 border-white/5' : 'bg-white/90 border-slate-200 shadow-sm'}`}>
      <div className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => setView('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-emerald-600 rounded-[18px] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-600/30 group-hover:rotate-12 transition-all">A</div>
          <span className="text-xl md:text-2xl font-black hidden sm:inline tracking-tighter">abdouweb</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="ابحث عن همزة..." 
                className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white/10 transition-all font-bold text-sm"
                value={query}
                onChange={handleSearch}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 text-lg">🔍</span>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenCart}
            className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600/10 text-emerald-500 rounded-2xl border border-emerald-500/10 flex items-center justify-center text-xl relative hover:bg-emerald-600 hover:text-white transition-all shadow-inner"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce border-2 border-[#0a0a0b]">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setView('admin')}
            className="hidden sm:flex w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-2xl border border-white/5 items-center justify-center text-xl hover:bg-white/10 transition-all"
          >
            ⚙️
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
