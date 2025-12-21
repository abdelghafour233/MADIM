
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
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-2xl font-bold text-emerald-600 cursor-pointer flex items-center gap-2" onClick={() => setView('home')}>
          <span className="bg-emerald-600 text-white p-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span>{siteName}</span>
        </div>

        <div className="hidden md:flex items-center space-x-8 space-x-reverse font-bold text-gray-600">
          <button onClick={() => setView('home')} className={currentView === 'home' ? 'text-emerald-600' : ''}>الرئيسية</button>
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => setView('category')} className="hover:text-emerald-500">{cat}</button>
          ))}
        </div>

        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 space-y-4 border-t shadow-lg">
          <button onClick={() => {setView('home'); setIsMenuOpen(false)}} className="block w-full text-right font-bold">الرئيسية</button>
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => {setView('category'); setIsMenuOpen(false)}} className="block w-full text-right text-gray-600">{cat}</button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
