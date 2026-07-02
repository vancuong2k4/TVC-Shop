import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductCard from '../components/common/ProductCard';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWishlistProducts = async () => {
      try {
        const response = await api.get('/wishlists');
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải wishlist", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [user, wishlistItems.length]); // Refresh if wishlist count changes

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 container mx-auto px-4 md:px-8 max-w-7xl">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Yêu thích', path: '' }
        ]} />
        <div className="flex items-center space-x-4 mb-10 border-b border-gray-200 pb-6">
          <Heart className="fill-black text-black" size={32} />
          <h1 className="text-3xl font-bold uppercase tracking-widest">Sản Phẩm Yêu Thích</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 uppercase tracking-widest">Đang tải dữ liệu...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border border-gray-100">
            <Heart size={64} className="mx-auto text-gray-300 mb-6" strokeWidth={1} />
            <p className="text-gray-500 uppercase tracking-widest mb-8 font-semibold">Danh sách yêu thích của bạn đang trống.</p>
            <Link to="/shop" className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors inline-block">
              Khám Phá Sản Phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={{
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image_url,
                badge: product.discount_price ? 'Sale' : null
              }} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
