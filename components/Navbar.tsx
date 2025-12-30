
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
    <nav className={`sticky top-0 z-[500] backdrop-blur-3xl border-b transition-all duration-300 ${darkMode ? 'bg-black/80 border-white/5' : 'bg-white/95 border-slate-200 shadow-sm'}`}>
      <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <div 
          onClick={() => setView('home')} 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-emerald-600/30 group-hover:rotate-12 transition-all">A</div>
          <span className="text-lg md:text-xl font-black tracking-tighter hidden xs:inline">abdouweb</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="ابحث..." 
                className="w-full bg-white/5 border border-white/10 p-2 pr-9 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-xs"
                value={query}
                onChange={handleSearch}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 text-sm">🔍</span>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={onOpenCart}
            className="w-10 h-10 bg-emerald-600/10 text-emerald-500 rounded-xl border border-emerald-500/10 flex items-center justify-center text-lg relative"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 min-w-[16px] h-4 bg-orange-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-[#0a0a0b]">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setView('admin')}
            className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-lg"
          >
            ⚙️
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
