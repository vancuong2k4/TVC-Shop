import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Sliders, Check, ShoppingBag, RotateCcw, 
  Layers, ShieldCheck, ArrowRight, Eye, Palette 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function HardwareCustomizer() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedZipper, setSelectedZipper] = useState(null);
  const [selectedLining, setSelectedLining] = useState(null);
  const [monogram, setMonogram] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('buttons'); // buttons, zippers, linings
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hardware-customizer/config');
      if (res.data?.success) {
        setConfig(res.data);
        const cats = res.data.categories;
        if (cats) {
          setSelectedButton(cats.buttons?.options[0] || null);
          setSelectedZipper(cats.zippers?.options[0] || null);
          setSelectedLining(cats.linings?.options[0] || null);
        }
      }
    } catch (err) {
      console.error('Failed to load customizer config:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const base = config?.preview_base_outfit?.base_price || 2450000;
    const btn = selectedButton?.price || 0;
    const zip = selectedZipper?.price || 0;
    const lin = selectedLining?.price || 0;
    return base + btn + zip + lin;
  };

  const handleSaveAndAddToCart = async () => {
    try {
      setSubmitting(true);
      const res = await api.post('/hardware-customizer/save', {
        selected_button_id: selectedButton?.id,
        selected_zipper_id: selectedZipper?.id,
        selected_lining_id: selectedLining?.id,
        custom_engraved_initials: monogram
      });

      if (res.data?.success) {
        // Thêm vào Cart với thuộc tính customizer
        const customProduct = {
          id: 2, // ID của Structured Tuxedo Blazer
          name: `${config?.preview_base_outfit?.name} (Bespoke Hardware)`,
          price: calculateTotal(),
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600'
        };

        await addToCart(
          customProduct, 
          1, 
          'M', 
          `Hardware: ${selectedButton?.name} + Lining: ${selectedLining?.name} [Code: ${res.data.config_code}]`
        );

        showToast('Đã thêm tác phẩm Blazer may đo tùy biến phụ liệu vào giỏ hàng!', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra khi lưu tùy biến', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Sliders size={13} className="text-amber-400" />
            Atelier Hardware & Bespoke Customizer
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Tùy Biến Kim Khí & Phụ Liệu
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Độc bản hóa tuyệt tác trang phục với các chi tiết kim khí điêu khắc thủ công: khuy sừng trâu Thụy Sĩ, khóa kéo titan đánh bóng và lót lụa Cupro Jacquard thoáng khí.
          </p>
        </div>

        {loading ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang tải xưởng chế tác kim khí...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Visual 3D Canvas (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md shadow-2xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4 text-xs font-mono">
                <span className="text-zinc-400 uppercase tracking-widest">Base Canvas:</span>
                <span className="text-amber-400 font-semibold">{config?.preview_base_outfit?.name}</span>
              </div>

              {/* Garment Visual Representation */}
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 mb-6 bg-zinc-900 flex flex-col items-center justify-between p-6">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
                  alt="Blazer Canvas"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Floating Highlights of Selected Hardware */}
                <div className="relative z-10 w-full flex flex-col items-center gap-3 mt-4">
                  {/* Button Highlight Pin */}
                  <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-2.5 shadow-xl w-full max-w-[280px]">
                    <span 
                      className="w-5 h-5 rounded-full border border-white/30 flex-shrink-0 shadow-inner" 
                      style={{ backgroundColor: selectedButton?.icon_color }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-mono text-zinc-400 block">Khuy Cài:</span>
                      <h4 className="text-[11px] font-semibold text-white truncate">{selectedButton?.name}</h4>
                    </div>
                  </div>

                  {/* Zipper Highlight Pin */}
                  <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-2.5 shadow-xl w-full max-w-[280px]">
                    <span 
                      className="w-5 h-5 rounded-full border border-white/30 flex-shrink-0 shadow-inner" 
                      style={{ backgroundColor: selectedZipper?.icon_color }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-mono text-zinc-400 block">Khóa Kéo:</span>
                      <h4 className="text-[11px] font-semibold text-white truncate">{selectedZipper?.name}</h4>
                    </div>
                  </div>

                  {/* Lining Highlight Pin */}
                  <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-2.5 shadow-xl w-full max-w-[280px]">
                    <span 
                      className="w-5 h-5 rounded-full border border-white/30 flex-shrink-0 shadow-inner" 
                      style={{ backgroundColor: selectedLining?.icon_color }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-mono text-zinc-400 block">Lớp Lót Trong:</span>
                      <h4 className="text-[11px] font-semibold text-white truncate">{selectedLining?.name}</h4>
                    </div>
                  </div>
                </div>

                {/* Monogram Stamp at Bottom */}
                {monogram && (
                  <div className="relative z-10 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-xs tracking-widest uppercase">
                    Thêu Monogram: {monogram}
                  </div>
                )}
              </div>

              {/* Price & Summary */}
              <div className="w-full pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400 uppercase">Tổng Giá Trị Trang Phục:</span>
                <span className="text-xl font-bold text-white">{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            {/* Right Column: Customization Panel (7 cols) */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md shadow-2xl">
              {/* Category Navigation Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-zinc-900 border border-white/10 mb-6 text-xs font-medium">
                <button
                  onClick={() => setActiveCategoryTab('buttons')}
                  className={`py-2 rounded-lg transition-all ${activeCategoryTab === 'buttons' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Khuy Áo
                </button>
                <button
                  onClick={() => setActiveCategoryTab('zippers')}
                  className={`py-2 rounded-lg transition-all ${activeCategoryTab === 'zippers' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Khóa Kéo
                </button>
                <button
                  onClick={() => setActiveCategoryTab('linings')}
                  className={`py-2 rounded-lg transition-all ${activeCategoryTab === 'linings' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Lót Lụa Trong
                </button>
              </div>

              {/* Options List for Active Category */}
              <div className="space-y-4 mb-6">
                {config?.categories?.[activeCategoryTab]?.options?.map((opt) => {
                  const isSelected = (activeCategoryTab === 'buttons' && selectedButton?.id === opt.id) ||
                                     (activeCategoryTab === 'zippers' && selectedZipper?.id === opt.id) ||
                                     (activeCategoryTab === 'linings' && selectedLining?.id === opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        if (activeCategoryTab === 'buttons') setSelectedButton(opt);
                        if (activeCategoryTab === 'zippers') setSelectedZipper(opt);
                        if (activeCategoryTab === 'linings') setSelectedLining(opt);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected 
                          ? 'border-white bg-white/15 shadow-xl' 
                          : 'border-white/10 bg-zinc-900/60 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 pr-3">
                        <span 
                          className="w-7 h-7 rounded-full border border-white/30 flex-shrink-0 mt-0.5 shadow-md"
                          style={{ backgroundColor: opt.icon_color }}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-xs font-semibold text-white">{opt.name}</h4>
                            <span className="text-[10px] font-mono text-amber-400">+{formatPrice(opt.price)}</span>
                          </div>
                          <span className="text-[11px] text-zinc-400 block mb-1 font-light">{opt.material}</span>
                          <p className="text-[11px] text-zinc-500 font-light leading-relaxed">{opt.description}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-white border-white text-black' : 'border-white/20 text-transparent'
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monogram Input Field */}
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs uppercase tracking-wider text-zinc-300 font-medium flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400" />
                    Thêu Tên Viết Tắt Cá Nhân Lên Ve Áo Trong (Monogram)
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Tối đa 4 ký tự</span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={monogram}
                  onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                  placeholder="VÍ DỤ: A.V.C"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs font-mono tracking-widest uppercase focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* CTA Add to Cart */}
              <button
                onClick={handleSaveAndAddToCart}
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={15} /> Thêm Vào Giỏ Hàng ({formatPrice(calculateTotal())})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
