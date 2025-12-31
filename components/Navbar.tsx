
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

const Navbar: React.FC<NavbarProps> = ({ setView, onSearch, cartCount, onOpenCart }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="fixed top-8 md:top-10 left-0 right-0 z-[1000] p-3 md:p-6 pointer-events-none">
      <nav className="max-w-6xl mx-auto premium-glass h-16 md:h-22 px-5 md:px-10 rounded-[24px] md:rounded-[40px] flex items-center justify-between gap-4 pointer-events-auto shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-white/10">
        {/* Logo Section */}
        <div 
          onClick={() => setView('home')} 
          className="flex items-center gap-3 md:gap-4 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 md:w-13 md:h-13 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-[0_10px_20px_rgba(16,185,129,0.3)] group-hover:rotate-6 transition-all">A</div>
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-black tracking-tighter leading-none">abdouweb</span>
            <span className="text-[7px] md:text-[9px] font-bold opacity-30 tracking-[0.2em] uppercase hidden sm:block">Deals & Store</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="ابحث عن أقوى العروض..." 
                className="w-full bg-white/5 border border-white/10 h-12 px-6 pr-12 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white/10 transition-all font-bold text-sm text-white"
                value={query}
                onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value); }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
           </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <button 
            onClick={onOpenCart}
            className="w-10 h-10 md:w-15 md:h-15 bg-white/5 text-white rounded-xl md:rounded-2xl border border-white/5 flex items-center justify-center text-xl md:text-2xl relative hover:bg-emerald-600 transition-all shadow-lg active:scale-90"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#030303] animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setView('admin')}
            className="w-10 h-10 md:w-15 md:h-15 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 flex items-center justify-center text-xl md:text-2xl hover:bg-white/10 transition-all active:scale-90 text-white"
          >
            ⚙️
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
