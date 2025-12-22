
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
              onClick={() => {
                // Here you would typically filter or navigate
                setView('home'); 
              }} 
              className="px-4 py-2 rounded-xl hover:bg-slate-50 transition-all hover:text-emerald-600"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('dashboard')}
            className="hidden md:flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all text-sm border border-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            لوحة الإدارة
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
            <button key={cat} onClick={() => {setView('home'); setIsMenuOpen(false)}} className="block w-full text-right text-slate-600 font-bold p-3 rounded-xl hover:bg-slate-50">{cat}</button>
          ))}
          <button onClick={() => {setView('dashboard'); setIsMenuOpen(false)}} className="block w-full text-right text-emerald-600 font-black p-3 rounded-xl bg-emerald-50 mt-4 border border-emerald-100">لوحة الإدارة</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
