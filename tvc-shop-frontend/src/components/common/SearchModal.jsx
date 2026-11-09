import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';

const POPULAR_SEARCHES = ['Áo sơ mi', 'Áo khoác Blazer', 'Quần âu', 'Váy lụa', 'Phụ kiện'];

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tvc_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  // Focus input when opened & lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced real-time search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await api.get('/products', {
          params: {
            search: query.trim(),
            limit: 6
          }
        });
        const items = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setResults(items);
      } catch (error) {
        console.error('Lỗi tìm kiếm thời gian thực:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const saveRecentSearch = (term) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    try {
      const existing = recentSearches.filter(s => s.toLowerCase() !== cleaned.toLowerCase());
      const updated = [cleaned, ...existing].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('tvc_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectProduct = (product) => {
    saveRecentSearch(product.name);
    onClose();
    navigate(`/product/${product.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickKeywordClick = (keyword) => {
    setQuery(keyword);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('tvc_recent_searches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Background Overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Box */}
      <div 
        className="relative w-full max-w-3xl bg-white shadow-2xl rounded-sm overflow-hidden z-10 border border-gray-100 animate-slide-down flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-gray-200 px-6 py-5 flex items-center bg-gray-50/50">
          <Search size={22} className="text-gray-400 mr-4 flex-shrink-0" />
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm trang phục, bộ sưu tập, phụ kiện..."
              className="w-full bg-transparent text-lg md:text-xl font-serif text-black placeholder-gray-400 outline-none tracking-wide"
            />
          </form>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-black p-1 mr-2 transition-colors"
              title="Xóa tìm kiếm"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase font-bold tracking-widest text-gray-500 hover:text-black border border-gray-300 px-3 py-1.5 transition-colors ml-2"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 flex-1 divide-y divide-gray-100">
          {/* 1. Real-time Results when Query exists */}
          {query.trim() ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  {loading ? 'Đang tìm kiếm...' : `Kết quả tìm kiếm (${results.length})`}
                </span>
                {results.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center space-x-1"
                  >
                    <span>Xem tất cả kết quả</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {loading ? (
                // Skeletons
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-16 h-20 bg-gray-200 rounded-sm" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="group flex items-center space-x-4 p-2.5 rounded-sm hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200"
                    >
                      <div className="w-16 h-20 bg-gray-100 overflow-hidden flex-shrink-0 relative rounded-sm">
                        <img
                          src={product.image || product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount && (
                          <span className="absolute top-1 left-1 bg-black text-white text-[9px] font-bold px-1 py-0.5 tracking-tighter">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {product.category_name && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                            {product.category_name}
                          </span>
                        )}
                        <h4 className="text-sm font-serif font-medium text-gray-900 group-hover:text-black line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {product.discount ? (
                            <>
                              <span className="text-xs font-bold text-black">
                                {formatPrice(product.discount_price)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(product.originalPrice || product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-black">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm mb-4 font-serif italic text-lg">
                    Không tìm thấy sản phẩm nào khớp với "{query}"
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">
                    Hãy thử từ khóa ngắn hơn hoặc kiểm tra lỗi chính tả
                  </p>
                  <button
                    onClick={() => setQuery('')}
                    className="border border-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                  >
                    Xem gợi ý tìm kiếm
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 2. Empty State: Recent & Popular Suggestions */
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
                      <Clock size={14} />
                      <span>Tìm kiếm gần đây</span>
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] text-gray-400 hover:text-black uppercase tracking-wider"
                    >
                      Xóa lịch sử
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickKeywordClick(item)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3.5 py-2 rounded-full transition-colors font-medium flex items-center space-x-1"
                      >
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2 mb-3">
                  <TrendingUp size={14} />
                  <span>Xu hướng tìm kiếm</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickKeywordClick(keyword)}
                      className="border border-gray-200 hover:border-black text-gray-700 hover:text-black text-xs px-4 py-2 rounded-full transition-all duration-200 font-medium tracking-wide flex items-center space-x-1.5"
                    >
                      <Sparkles size={12} className="text-gray-400" />
                      <span>{keyword}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Tips */}
              <div className="bg-gray-50 p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-black">
                    Khám phá toàn bộ Cửa Hàng
                  </h5>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Duyệt qua tất cả sản phẩm thời trang thiết kế mới nhất
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/shop');
                  }}
                  className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <span>Duyệt Ngay</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400">
          <span>Nhấn <strong>Enter</strong> để xem tất cả kết quả</span>
          <span>Nhấn <strong>ESC</strong> để đóng</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
