
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const NavLink = ({ view, label }: { view: View, label: string }) => (
    <button 
      onClick={() => setView(view)}
      className={`px-4 py-2 rounded-xl font-black transition-all ${currentView === view ? 'bg-emerald-600 text-white shadow-lg' : 'opacity-60 hover:opacity-100'}`}
    >
      {label}
    </button>
  );

  return (
    <nav className={`sticky top-0 z-[100] backdrop-blur-2xl border-b transition-all duration-300 ${darkMode ? 'bg-black/40 border-white/5' : 'bg-white/80 border-slate-200'}`}>
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-xl md:text-3xl font-black cursor-pointer tracking-tighter flex items-center gap-3" onClick={() => setView('home')}>
            <span className="bg-emerald-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg">A</span>
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>{siteName.split(' | ')[0]}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <NavLink view="home" label="الرئيسية" />
            <NavLink view="store" label="المتجر" />
          </div>
        </div>

        <div className="hidden md:flex flex-grow max-w-sm mx-8">
           <div className="relative w-full">
             <input 
               type="text" 
               placeholder="ابحث..." 
               value={query}
               onChange={handleSearch}
               className={`w-full py-2.5 px-12 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onOpenCart} className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={toggleDarkMode} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-xl">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setView('admin')} className="p-3 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20">⚙️</button>
        </div>
      </div>
      
      {/* Mobile Nav Links */}
      <div className="lg:hidden flex gap-4 px-4 pb-4 overflow-x-auto no-scrollbar">
         <button onClick={() => setView('home')} className={`text-xs font-black whitespace-nowrap px-4 py-2 rounded-lg ${currentView === 'home' ? 'bg-emerald-600 text-white' : 'opacity-40'}`}>الرئيسية</button>
         <button onClick={() => setView('store')} className={`text-xs font-black whitespace-nowrap px-4 py-2 rounded-lg ${currentView === 'store' ? 'bg-emerald-600 text-white' : 'opacity-40'}`}>المتجر</button>
      </div>
    </nav>
  );
};

export default Navbar;
