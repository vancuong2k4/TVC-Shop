import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RotateCcw, ShoppingBag, Eye, Check, ArrowRight, 
  Layers, Shuffle, Share2, Info 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function VirtualFittingRoom() {
  const [wardrobe, setWardrobe] = useState([]);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOuterwear, setSelectedOuterwear] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [activeTab, setActiveTab] = useState('outerwear'); // outerwear, tops, bottoms

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchWardrobeData();
  }, []);

  const fetchWardrobeData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fitting-room/wardrobe');
      if (res.data?.success) {
        const items = res.data.wardrobe_items || [];
        setWardrobe(items);
        setPresets(res.data.preset_outfits || []);

        // Chọn mặc định
        if (items.length > 0) {
          setSelectedOuterwear(items[0]);
          setSelectedTop(items[1] || items[0]);
          setSelectedBottom(items[2] || items[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load fitting room wardrobe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset) => {
    const out = wardrobe.find(w => w.id === preset.outerwear_id);
    const top = wardrobe.find(w => w.id === preset.top_id);
    const bot = wardrobe.find(w => w.id === preset.bottom_id);

    if (out) setSelectedOuterwear(out);
    if (top) setSelectedTop(top);
    if (bot) setSelectedBottom(bot);

    showToast(`Đã áp dụng bản phối: ${preset.name}`, 'info');
  };

  const handleRandomize = () => {
    if (wardrobe.length < 3) return;
    const randomOut = wardrobe[Math.floor(Math.random() * wardrobe.length)];
    const randomTop = wardrobe[Math.floor(Math.random() * wardrobe.length)];
    const randomBot = wardrobe[Math.floor(Math.random() * wardrobe.length)];

    setSelectedOuterwear(randomOut);
    setSelectedTop(randomTop);
    setSelectedBottom(randomBot);
    showToast('Đã tạo bản phối ngẫu nhiên mới!', 'success');
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedOuterwear) total += Number(selectedOuterwear.discount_price || selectedOuterwear.price || 0);
    if (selectedTop) total += Number(selectedTop.discount_price || selectedTop.price || 0);
    if (selectedBottom) total += Number(selectedBottom.discount_price || selectedBottom.price || 0);
    return total;
  };

  const handleAddFullOutfitToCart = async () => {
    const itemsToAdd = [selectedOuterwear, selectedTop, selectedBottom].filter(Boolean);
    if (itemsToAdd.length === 0) return;

    try {
      for (const item of itemsToAdd) {
        await addToCart(item, 1, 'M', 'Black');
      }
      showToast(`Đã thêm trọn bộ ${itemsToAdd.length} món vào giỏ hàng!`, 'success');
    } catch {
      showToast('Có lỗi xảy ra khi thêm trang phục', 'error');
    }
  };

  const filteredWardrobe = wardrobe; // Trong thực tế có thể lọc theo category_id

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            Interactive Studio Canvas
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase">
            Virtual Fitting Room
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 font-light">
            Phòng thử đồ kỹ thuật số. Thử nghiệm phối layer đa tầng giữa Áo khoác, Áo lụa và Quần âu để định hình phong cách Cold Luxury hoàn mỹ nhất.
          </p>
        </div>

        {loading ? (
          <div className="h-[500px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest">Đang khởi tạo phòng thử 3D...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Preset Outfits & Controls (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                    <Layers size={14} className="text-amber-400" />
                    Bản Phối Tuyển Chọn
                  </h3>
                  <button
                    onClick={handleRandomize}
                    className="p-1.5 rounded-lg border border-white/15 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Phối ngẫu nhiên"
                  >
                    <Shuffle size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className="w-full p-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/30 text-left transition-all group"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {preset.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                          {preset.style_score}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light line-clamp-2">
                        {preset.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Outfit Summary Box */}
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                  Tổng Giá Trị Set Đồ
                </span>
                <div className="text-2xl font-bold font-mono text-white mb-4">
                  {formatPrice(calculateTotal())}
                </div>

                <button
                  onClick={handleAddFullOutfitToCart}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag size={15} /> Thêm Trọn Bộ Vào Giỏ
                </button>
              </div>
            </div>

            {/* Middle Column: Mannequin Visual Canvas (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] max-w-[420px] rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-white/15 p-6 flex flex-col items-center justify-between shadow-2xl overflow-hidden group">
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-zinc-300 border border-white/15">
                    Studio Canvas
                  </span>
                </div>

                {/* Layer 1: Outerwear */}
                <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 py-2">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 block mb-1">
                      Lớp 1: Khoác Ngoài
                    </span>
                    <h4 className="text-xs font-semibold text-white truncate max-w-[280px]">
                      {selectedOuterwear?.name || 'Chưa chọn'}
                    </h4>
                  </div>
                  <div className="w-32 h-36 mt-2 rounded-xl overflow-hidden border border-white/20 shadow-md">
                    <img 
                      src={selectedOuterwear?.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400'} 
                      alt="Outerwear"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Layer 2: Top / Inner */}
                <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 py-2 border-y border-white/5">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 block mb-1">
                      Lớp 2: Áo Trong / Sơ Mi
                    </span>
                    <h4 className="text-xs font-semibold text-white truncate max-w-[280px]">
                      {selectedTop?.name || 'Chưa chọn'}
                    </h4>
                  </div>
                  <div className="w-28 h-32 mt-2 rounded-xl overflow-hidden border border-white/20 shadow-md">
                    <img 
                      src={selectedTop?.image || 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=400'} 
                      alt="Top"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Layer 3: Bottom */}
                <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 py-2">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 block mb-1">
                      Lớp 3: Quần Âu / Chân Váy
                    </span>
                    <h4 className="text-xs font-semibold text-white truncate max-w-[280px]">
                      {selectedBottom?.name || 'Chưa chọn'}
                    </h4>
                  </div>
                  <div className="w-28 h-32 mt-2 rounded-xl overflow-hidden border border-white/20 shadow-md">
                    <img 
                      src={selectedBottom?.image || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400'} 
                      alt="Bottom"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Wardrobe Item Selector (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 mb-4">
                Tủ Đồ Studio (Chọn món thay thế)
              </h3>

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-zinc-900 border border-white/10 mb-4 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('outerwear')}
                  className={`py-2 rounded-lg transition-all ${activeTab === 'outerwear' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Khoác
                </button>
                <button
                  onClick={() => setActiveTab('tops')}
                  className={`py-2 rounded-lg transition-all ${activeTab === 'tops' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Áo Trong
                </button>
                <button
                  onClick={() => setActiveTab('bottoms')}
                  className={`py-2 rounded-lg transition-all ${activeTab === 'bottoms' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Quần/Váy
                </button>
              </div>

              {/* Wardrobe Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredWardrobe.map((item) => {
                  const isCurrent = (activeTab === 'outerwear' && selectedOuterwear?.id === item.id) ||
                                    (activeTab === 'tops' && selectedTop?.id === item.id) ||
                                    (activeTab === 'bottoms' && selectedBottom?.id === item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (activeTab === 'outerwear') setSelectedOuterwear(item);
                        if (activeTab === 'tops') setSelectedTop(item);
                        if (activeTab === 'bottoms') setSelectedBottom(item);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isCurrent 
                          ? 'border-white bg-white/15 shadow-lg' 
                          : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 relative">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isCurrent && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <h4 className="text-[11px] font-medium text-white truncate mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-bold font-mono text-zinc-300">
                        {formatPrice(item.discount_price || item.price)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
