export const formatPrice = (price, currencyOverride = null) => {
  if (price === undefined || price === null) return '0 ₫';
  const numberPrice = parseFloat(price);
  if (isNaN(numberPrice)) return '0 ₫';
  
  if (currencyOverride && currencyOverride.rate) {
    const converted = numberPrice * currencyOverride.rate;
    const rounded = Number(converted.toFixed(currencyOverride.decimal_digits || 0));
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currencyOverride.decimal_digits || 0,
      maximumFractionDigits: currencyOverride.decimal_digits || 0
    }).format(rounded);

    return currencyOverride.symbol_position === 'before'
      ? `${currencyOverride.symbol}${formattedNumber}`
      : `${formattedNumber}${currencyOverride.symbol}`;
  }

  // Kiểm tra nếu có currency trong localStorage
  try {
    const saved = localStorage.getItem('tvc_currency');
    if (saved) {
      const cur = JSON.parse(saved);
      if (cur && cur.rate) {
        const converted = numberPrice * cur.rate;
        const rounded = Number(converted.toFixed(cur.decimal_digits || 0));
        const formattedNumber = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: cur.decimal_digits || 0,
          maximumFractionDigits: cur.decimal_digits || 0
        }).format(rounded);

        return cur.symbol_position === 'before'
          ? `${cur.symbol}${formattedNumber}`
          : `${formattedNumber}${cur.symbol}`;
      }
    }
  } catch {
    // fallback
  }

  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(numberPrice);
};
