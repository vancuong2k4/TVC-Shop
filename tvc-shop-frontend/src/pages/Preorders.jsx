import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Clock, Calendar, ShieldCheck, CheckCircle2, ChevronRight, 
  Flame, Award, Scissors, ArrowRight 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import PreorderReservationModal from '../components/preorder/PreorderReservationModal';

export default function Preorders() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pre-orders');
      if (res.data?.success) {
        setCampaigns(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load preorder campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReserve = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Editorial Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-4">
            <Sparkles size={14} className="text-amber-400" />
            Limited Atelier Reservation
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase">
            Runway Capsule Pre-Orders
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-3 font-light leading-relaxed">
            Đặc quyền giữ chỗ các tuyệt tác may đo giới hạn từ sàn diễn thời trang TVC-Shop trước ngày phát hành chính thức. Đặt cọc 30% để khóa suất độc bản và hưởng dịch vụ may đo thêu tên riêng.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Scissors size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-1">May Đo Chuẩn Xác</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">Tùy chỉnh số đo ve áo, độ dài gấu và thêu chữ lụa Monogram riêng biệt cho từng chủ nhân.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-1">Số Lượng Giới Hạn</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">Chỉ sản xuất từ 25 - 50 chiếc toàn cầu kèm chứng chỉ có chữ ký của Giám đốc nghệ thuật.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-1">Đảm Bảo Hoàn Tiền</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">Linh hoạt hủy và nhận lại 100% tiền cọc trong 7 ngày đầu. Giao hàng tận nơi kèm hộp Cold Luxury.</p>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang tải các thiết kế Runway...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-24 text-center text-zinc-500 text-sm">
            Hiện tại các chiến dịch đặt cọc đợt này đã kết thúc. Vui lòng quay lại sau!
          </div>
        ) : (
          <div className="space-y-12">
            {campaigns.map((camp, idx) => {
              const percentageFilled = Math.min(100, Math.round((camp.slots_reserved / camp.slots_total) * 100));
              const slotsLeft = camp.slots_total - camp.slots_reserved;

              return (
                <div 
                  key={camp.id}
                  className="rounded-3xl bg-zinc-950/70 border border-white/15 p-6 md:p-10 backdrop-blur-md flex flex-col lg:flex-row gap-8 items-center overflow-hidden hover:border-white/30 transition-all duration-300"
                >
                  {/* Campaign Image Showcase */}
                  <div className="w-full lg:w-5/12 aspect-[4/5] rounded-2xl overflow-hidden relative group">
                    <img
                      src={camp.product_details?.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Badge top-left */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-white border border-white/20">
                        {camp.collection}
                      </span>
                    </div>

                    {/* Scarcity Tag bottom-left */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 backdrop-blur-md">
                        <Flame size={13} /> Còn lại {slotsLeft} suất
                      </span>
                      <span className="text-zinc-300 backdrop-blur-md px-2 py-0.5 rounded bg-black/40">
                        {camp.artisan_hours} Giờ May Đo Thủ Công
                      </span>
                    </div>
                  </div>

                  {/* Campaign Info & Reserve Action */}
                  <div className="w-full lg:w-7/12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase tracking-widest font-mono text-zinc-400">
                          GIỚI HẠN {camp.slots_total} BẢN TOÀN CẦU
                        </span>
                        {camp.status === 'closing_soon' && (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Sắp Đóng Suất
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-tight mb-2">
                        {camp.title}
                      </h2>
                      <p className="text-xs text-zinc-300 font-light mb-6 leading-relaxed">
                        Chất liệu: <span className="text-white font-medium">{camp.fabric_origin}</span>
                      </p>

                      {/* Scarcity Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center text-xs font-mono mb-2">
                          <span className="text-zinc-400">Tiến độ giữ chỗ:</span>
                          <span className="text-white font-semibold">{camp.slots_reserved} / {camp.slots_total} ({percentageFilled}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-1000"
                            style={{ width: `${percentageFilled}%` }}
                          />
                        </div>
                      </div>

                      {/* Perks Bullet Points */}
                      <div className="space-y-2 mb-8">
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                          Đặc quyền sở hữu phiên bản Runway:
                        </span>
                        {camp.perks?.map((perk, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-light">
                            <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Deposit CTA Block */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs uppercase text-zinc-400">Giá Niêm Yết:</span>
                          <span className="text-base text-zinc-300 line-through font-mono">
                            {formatPrice(camp.total_price)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs uppercase text-amber-400 font-semibold">Cọc Trước ({camp.deposit_percentage}%):</span>
                          <span className="text-xl md:text-2xl font-bold font-mono text-white">
                            {formatPrice(camp.deposit_amount)}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 block mt-1">
                          Dự kiến bàn giao: <span className="text-zinc-200">{camp.estimated_delivery}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenReserve(camp)}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl"
                      >
                        Đặt Cọc Giữ Chỗ <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Reservation Modal */}
      <PreorderReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={selectedCampaign}
        onSuccess={() => fetchCampaigns()}
      />

      <Footer />
    </div>
  );
}
