import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Check, Trash2, ShoppingBag, ArrowRight, 
  Layers, ArrowLeftRight, Star, ExternalLink 
} from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';

const CompareModal = () => {
  const { 
    compareItems, 
    removeFromCompare, 
    clearCompare, 
    isCompareDrawerOpen, 
    setIsCompareDrawerOpen 
  } = useCompare();

  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!isCompareDrawerOpen) return null;

  const handleQuickAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image: product.image || product.image_url,
      size: (product.available_sizes && product.available_sizes[0]) || 'M',
      color: (product.available_colors && product.available_colors[0]) || 'Đen',
      quantity: 1
    });
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={() => setIsCompareDrawerOpen(false)} />

      {/* Modal Dialog */}
      <div 
        className="relative bg-white w-full max-w-6xl max-h-[92vh] flex flex-col rounded-sm shadow-2xl z-10 border border-gray-200 overflow-hidden animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/70">
          <div className="flex items-center space-x-2.5">
            <ArrowLeftRight size={18} className="text-gray-900" />
            <h2 className="text-base font-serif font-bold uppercase tracking-wider text-gray-900">
              So Sánh Sản Phẩm ({compareItems.length}/4)
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs uppercase font-bold tracking-wider text-gray-400 hover:text-rose-600 transition-colors flex items-center space-x-1"
              >
                <Trash2 size={13} />
                <span>Xóa tất cả</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareDrawerOpen(false)}
              className="text-gray-400 hover:text-black p-1 transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content Comparison Table */}
        <div className="flex-1 overflow-auto p-6">
          {compareItems.length === 0 ? (
            <div className="text-center py-20">
              <ArrowLeftRight size={44} className="mx-auto text-gray-300 mb-4" />
              <p className="text-sm font-serif italic text-gray-700 mb-2">Danh sách so sánh đang trống</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Hãy nhấn biểu tượng so sánh trên thẻ sản phẩm để đưa vào bảng đối chiếu!</p>
              <button
                onClick={() => setIsCompareDrawerOpen(false)}
                className="border border-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Khám Phá Cửa Hàng
              </button>
            </div>
          ) : (
            <div className="min-w-[650px]">
              <table className="w-full border-collapse">
                <tbody>
                  {/* Row: Product Images & Names */}
                  <tr className="border-b border-gray-200">
                    <td className="w-36 p-4 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50 align-top">
                      Sản phẩm
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="p-4 align-top border-l border-gray-100 w-1/4">
                        <div className="relative group mb-3">
                          <button
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full z-10 transition-colors"
                            title="Xóa khỏi so sánh"
                          >
                            <X size={13} />
                          </button>
                          <div className="aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden mb-3">
                            <img src={item.image || item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-serif font-bold text-sm text-gray-900 line-clamp-1 mb-1">
                            <Link 
                              to={`/product/${item.id}`} 
                              onClick={() => setIsCompareDrawerOpen(false)}
                              className="hover:underline flex items-center space-x-1"
                            >
                              <span>{item.name}</span>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {item.category_name || 'Thời Trang'}
                          </p>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Prices */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50">
                      Mức giá
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="p-4 border-l border-gray-100">
                        {item.discount ? (
                          <div>
                            <span className="text-base font-bold text-gray-900 block">
                              {formatPrice(item.discount_price)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice || item.price)}
                            </span>
                            <span className="ml-2 text-[10px] text-emerald-600 font-bold">
                              Tiết kiệm {item.discount}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-base font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Available Sizes */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50">
                      Kích cỡ có sẵn
                    </td>
                    {compareItems.map((item) => {
                      const sizes = item.available_sizes || ['S', 'M', 'L', 'XL'];
                      return (
                        <td key={item.id} className="p-4 border-l border-gray-100">
                          <div className="flex flex-wrap gap-1.5">
                            {sizes.map((s) => (
                              <span key={s} className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase rounded-xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Colors */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50">
                      Màu sắc
                    </td>
                    {compareItems.map((item) => {
                      const colors = item.available_colors || ['Đen', 'Trắng', 'Xám'];
                      return (
                        <td key={item.id} className="p-4 border-l border-gray-100">
                          <div className="flex flex-wrap gap-1.5">
                            {colors.map((c) => (
                              <span key={c} className="px-2.5 py-1 border border-gray-200 text-gray-700 text-[10px] font-semibold rounded-xs">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Description */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50">
                      Đặc điểm
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="p-4 border-l border-gray-100 text-xs text-gray-600 leading-relaxed">
                        <p className="line-clamp-3">
                          {item.description || 'Chất liệu vải cao cấp thoáng khí, chuẩn phom dáng tối giản hiện đại.'}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Action Buy */}
                  <tr>
                    <td className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50">
                      Thao tác
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="p-4 border-l border-gray-100">
                        <button
                          onClick={() => handleQuickAdd(item)}
                          className="w-full bg-black text-white py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                        >
                          <ShoppingBag size={14} />
                          <span>Thêm vào giỏ</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-right">
          <button
            onClick={() => setIsCompareDrawerOpen(false)}
            className="text-xs uppercase font-bold tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            Đóng bảng so sánh
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
