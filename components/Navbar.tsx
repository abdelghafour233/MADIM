
import React, { useState } from 'react';
import { View, Category } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="text-2xl font-bold text-emerald-600 cursor-pointer flex items-center gap-2"
          onClick={() => setView('home')}
        >
          <span className="bg-emerald-600 text-white p-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </span>
          <span className="hidden sm:inline">سوق المغرب</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          <button 
            onClick={() => setView('home')}
            className={`font-bold transition-colors ${currentView === 'home' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}
          >
            الرئيسية
          </button>
          <div className="group relative">
            <button className="font-bold text-gray-600 hover:text-emerald-500 transition-colors flex items-center gap-1">
              التصنيفات
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl py-2 hidden group-hover:block animate-fadeIn">
              {Object.values(Category).map(cat => (
                <button 
                  key={cat} 
                  onClick={() => handleNavClick('category')}
                  className="block w-full text-right px-4 py-2 hover:bg-emerald-50 text-gray-700 font-medium"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setView('dashboard')}
            className="text-gray-400 hover:text-emerald-600 text-sm font-medium transition"
          >
            الإدارة
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <button 
            onClick={() => setView('cart')}
            className="relative p-2 text-gray-600 hover:text-emerald-600 bg-gray-50 rounded-full transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-emerald-600 bg-gray-50 rounded-full"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-xl animate-fadeIn">
          <button 
            onClick={() => handleNavClick('home')}
            className={`block w-full text-right font-bold p-3 rounded-lg ${currentView === 'home' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'}`}
          >
            الرئيسية
          </button>
          
          <div className="py-2">
            <p className="text-xs font-bold text-gray-400 px-3 mb-2 uppercase">الأقسام</p>
            {Object.values(Category).map(cat => (
              <button 
                key={cat}
                onClick={() => handleNavClick('category')}
                className="block w-full text-right p-3 text-gray-600 hover:bg-gray-50 rounded-lg text-sm"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="border-t pt-2 mt-2">
            <button 
              onClick={() => handleNavClick('dashboard')}
              className="block w-full text-right font-bold text-gray-400 p-3 hover:text-emerald-600 text-sm"
            >
              لوحة التحكم (للمسؤول)
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
