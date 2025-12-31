
import React, { useState } from 'react';
import { Settings } from '../types';

interface SocialButtonsProps {
  settings: Settings;
}

const WhatsAppButton: React.FC<SocialButtonsProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const socials = [
    { name: 'WhatsApp', icon: '💬', url: `https://wa.me/${settings.whatsappNumber}`, color: 'bg-[#25D366]' },
    { name: 'Telegram', icon: '✈️', url: settings.telegramLink, color: 'bg-[#0088cc]' },
    { name: 'Facebook', icon: '👥', url: settings.facebookLink, color: 'bg-[#1877F2]' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-8 left-8 z-[2000] flex flex-col items-center gap-3">
      {/* Expanded Menu */}
      <div className={`flex flex-col gap-3 transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {socials.map((social, idx) => (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 md:w-14 md:h-14 ${social.color} text-white rounded-full shadow-2xl flex items-center justify-center text-xl md:text-2xl hover:scale-110 active:scale-95 transition-all border border-white/10`}
            title={social.name}
          >
            {social.icon}
          </a>
        ))}
        
        {/* Copy Link Action */}
        <button
          onClick={handleCopyLink}
          className={`w-12 h-12 md:w-14 md:h-14 ${copied ? 'bg-emerald-600' : 'bg-white/10'} text-white rounded-full shadow-2xl flex items-center justify-center text-xl md:text-2xl hover:scale-110 active:scale-95 transition-all border border-white/10`}
          title="نسخ رابط الموقع"
        >
          {copied ? '✅' : '🔗'}
        </button>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 md:w-16 md:h-16 ${isOpen ? 'bg-red-500 rotate-90 shadow-red-900/40' : 'bg-emerald-600 shadow-emerald-900/40'} text-white rounded-full shadow-[0_15px_45px_rgba(0,0,0,0.6)] flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 hover:scale-110 active:scale-90 border-2 border-white/20`}
      >
        {isOpen ? '✕' : '💬'}
      </button>
      
      {/* Label for Tooltip (Mobile) */}
      {!isOpen && (
        <span className="absolute -top-10 left-0 bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-lg animate-bounce whitespace-nowrap shadow-lg uppercase">
          شارك الهمزة 🚀
        </span>
      )}
    </div>
  );
};

export default WhatsAppButton;
