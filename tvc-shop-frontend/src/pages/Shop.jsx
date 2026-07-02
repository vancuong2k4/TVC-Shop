import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { Filter, X, Search } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data);
      // Update URL without reloading
      setSearchParams(params, { replace: true });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters change (debounced for search)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms delay for smooth typing
    
    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (categoryId) => {
    setFilters(prev => ({ 
      ...prev, 
      category: prev.category === String(categoryId) ? '' : String(categoryId) 
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
      sort: 'newest'
    });
  };

  const categories = [
    { id: 1, name: 'Thời Trang Nam' },
    { id: 2, name: 'Thời Trang Nữ' },
    { id: 3, name: 'Phụ Kiện' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 container mx-auto px-4 md:px-8">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Cửa hàng', path: '' }
        ]} />
        {/* Header Area */}
        <div className="flex justify-between items-center mb-8 border-b border-black pb-4">
        <h1 className="text-3xl font-serif font-bold uppercase tracking-widest">
          Cửa Hàng
          {filters.search && <span className="text-gray-400 text-lg ml-2 font-sans">/ Tìm kiếm: "{filters.search}"</span>}
        </h1>
        <div className="flex items-center space-x-4">
          <select 
            name="sort" 
            value={filters.sort} 
            onChange={handleFilterChange}
            className="border-none bg-transparent font-bold uppercase tracking-widest text-sm outline-none cursor-pointer hidden md:block"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
          </select>
          <button 
            className="md:hidden flex items-center space-x-2 font-bold uppercase tracking-widest text-sm"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={18} />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          {/* Search Box */}
          <div className="mb-8">
            <h3 className="font-bold uppercase tracking-widest mb-4 text-sm border-b pb-2">Tìm Kiếm</h3>
            <div className="relative">
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nhập tên sản phẩm..."
                className="w-full border border-gray-300 p-3 pr-10 outline-none focus:border-black text-sm"
              />
              <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-bold uppercase tracking-widest mb-4 text-sm border-b pb-2">Danh Mục</h3>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`text-sm uppercase tracking-wider transition-colors ${filters.category === String(cat.id) ? 'font-bold text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-bold uppercase tracking-widest mb-4 text-sm border-b pb-2">Khoảng Giá</h3>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                name="min_price"
                value={filters.min_price}
                onChange={handleFilterChange}
                placeholder="Từ (USD)"
                className="w-full border border-gray-300 p-2 outline-none focus:border-black text-sm"
              />
              <span className="text-gray-400">-</span>
              <input 
                type="number" 
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder="Đến (USD)"
                className="w-full border border-gray-300 p-2 outline-none focus:border-black text-sm"
              />
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="w-full border border-black py-3 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors"
          >
            Xóa Bộ Lọc
          </button>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl font-bold uppercase tracking-widest text-gray-400 animate-pulse">Đang tải...</div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Không tìm thấy sản phẩm</h2>
              <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              <button 
                onClick={clearFilters}
                className="mt-6 bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-gray-800"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}></div>
          
          {/* Drawer */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-xl flex flex-col animate-slide-in-right ml-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold uppercase tracking-widest">Bộ Lọc</h2>
              <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-6">
                <label className="block font-bold uppercase tracking-widest text-xs mb-2">Sắp Xếp</label>
                <select 
                  name="sort" 
                  value={filters.sort} 
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 p-3 outline-none focus:border-black text-sm uppercase font-bold"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                </select>
              </div>

              {/* Duplicate desktop filters here for mobile */}
              <div className="mb-6">
                <label className="block font-bold uppercase tracking-widest text-xs mb-2">Danh Mục</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`block w-full text-left p-3 border text-sm uppercase font-bold tracking-wider ${filters.category === String(cat.id) ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-bold uppercase tracking-widest text-xs mb-2">Khoảng Giá (USD)</label>
                <div className="flex items-center space-x-2">
                  <input type="number" name="min_price" value={filters.min_price} onChange={handleFilterChange} placeholder="Từ" className="w-full border border-gray-300 p-3 text-sm" />
                  <span>-</span>
                  <input type="number" name="max_price" value={filters.max_price} onChange={handleFilterChange} placeholder="Đến" className="w-full border border-gray-300 p-3 text-sm" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex space-x-4">
              <button onClick={clearFilters} className="flex-1 border border-black py-4 font-bold uppercase tracking-widest text-xs">
                Xóa
              </button>
              <button onClick={() => setIsFilterOpen(false)} className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest text-xs">
                Xem Kết Quả
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
