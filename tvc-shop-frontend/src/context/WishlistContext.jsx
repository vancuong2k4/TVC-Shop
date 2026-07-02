import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    try {
      const response = await api.get('/wishlists');
      setWishlistItems(response.data.map(item => item.id));
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để sử dụng tính năng Yêu thích.");
      return false;
    }

    try {
      const response = await api.post('/wishlists', { product_id: productId });
      
      if (response.data.action === 'added') {
        setWishlistItems(prev => [...prev, String(productId)]);
      } else if (response.data.action === 'removed') {
        setWishlistItems(prev => prev.filter(id => String(id) !== String(productId)));
      }
      return true;
    } catch (error) {
      console.error("Error toggling wishlist", error);
      return false;
    }
  };

  const isInWishlist = (productId) => wishlistItems.some(id => String(id) === String(productId));

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
