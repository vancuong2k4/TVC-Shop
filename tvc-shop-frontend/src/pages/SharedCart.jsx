import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Share2, ArrowRight, CheckCircle2, User, Sparkles, AlertCircle } from 'lucide-react';

const SharedCart = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    fetchSharedCart();
  }, [code]);

  const fetchSharedCart = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/cart/shared/${code}`);
      setCartData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tìm thấy giỏ hàng chia sẻ hoặc liên kết đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    if (!cartData?.items) return;

    cartData.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      }, item.quantity, item.size, item.color);
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setIsCartOpen(true);
    }, 500);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-4xl">
          <Breadcrumb items={[{ label: 'Trang chủ', link: '/' }, { label: 'Giỏ Hàng Được Chia Sẻ' }]} />

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Đang tải giỏ hàng chia sẻ...</p>
            </div>
          ) : error ? (
            <div className="bg-white border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-sm">
              <AlertCircle size={40} className="text-rose-500 mx-auto mb-4" />
              <h2 className="font-serif font-bold text-lg text-black mb-2">Liên Kết Không Khả Dụng</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">{error}</p>
              <Link
                to="/shop"
                className="inline-block px-6 py-3 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors"
              >
                Khám Phá Cửa Hàng
              </Link>
            </div>
          ) : cartData && (
            <div className="bg-white border border-gray-100 shadow-xl overflow-hidden">
              {/* Header Banner */}
              <div className="bg-black text-white p-8 md:p-10 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-300 mb-3">
                    <Share2 size={12} className="text-amber-300" />
                    <span>Shared Wishlist & Cart</span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-serif font-normal tracking-tight text-white mb-2">
                    Giỏ Hàng Được Chia Sẻ
                  </h1>
                  <p className="text-xs text-zinc-400">
                    Mã liên kết: <span className="font-mono text-white font-bold">{cartData.share_code}</span> • Tạo ngày {cartData.created_at}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="p-8 md:p-10 divide-y divide-gray-100">
                <div className="flex justify-between items-center pb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Sản Phẩm ({cartData.items_count})</span>
                  <span>Đơn Giá</span>
                </div>

                {cartData.items.map((item, idx) => (
                  <div key={idx} className="py-6 flex items-center justify-between gap-6 group">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="w-16 h-20 bg-zinc-100 overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link to={`/product/${item.id}`} className="font-serif font-bold text-sm text-black hover:underline truncate block">
                          {item.name}
                        </Link>
                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
                          Size: <span className="font-bold text-black">{item.size}</span> | Màu: <span className="font-bold text-black">{item.color}</span> | SL: <span className="font-bold text-black">{item.quantity}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-serif font-bold text-sm text-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-400">
                          {formatPrice(item.price)}/chiếc
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Total & Action Bar */}
                <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">
                      Tổng Giá Trị Giỏ Hàng
                    </span>
                    <span className="font-serif font-bold text-2xl text-black">
                      {formatPrice(cartData.total_amount)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <Link
                      to="/shop"
                      className="flex-1 sm:flex-none px-6 py-3.5 border border-black text-xs font-bold uppercase tracking-widest text-center hover:bg-black hover:text-white transition-colors"
                    >
                      Tiếp Tục Mua Sắm
                    </Link>

                    <button
                      onClick={handleAddAllToCart}
                      className="flex-1 sm:flex-none px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                    >
                      {addedSuccess ? (
                        <>
                          <CheckCircle2 size={16} className="text-emerald-400" />
                          <span>Đã Thêm Vào Giỏ!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Sao Chép Vào Giỏ Hàng Của Bạn</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SharedCart;
