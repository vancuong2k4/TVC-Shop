import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { 
  Filter, X, Search, SlidersHorizontal, RotateCcw, 
  ChevronLeft, ChevronRight, Check, Grid3X3, LayoutGrid, ArrowUpDown
} from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const PRICE_PRESETS = [
  { id: 'all', label: 'Tất cả mức giá', min: '', max: '' },
  { id: 'under_500k', label: 'Dưới 500.000 ₫', min: '0', max: '500000' },
  { id: '500k_1500k', label: '500.000 ₫ - 1.500.000 ₫', min: '500000', max: '1500000' },
  { id: '1500k_3000k', label: '1.500.000 ₫ - 3.000.000 ₫', min: '1500000', max: '3000000' },
  { id: 'over_3000k', label: 'Trên 3.000.000 ₫', min: '3000000', max: '' },
];

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT_COLORS = [
  { name: 'Đen', hex: '#111827' },
  { name: 'Trắng', hex: '#FFFFFF', border: true },
  { name: 'Xám', hex: '#9CA3AF' },
  { name: 'Xanh Navy', hex: '#1E3A8A' },
  { name: 'Be', hex: '#D7C4B7' },
  { name: 'Nâu', hex: '#78350F' }
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const productsContainerRef = useRef(null);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState(DEFAULT_SIZES);
  const [availableColors, setAvailableColors] = useState(DEFAULT_COLORS);
  const [loading, setLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page') || '1', 10),
    lastPage: 1,
    total: 0,
    perPage: 9
  });

  // Display View layout: 3 columns vs 4 columns
  const [columnCount, setColumnCount] = useState(3);

  // Mobile drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    in_stock: searchParams.get('in_stock') === '1',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  });

  // Local state for instant input editing before debounce
  const [searchInput, setSearchInput] = useState(filters.search);
  const [customMinPrice, setCustomMinPrice] = useState(filters.min_price);
  const [customMaxPrice, setCustomMaxPrice] = useState(filters.max_price);

  // 1. Fetch metadata (Categories & Filter Options) once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, optRes] = await Promise.allSettled([
          api.get('/categories'),
          api.get('/products/filter-options')
        ]);

        if (catRes.status === 'fulfilled' && Array.isArray(catRes.value.data)) {
          setCategories(catRes.value.data);
        }

        if (optRes.status === 'fulfilled' && optRes.value.data) {
          const { sizes, colors } = optRes.value.data;
          if (Array.isArray(sizes) && sizes.length > 0) {
            // merge with defaults
            const mergedSizes = Array.from(new Set([...DEFAULT_SIZES, ...sizes]));
            setAvailableSizes(mergedSizes);
          }
          if (Array.isArray(colors) && colors.length > 0) {
            // keep standard list and append any new ones
            const existingNames = new Set(DEFAULT_COLORS.map(c => c.name.toLowerCase()));
            const extra = colors
              .filter(c => !existingNames.has(c.toLowerCase()))
              .map(c => ({ name: c, hex: '#6B7280' }));
            setAvailableColors([...DEFAULT_COLORS, ...extra]);
          }
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu bộ lọc:', err);
      } finally {
        setInitialLoaded(true);
      }
    };

    fetchMetadata();
  }, []);

  // Sync search input if URL changes externally (e.g. from navbar search)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: urlSearch, page: 1 }));
      setSearchInput(urlSearch);
    }
    const urlCat = searchParams.get('category') || '';
    if (urlCat !== filters.category) {
      setFilters(prev => ({ ...prev, category: urlCat, page: 1 }));
    }
  }, [searchParams]);

  // Debounce search input changes into filters
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 2. Fetch products whenever filters change
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.size) params.append('size', filters.size);
      if (filters.color) params.append('color', filters.color);
      if (filters.in_stock) params.append('in_stock', '1');
      if (filters.sort) params.append('sort', filters.sort);
      
      params.append('page', filters.page.toString());
      params.append('per_page', pagination.perPage.toString());
      params.append('paginate', '1');

      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.data && response.data.data) {
        // Paginated structure
        setProducts(response.data.data);
        setPagination({
          currentPage: response.data.current_page || filters.page,
          lastPage: response.data.last_page || 1,
          total: response.data.total || response.data.data.length,
          perPage: response.data.per_page || 9
        });
      } else if (Array.isArray(response.data)) {
        // Direct array fallback
        setProducts(response.data);
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          lastPage: 1,
          total: response.data.length
        }));
      }

      // Sync URL query params cleanly (omit defaults/empty)
      const urlParams = new URLSearchParams();
      if (filters.search) urlParams.set('search', filters.search);
      if (filters.category) urlParams.set('category', filters.category);
      if (filters.min_price) urlParams.set('min_price', filters.min_price);
      if (filters.max_price) urlParams.set('max_price', filters.max_price);
      if (filters.size) urlParams.set('size', filters.size);
      if (filters.color) urlParams.set('color', filters.color);
      if (filters.in_stock) urlParams.set('in_stock', '1');
      if (filters.sort && filters.sort !== 'newest') urlParams.set('sort', filters.sort);
      if (filters.page > 1) urlParams.set('page', filters.page.toString());

      setSearchParams(urlParams, { replace: true });
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Handlers
  const handleCategorySelect = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === String(categoryId) ? '' : String(categoryId),
      page: 1
    }));
  };

  const handlePricePresetSelect = (preset) => {
    setCustomMinPrice(preset.min);
    setCustomMaxPrice(preset.max);
    setFilters(prev => ({
      ...prev,
      min_price: preset.min,
      max_price: preset.max,
      page: 1
    }));
  };

  const handleApplyCustomPrice = (e) => {
    e?.preventDefault();
    setFilters(prev => ({
      ...prev,
      min_price: customMinPrice,
      max_price: customMaxPrice,
      page: 1
    }));
  };

  const handleSizeSelect = (size) => {
    setFilters(prev => ({
      ...prev,
      size: prev.size === size ? '' : size,
      page: 1
    }));
  };

  const handleColorSelect = (color) => {
    setFilters(prev => ({
      ...prev,
      color: prev.color === color ? '' : color,
      page: 1
    }));
  };

  const handleStockToggle = () => {
    setFilters(prev => ({
      ...prev,
      in_stock: !prev.in_stock,
      page: 1
    }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({
      ...prev,
      sort: e.target.value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage && newPage !== filters.page) {
      setFilters(prev => ({ ...prev, page: newPage }));
      // Smooth scroll back to top of products list
      if (productsContainerRef.current) {
        productsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setFilters({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
      size: '',
      color: '',
      in_stock: false,
      sort: 'newest',
      page: 1
    });
  };

  // Determine active price preset
  const currentPricePreset = PRICE_PRESETS.find(
    p => p.min === filters.min_price && p.max === filters.max_price
  )?.id || (filters.min_price || filters.max_price ? 'custom' : 'all');

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.min_price ||
    filters.max_price ||
    filters.size ||
    filters.color ||
    filters.in_stock
  );

  const getActiveCategoryName = () => {
    const cat = categories.find(c => String(c.id) === String(filters.category));
    return cat ? cat.name : 'Danh mục đã chọn';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 lg:px-12">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Cửa hàng', path: '' }
        ]} />

        {/* Page Editorial Header */}
        <div ref={productsContainerRef} className="pt-4 pb-8 mb-8 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">
                Bộ Sưu Tập / Tuyển Chọn
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight text-black">
                Cửa Hàng
              </h1>
            </div>

            {/* Results counter & Column switcher */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 font-medium">
              <span>
                Hiển thị {pagination.total > 0 ? (filters.page - 1) * pagination.perPage + 1 : 0} - {Math.min(filters.page * pagination.perPage, pagination.total)} trong {pagination.total} sản phẩm
              </span>

              {/* Grid Column Selector (Desktop) */}
              <div className="hidden lg:flex items-center space-x-1 border border-gray-200 p-1">
                <button
                  onClick={() => setColumnCount(3)}
                  className={`p-1.5 transition-colors ${columnCount === 3 ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                  title="Lưới 3 cột"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setColumnCount(4)}
                  className={`p-1.5 transition-colors ${columnCount === 4 ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                  title="Lưới 4 cột"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Control Bar: Active Filters Pills + Sorting + Mobile Filter Trigger */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          {/* Active Filter Chips */}
          <div className="flex-1 flex flex-wrap items-center gap-2">
            {hasActiveFilters && (
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-2">
                Đang lọc:
              </span>
            )}

            {filters.search && (
              <span className="inline-flex items-center bg-gray-100 text-black text-xs px-3 py-1.5 rounded-full font-medium">
                Tìm kiếm: "{filters.search}"
                <button 
                  onClick={() => { setSearchInput(''); setFilters(prev => ({ ...prev, search: '', page: 1 })); }}
                  className="ml-2 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {filters.category && (
              <span className="inline-flex items-center bg-gray-100 text-black text-xs px-3 py-1.5 rounded-full font-medium">
                {getActiveCategoryName()}
                <button 
                  onClick={() => handleCategorySelect(filters.category)}
                  className="ml-2 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {(filters.min_price || filters.max_price) && (
              <span className="inline-flex items-center bg-gray-100 text-black text-xs px-3 py-1.5 rounded-full font-medium">
                Giá: {filters.min_price ? formatPrice(filters.min_price) : '0 ₫'} - {filters.max_price ? formatPrice(filters.max_price) : 'Tối đa'}
                <button 
                  onClick={() => {
                    setCustomMinPrice('');
                    setCustomMaxPrice('');
                    setFilters(prev => ({ ...prev, min_price: '', max_price: '', page: 1 }));
                  }}
                  className="ml-2 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {filters.size && (
              <span className="inline-flex items-center bg-gray-100 text-black text-xs px-3 py-1.5 rounded-full font-medium">
                Size: {filters.size}
                <button 
                  onClick={() => handleSizeSelect(filters.size)}
                  className="ml-2 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {filters.color && (
              <span className="inline-flex items-center bg-gray-100 text-black text-xs px-3 py-1.5 rounded-full font-medium">
                Màu: {filters.color}
                <button 
                  onClick={() => handleColorSelect(filters.color)}
                  className="ml-2 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {filters.in_stock && (
              <span className="inline-flex items-center bg-gray-100 text-black text-xs px-3 py-1.5 rounded-full font-medium">
                Chỉ còn hàng
                <button 
                  onClick={handleStockToggle}
                  className="ml-2 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 ml-2 underline underline-offset-4 flex items-center space-x-1"
              >
                <RotateCcw size={12} />
                <span>Xóa tất cả</span>
              </button>
            )}
          </div>

          {/* Right Action: Sort & Mobile Button */}
          <div className="flex items-center space-x-4 w-full lg:w-auto justify-between lg:justify-end">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 border border-black px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              <SlidersHorizontal size={14} />
              <span>Bộ Lọc {hasActiveFilters && '•'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 hidden sm:inline-block">
                Sắp xếp:
              </span>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="border border-gray-300 py-2.5 px-4 pr-9 text-xs font-bold uppercase tracking-wider bg-transparent outline-none cursor-pointer focus:border-black appearance-none"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                  <option value="name_asc">Tên: A - Z</option>
                  <option value="name_desc">Tên: Z - A</option>
                </select>
                <ArrowUpDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* ================= DESKTOP SIDEBAR ================= */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28 space-y-10">
            
            {/* 1. Real-time Search Box */}
            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs mb-3 border-b border-gray-200 pb-2">
                Tìm Kiếm Nhanh
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Gõ tên sản phẩm..."
                  className="w-full border border-gray-300 p-3 pr-10 text-sm outline-none focus:border-black transition-colors"
                />
                {searchInput ? (
                  <button 
                    onClick={() => { setSearchInput(''); setFilters(prev => ({ ...prev, search: '', page: 1 })); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                )}
              </div>
            </div>

            {/* 2. Categories */}
            <div>
              <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                <h3 className="font-bold uppercase tracking-widest text-xs">
                  Danh Mục
                </h3>
                {filters.category && (
                  <button 
                    onClick={() => handleCategorySelect(filters.category)}
                    className="text-[10px] text-gray-400 hover:text-black uppercase"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 }))}
                    className={`w-full flex justify-between items-center text-xs uppercase tracking-wider py-1 transition-colors ${!filters.category ? 'font-bold text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    <span>Tất cả sản phẩm</span>
                    <span className="text-[11px] text-gray-400">({pagination.total})</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const isActive = String(filters.category) === String(cat.id);
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full flex justify-between items-center text-xs uppercase tracking-wider py-1 transition-colors ${isActive ? 'font-bold text-black border-l-2 border-black pl-2' : 'text-gray-500 hover:text-black'}`}
                      >
                        <span>{cat.name}</span>
                        {cat.products_count !== undefined && (
                          <span className={`text-[11px] ${isActive ? 'text-black font-bold' : 'text-gray-400'}`}>
                            ({cat.products_count})
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 3. Price Filter */}
            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs mb-3 border-b border-gray-200 pb-2">
                Khoảng Giá
              </h3>
              
              {/* Preset radio-like chips */}
              <div className="space-y-2 mb-4">
                {PRICE_PRESETS.map((preset) => {
                  const isSelected = currentPricePreset === preset.id;
                  return (
                    <label 
                      key={preset.id}
                      onClick={() => handlePricePresetSelect(preset)}
                      className="flex items-center space-x-3 cursor-pointer group py-0.5"
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-black bg-black' : 'border-gray-300 group-hover:border-black'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={`text-xs transition-colors ${isSelected ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                        {preset.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Custom Price Range Inputs */}
              <form onSubmit={handleApplyCustomPrice} className="pt-2 border-t border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Tùy chỉnh (₫)</span>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="number"
                    value={customMinPrice}
                    onChange={(e) => setCustomMinPrice(e.target.value)}
                    placeholder="Từ"
                    className="w-full border border-gray-300 p-2 text-xs outline-none focus:border-black"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={customMaxPrice}
                    onChange={(e) => setCustomMaxPrice(e.target.value)}
                    placeholder="Đến"
                    className="w-full border border-gray-300 p-2 text-xs outline-none focus:border-black"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full border border-gray-300 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-colors"
                >
                  Áp dụng giá
                </button>
              </form>
            </div>

            {/* 4. Size Filter */}
            {availableSizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                  <h3 className="font-bold uppercase tracking-widest text-xs">
                    Kích Cỡ
                  </h3>
                  {filters.size && (
                    <button 
                      onClick={() => handleSizeSelect(filters.size)}
                      className="text-[10px] text-gray-400 hover:text-black uppercase"
                    >
                      Bỏ chọn
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = filters.size === size;
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`w-10 h-10 border text-xs font-bold uppercase transition-all duration-200 flex items-center justify-center ${isSelected ? 'bg-black text-white border-black shadow-sm' : 'border-gray-200 text-gray-700 hover:border-black'}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Color Filter */}
            {availableColors.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                  <h3 className="font-bold uppercase tracking-widest text-xs">
                    Màu Sắc
                  </h3>
                  {filters.color && (
                    <button 
                      onClick={() => handleColorSelect(filters.color)}
                      className="text-[10px] text-gray-400 hover:text-black uppercase"
                    >
                      Bỏ chọn
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableColors.map((color) => {
                    const isSelected = filters.color === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleColorSelect(color.name)}
                        className={`flex items-center space-x-2.5 p-2 border text-xs text-left transition-all ${isSelected ? 'border-black bg-gray-50 font-bold' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                          style={{ 
                            backgroundColor: color.hex,
                            border: color.border || color.hex === '#FFFFFF' ? '1px solid #D1D5DB' : 'none' 
                          }}
                        />
                        <span className="truncate">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. Availability Checkbox */}
            <div className="pt-2 border-t border-gray-200">
              <label 
                onClick={handleStockToggle}
                className="flex items-center space-x-3 cursor-pointer group select-none"
              >
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.in_stock ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-black'}`}>
                  {filters.in_stock && <Check size={12} strokeWidth={3} />}
                </div>
                <span className={`text-xs uppercase tracking-wider ${filters.in_stock ? 'font-bold text-black' : 'text-gray-600'}`}>
                  Chỉ hiện hàng có sẵn
                </span>
              </label>
            </div>

            {/* Reset All Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full border border-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw size={14} />
                <span>Đặt Lại Bộ Lọc</span>
              </button>
            )}
          </aside>

          {/* ================= PRODUCTS GRID & PAGINATION ================= */}
          <section className="flex-1 w-full">
            {loading ? (
              // Luxury Skeleton Loading State
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${columnCount === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-x-8 gap-y-12`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse flex flex-col">
                    <div className="aspect-[3/4] bg-gray-100 rounded-sm mb-4" />
                    <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3 mx-auto" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${columnCount === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-x-8 gap-y-12`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Real Pagination */}
                {pagination.lastPage > 1 && (
                  <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                      Trang {pagination.currentPage} / {pagination.lastPage}
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Previous Page */}
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage <= 1}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: pagination.lastPage }, (_, idx) => idx + 1)
                        .filter(pageNum => (
                          pageNum === 1 || 
                          pageNum === pagination.lastPage || 
                          Math.abs(pageNum - pagination.currentPage) <= 1
                        ))
                        .map((pageNum, index, arr) => {
                          const prevNum = arr[index - 1];
                          const showEllipsis = prevNum && pageNum - prevNum > 1;
                          const isActive = pageNum === pagination.currentPage;
                          return (
                            <React.Fragment key={pageNum}>
                              {showEllipsis && <span className="text-gray-300 px-1">...</span>}
                              <button
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 flex items-center justify-center text-xs font-bold transition-colors ${isActive ? 'bg-black text-white' : 'border border-gray-200 text-gray-700 hover:border-black hover:text-black'}`}
                              >
                                {pageNum}
                              </button>
                            </React.Fragment>
                          );
                        })}

                      {/* Next Page */}
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.lastPage}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty Search Results State */
              <div className="text-center py-28 px-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-sm">
                <Search size={36} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-serif italic text-gray-900 mb-2">
                  Không tìm thấy sản phẩm nào
                </h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  Rất tiếc, không có sản phẩm nào phù hợp với các tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-black text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Xóa Hết Bộ Lọc
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ================= MOBILE FILTER DRAWER ================= */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Dark Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsFilterOpen(false)} 
            />

            {/* Slide Drawer */}
            <div className="relative w-full max-w-xs sm:max-w-md bg-white h-full shadow-2xl flex flex-col ml-auto z-10 animate-slide-in-right">
              {/* Drawer Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal size={18} />
                  <h2 className="text-lg font-bold uppercase tracking-widest">Bộ Lọc</h2>
                </div>
                <button 
                  onClick={() => setIsFilterOpen(false)} 
                  className="text-gray-400 hover:text-black p-1"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="p-6 flex-1 overflow-y-auto space-y-8">
                {/* Search */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Tìm kiếm</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Tên sản phẩm..."
                      className="w-full border border-gray-300 p-3 text-sm outline-none"
                    />
                    {searchInput && (
                      <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Danh mục</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 }))}
                      className={`block w-full text-left p-3 border text-xs uppercase font-bold tracking-wider ${!filters.category ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600'}`}
                    >
                      Tất cả sản phẩm
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`block w-full text-left p-3 border text-xs uppercase font-bold tracking-wider ${String(filters.category) === String(cat.id) ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600'}`}
                      >
                        {cat.name} {cat.products_count !== undefined && `(${cat.products_count})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Presets */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Khoảng giá</label>
                  <div className="space-y-2">
                    {PRICE_PRESETS.map((preset) => {
                      const isSelected = currentPricePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handlePricePresetSelect(preset)}
                          className={`block w-full text-left p-2.5 border text-xs font-medium ${isSelected ? 'border-black bg-gray-50 font-bold' : 'border-gray-200 text-gray-600'}`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sizes */}
                {availableSizes.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Kích cỡ</label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          className={`w-10 h-10 border text-xs font-bold uppercase ${filters.size === size ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {availableColors.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Màu sắc</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => handleColorSelect(color.name)}
                          className={`flex items-center space-x-2 p-2 border text-xs ${filters.color === color.name ? 'border-black bg-gray-50 font-bold' : 'border-gray-200 text-gray-600'}`}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                          <span className="truncate">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* In Stock Toggle */}
                <div>
                  <label 
                    onClick={handleStockToggle}
                    className="flex items-center space-x-3 cursor-pointer py-2 border-t border-gray-100"
                  >
                    <div className={`w-4 h-4 border flex items-center justify-center ${filters.in_stock ? 'bg-black border-black text-white' : 'border-gray-300'}`}>
                      {filters.in_stock && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="text-xs uppercase font-bold tracking-wider">Chỉ hiện hàng có sẵn</span>
                  </label>
                </div>
              </div>

              {/* Drawer Footer Buttons */}
              <div className="p-6 border-t border-gray-100 flex space-x-4 bg-gray-50">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 border border-black py-3.5 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors"
                >
                  Xóa Lọc
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 bg-black text-white py-3.5 font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
                >
                  Xem Kết Quả ({pagination.total})
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
