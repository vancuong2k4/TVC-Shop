import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <>
      {/* Lớp phủ đen mờ */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer trượt từ phải */}
      <div className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-[450px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold uppercase tracking-widest flex items-center">
            <ShoppingBag className="mr-3" size={20} /> Giỏ hàng ({cartItems.length})
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black transition-colors rotate-hover">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-6">
              <ShoppingBag size={56} strokeWidth={1} />
              <p className="uppercase tracking-widest text-sm font-semibold text-gray-500">Giỏ hàng của bạn đang trống.</p>
              <button onClick={() => setIsCartOpen(false)} className="btn-outline mt-6">Tiếp tục mua sắm</button>
            </div>
          ) : (
            <div className="space-y-8">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-5 group">
                  {/* Product Image */}
                  <div className="w-24 h-32 bg-gray-50 flex-shrink-0 relative overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <Link to={`/product/${item.id}`} onClick={() => setIsCartOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-gray-500 line-clamp-2 pr-4">
                          {item.name}
                        </Link>
                        <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-2 font-medium">
                        Màu: {item.color} | Size: {item.size}
                      </p>
                      <div className="flex justify-between items-center">
                        {/* Quantity Control */}
                        <div className="flex items-center border border-gray-200 w-28 justify-between">
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="p-2 hover:bg-gray-100 text-gray-500 transition-colors"><Minus size={14} /></button>
                          <span className="text-xs font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="p-2 hover:bg-gray-100 text-gray-500 transition-colors"><Plus size={14} /></button>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm uppercase tracking-widest font-semibold text-gray-500">Tổng cộng</span>
              <span className="text-2xl font-bold">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-6 text-center tracking-wider">THUẾ VÀ PHÍ VẬN CHUYỂN SẼ ĐƯỢC TÍNH KHI THANH TOÁN.</p>
            <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="block w-full text-center bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors shadow-xl">
              Thanh Toán Ngay
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
