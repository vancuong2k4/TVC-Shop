import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const CurrencyContext = createContext();

export const DEFAULT_CURRENCIES = [
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rate: 1.0, decimal_digits: 0, symbol_position: 'after', flag: '🇻🇳' },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.000039, decimal_digits: 2, symbol_position: 'before', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.000036, decimal_digits: 2, symbol_position: 'before', flag: '🇪🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 0.0059, decimal_digits: 0, symbol_position: 'before', flag: '🇯🇵' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.000031, decimal_digits: 2, symbol_position: 'before', flag: '🇬🇧' }
];

export function CurrencyProvider({ children }) {
  const [currencies, setCurrencies] = useState(DEFAULT_CURRENCIES);
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem('tvc_currency');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_CURRENCIES[0]; // VND
  });

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const res = await api.get('/currencies');
      if (res.data?.success && res.data.currencies?.length > 0) {
        setCurrencies(res.data.currencies);
        // Cập nhật lại currentCurrency với rate mới nhất nếu đã lưu
        setCurrentCurrency(prev => {
          const updated = res.data.currencies.find(c => c.code === prev.code);
          return updated || prev;
        });
      }
    } catch {
      // Sử dụng default fallback
    }
  };

  const changeCurrency = (code) => {
    const selected = currencies.find(c => c.code === code);
    if (selected) {
      setCurrentCurrency(selected);
      try {
        localStorage.setItem('tvc_currency', JSON.stringify(selected));
      } catch (err) {
        console.error('Failed to save currency:', err);
      }
    }
  };

  /**
   * Định dạng số tiền (input amount luôn mặc định là VND)
   */
  const formatPrice = (amountInVnd) => {
    const num = Number(amountInVnd) || 0;
    const converted = num * currentCurrency.rate;
    const rounded = Number(converted.toFixed(currentCurrency.decimal_digits));

    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currentCurrency.decimal_digits,
      maximumFractionDigits: currentCurrency.decimal_digits
    }).format(rounded);

    if (currentCurrency.symbol_position === 'before') {
      return `${currentCurrency.symbol}${formattedNumber}`;
    }
    return `${formattedNumber}${currentCurrency.symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currencies,
      currentCurrency,
      changeCurrency,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
