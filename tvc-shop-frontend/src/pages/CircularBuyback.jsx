import React, { useState, useEffect } from 'react';
import SustainabilityMetricsBar from '../components/circular/SustainabilityMetricsBar';
import BuybackAppraisalModal from '../components/circular/BuybackAppraisalModal';
import { formatPrice } from '../utils/formatPrice';

const CircularBuyback = () => {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState(null);
    const [isAppraisalOpen, setIsAppraisalOpen] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/circular-buyback/config');
            const data = await res.json();
            if (data.success) {
                setConfig(data);
            }
        } catch (err) {
            console.error('Error fetching buyback config:', err);
        } finally {
            setLoading(false);
        }
    };

    const conditionTiers = config?.condition_tiers || {};
    const eligibleCategories = config?.eligible_categories || [];

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-emerald-400 selection:text-black">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-950/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-emerald-500/30 bg-emerald-950/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-emerald-300">
                            Atelier Circularity & Archival Buyback Sovereign
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Ký Gửi & Bàn Giao Tuần Hoàn Di Sản
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                        Cam kết thời trang bền vững và trường tồn vĩnh cửu. TVC Atelier thu mua lại các thiết kế may đo cao cấp của Quý khách với định giá minh bạch lên đến 70% giá trị gốc, tái sinh qua bàn tay của các nghệ nhân phục chế.
                    </p>

                    <button
                        onClick={() => setIsAppraisalOpen(true)}
                        className="px-8 py-3.5 bg-emerald-400 text-black hover:bg-emerald-300 transition-all uppercase tracking-[0.2em] text-xs font-semibold inline-flex items-center space-x-3 shadow-xl shadow-emerald-950/30"
                    >
                        <span>Khởi Tạo Hồ Sơ Thẩm Định Thu Mua</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>

                {/* Sustainability Metrics Tracker */}
                <div className="mb-16">
                    <SustainabilityMetricsBar stats={config?.circular_sustainability_stats} />
                </div>

                {/* Condition Standards Tiers */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                            Tiêu Chuẩn Giám Định & Tỷ Lệ Thu Mua
                        </span>
                        <h2 className="text-2xl font-serif text-white">3 Cấp Độ Kiểm Định Trạng Thái Vải</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(conditionTiers).map(([key, tier]) => (
                            <div key={key} className="p-6 border border-zinc-900 bg-zinc-950/60 backdrop-blur-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-base font-serif text-white">{tier.name}</h3>
                                        <span className="text-xs font-mono text-emerald-400 font-bold">
                                            Lên tới {tier.valuation_percentage}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                                        {tier.description}
                                    </p>
                                    <div className="space-y-2 py-4 border-t border-zinc-900">
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 block">Yêu cầu kiểm duyệt:</span>
                                        <ul className="text-[11px] text-zinc-300 space-y-1.5 list-disc list-inside font-light">
                                            {tier.requirements.map((req, idx) => (
                                                <li key={idx}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-500">
                                    <span>Tiền mặt: {tier.cash_percentage}%</span>
                                    <span className="text-emerald-400">Store Credit: {tier.valuation_percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Eligible Categories & Value Estimation */}
                <div className="mb-16 border border-zinc-900 bg-zinc-950/40 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                                Danh Mục Được Ưu Tiên Tiếp Nhận
                            </span>
                            <h3 className="text-xl font-serif text-white">Các Dòng Sản Phẩm Giữ Giá Trị Di Sản</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {eligibleCategories.map((cat) => (
                            <div key={cat.id} className="p-4 border border-zinc-900 bg-black/60">
                                <h4 className="text-xs font-medium text-white mb-2">{cat.name}</h4>
                                <div className="space-y-1 text-[11px] font-mono">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Giá trị tham chiếu:</span>
                                        <span className="text-zinc-200">{formatPrice(cat.base_avg_price)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Nhu cầu săn đón:</span>
                                        <span className="text-emerald-400">{cat.resell_demand}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Process Steps */}
                <div className="border border-zinc-900 bg-zinc-950/60 p-8">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                            Nghi thức bàn giao
                        </span>
                        <h3 className="text-xl font-serif text-white">Quy Trình Thu Mua Chuẩn White-Glove</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <div className="p-4">
                            <span className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center mx-auto mb-3 font-mono text-xs text-emerald-400">01</span>
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-1">Kê khai trực tuyến</h4>
                            <p className="text-[11px] text-zinc-400 font-light">Điền thông tin và hình ảnh sản phẩm để nhận định giá sơ bộ ngay tức thì.</p>
                        </div>
                        <div className="p-4">
                            <span className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center mx-auto mb-3 font-mono text-xs text-emerald-400">02</span>
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-1">Giao nhận tận nơi</h4>
                            <p className="text-[11px] text-zinc-400 font-light">Chuyên viên TVC dùng hộp bảo hiểm chuyên dụng tới nhận trang phục tại nhà.</p>
                        </div>
                        <div className="p-4">
                            <span className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center mx-auto mb-3 font-mono text-xs text-emerald-400">03</span>
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-1">Nghệ nhân giám định</h4>
                            <p className="text-[11px] text-zinc-400 font-light">Kiểm tra vi sợi vải, độ bền phụ kiện và đưa ra chứng chỉ giám định chính thức.</p>
                        </div>
                        <div className="p-4">
                            <span className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center mx-auto mb-3 font-mono text-xs text-emerald-400">04</span>
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-white mb-1">Giải ngân tức thì</h4>
                            <p className="text-[11px] text-zinc-400 font-light">Nhận chuyển khoản ngân hàng hoặc nạp Store Credit +15% thưởng mua sắm.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appraisal Modal */}
            {isAppraisalOpen && (
                <BuybackAppraisalModal
                    config={config}
                    onClose={() => setIsAppraisalOpen(false)}
                    onSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default CircularBuyback;
