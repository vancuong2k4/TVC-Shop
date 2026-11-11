import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Key, Lock, Search, CheckCircle2, 
  Copy, ExternalLink, Award, FileText, ArrowRight, Check 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function AuthenticityCertificate() {
  const [showcase, setShowcase] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchShowcase();
  }, []);

  const fetchShowcase = async () => {
    try {
      setLoading(true);
      const res = await api.get('/authenticity/showcase');
      if (res.data?.success) {
        setShowcase(res.data.certificates || []);
        if (res.data.certificates?.length > 0) {
          setVerifiedCert(res.data.certificates[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load authenticity showcase:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      showToast('Vui lòng nhập mã chứng chỉ hoặc số Serial sản phẩm', 'warning');
      return;
    }

    try {
      setVerifying(true);
      const res = await api.get(`/authenticity/verify?code=${encodeURIComponent(searchCode.trim())}`);
      if (res.data?.success) {
        setVerifiedCert(res.data.certificate);
        showToast('Chứng nhận độc bản đã được xác thực chính xác trên sổ cái mật mã!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không tìm thấy chứng thư trên sổ cái';
      showToast(msg, 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    showToast('Đã sao chép mã băm mật mã (Cryptographic Hash)!', 'success');
    setTimeout(() => setCopiedHash(false), 2500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <ShieldCheck size={13} className="text-amber-400" />
            Sovereign Ledger & Cryptographic Authenticity
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Chứng Nhận Độc Bản Kỹ Thuật Số
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Mỗi thiết kế Runway và Bespoke giới hạn từ TVC-Shop đều được gắn một chứng thư mật mã bất biến. Tra cứu số Serial để kiểm định nghệ nhân may đo, nguồn gốc xơ sợi và lịch sử sở hữu độc quyền.
          </p>
        </div>

        {/* Verification Search Bar */}
        <div className="max-w-xl mx-auto w-full mb-14">
          <form onSubmit={handleVerify} className="relative flex items-center">
            <Key size={18} className="absolute left-4 text-zinc-500" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Nhập mã chứng chỉ (TVC-AUTH-882190) hoặc số Serial..."
              className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-zinc-950 border border-white/20 text-white placeholder-zinc-500 text-xs font-mono tracking-wider focus:outline-none focus:border-white transition-all shadow-xl"
            />
            <button
              type="submit"
              disabled={verifying}
              className="absolute right-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {verifying ? 'Kiểm định...' : 'Kiểm Định'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 mt-2 text-[10px] font-mono text-zinc-500">
            <span>Mã mẫu thử nghiệm:</span>
            <button onClick={() => setSearchCode('TVC-AUTH-882190')} className="text-amber-400 underline hover:text-amber-300">TVC-AUTH-882190</button>
            <button onClick={() => setSearchCode('TVC-AUTH-991204')} className="text-amber-400 underline hover:text-amber-300">TVC-AUTH-991204</button>
          </div>
        </div>

        {/* Interactive Certificate Viewport */}
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang đối chiếu sổ cái kỹ thuật số...</p>
          </div>
        ) : verifiedCert && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Certificate Document (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-2 border-amber-400/30 p-8 shadow-2xl relative overflow-hidden">
              {/* Luxury Certificate Header */}
              <div className="flex justify-between items-start pb-6 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 block mb-1">
                    CERTIFICATE OF IMMUTABLE AUTHENTICITY
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif uppercase tracking-tight text-white">
                    {verifiedCert.product_name}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Award size={24} />
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-zinc-500 block mb-1">Mã Chứng Thư:</span>
                  <span className="text-amber-300 font-bold">{verifiedCert.certificate_id}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-zinc-500 block mb-1">Số Serial Phiên Bản:</span>
                  <span className="text-white font-bold">{verifiedCert.serial_number}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-zinc-500 block mb-1">Nghệ Nhân May Đo:</span>
                  <span className="text-white font-sans">{verifiedCert.artisan}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-zinc-500 block mb-1">Thời Gian Chế Tác:</span>
                  <span className="text-white">{verifiedCert.crafting_hours} Giờ Thủ Công</span>
                </div>
              </div>

              {/* Cryptographic Ledger Proof Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono mb-6 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest pb-1 border-b border-white/5">
                  <span>Mạng Lưới Xác Thực: {verifiedCert.blockchain_network}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> VERIFIED HASH
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Mã Băm Mật Mã (SHA-256):</span>
                  <div className="flex items-center justify-between gap-2 bg-zinc-900 p-2 rounded-lg border border-white/10">
                    <span className="text-[10px] text-zinc-300 truncate max-w-[320px] font-mono">
                      {verifiedCert.cryptographic_hash}
                    </span>
                    <button 
                      onClick={() => handleCopyHash(verifiedCert.cryptographic_hash)}
                      className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                      title="Sao chép mã hash"
                    >
                      {copiedHash ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Owner & Date Footer */}
              <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-white/10 text-zinc-400">
                <span>Chủ sở hữu: <strong className="text-white font-sans">{verifiedCert.current_owner}</strong></span>
                <span>Ngày cấp: {verifiedCert.issue_date}</span>
              </div>
            </div>

            {/* Right Perks & Showcase List (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Perks card */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-md">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  Đặc Quyền Kèm Theo Chứng Thư
                </h3>

                <div className="space-y-3">
                  {verifiedCert.perks?.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-light leading-relaxed">
                      <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Authenticated Pieces */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-3">
                  Các Tuyệt Tác Khác Trên Sổ Cái
                </span>

                <div className="space-y-2.5">
                  {showcase.map((item) => (
                    <button
                      key={item.certificate_id}
                      onClick={() => setVerifiedCert(item)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        verifiedCert.certificate_id === item.certificate_id 
                          ? 'border-white bg-white/10 shadow-lg' 
                          : 'border-white/5 bg-zinc-900/40 hover:border-white/20'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-mono text-amber-400 block">{item.serial_number}</span>
                        <h4 className="text-xs font-semibold text-white truncate">{item.product_name}</h4>
                      </div>
                      <ArrowRight size={14} className="text-zinc-500 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
