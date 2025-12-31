
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

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, siteName, onSearch, cartCount, onOpenCart }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className="sticky top-6 z-[500] px-4 md:px-8 max-w-7xl mx-auto">
      <div className="glass px-6 md:px-10 h-16 md:h-24 flex items-center justify-between gap-4 md:gap-8 rounded-[30px] md:rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-white/10">
        {/* Logo */}
        <div 
          onClick={() => setView('home')} 
          className="flex items-center gap-2 md:gap-4 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-lg shadow-emerald-500/30 group-hover:rotate-6 transition-all">A</div>
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-black tracking-tighter hidden xs:inline leading-none">abdouweb</span>
            <span className="text-[8px] md:text-[10px] font-bold opacity-30 tracking-[0.3em] uppercase hidden sm:inline">The Best Deals</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto hidden md:block">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="ابحث عن أقوى الهميزات..." 
                className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-[20px] outline-none focus:border-emerald-500 focus:bg-white/10 transition-all font-bold text-sm"
                value={query}
                onChange={handleSearch}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 text-xl group-focus-within:opacity-100 transition-opacity">🔍</span>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <button 
            onClick={onOpenCart}
            className="w-12 h-12 md:w-16 md:h-16 bg-white/5 text-white rounded-[20px] border border-white/5 flex items-center justify-center text-xl relative hover:bg-white/10 transition-all"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 min-w-[20px] h-5 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#050505]">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setView('admin')}
            className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-[20px] border border-white/5 flex items-center justify-center text-xl hover:bg-white/10 transition-all"
          >
            ⚙️
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
