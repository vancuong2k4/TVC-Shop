import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tvc_recently_viewed');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Lỗi khi đọc danh sách xem gần đây:', e);
    }
  }, []);

  const addProductToRecentlyViewed = (product) => {
    if (!product || !product.id) return;

    setRecentlyViewed((prev) => {
      // Lọc bỏ sản phẩm nếu đã tồn tại trong danh sách
      const filtered = prev.filter((p) => p.id !== product.id);

      const newItem = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discount_price: product.discount_price,
        category_name: product.category?.name || product.category_name || '',
        image: product.image || product.image_url || (product.images && product.images[0]?.image_url),
        viewed_at: new Date().toISOString()
      };

      // Giữ tối đa 10 sản phẩm xem gần đây nhất
      const updated = [newItem, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('tvc_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.error('Lỗi khi lưu danh sách xem gần đây:', e);
      }
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('tvc_recently_viewed');
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addProductToRecentlyViewed,
        clearRecentlyViewed
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};
