import React from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { formatPrice } from '../../utils/formatPrice';
import { History, Trash2, ArrowRight } from 'lucide-react';

const RecentlyViewedBar = ({ currentProductId }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  // Loại trừ sản phẩm đang xem chi tiết hiện tại (nếu có)
  const items = recentlyViewed.filter(p => p.id !== Number(currentProductId) && p.id !== currentProductId);

  if (items.length === 0) return null;

  return (
    <div className="border-t border-gray-200 pt-16 mt-16">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <History size={16} className="text-gray-400" />
          <h3 className="font-serif font-bold text-lg uppercase tracking-wider text-black">
            Sản Phẩm Bạn Đã Xem Gần Đây
          </h3>
        </div>

        <button
          onClick={clearRecentlyViewed}
          className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-1"
        >
          <Trash2 size={12} />
          <span>Xóa Lịch Sử</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            className="group bg-white border border-gray-100 hover:border-black transition-all p-2.5 block"
          >
            <div className="aspect-[3/4] bg-zinc-100 overflow-hidden mb-2 relative">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : null}
            </div>

            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 truncate">
              {item.category_name || 'TVC Shop'}
            </p>
            <h4 className="font-serif font-medium text-xs text-black truncate mt-0.5 group-hover:text-gray-600 transition-colors">
              {item.name}
            </h4>

            <div className="mt-1 flex items-baseline space-x-1.5">
              <span className="font-serif font-bold text-xs text-black">
                {formatPrice(item.discount_price || item.price)}
              </span>
              {item.discount_price && (
                <span className="text-[10px] text-gray-400 line-through">
                  {formatPrice(item.price)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedBar;
