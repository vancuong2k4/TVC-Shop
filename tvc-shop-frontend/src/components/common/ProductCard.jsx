import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, ArrowLeftRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare, setIsCompareDrawerOpen } = useCompare();
  const { toast } = useToast();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const isLiked = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleOpenQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCompared) {
      removeFromCompare(product.id);
      toast.info(`Đã bỏ "${product.name}" khỏi danh sách so sánh.`);
    } else {
      const res = addToCompare(product);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.warning(res.message);
      }
    }
  };

  return (
    <>
      <div className="group relative flex flex-col cursor-pointer">
        {/* Hình ảnh & Hover Overlay */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4 rounded-sm">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
          />
          
          {/* Lớp phủ Glassmorphism mờ */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Nút thao tác (Hiện ra từ dưới lên) */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center space-x-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10 px-2">
            {/* Quick View Button */}
            <button 
              onClick={handleOpenQuickView}
              className="bg-white/95 backdrop-blur-md text-black p-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-md transform hover:-translate-y-1"
              title="Xem nhanh sản phẩm"
            >
              <Eye size={16} strokeWidth={2} />
            </button>

            {/* Compare Button */}
            <button 
              onClick={handleToggleCompare}
              className={`p-3 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-1 backdrop-blur-md ${
                isCompared 
                  ? 'bg-black text-white' 
                  : 'bg-white/95 text-black hover:bg-black hover:text-white'
              }`}
              title={isCompared ? "Đã thêm vào so sánh (Click để xóa)" : "Thêm vào so sánh"}
            >
              <ArrowLeftRight size={16} strokeWidth={2} />
            </button>

            {/* Direct Quick Add */}
            <button 
              onClick={handleOpenQuickView}
              className="bg-white/95 backdrop-blur-md text-black p-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-md transform hover:-translate-y-1"
              title="Tùy chọn kích cỡ & Thêm vào giỏ"
            >
              <ShoppingCart size={16} strokeWidth={2} />
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={handleToggleWishlist}
              className="bg-white/95 backdrop-blur-md text-black p-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-md transform hover:-translate-y-1"
              title="Yêu thích"
            >
              <Heart size={16} strokeWidth={2} className={isLiked ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>

          {/* Badges cao cấp */}
          {product.isNew && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-black text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 shadow-xs">
              New
            </div>
          )}
          {product.discount && (
            <div className="absolute top-3 right-3 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 shadow-xs">
              -{product.discount}%
            </div>
          )}

          {isCompared && (
            <div className="absolute top-3 left-3 bg-black text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-xs">
              Đang so sánh
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="text-center px-2">
          <h3 className="text-sm md:text-base font-serif italic text-gray-900 mb-1.5 line-clamp-1">
            <Link to={`/product/${product.id}`} className="hover:text-gray-500 transition-colors">
              {product.name}
            </Link>
          </h3>
          <div className="flex justify-center space-x-2.5 text-[13px] font-medium tracking-wide">
            {product.discount ? (
              <>
                <span className="text-gray-400 line-through decoration-gray-300">{formatPrice(product.originalPrice || product.price)}</span>
                <span className="text-black font-bold">{formatPrice(product.discount_price || product.price)}</span>
              </>
            ) : (
              <span className="text-gray-900 font-bold">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal Popup */}
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
