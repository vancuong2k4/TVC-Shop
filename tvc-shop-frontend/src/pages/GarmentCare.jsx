import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Scissors, Droplets, Wind, Sun, 
  Check, ArrowRight, Clock, Truck, FileText, RefreshCw 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { useToast } from '../context/ToastContext';

export default function GarmentCare() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGuideTab, setActiveGuideTab] = useState('cashmere');
  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    item_name: '',
    service_id: 'service_steam_freshen',
    pickup_address: '',
    pickup_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    notes: ''
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchCareData();
  }, []);

  const fetchCareData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/garment-care');
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load care data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.item_name || !formData.pickup_address) {
      showToast('Vui lòng điền đầy đủ các trường thông tin bắt buộc', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/garment-care/request', formData);
      if (res.data?.success) {
        setTicketResult(res.data.data);
        showToast('Yêu cầu bảo dưỡng trang phục đã được ghi nhận!', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra khi gửi yêu cầu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentGuide = data?.care_guides?.find(g => g.id === activeGuideTab) || data?.care_guides?.[0];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            Atelier Garment Care & Lifetime Maintenance
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Bảo Dưỡng Trang Phục
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Mỗi thiết kế từ TVC-Shop được sinh ra để trường tồn cùng thời gian. Hãy tìm hiểu cẩm nang chăm sóc sợi vải thượng hạng hoặc đặt dịch vụ phục hồi, may đo và khử khuẩn chuyên nghiệp tận nhà.
          </p>
        </div>

        {loading ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang tải trung tâm bảo dưỡng...</p>
          </div>
        ) : ticketResult ? (
          /* Confirmation Ticket */
          <div className="max-w-xl mx-auto w-full p-8 rounded-3xl bg-zinc-950 border border-white/20 text-center shadow-2xl animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <Check size={32} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Phiếu Tiếp Nhận Atelier</span>
            <h2 className="text-2xl font-serif uppercase tracking-tight mt-1 mb-2">Đăng Ký Bảo Dưỡng Thành Công</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6 font-light">
              Đội ngũ giao nhận chuyên dụng TVC-Shop sẽ đến lấy trang phục trong hộp chống sốc theo thời gian quý khách đã yêu cầu.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left font-mono text-xs space-y-2.5 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-zinc-400">Mã Phiếu Bảo Dưỡng:</span>
                <span className="font-bold text-amber-400 text-sm tracking-wider">{ticketResult.ticket_code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Trang phục:</span>
                <span className="text-white font-sans">{ticketResult.item_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Dịch vụ:</span>
                <span className="text-white font-sans truncate max-w-[240px]">{ticketResult.service_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Chi phí dịch vụ:</span>
                <span className="text-white font-bold">{ticketResult.price === 0 ? 'MIỄN PHÍ (Hội viên VIP)' : formatPrice(ticketResult.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Ngày lấy đồ:</span>
                <span className="text-white">{ticketResult.pickup_date}</span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t border-white/10">
                <span className="text-zinc-400">Địa chỉ:</span>
                <span className="text-right text-zinc-200 font-sans max-w-[240px]">{ticketResult.pickup_address}</span>
              </div>
            </div>

            <button
              onClick={() => setTicketResult(null)}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors"
            >
              Gửi Thêm Trang Phục Khác
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Part 1: Interactive Fabric Care Guide */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">Cẩm Nang Chất Liệu</h3>
                  <h2 className="text-xl md:text-2xl font-serif uppercase tracking-tight">Quy Chuẩn Chăm Sóc Sợi Vải</h2>
                </div>

                {/* Guide Tabs */}
                <div className="flex flex-wrap gap-2">
                  {data?.care_guides?.map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() => setActiveGuideTab(guide.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeGuideTab === guide.id 
                          ? 'bg-white text-black font-semibold shadow-md' 
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {guide.fabric_name.split('&')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guide Card Matrix */}
              {currentGuide && (
                <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md shadow-2xl">
                  <h3 className="text-lg font-serif text-white uppercase tracking-wide mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
                    <span>{currentGuide.fabric_name}</span>
                    <span className="text-xs font-mono text-amber-400 tracking-widest">ATELIER CERTIFIED</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 text-zinc-300 font-mono uppercase mb-2">
                        <Droplets size={16} className="text-cyan-400" />
                        <span className="font-semibold">Nhiệt Độ Giặt</span>
                      </div>
                      <p className="text-zinc-400 font-light leading-relaxed">{currentGuide.temperature}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 text-zinc-300 font-mono uppercase mb-2">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span className="font-semibold">Dung Dịch Giặt Tẩy</span>
                      </div>
                      <p className="text-zinc-400 font-light leading-relaxed">{currentGuide.detergent}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 text-zinc-300 font-mono uppercase mb-2">
                        <Wind size={16} className="text-amber-400" />
                        <span className="font-semibold">Quy Trình Phơi Khô</span>
                      </div>
                      <p className="text-zinc-400 font-light leading-relaxed">{currentGuide.drying}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 text-zinc-300 font-mono uppercase mb-2">
                        <RefreshCw size={16} className="text-violet-400" />
                        <span className="font-semibold">Kỹ Thuật Là Ủi</span>
                      </div>
                      <p className="text-zinc-400 font-light leading-relaxed">{currentGuide.ironing}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 lg:col-span-2">
                      <div className="flex items-center gap-2 text-zinc-300 font-mono uppercase mb-2">
                        <FileText size={16} className="text-rose-400" />
                        <span className="font-semibold">Bảo Quản & Lưu Trữ Tủ Áo</span>
                      </div>
                      <p className="text-zinc-400 font-light leading-relaxed">{currentGuide.storage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Part 2: Maintenance Request Booking Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">Dịch Vụ Nghệ Nhân</span>
                <h3 className="text-lg font-serif uppercase tracking-tight mb-4 text-white">Các Gói Chăm Sóc Tại Xưởng</h3>

                <div className="space-y-3">
                  {data?.services?.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => setFormData(p => ({ ...p, service_id: svc.id }))}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        formData.service_id === svc.id 
                          ? 'border-white bg-white/10 shadow-lg' 
                          : 'border-white/5 bg-zinc-900/40 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-semibold text-white max-w-[200px] leading-tight">{svc.name}</h4>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {svc.price === 0 ? 'MIỄN PHÍ' : formatPrice(svc.price)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light mb-2">{svc.description}</p>
                      <span className="text-[10px] font-mono text-zinc-500 block">Thời gian xử lý: {svc.turnaround_days} ngày</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md shadow-2xl">
                <h3 className="text-xl font-serif uppercase tracking-tight mb-2">Đăng Ký Gửi Đồ Bảo Dưỡng</h3>
                <p className="text-xs text-zinc-400 mb-6 font-light">
                  Nhân viên giao vận riêng sẽ đến tận nhà thu nhận trang phục và hoàn trả sau khi nghệ nhân hoàn tất bảo dưỡng.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Họ và tên *</label>
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
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Số điện thoại *</label>
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
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Tên trang phục cần bảo dưỡng *</label>
                    <input
                      type="text"
                      name="item_name"
                      value={formData.item_name}
                      onChange={handleChange}
                      required
                      placeholder="Ví dụ: Áo Blazer Tuxedo Đen / Đầm lụa Noir Slip Dress"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Email *</label>
                      <input
                        type="email"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleChange}
                        required
                        placeholder="cuong@luxury.vn"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Ngày nhân viên đến lấy đồ *</label>
                      <input
                        type="date"
                        name="pickup_date"
                        value={formData.pickup_date}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Địa chỉ nhận trang phục *</label>
                    <input
                      type="text"
                      name="pickup_address"
                      value={formData.pickup_address}
                      onChange={handleChange}
                      required
                      placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Ghi chú cho nghệ nhân (Tùy chọn)</label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Chi tiết về vết ố, cúc áo lỏng hoặc yêu cầu chỉnh sửa số đo cụ thể..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>Xác Nhận Đăng Ký Bảo Dưỡng Trang Phục <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
