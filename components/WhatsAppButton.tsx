
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
    { name: 'Twitter', icon: '𝕏', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin)}`, color: 'bg-black' },
    { name: 'Pinterest', icon: '📌', url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.origin)}`, color: 'bg-[#E60023]' },
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
        className={`w-14 h-14 md:w-18 md:h-18 bg-emerald-600 text-white rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center justify-center text-2xl md:text-3xl hover:scale-110 active:scale-90 transition-all z-10 border-4 border-white/10`}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

// Fixing the missing default export that caused the error in App.tsx
export default WhatsAppButton;
