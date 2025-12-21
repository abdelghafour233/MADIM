
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
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="text-2xl font-bold text-emerald-600 cursor-pointer flex items-center gap-2"
          onClick={() => setView('home')}
        >
          <div className="bg-emerald-600 text-white p-1.5 rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="tracking-tight">سوق المغرب</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          <button 
            onClick={() => setView('home')}
            className={`font-bold transition-colors ${currentView === 'home' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}
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
            className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
          >
            لوحة التحكم
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Cart Icon */}
          <button 
            onClick={() => setView('cart')}
            className="relative p-2.5 text-gray-700 hover:text-emerald-600 bg-gray-50 rounded-xl transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle - Very Visible */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-white bg-emerald-600 rounded-xl shadow-md active:scale-95 transition"
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

      {/* Mobile Menu Overlay - Fully Redesigned for Visibility */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-[60] overflow-y-auto animate-fadeIn border-t">
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">التنقل السريع</p>
              <button 
                onClick={() => handleNavClick('home')}
                className={`w-full text-right font-bold p-4 rounded-2xl flex items-center justify-between ${currentView === 'home' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                <span>الرئيسية</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              
              <button 
                onClick={() => handleNavClick('cart')}
                className={`w-full text-right font-bold p-4 rounded-2xl flex items-center justify-between ${currentView === 'cart' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                <span>سلة المشتريات</span>
                <span className={`px-2 py-1 rounded-lg text-xs ${currentView === 'cart' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}>{cartCount} منتج</span>
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">أقسام المتجر</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(Category).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => handleNavClick('category')}
                    className="text-right p-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-emerald-50 hover:text-emerald-600 transition border border-transparent hover:border-emerald-100"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t mt-6">
              <button 
                onClick={() => handleNavClick('dashboard')}
                className="w-full text-right font-bold text-gray-500 p-4 bg-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-200"
              >
                <span>لوحة التحكم (للمسؤول)</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
