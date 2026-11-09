import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';
import { ShoppingBag, CheckCircle, X, Sparkles, MapPin } from 'lucide-react';

const SocialProofPopup = () => {
  const [purchases, setPurchases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Không hiện nếu user đã tắt trong phiên làm việc
    if (sessionStorage.getItem('dismiss_social_proof') === 'true') {
      setIsDismissed(true);
      return;
    }

    const fetchPurchases = async () => {
      try {
        const response = await api.get('/social-proof/recent-purchases');
        if (response.data?.data && response.data.data.length > 0) {
          setPurchases(response.data.data);
        }
      } catch (error) {
        console.error('Không thể tải dữ liệu social proof:', error);
      }
    };

    fetchPurchases();
  }, []);

  useEffect(() => {
    if (isDismissed || purchases.length === 0) return;

    // Lần đầu tiên hiện sau 4s
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Chu kỳ: Hiển thị 6 giây, ẩn đi 8 giây rồi đổi sản phẩm tiếp theo
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchases.length);
        setIsVisible(true);
      }, 3000); // 3s sau khi ẩn thì đổi sang thông báo tiếp theo
    }, 11000); // Tổng chu kỳ 11s

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [purchases, isDismissed]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('dismiss_social_proof', 'true');
  };

  if (isDismissed || purchases.length === 0) return null;

  const currentItem = purchases[currentIndex];
  if (!currentItem) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-sm w-full sm:w-auto transition-all duration-700 transform ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border border-black/10 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)] p-3.5 pr-8 flex items-center space-x-3.5 relative group hover:border-black transition-colors">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-black transition-colors p-0.5"
          title="Đóng thông báo"
        >
          <X size={13} />
        </button>

        {/* Product Image Thumbnail */}
        <Link
          to={`/product/${currentItem.product_id}`}
          className="relative w-14 h-18 bg-zinc-100 flex-shrink-0 overflow-hidden block"
        >
          <img
            src={currentItem.product_image}
            alt={currentItem.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-0 right-0 bg-black text-white p-0.5">
            <ShoppingBag size={10} />
          </div>
        </Link>

        {/* Content */}
        <div className="min-w-0 pr-2">
          <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-0.5">
            <span className="text-black font-bold truncate max-w-[90px]">{currentItem.customer_name}</span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center space-x-0.5 text-zinc-400">
              <MapPin size={9} className="flex-shrink-0" />
              <span className="truncate max-w-[80px]">{currentItem.location}</span>
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 font-light mb-1">vừa đặt mua</p>

          <Link
            to={`/product/${currentItem.product_id}`}
            className="block text-xs font-serif font-medium text-black truncate max-w-[190px] hover:underline"
            title={currentItem.product_name}
          >
            {currentItem.product_name}
          </Link>

          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[11px] font-bold text-black font-sans">
              {formatPrice(currentItem.price)}
            </span>
            <span className="text-[9px] text-zinc-400 font-mono">
              {currentItem.time_ago}
            </span>
            <span className="inline-flex items-center space-x-0.5 text-[9px] text-emerald-600 font-medium">
              <CheckCircle size={9} />
              <span>Đã xác nhận</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofPopup;
