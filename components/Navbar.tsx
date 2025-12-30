
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
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <nav className={`sticky top-0 z-[100] backdrop-blur-2xl border-b transition-all duration-300 ${darkMode ? 'bg-black/40 border-white/5' : 'bg-white/80 border-slate-200'}`}>
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between gap-4">
        {/* اللوغو */}
        <div className="flex items-center gap-4 md:gap-8 shrink-0">
          <div 
            onClick={() => setView('home')} 
            className="text-xl md:text-3xl font-black cursor-pointer hover:text-emerald-500 transition-colors flex items-center gap-2"
          >
            <span className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-sm md:text-lg shadow-lg shadow-emerald-600/20">A</span>
            <span className="hidden sm:inline">{siteName.split('|')[0]}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => setView('home')} 
              className={`px-4 py-2 rounded-xl font-bold transition-all ${currentView === 'home' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'opacity-60 hover:opacity-100'}`}
            >الرئيسية</button>
            <button 
              onClick={() => setView('admin')} 
              className={`px-4 py-2 rounded-xl font-bold transition-all ${currentView === 'admin' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'opacity-60 hover:opacity-100'}`}
            >الإدارة</button>
          </div>
        </div>

        {/* محرك البحث */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="ابحث عن منتج أو همزة..." 
              className={`w-full py-2 md:py-4 px-12 rounded-2xl outline-none border-2 transition-all text-xs md:text-sm font-bold ${
                darkMode 
                ? 'bg-white/5 border-transparent focus:border-emerald-500 text-white focus:bg-white/10' 
                : 'bg-slate-100 border-transparent focus:border-emerald-500 text-slate-900 focus:bg-white'
              }`}
              value={query}
              onChange={handleSearch}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-emerald-500 transition-all">🔍</span>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* زر السلة */}
          <button 
            onClick={onOpenCart}
            className={`relative p-2 md:p-4 rounded-2xl border transition-all ${
              darkMode 
              ? 'bg-white/5 border-white/10 text-emerald-400 hover:bg-white/10' 
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="text-xl md:text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={toggleDarkMode} 
            className={`hidden sm:block p-2 md:p-4 rounded-2xl border transition-all ${
              darkMode 
              ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' 
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          <button 
            onClick={() => setView('admin')}
            className="md:hidden p-2 bg-emerald-600/10 text-emerald-500 rounded-2xl border border-emerald-500/20"
          >
            ⚙️
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
