import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { 
  Gift, Sparkles, Send, CheckCircle2, Copy, 
  Check, CreditCard, ShieldCheck, HeartHandshake, ArrowRight 
} from 'lucide-react';

const GIFT_PRESETS = [
  { amount: 200000, label: '200.000 ₫', tier: 'Bronze Card' },
  { amount: 500000, label: '500.000 ₫', tier: 'Silver Card' },
  { amount: 1000000, label: '1.000.000 ₫', tier: 'Gold Card' },
  { amount: 2000000, label: '2.000.000 ₫', tier: 'Diamond VIP' },
];

const THEMES = [
  { id: 'noir', name: 'Noir Minimalist', bg: 'bg-gradient-to-tr from-black via-zinc-900 to-zinc-800 text-white' },
  { id: 'slate', name: 'Slate Modern', bg: 'bg-gradient-to-tr from-slate-900 via-neutral-800 to-slate-950 text-white' },
  { id: 'platinum', name: 'Pure Monochrome', bg: 'bg-gradient-to-tr from-neutral-900 via-stone-800 to-zinc-900 text-white' }
];

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState(500000);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('noir');

  const [formData, setFormData] = useState({
    sender_name: '',
    recipient_name: '',
    recipient_email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successCard, setSuccessCard] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeAmount = customAmount ? Number(customAmount) : selectedAmount;
  const activeThemeObj = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeAmount < 50000) {
      setErrorMsg('Mệnh giá tối thiểu của E-Gift Card là 50.000 VNĐ.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        amount: activeAmount,
        sender_name: formData.sender_name,
        recipient_name: formData.recipient_name,
        recipient_email: formData.recipient_email,
        message: formData.message,
        card_theme: selectedTheme
      };

      const response = await api.post('/gift-cards/purchase', payload);
      setSuccessCard(response.data.gift_card);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra khi tạo thẻ quà tặng.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (successCard?.code) {
      navigator.clipboard.writeText(successCard.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl">
          <Breadcrumb items={[{ label: 'Trang chủ', link: '/' }, { label: 'E-Gift Cards' }]} />

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <Gift size={12} className="text-amber-300" />
              <span>Digital Luxury Gift</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-black mb-4">
              Phiếu Quà Tặng Điện Tử
            </h1>
            <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest leading-relaxed">
              Món quà sang trọng, tinh tế gửi trao tức thì đến người thân yêu
            </p>
          </div>

          {successCard ? (
            /* Success State */
            <div className="max-w-2xl mx-auto bg-white border border-gray-100 p-8 md:p-12 shadow-xl text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-black mb-2">Phát Hành E-Gift Card Thành Công!</h2>
              <p className="text-xs text-gray-500 mb-8 max-w-md mx-auto">
                Phiếu quà tặng điện tử đã được tạo và lưu trữ trên hệ thống TVC-Shop, sẵn sàng để gửi tới {successCard.recipient_name}.
              </p>

              {/* Digital Card Preview */}
              <div className={`p-8 rounded-none border border-black/10 shadow-2xl text-left max-w-md mx-auto mb-8 ${activeThemeObj.bg}`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">TVC-Shop Luxe</span>
                    <h3 className="font-serif text-lg font-bold tracking-tight text-white mt-1">E-Gift Certificate</h3>
                  </div>
                  <Sparkles size={20} className="text-amber-300" />
                </div>

                <div className="text-3xl font-serif font-semibold text-white mb-6">
                  {formatPrice(successCard.amount)}
                </div>

                <div className="space-y-1 mb-6 text-xs text-zinc-300">
                  <p><span className="text-zinc-500">Người gửi:</span> {successCard.sender_name}</p>
                  <p><span className="text-zinc-500">Người nhận:</span> {successCard.recipient_name} ({successCard.recipient_email})</p>
                  {successCard.message && (
                    <p className="italic text-zinc-400 pt-2 border-t border-white/10 mt-2">"{successCard.message}"</p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/15 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  <span>HSD: {successCard.valid_until}</span>
                  <span className="text-white font-bold tracking-widest">{successCard.code}</span>
                </div>
              </div>

              {/* Code Box */}
              <div className="flex items-center justify-center space-x-3 max-w-md mx-auto bg-zinc-50 border border-zinc-200 p-3 mb-8">
                <span className="font-mono font-bold text-sm tracking-widest text-black">
                  {successCard.code}
                </span>
                <button
                  onClick={copyCode}
                  className="px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center space-x-1.5"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedCode ? 'Đã chép' : 'Sao chép mã'}</span>
                </button>
              </div>

              <button
                onClick={() => setSuccessCard(null)}
                className="text-xs uppercase tracking-widest font-bold text-zinc-500 hover:text-black transition-colors"
              >
                Tạo thêm thẻ quà tặng khác
              </button>
            </div>
          ) : (
            /* Builder Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Interactive Preview */}
              <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Bản Xem Trước Trực Quan
                </div>

                {/* Card Container */}
                <div className={`p-8 border border-black/10 shadow-2xl relative overflow-hidden transition-all duration-300 ${activeThemeObj.bg}`}>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">TVC-Shop Luxe</span>
                      <h3 className="font-serif text-xl font-normal tracking-tight text-white mt-1">E-Gift Certificate</h3>
                    </div>
                    <Sparkles size={22} className="text-amber-300" />
                  </div>

                  <div className="text-3xl md:text-4xl font-serif font-normal text-white mb-8 tracking-tight">
                    {formatPrice(activeAmount)}
                  </div>

                  <div className="space-y-1 mb-8 text-xs text-zinc-300">
                    <p><span className="text-zinc-500 uppercase tracking-widest text-[10px]">Tới:</span> {formData.recipient_name || 'Tên người nhận'}</p>
                    <p><span className="text-zinc-500 uppercase tracking-widest text-[10px]">Từ:</span> {formData.sender_name || 'Tên người gửi'}</p>
                    {formData.message && (
                      <p className="italic text-zinc-400 text-xs pt-3 border-t border-white/10 mt-3 font-serif">
                        "{formData.message}"
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/15 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    <span>Mã điện tử</span>
                    <span className="text-white font-bold tracking-widest">EGC-••••-••••</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-6 space-y-3">
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <ShieldCheck size={18} className="text-black flex-shrink-0" />
                    <span>Hiệu lực sử dụng trong vòng 6 tháng kể từ thời điểm phát hành.</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <HeartHandshake size={18} className="text-black flex-shrink-0" />
                    <span>Áp dụng đồng thời với các chương trình khuyến mãi hiện hành.</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customization Form */}
              <div className="lg:col-span-7 bg-white border border-gray-100 p-8 md:p-12 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  {/* 1. Mệnh giá */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-black mb-4">
                      1. Chọn Mệnh Giá Quà Tặng
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {GIFT_PRESETS.map((preset) => (
                        <button
                          key={preset.amount}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(preset.amount);
                            setCustomAmount('');
                          }}
                          className={`py-3 px-2 border text-center transition-all ${
                            selectedAmount === preset.amount && !customAmount
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 hover:border-black text-gray-700 bg-white'
                          }`}
                        >
                          <div className="text-xs font-bold font-serif">{preset.label}</div>
                          <div className="text-[9px] uppercase tracking-wider opacity-60 mt-0.5">{preset.tier}</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">Hoặc nhập:</span>
                      <input
                        type="number"
                        placeholder="Số tiền khác (VNĐ)..."
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="flex-1 border border-gray-200 px-4 py-2.5 text-xs focus:border-black focus:outline-none"
                        min="50000"
                        step="10000"
                      />
                    </div>
                  </div>

                  {/* 2. Theme */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-black mb-4">
                      2. Thiết Kế Bao Bì Kỹ Thuật Số
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`p-3 border text-left transition-all ${
                            selectedTheme === theme.id ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div className={`w-full h-8 mb-2 ${theme.bg}`}></div>
                          <p className="text-[11px] font-medium text-black truncate">{theme.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Thông tin người nhận */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="block text-xs uppercase tracking-widest font-bold text-black">
                      3. Thông Tin Người Nhận & Thông Điệp
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                          Họ tên người gửi *
                        </label>
                        <input
                          type="text"
                          name="sender_name"
                          required
                          value={formData.sender_name}
                          onChange={handleInputChange}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="w-full border border-gray-200 px-4 py-2.5 text-xs focus:border-black focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                          Họ tên người nhận *
                        </label>
                        <input
                          type="text"
                          name="recipient_name"
                          required
                          value={formData.recipient_name}
                          onChange={handleInputChange}
                          placeholder="Ví dụ: Trần Thị B"
                          className="w-full border border-gray-200 px-4 py-2.5 text-xs focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                        Email người nhận (để gửi mã quà tặng) *
                      </label>
                      <input
                        type="email"
                        name="recipient_email"
                        required
                        value={formData.recipient_email}
                        onChange={handleInputChange}
                        placeholder="recipient@example.com"
                        className="w-full border border-gray-200 px-4 py-2.5 text-xs focus:border-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                        Lời chúc hoặc thông điệp cá nhân
                      </label>
                      <textarea
                        rows="3"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Chúc mừng sinh nhật / Kỷ niệm ngày đặc biệt..."
                        className="w-full border border-gray-200 px-4 py-2.5 text-xs focus:border-black focus:outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Action */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Phát Hành E-Gift Card ({formatPrice(activeAmount)})</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GiftCards;
