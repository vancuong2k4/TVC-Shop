import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, MapPin, Search, Check, 
  FileCheck2, Globe, Leaf, Award, ArrowRight, Layers 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function FabricArchive() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFabric, setActiveFabric] = useState(null);
  const [searchCode, setSearchCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedPassport, setVerifiedPassport] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchFabrics();
  }, []);

  const fetchFabrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fabric-archive');
      if (res.data?.success) {
        setFabrics(res.data.fabrics || []);
        if (res.data.fabrics?.length > 0) {
          setActiveFabric(res.data.fabrics[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load fabric archive:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      showToast('Vui lòng nhập mã chứng chỉ vải (Ví dụ: TEX-IT-7892)', 'warning');
      return;
    }

    try {
      setVerifying(true);
      const res = await api.get(`/fabric-archive/verify?code=${encodeURIComponent(searchCode.trim())}`);
      if (res.data?.success) {
        setVerifiedPassport(res.data.passport_data);
        showToast('Mã chất liệu hợp lệ và đã được chứng thực minh bạch!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không tìm thấy chứng chỉ của mã vải này';
      showToast(msg, 'error');
      setVerifiedPassport(null);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            Atelier Traceability & Digital Fabric Passport
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Thư Viện Chất Liệu & Hộ Chiếu Vải
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Minh bạch tuyệt đối nguồn gốc từng mét vải cao cấp. Tra cứu hộ chiếu kỹ thuật số để khám phá cội nguồn xưởng dệt lịch sử, chứng nhận quốc tế và dấu ấn sinh thái bền vững.
          </p>
        </div>

        {/* Passport Code Verification Search Bar */}
        <div className="max-w-xl mx-auto w-full mb-14">
          <form onSubmit={handleVerify} className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-zinc-500" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Nhập mã chứng chỉ vải trên tag sản phẩm (Ví dụ: TEX-IT-7892)..."
              className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-zinc-950 border border-white/20 text-white placeholder-zinc-500 text-xs font-mono tracking-wider focus:outline-none focus:border-white transition-all shadow-xl"
            />
            <button
              type="submit"
              disabled={verifying}
              className="absolute right-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {verifying ? 'Xác thực...' : 'Tra Cứu'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 mt-2 text-[10px] font-mono text-zinc-500">
            <span>Mã mẫu thử nghiệm:</span>
            <button onClick={() => setSearchCode('TEX-IT-7892')} className="text-amber-400 underline hover:text-amber-300">TEX-IT-7892</button>
            <button onClick={() => setSearchCode('TEX-FR-4501')} className="text-amber-400 underline hover:text-amber-300">TEX-FR-4501</button>
            <button onClick={() => setSearchCode('TEX-JP-1120')} className="text-amber-400 underline hover:text-amber-300">TEX-JP-1120</button>
          </div>
        </div>

        {/* Passport Verification Modal / Card if searched */}
        {verifiedPassport && (
          <div className="mb-14 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-emerald-500/40 shadow-2xl relative animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">KẾT QUẢ XÁC THỰC HỢP LỆ</span>
                  <h3 className="text-base font-serif uppercase tracking-wide text-white">{verifiedPassport.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => setVerifiedPassport(null)}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                Đóng [×]
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-500 block mb-1">Mã Hộ Chiếu Vải:</span>
                <span className="text-amber-400 font-bold text-sm">{verifiedPassport.code}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-500 block mb-1">Xưởng Dệt Di Sản:</span>
                <span className="text-white font-sans">{verifiedPassport.mill}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-500 block mb-1">Xuất Xứ Địa Lý:</span>
                <span className="text-white font-sans">{verifiedPassport.origin}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Archive Explorer */}
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang đồng bộ hồ sơ chất liệu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Fabric Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">Kho Lưu Trữ Vải Tuyển Chọn</span>
              {fabrics.map((fab) => (
                <div
                  key={fab.id}
                  onClick={() => setActiveFabric(fab)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    activeFabric?.id === fab.id 
                      ? 'border-white bg-white/10 shadow-lg' 
                      : 'border-white/5 bg-zinc-950/60 hover:border-white/20'
                  }`}
                >
                  <img 
                    src={fab.image} 
                    alt={fab.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/15 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-amber-400 block tracking-widest mb-0.5">{fab.code}</span>
                    <h4 className="text-xs font-semibold text-white truncate mb-1">{fab.name}</h4>
                    <span className="text-[10px] text-zinc-400 truncate block font-light">{fab.origin}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Detailed Passport Dossier (8 cols) */}
            {activeFabric && (
              <div className="lg:col-span-8 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md shadow-2xl">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-amber-400 border border-white/15">
                        {activeFabric.code}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <MapPin size={12} className="text-rose-400" /> {activeFabric.origin}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif uppercase tracking-tight text-white">
                      {activeFabric.name}
                    </h2>
                  </div>

                  <div className="text-right sm:self-center">
                    <span className="text-[10px] font-mono text-zinc-500 block">Ứng dụng may đo</span>
                    <span className="text-xs font-mono font-semibold text-zinc-200">{activeFabric.products_used_count} Sản phẩm TVC-Shop</span>
                  </div>
                </div>

                {/* Fabric Image & Story */}
                <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-6 border border-white/10 relative">
                  <img 
                    src={activeFabric.image} 
                    alt={activeFabric.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>Xưởng dệt: {activeFabric.mill}</span>
                    <span>Định lượng: {activeFabric.weight}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">Câu Chuyện Nguồn Gốc</span>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    {activeFabric.story}
                  </p>
                </div>

                {/* Technical Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-zinc-500 block mb-1">Phẩm Cấp Xơ Sợi:</span>
                    <span className="text-white font-sans font-medium">{activeFabric.fiber_type}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-zinc-500 block mb-1">Độ Mịn Sợi / Cấu Trúc Dệt:</span>
                    <span className="text-white font-sans font-medium">{activeFabric.fineness}</span>
                  </div>
                </div>

                {/* Certifications Badges */}
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">Chứng Nhận Quốc Tế</span>
                  <div className="flex flex-wrap gap-2">
                    {activeFabric.certifications?.map((cert, cIdx) => (
                      <span 
                        key={cIdx}
                        className="px-3 py-1 rounded-full bg-zinc-900 border border-white/15 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5"
                      >
                        <Award size={13} className="text-amber-400" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sustainability & Environmental Impact */}
                {activeFabric.environmental_impact && (
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold uppercase mb-2">
                      <Leaf size={14} /> Dấu Ấn Sinh Thái Bền Vững
                    </div>
                    <ul className="space-y-1.5 text-zinc-300 font-light">
                      {Object.values(activeFabric.environmental_impact).map((impact, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <Check size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
