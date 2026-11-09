import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, ShoppingBag, Heart, Check, Star, ShieldCheck, 
  Ruler, Eye, ArrowRight 
} from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Đen');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const isLiked = isInWishlist(product.id);

  // Danh sách hình ảnh
  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.image_url || img) 
    : [product.image || product.image_url];

  const currentDisplayImage = images[activeImageIndex] || product.image;

  const sizes = product.available_sizes && product.available_sizes.length > 0 
    ? product.available_sizes 
    : ['S', 'M', 'L', 'XL'];

  const colors = product.available_colors && product.available_colors.length > 0 
    ? product.available_colors 
    : ['Đen', 'Trắng', 'Xám'];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image: currentDisplayImage,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });

    toast.success(`Đã thêm ${quantity}x "${product.name}" (Size ${selectedSize}) vào giỏ hàng!`);
    onClose();
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    if (!isLiked) {
      toast.info(`Đã lưu "${product.name}" vào danh sách yêu thích.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div 
        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm border border-gray-100 shadow-2xl z-10 animate-slide-down flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-black hover:bg-white transition-all shadow-md"
        >
          <X size={20} />
        </button>

        {/* Left Side: Product Gallery */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-gray-50/50 border-r border-gray-100">
          <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-sm overflow-hidden mb-4 shadow-xs">
            <img 
              src={currentDisplayImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-500"
            />
            {product.discount && (
              <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-18 rounded-sm overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Add to Cart */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 block mb-1">
                {product.category_name || 'Thời Trang Thiết Kế'}
              </span>
              <h2 className="text-2xl font-serif font-bold text-gray-900 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Price Row */}
            <div className="flex items-center space-x-3 mb-6">
              {product.discount ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.discount_price)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.originalPrice || product.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-gray-600 leading-relaxed mb-6 line-clamp-3">
              {product.description || 'Thiết kế nguyên bản tôn vinh sự thanh lịch, phom dáng chuẩn mực cùng chất liệu cao cấp mang lại cảm giác thoải mái suốt cả ngày.'}
            </p>

            {/* Color Selection */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Màu sắc: <span className="text-black">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                      selectedColor === color 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 text-gray-700 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Kích cỡ: <span className="text-black">{selectedSize}</span>
                </label>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center space-x-1">
                  <Ruler size={12} />
                  <span>Chuẩn Form</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 text-xs font-bold uppercase border transition-all ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white shadow-sm' 
                        : 'border-gray-200 text-gray-700 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Số Lượng
              </label>
              <div className="flex items-center border border-gray-300 w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <ShoppingBag size={16} />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-4 border transition-colors ${
                  isLiked ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 text-gray-700 hover:border-black'
                }`}
                title="Thêm vào danh sách yêu thích"
              >
                <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="block text-center text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black py-1.5 transition-colors"
            >
              Xem Chi Tiết Đầy Đủ & Đánh Giá →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
