import React, { useState } from 'react';
import api from '../../api/axios';
import { Bell, CheckCircle2, X, Sparkles, Mail, ShieldCheck } from 'lucide-react';

const RestockModal = ({ isOpen, onClose, product, selectedSize, selectedColor }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await api.post('/restock/subscribe', {
        product_id: product.id,
        email,
        phone,
        size: selectedSize,
        color: selectedColor
      });
      setSuccess(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký nhận tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setEmail('');
    setPhone('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white max-w-md w-full p-6 md:p-8 shadow-2xl border border-black/10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black mb-2">
              Đăng Ký Thành Công!
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              TVC-Shop đã lưu thông tin của bạn. Chúng tôi sẽ gửi thông báo đến email <strong className="text-black font-semibold">{email}</strong> ngay khi sản phẩm có hàng lại.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] mb-2">
                <Bell size={11} className="text-amber-300" />
                <span>Back In Stock Alert</span>
              </div>
              <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                Thông Báo Khi Có Hàng
              </h3>
              <p className="text-xs text-gray-500 font-light mt-1">
                Để lại email để nhận thông báo ưu tiên ngay khoảnh khắc sản phẩm được restock.
              </p>
            </div>

            {/* Product summary preview */}
            <div className="flex items-center space-x-3 p-3 bg-zinc-50 border border-zinc-200 mb-6">
              <div className="w-12 h-14 bg-zinc-200 overflow-hidden flex-shrink-0">
                {product.image || product.image_url ? (
                  <img src={product.image || product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="font-serif font-bold text-xs text-black truncate">{product.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                  Size: <span className="font-bold text-black">{selectedSize || 'M'}</span> | Màu: <span className="font-bold text-black">{selectedColor || 'Black'}</span>
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                  Email của bạn *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@domain.com"
                  className="w-full border border-gray-200 px-3.5 py-2.5 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                  Số điện thoại (tùy chọn)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full border border-gray-200 px-3.5 py-2.5 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-black text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Bell size={14} />
                      <span>Nhận Thông Báo Khi Có Hàng</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestockModal;
