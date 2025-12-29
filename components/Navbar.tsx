
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

const Navbar: React.FC<NavbarProps> = ({ setView, siteName, onSearch, darkMode, toggleDarkMode, cartCount, onOpenCart }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <nav className={`sticky top-0 z-[100] backdrop-blur-2xl border-b transition-all duration-300 ${darkMode ? 'bg-black/40 border-white/5' : 'bg-white/80 border-slate-200'}`}>
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="text-xl md:text-3xl font-black cursor-pointer tracking-tighter flex items-center gap-2 md:gap-3" onClick={() => {setView('home'); setQuery(''); onSearch('');}}>
          <span className="bg-emerald-600 text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl shadow-lg shadow-emerald-600/20">A</span>
          <span className={darkMode ? 'text-white' : 'text-slate-900'}>{siteName.split(' | ')[0]}</span>
        </div>

        <div className="hidden md:flex flex-grow max-w-md mx-8">
           <div className="relative w-full">
             <input 
               type="text" 
               placeholder="ابحث عن مقال أو خبر..." 
               value={query}
               onChange={handleSearch}
               className={`w-full py-2.5 px-12 rounded-2xl outline-none border transition-all search-focus font-bold text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
           </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-lg"
          >🔍</button>

          <button 
            onClick={onOpenCart}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all"
          >
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

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
      
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4 animate-fadeIn">
           <input 
             type="text" 
             placeholder="ابحث..." 
             autoFocus
             value={query}
             onChange={handleSearch}
             className={`w-full py-3 px-6 rounded-xl outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
           />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
