import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem('tvc_compare_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('tvc_compare_items', JSON.stringify(compareItems));
    } catch (e) {
      console.error(e);
    }
  }, [compareItems]);

  const addToCompare = (product) => {
    if (!product || !product.id) return { success: false, message: 'Dữ liệu không hợp lệ.' };

    const exists = compareItems.some(item => item.id === product.id);
    if (exists) {
      return { success: false, message: `"${product.name}" đã có trong danh sách so sánh.` };
    }

    if (compareItems.length >= 4) {
      return { success: false, message: 'Bạn chỉ có thể so sánh tối đa 4 sản phẩm cùng lúc.' };
    }

    setCompareItems(prev => [...prev, product]);
    return { success: true, message: `Đã thêm "${product.name}" vào so sánh!` };
  };

  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    return compareItems.some(item => item.id === productId);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      isCompareDrawerOpen,
      setIsCompareDrawerOpen
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
