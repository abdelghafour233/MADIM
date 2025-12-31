
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
    <div className="fixed top-0 left-0 right-0 z-[1000] p-4 md:p-6 pointer-events-none">
      <nav className="max-w-6xl mx-auto glass-card h-16 md:h-20 px-4 md:px-8 rounded-[25px] md:rounded-[35px] flex items-center justify-between gap-4 pointer-events-auto shadow-2xl">
        {/* Logo */}
        <div 
          onClick={() => setView('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">A</div>
          <span className="text-lg md:text-2xl font-black tracking-tighter hidden xs:block">abdouweb</span>
        </div>

        {/* Search - Compact */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <input 
              type="text" 
              placeholder="ابحث عن همزة..." 
              className="w-full bg-white/5 border border-white/10 h-10 md:h-12 px-5 pr-12 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-bold text-sm"
              value={query}
              onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value); }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onOpenCart}
            className="w-10 h-10 md:w-14 md:h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-xl relative hover:bg-emerald-500 hover:text-white transition-all"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#030303]">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setView('admin')}
            className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-all"
          >
            ⚙️
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
