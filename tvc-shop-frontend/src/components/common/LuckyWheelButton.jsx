import React, { useState } from 'react';
import { Sparkles, Gift } from 'lucide-react';
import LuckyWheelModal from './LuckyWheelModal';

const LuckyWheelButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 z-40 bg-zinc-900/90 text-amber-300 hover:text-white border border-amber-300/40 hover:border-amber-300 p-3 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 group backdrop-blur-md"
        title="Vòng Quay May Mắn - Nhận Voucher VIP"
      >
        <Gift size={20} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      </button>

      {/* Modal */}
      <LuckyWheelModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default LuckyWheelButton;
