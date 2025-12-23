
import React, { useState } from 'react';
import { View, Category } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  siteName: string;
  onSearch: (query: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, siteName, onSearch, darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className={`glass border-b transition-colors duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-emerald-100/50 text-slate-900'} backdrop-blur-md`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div 
            className="text-2xl font-black cursor-pointer flex items-center gap-3 group flex-shrink-0" 
            onClick={() => {setView('home'); setSearchValue(''); onSearch('');}}
          >
            <div className="bg-emerald-600 text-white p-2 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-emerald-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className={`${darkMode ? 'text-white' : 'gradient-text'} tracking-tight hidden sm:block`}>{siteName}</span>
          </div>

          <div className="flex-grow max-w-md relative hidden md:block">
            <input 
              type="text" 
              placeholder="ابحث عن مراجعة منتج..." 
              value={searchValue}
              onChange={handleSearch}
              className={`w-full border-none rounded-2xl py-3 px-12 focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all text-sm ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className={`p-3 rounded-2xl transition-all border ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
              title={darkMode ? "تبديل للوضع النهاري" : "تبديل للوضع الليلي"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className={`p-3 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
