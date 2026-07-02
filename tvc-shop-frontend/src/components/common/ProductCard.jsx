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
    <div className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-5">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Hover overlay & actions */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex justify-center space-x-4">
          <button className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-xl">
            <ShoppingCart size={18} />
          </button>
          <button 
            onClick={handleToggle}
            className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-xl"
          >
            <Heart size={18} className={isLiked ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>

        {/* Badges */}
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-sm">
            Mới
          </div>
        )}
        {product.discount && (
          <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-sm">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wide">
          <Link to={`/product/${product.id}`} className="hover:text-gray-500 transition-colors">{product.name}</Link>
        </h3>
        <div className="flex justify-center space-x-3 text-sm">
          {product.discount ? (
            <>
              <span className="text-gray-400 line-through">{formatPrice(product.originalPrice || product.price)}</span>
              <span className="text-black font-semibold">{formatPrice(product.discount_price || product.price)}</span>
            </>
          ) : (
            <span className="text-black font-semibold">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
