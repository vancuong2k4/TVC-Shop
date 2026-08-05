import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard';
import api from '../../api/axios';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Lấy 8 sản phẩm đầu tiên để làm nổi bật
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-4">Sản Phẩm Nổi Bật</h2>
            <p className="text-gray-500 max-w-2xl leading-relaxed">Những thiết kế được yêu thích nhất trong bộ sưu tập mới của chúng tôi, kết hợp giữa phong cách hiện đại và chất liệu cao cấp.</p>
          </div>
          <a href="/shop" className="hidden md:inline-block border-b border-black text-sm uppercase tracking-widest font-semibold pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
            Xem Tất Cả
          </a>
        </div>
        
        {loading ? (
          <div className="text-center py-10 font-medium animate-pulse text-gray-500">Đang tải dữ liệu từ máy chủ...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 p-10">
            Hiện chưa có sản phẩm nào trong CSDL. Vui lòng thêm sản phẩm vào bảng `products`!
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <a href="/shop" className="btn-outline w-full inline-block">Xem Tất Cả</a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
