import React, { useState, useEffect } from 'react';
import { X, Ruler, Sparkles, Check, Info } from 'lucide-react';
import api from '../../api/axios';

export default function SizeGuideModal({ isOpen, onClose, defaultCategory = 'tops' }) {
  const [guides, setGuides] = useState(null);
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [unit, setUnit] = useState('cm'); // 'cm' or 'inch'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSizeGuides();
    }
  }, [isOpen]);

  const fetchSizeGuides = async () => {
    try {
      setLoading(true);
      const res = await api.get('/size-guides');
      if (res.data?.success) {
        setGuides(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load size guides:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentGuide = guides ? guides[activeCategory] : null;

  const convertValue = (valStr) => {
    if (unit === 'cm') return valStr;
    // chuyển đổi cm sang inch (~ chia 2.54)
    return valStr.replace(/\d+/g, (match) => {
      const num = parseFloat(match);
      return (num / 2.54).toFixed(1);
    });
  };

  const categoryLabels = {
    tops: 'Áo Sơ Mi & Dệt Kim',
    blazers: 'Blazer & May Đo',
    pants: 'Quần Âu & Denim',
    dresses: 'Đầm & Slip Dress'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-zinc-950 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-amber-400">
            <Ruler size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Cold Luxury Atelier</span>
            <h2 className="text-xl md:text-2xl font-serif tracking-tight uppercase">Bảng Thông Số Kích Cỡ</h2>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mb-6 font-light">
          Thông số chuẩn xác cho từng đường may phom dáng cao cấp. Hãy sử dụng thước dây mềm để đối chiếu.
        </p>

        {/* Category Tabs & Unit Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {Object.keys(categoryLabels).map((catKey) => (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === catKey 
                    ? 'bg-white text-black shadow-md font-semibold' 
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-white/10'
                }`}
              >
                {categoryLabels[catKey]}
              </button>
            ))}
          </div>

          {/* CM / INCH Toggle */}
          <div className="flex items-center self-end sm:self-center bg-zinc-900 border border-white/15 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 rounded-md transition-colors ${unit === 'cm' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('inch')}
              className={`px-2.5 py-1 rounded-md transition-colors ${unit === 'inch' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              INCH
            </button>
          </div>
        </div>

        {/* Table Content */}
        {loading || !currentGuide ? (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-500">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
            <p className="text-xs uppercase tracking-widest">Đang tải thông số may đo...</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto rounded-xl border border-white/15 bg-zinc-900/50 mb-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-zinc-300 font-mono uppercase tracking-wider text-[11px]">
                    {currentGuide.columns.map((col, idx) => (
                      <th key={idx} className="p-3 font-semibold">{col} ({unit.toUpperCase()})</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {currentGuide.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-white tracking-widest">{row.size}</td>
                      {row.chest && <td className="p-3 text-zinc-300">{convertValue(row.chest)}</td>}
                      {row.waist && <td className="p-3 text-zinc-300">{convertValue(row.waist)}</td>}
                      {row.shoulder && <td className="p-3 text-zinc-300">{convertValue(row.shoulder)}</td>}
                      {row.hip && <td className="p-3 text-zinc-300">{convertValue(row.hip)}</td>}
                      {row.thigh && <td className="p-3 text-zinc-300">{convertValue(row.thigh)}</td>}
                      {row.sleeve && <td className="p-3 text-zinc-300">{convertValue(row.sleeve)}</td>}
                      {row.length && <td className="p-3 text-zinc-300">{convertValue(row.length)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Styling & Measuring Tips */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-zinc-300">
              <Info size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block mb-0.5">Lời khuyên may đo từ Atelier:</span>
                <p className="leading-relaxed font-light">{currentGuide.tips}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
