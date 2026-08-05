import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  const handleToggle = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
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
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
          <button className="bg-white/90 backdrop-blur-md text-black p-3.5 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-lg transform hover:-translate-y-1">
            <ShoppingCart size={18} strokeWidth={2} />
          </button>
          <button 
            onClick={handleToggle}
            className="bg-white/90 backdrop-blur-md text-black p-3.5 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            <Heart size={18} strokeWidth={2} className={isLiked ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>

        {/* Badges cao cấp */}
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-sm">
            New
          </div>
        )}
        {product.discount && (
          <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-sm">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="text-center px-2">
        <h3 className="text-base font-serif italic text-gray-900 mb-1.5 line-clamp-1">
          <Link to={`/product/${product.id}`} className="hover:text-gray-500 transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex justify-center space-x-3 text-[13px] font-medium tracking-wide">
          {product.discount ? (
            <>
              <span className="text-gray-400 line-through decoration-gray-300">{formatPrice(product.originalPrice || product.price)}</span>
              <span className="text-black">{formatPrice(product.discount_price || product.price)}</span>
            </>
          ) : (
            <span className="text-gray-900">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
