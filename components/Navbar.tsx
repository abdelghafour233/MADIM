
import React, { useState } from 'react';
import { View, Category } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  siteName: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, siteName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-emerald-100/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="text-2xl font-black cursor-pointer flex items-center gap-3 group" 
          onClick={() => setView('home')}
        >
          <div className="bg-emerald-600 text-white p-2 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="gradient-text tracking-tight">{siteName}</span>
        </div>

        <div className="hidden md:flex items-center gap-1 font-bold text-slate-600">
          <button 
            onClick={() => setView('home')} 
            className={`px-4 py-2 rounded-xl transition-all ${currentView === 'home' ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50'}`}
          >
            الرئيسية
          </button>
          {Object.values(Category).map(cat => (
            <button 
              key={cat} 
              onClick={() => setView('category')} 
              className="px-4 py-2 rounded-xl hover:bg-slate-50 transition-all hover:text-emerald-600"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 text-sm">
            اشترك في النشرة
          </button>
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-6 space-y-4 shadow-2xl animate-fadeIn">
          <button onClick={() => {setView('home'); setIsMenuOpen(false)}} className="block w-full text-right font-bold text-lg p-3 rounded-xl hover:bg-emerald-50">الرئيسية</button>
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => {setView('category'); setIsMenuOpen(false)}} className="block w-full text-right text-slate-600 font-bold p-3 rounded-xl hover:bg-slate-50">{cat}</button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
