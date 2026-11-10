import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function CurrencySwitcher({ lightMode = false }) {
  const { currencies, currentCurrency, changeCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wider transition-all ${
          lightMode 
            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300' 
            : 'bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md'
        }`}
        title="Chuyển đổi tiền tệ"
      >
        <span className="text-sm">{currentCurrency.flag}</span>
        <span className="font-mono">{currentCurrency.code}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-zinc-950 border border-white/15 backdrop-blur-2xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            Chọn đơn vị tiền tệ
          </div>
          {currencies.map((currency) => {
            const isSelected = currency.code === currentCurrency.code;
            return (
              <button
                key={currency.code}
                onClick={() => {
                  changeCurrency(currency.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isSelected 
                    ? 'bg-white/15 text-white font-semibold' 
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{currency.flag}</span>
                  <div className="text-left">
                    <span className="font-mono text-xs">{currency.code}</span>
                    <span className="text-[10px] text-zinc-400 block leading-none mt-0.5">{currency.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-zinc-400">{currency.symbol}</span>
                  {isSelected && <Check size={14} className="text-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
