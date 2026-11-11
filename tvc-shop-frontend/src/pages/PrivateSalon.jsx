import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, Clock, MapPin, Check, ShieldCheck, 
  User, Phone, Mail, Award, ArrowRight, Video, Wine, Scissors 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function PrivateSalon() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    stylist_id: 'stylist_01',
    location_id: 'salon_hanoi',
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time_slot: '14:00 - 15:30',
    special_requests: ''
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get('/private-salon/config');
      if (res.data?.success) {
        setConfig(res.data);
      }
    } catch (err) {
      console.error('Failed to load private salon config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.customer_email) {
      showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và email', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/private-salon/book', formData);
      if (res.data?.success) {
        setConfirmedBooking(res.data.data);
        showToast('Đặt lịch hẹn Private Salon VIP thành công!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi đặt lịch';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            Bespoke Salon & Private Consultation
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Private Salon 1-1
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Dịch vụ tư vấn thời trang và may đo riêng tư bậc nhất từ TVC-Shop. Không gian biệt lập, thưởng thức trà bánh cao cấp và làm việc trực tiếp cùng Giám đốc sáng tạo hoặc Nghệ nhân may đo Bespoke.
          </p>
        </div>

        {loading ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang tải không gian Private Salon...</p>
          </div>
        ) : confirmedBooking ? (
          /* Confirmation Success Ticket */
          <div className="w-full max-w-xl p-8 rounded-3xl bg-zinc-950 border border-white/20 backdrop-blur-2xl text-center shadow-2xl animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <Check size={32} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Đã Xác Nhận Đặt Chỗ</span>
            <h2 className="text-2xl font-serif uppercase tracking-tight mt-1 mb-2">Thẻ Mời Private Salon VIP</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6 font-light">
              Chúng tôi rất vinh hạnh được đón tiếp bạn. Quản lý Salon sẽ liên hệ trước 2 giờ hẹn để chuẩn bị thức uống theo sở thích và điều xe đưa đón nếu cần.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left font-mono text-xs space-y-2.5 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-zinc-400">Mã Lịch Hẹn VIP:</span>
                <span className="font-bold text-amber-400 text-sm tracking-wider">{confirmedBooking.booking_code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Khách hàng:</span>
                <span className="text-white font-sans">{confirmedBooking.customer_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Chuyên gia cố vấn:</span>
                <span className="text-white font-sans">{confirmedBooking.stylist?.name} ({confirmedBooking.stylist?.role})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Thời gian:</span>
                <span className="text-white">{confirmedBooking.appointment_date} | {confirmedBooking.time_slot}</span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t border-white/10">
                <span className="text-zinc-400">Địa điểm:</span>
                <span className="text-right text-zinc-200 font-sans max-w-[240px]">{confirmedBooking.location?.name}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors"
            >
              Đặt Thêm Lịch Hẹn Khác
            </button>
          </div>
        ) : (
          /* Booking Form & Stylist Showcase */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Stylists Showcase (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-md">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 mb-4 flex items-center gap-2">
                  <Award size={14} className="text-amber-400" />
                  Đội Ngũ Cố Vấn Cao Cấp
                </h3>

                <div className="space-y-4">
                  {config?.stylists?.map((st) => (
                    <div 
                      key={st.id}
                      onClick={() => setFormData(p => ({ ...p, stylist_id: st.id }))}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                        formData.stylist_id === st.id 
                          ? 'border-white bg-white/10 shadow-lg' 
                          : 'border-white/5 bg-zinc-900/40 hover:border-white/20'
                      }`}
                    >
                      <img 
                        src={st.avatar} 
                        alt={st.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-white/20 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="text-sm font-semibold text-white truncate">{st.name}</h4>
                          {formData.stylist_id === st.id && (
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate mb-1">{st.role}</p>
                        <p className="text-[10px] text-zinc-500 line-clamp-1">{st.experience}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities card */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-md">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 mb-4">
                  Đặc Quyền Private Salon
                </h3>
                <div className="space-y-3 text-xs text-zinc-400 font-light">
                  <div className="flex items-center gap-3">
                    <Wine size={16} className="text-amber-400" />
                    <span>Thưởng thức rượu vang hảo hạng & trà thảo mộc Pháp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Scissors size={16} className="text-amber-400" />
                    <span>Lấy số đo Bespoke 28 điểm may đo chuẩn xác</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-amber-400" />
                    <span>Không gian hoàn toàn riêng tư, không tiếp khách đại trà</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Form (7 cols) */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md shadow-2xl">
              <h2 className="text-xl md:text-2xl font-serif uppercase tracking-tight mb-2">
                Thông Tin Đặt Lịch Tư Vấn
              </h2>
              <p className="text-xs text-zinc-400 mb-6 font-light">
                Vui lòng điền thông tin để Concierge TVC-Shop chuẩn bị không gian tiếp đón hoàn hảo nhất.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                      Họ và tên quý khách *
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
                    Địa chỉ Email nhận Thư Mời VIP *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    placeholder="vip@luxury.vn"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                    Chọn Địa Điểm Salon
                  </label>
                  <div className="space-y-2">
                    {config?.locations?.map((loc) => (
                      <label 
                        key={loc.id} 
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.location_id === loc.id 
                            ? 'border-white bg-white/10' 
                            : 'border-white/10 bg-zinc-900/60 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="location_id"
                          value={loc.id}
                          checked={formData.location_id === loc.id}
                          onChange={handleChange}
                          className="mt-0.5 text-white"
                        />
                        <div>
                          <span className="text-xs font-semibold text-white block">{loc.name}</span>
                          <span className="text-[11px] text-zinc-400 block font-light">{loc.address}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                      Ngày hẹn mong muốn *
                    </label>
                    <input
                      type="date"
                      name="appointment_date"
                      value={formData.appointment_date}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                      Khung giờ tiếp đón *
                    </label>
                    <select
                      name="time_slot"
                      value={formData.time_slot}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none focus:border-white transition-colors"
                    >
                      {config?.available_time_slots?.map((slot) => (
                        <option key={slot} value={slot} className="bg-zinc-900 text-white">{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                    Yêu cầu đặc biệt về chất liệu hoặc trang phục
                  </label>
                  <textarea
                    name="special_requests"
                    rows={2}
                    value={formData.special_requests}
                    onChange={handleChange}
                    placeholder="Ví dụ: Cần tư vấn bộ Tuxedo dạ tiệc thảm đỏ vào tháng tới, ưu tiên xem trước mẫu vải len Cashmere..."
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
                    <>Xác Nhận Đặt Lịch Private Salon 1-1 <ArrowRight size={15} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
