import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard';
import { SlidersHorizontal } from 'lucide-react';
import api from '../../api/axios';

const ProductGrid = ({ onOpenSidebar }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200">
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start mb-6 sm:mb-0">
          <button 
            className="lg:hidden flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest border border-gray-300 px-5 py-3 hover:bg-black hover:text-white transition-colors"
            onClick={onOpenSidebar}
          >
            <SlidersHorizontal size={16} />
            <span>Lọc Sản Phẩm</span>
          </button>
          <span className="text-gray-500 text-sm sm:ml-6 font-medium">Hiển thị {products.length} sản phẩm</span>
        </div>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline-block">Sắp xếp:</span>
          <select className="w-full sm:w-auto border-gray-300 border px-4 py-3 text-sm outline-none focus:border-black bg-transparent cursor-pointer font-medium">
            <option>Mới nhất</option>
            <option>Giá: Thấp đến Cao</option>
            <option>Giá: Cao xuống Thấp</option>
            <option>Bán chạy nhất</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 font-medium animate-pulse text-gray-500">
          Đang kết nối Backend PHP và tải dữ liệu...
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 p-10">
          Hệ thống chưa có sản phẩm nào. Hãy truy cập phpMyAdmin, bảng `products` để tạo sản phẩm mẫu!
        </div>
      )}

      {/* Pagination / Load More */}
      {products.length > 0 && (
        <div className="mt-20 text-center border-t border-gray-200 pt-10">
          <button className="btn-outline border-gray-300 hover:border-black">Tải thêm sản phẩm</button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
