import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Check, Clock, Calendar, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';
import { useToast } from '../../context/ToastContext';

export default function PreorderReservationModal({ isOpen, onClose, campaign, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    size: 'M',
    color: 'Obsidian Black',
    custom_monogram: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [reservationSuccessData, setReservationSuccessData] = useState(null);
  const { showToast } = useToast();

  if (!isOpen || !campaign) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.customer_email) {
      showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và email', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/pre-orders/reserve', {
        campaign_id: campaign.id,
        ...formData
      });

      if (res.data?.success) {
        setReservationSuccessData(res.data.data);
        showToast('Đăng ký suất đặt cọc thành công!', 'success');
        if (onSuccess) onSuccess(res.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tạo đơn đặt cọc';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReservationSuccessData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-zinc-950 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 text-white max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {reservationSuccessData ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <Check size={32} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Giữ Chỗ Thành Công</span>
            <h2 className="text-2xl font-serif uppercase tracking-tight mt-1 mb-2">Phiếu Xác Nhận Suất May Đo</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6 font-light">
              Atelier TVC-Shop đã ghi nhận suất đặt trước của bạn. Stylist phụ trách sẽ liên hệ qua điện thoại trong vòng 24 giờ để hoàn tất thủ tục cọc và lấy số đo chi tiết.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left font-mono text-xs space-y-2.5 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-zinc-400">Mã Đặt Cọc:</span>
                <span className="font-bold text-white text-sm tracking-wider">{reservationSuccessData.reservation_code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Thiết kế:</span>
                <span className="text-white truncate max-w-[220px]">{reservationSuccessData.product_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Khách hàng:</span>
                <span className="text-white">{reservationSuccessData.customer_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Phân loại & Size:</span>
                <span className="text-white">{reservationSuccessData.color} / Size {reservationSuccessData.size}</span>
              </div>
              {reservationSuccessData.custom_monogram && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Khắc chữ Monogram:</span>
                  <span className="text-amber-400 font-bold">{reservationSuccessData.custom_monogram}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-zinc-400">Tiền cọc cần thanh toán ({campaign.deposit_percentage}%):</span>
                <span className="font-bold text-emerald-400 text-sm">{formatPrice(reservationSuccessData.deposit_amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Còn lại khi nhận hàng:</span>
                <span className="text-zinc-300">{formatPrice(reservationSuccessData.remaining_amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Dự kiến bàn giao:</span>
                <span className="text-amber-300">{reservationSuccessData.estimated_delivery}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors"
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Đặt cọc trước {campaign.deposit_percentage}%
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif tracking-tight uppercase mb-1">
              {campaign.title}
            </h2>
            <p className="text-xs text-zinc-400 mb-6 font-light">
              Bộ sưu tập: <span className="text-white font-medium">{campaign.collection}</span>
            </p>

            {/* Campaign Metrics Pill */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6 text-center font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block mb-1">Giá Niêm Yết</span>
                <span className="text-white font-bold">{formatPrice(campaign.total_price)}</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-[10px] uppercase text-zinc-400 block mb-1">Tiền Cọc ({campaign.deposit_percentage}%)</span>
                <span className="text-amber-400 font-bold">{formatPrice(campaign.deposit_amount)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block mb-1">Dự Kiến Giao</span>
                <span className="text-zinc-300 font-medium">{campaign.estimated_delivery}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                  Địa chỉ Email nhận thông tin *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  required
                  placeholder="vancuong@luxury.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                    Kích cỡ may đo
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none focus:border-white transition-colors"
                  >
                    {['S', 'M', 'L', 'XL', 'May đo riêng (Bespoke)'].map(sz => (
                      <option key={sz} value={sz} className="bg-zinc-900 text-white">{sz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                    Màu sắc phiên bản
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider text-zinc-300 font-medium flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400" />
                    Chữ viết tắt Monogram (Tùy chọn)
                  </label>
                  <span className="text-[10px] text-zinc-500">Tối đa 4 ký tự</span>
                </div>
                <input
                  type="text"
                  name="custom_monogram"
                  maxLength={4}
                  value={formData.custom_monogram}
                  onChange={handleChange}
                  placeholder="V.C (Thêu chỉ lụa vàng)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs uppercase font-mono tracking-widest focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-zinc-400 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Chính sách đảm bảo: Bạn có thể hủy và nhận lại 100% tiền cọc trong vòng 7 ngày kể từ khi đăng ký giữ chỗ.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Xác Nhận Giữ Chỗ Cọc ({formatPrice(campaign.deposit_amount)})</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
