import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Gift, ShieldCheck, Check, ArrowRight, Heart, 
  Send, Package, Feather, Eye 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { useToast } from '../context/ToastContext';

export default function BespokeBox() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBox, setConfirmedBox] = useState(null);

  const [formData, setFormData] = useState({
    sender_name: '',
    sender_phone: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    box_edition_id: 'box_noir_lacquer',
    gift_card_amount: 2000000,
    engraving_text: '',
    greeting_message: '',
    delivery_date: new Date(Date.now() + 172800000).toISOString().split('T')[0] // 2 ngày sau để chế tác
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchBoxEditions();
  }, []);

  const fetchBoxEditions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bespoke-box/editions');
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load box editions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sender_name || !formData.recipient_name || !formData.recipient_address) {
      showToast('Vui lòng điền đầy đủ các thông tin giao nhận bắt buộc', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/bespoke-box/order', formData);
      if (res.data?.success) {
        setConfirmedBox(res.data.data);
        showToast('Đơn đặt chế tác hộp quà sơn mài thành công!', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra khi tạo đơn chế tác', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentEdition = data?.editions?.find(e => e.id === formData.box_edition_id) || data?.editions?.[0];
  const totalCost = (currentEdition?.price_box_only || 0) + Number(formData.gift_card_amount || 0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            Artisanal Lacquer & Bespoke Gifting
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Hộp Quà Sơn Mài Bespoke
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Tuyệt tác tri ân độc bản. Thẻ quà tặng kim loại nguyên khối chứa giá trị mua sắm được đặt trang trọng trong hộp gỗ óc chó thủ công 12 lớp sơn mài bóng gương, thiệp lụa dát vàng và khắc tên người nhận.
          </p>
        </div>

        {loading ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang tải các ấn bản sơn mài...</p>
          </div>
        ) : confirmedBox ? (
          /* Confirmation Ticket */
          <div className="max-w-xl mx-auto w-full p-8 rounded-3xl bg-zinc-950 border border-white/20 text-center shadow-2xl animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 mx-auto flex items-center justify-center mb-4">
              <Gift size={32} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Chế Tác Thành Công</span>
            <h2 className="text-2xl font-serif uppercase tracking-tight mt-1 mb-2">Đơn Chế Tác Quà Tặng Đã Nhận</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6 font-light">
              Nghệ nhân xưởng sơn mài TVC-Shop bắt đầu công đoạn khắc laser thẻ kim loại và đóng gói lót nhung. Hộp quà sẽ được trao tận tay người nhận theo đúng lịch hẹn.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left font-mono text-xs space-y-2.5 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-zinc-400">Mã Chế Tác:</span>
                <span className="font-bold text-white text-sm tracking-wider">{confirmedBox.order_code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Ấn bản hộp:</span>
                <span className="text-white font-sans truncate max-w-[220px]">{confirmedBox.box_edition}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Người nhận:</span>
                <span className="text-white font-sans">{confirmedBox.recipient_name} ({confirmedBox.recipient_phone})</span>
              </div>
              {confirmedBox.engraving_text && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Chữ khắc trên thẻ kim loại:</span>
                  <span className="text-amber-400 font-bold">{confirmedBox.engraving_text}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Hạn mức thẻ quà tặng:</span>
                <span className="text-white font-bold">{formatPrice(confirmedBox.gift_card_amount)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-zinc-400">Tổng thanh toán:</span>
                <span className="font-bold text-amber-300 text-sm">{formatPrice(confirmedBox.total_amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Ngày trao quà dự kiến:</span>
                <span className="text-zinc-300">{confirmedBox.delivery_date}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBox(null)}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors"
            >
              Đặt Chế Tác Thêm Hộp Khác
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Box Edition Showcase (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">Ấn Bản Chế Tác</span>
                
                <div className="space-y-4">
                  {data?.editions?.map((edition) => (
                    <div
                      key={edition.id}
                      onClick={() => setFormData(p => ({ ...p, box_edition_id: edition.id }))}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        formData.box_edition_id === edition.id 
                          ? 'border-white bg-white/10 shadow-lg' 
                          : 'border-white/5 bg-zinc-900/40 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-video rounded-xl overflow-hidden mb-3 relative">
                        <img 
                          src={edition.image} 
                          alt={edition.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300">
                          {formatPrice(edition.price_box_only)}
                        </div>
                      </div>

                      <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wide mb-1">
                        {edition.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-light mb-2 leading-relaxed">
                        {edition.material}
                      </p>

                      <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                        Thẻ: <span className="text-zinc-200">{edition.card_type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box Specs Perks */}
              {currentEdition && (
                <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-md">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
                    Đặc Quyền Kèm Theo Mỗi Ấn Bản
                  </h4>
                  <div className="space-y-2 text-xs text-zinc-400 font-light">
                    {currentEdition.included_perks?.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Bespoke Customization Form (7 cols) */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md shadow-2xl">
              <h2 className="text-xl md:text-2xl font-serif uppercase tracking-tight mb-2">
                Tùy Biến Hộp Quà Bespoke
              </h2>
              <p className="text-xs text-zinc-400 mb-6 font-light">
                Chọn mệnh giá nạp vào thẻ kim loại, nội dung khắc laser và thông điệp tri ân trao gửi người thân, đối tác.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Gift Card Amount Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-2 font-medium">
                    Mệnh giá nạp vào thẻ kim loại *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    {data?.preset_gift_amounts?.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, gift_card_amount: amt }))}
                        className={`py-2 px-1 rounded-xl text-xs font-mono font-semibold transition-all ${
                          formData.gift_card_amount === amt 
                            ? 'bg-white text-black shadow-md' 
                            : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {formatPrice(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Laser Engraving Text */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs uppercase tracking-wider text-zinc-300 font-medium flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-400" />
                      Khắc Laser Tên Người Nhận Lên Thẻ Kim Loại (Tùy chọn)
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">Tối đa 25 ký tự</span>
                  </div>
                  <input
                    type="text"
                    name="engraving_text"
                    maxLength={25}
                    value={formData.engraving_text}
                    onChange={handleChange}
                    placeholder="VÍ DỤ: MR. ARTHUR VĂN CƯỜNG"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Sender & Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Họ tên người gửi *</label>
                    <input
                      type="text"
                      name="sender_name"
                      value={formData.sender_name}
                      onChange={handleChange}
                      required
                      placeholder="Người gửi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Số điện thoại người gửi *</label>
                    <input
                      type="tel"
                      name="sender_phone"
                      value={formData.sender_phone}
                      onChange={handleChange}
                      required
                      placeholder="0912 xxx xxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Họ tên người nhận *</label>
                    <input
                      type="text"
                      name="recipient_name"
                      value={formData.recipient_name}
                      onChange={handleChange}
                      required
                      placeholder="Người nhận quà"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Số điện thoại người nhận *</label>
                    <input
                      type="tel"
                      name="recipient_phone"
                      value={formData.recipient_phone}
                      onChange={handleChange}
                      required
                      placeholder="0988 xxx xxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Địa chỉ giao quà tận tay *</label>
                  <input
                    type="text"
                    name="recipient_address"
                    value={formData.recipient_address}
                    onChange={handleChange}
                    required
                    placeholder="Số nhà, Tòa nhà, Tên đường, Quận/Huyện, Tỉnh/TP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">Lời chúc viết trên thiệp lụa dát vàng</label>
                  <textarea
                    name="greeting_message"
                    rows={2}
                    value={formData.greeting_message}
                    onChange={handleChange}
                    placeholder="Gửi tặng bạn món quà tri ân đặc biệt từ thương hiệu TVC-Shop..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Total Cost Summary Bar */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Tổng Chi Phí Chế Tác & Thẻ</span>
                    <span className="text-xl font-bold font-mono text-white">{formatPrice(totalCost)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="py-3.5 px-6 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>Đặt Chế Tác Hộp Quà <ArrowRight size={15} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
