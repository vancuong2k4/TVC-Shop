import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Ruler, ShieldCheck, Check, Save, User, 
  ArrowRight, Award, Compass, RefreshCw 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function MeasurementLedger() {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unit, setUnit] = useState('cm'); // cm or inch

  const [formData, setFormData] = useState({
    client_name: 'Arthur V.C',
    height: 178,
    weight: 71,
    posture: 'Vai vuông & Lưng thẳng tự nhiên',
    fit_preference: 'Structured Slim Fit',
    measurements: {}
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      setLoading(true);
      const res = await api.get('/measurement-ledger/schema');
      if (res.data?.success) {
        setSchema(res.data);
        if (res.data.sample_profile) {
          setFormData({
            client_name: res.data.sample_profile.client_name,
            height: res.data.sample_profile.height,
            weight: res.data.sample_profile.weight,
            posture: res.data.sample_profile.posture,
            fit_preference: res.data.sample_profile.fit_preference,
            measurements: res.data.sample_profile.measurements || {}
          });
        }
      }
    } catch (err) {
      console.error('Failed to load measurement schema:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMeasurementChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: parseFloat(value) || 0
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.post('/measurement-ledger/save', formData);
      if (res.data?.success) {
        showToast('Hồ sơ số đo may đo đã được hiệu chuẩn & đồng bộ thành công!', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra khi lưu số đo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const convertDisplay = (val) => {
    if (!val) return '0';
    if (unit === 'cm') return val;
    return (val / 2.54).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Ruler size={13} className="text-amber-400" />
            Atelier Bespoke & Digital Fit Ledger
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Sổ Cái Thước Đo Cá Nhân
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Hồ sơ nhân trắc học may đo 14 điểm chuẩn xác được lưu trữ bảo mật trọn đời. Dữ liệu số đo giúp nghệ nhân TVC-Shop cắt may trang phục chuẩn phom dáng mà không cần quý khách phải đến xưởng đo lại nhiều lần.
          </p>

          {/* CM / INCH switcher */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="bg-zinc-900 border border-white/15 rounded-lg p-0.5 text-xs font-mono inline-flex">
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition-colors ${unit === 'cm' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                CENTIMET (CM)
              </button>
              <button
                onClick={() => setUnit('inch')}
                className={`px-3 py-1 rounded-md transition-colors ${unit === 'inch' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                INCHES (INCH)
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang hiệu chuẩn sổ cái số đo...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-10">
            {/* General Posture & Fit Profile Card */}
            <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-0.5">THÔNG SỐ THỂ TRẠNG TỔNG QUAN</span>
                  <h3 className="text-lg font-serif uppercase tracking-tight text-white">Chân Dung Vóc Dáng & Phom May Đo</h3>
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  Mã hồ sơ: <span className="text-white font-bold">{schema?.sample_profile?.profile_id}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-mono text-[10px]">Họ tên chủ nhân</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={e => setFormData(p => ({ ...p, client_name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-mono text-[10px]">Chiều cao (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={e => setFormData(p => ({ ...p, height: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-mono text-[10px]">Cân nặng (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={e => setFormData(p => ({ ...p, weight: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-zinc-400 mb-1 font-mono text-[10px]">Gu phom dáng may đo</label>
                  <select
                    value={formData.fit_preference}
                    onChange={e => setFormData(p => ({ ...p, fit_preference: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none focus:border-white"
                  >
                    <option value="Structured Slim Fit">Structured Slim Fit (Ôm vừa vặn cấu trúc)</option>
                    <option value="Classic Regular Fit">Classic Regular Fit (Thoải mái chuẩn mực)</option>
                    <option value="Relaxed Minimal Fit">Relaxed Minimal Fit (Rộng rãi phóng khoáng)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categorized Measurements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {schema?.categories && Object.entries(schema.categories).map(([catKey, cat]) => (
                <div 
                  key={catKey}
                  className="p-6 rounded-3xl bg-zinc-950 border border-white/10 backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
                      <span>{cat.name}</span>
                      <Compass size={14} />
                    </h4>

                    <div className="space-y-4">
                      {cat.fields.map((field) => (
                        <div key={field.key} className="flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <span className="text-white block font-medium truncate">{field.label}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">Chuẩn: {field.range}</span>
                          </div>

                          <div className="w-24 relative flex items-center">
                            <input
                              type="number"
                              step="0.5"
                              value={formData.measurements[field.key] || field.default}
                              onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                              className="w-full pl-2.5 pr-8 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white text-right"
                            />
                            <span className="absolute right-2 text-[10px] font-mono text-zinc-400 pointer-events-none">
                              {unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Signature & Save Action Bar */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">CHỨNG THỰC BỞI NGHỆ NHÂN ATELIER</span>
                  <p className="text-xs text-zinc-200">Hiệu chuẩn lần cuối bởi: <strong>{schema?.sample_profile?.calibrated_by}</strong></p>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={14} /> Lưu & Đồng Bộ Sổ Cái Thước Đo
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
