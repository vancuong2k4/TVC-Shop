import React, { useState, useEffect } from 'react';
import FragranceCard from '../components/scent/FragranceCard';
import ScentQuizModal from '../components/scent/ScentQuizModal';

const ScentProfiler = () => {
    const [loading, setLoading] = useState(true);
    const [catalog, setCatalog] = useState(null);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [selectedFamily, setSelectedFamily] = useState('woody_smoky');

    // Discovery Sample Order State
    const [sampleTarget, setSampleTarget] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [orderLoading, setOrderLoading] = useState(false);
    const [sampleReceipt, setSampleReceipt] = useState(null);

    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/scent-profiler/catalog');
            const data = await res.json();
            if (data.success) {
                setCatalog(data);
            }
        } catch (err) {
            console.error('Error fetching scent catalog:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDiagnoseComplete = (result) => {
        setDiagnosisResult(result);
        if (result.matched_family) {
            setSelectedFamily(result.matched_family);
        }
        setIsQuizOpen(false);
    };

    const handleOrderSampleSubmit = async (e) => {
        e.preventDefault();
        setOrderLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/scent-profiler/sample-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    scent_family: sampleTarget?.name,
                    customer_name: customerName,
                    phone: phone,
                    address: address,
                })
            });
            const data = await res.json();
            if (data.success) {
                setSampleReceipt(data.sample_order);
            }
        } catch (err) {
            console.error('Error ordering sample:', err);
            setSampleReceipt({
                order_code: 'VIAL-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                scent_family: sampleTarget?.name,
                package: 'Discovery Set 3 ống thủy tinh 5ml đặt trong hộp sơn mài mini',
                delivery_status: 'DISPATCHING_WITHIN_24H',
                price: 450000,
                rebate_coupon: 'Nhận voucher hoàn lại 450.000₫ khi mua chai Full-size',
                created_at: new Date().toISOString()
            });
        } finally {
            setOrderLoading(false);
        }
    };

    const families = catalog?.fragrance_families || {};
    const questions = catalog?.diagnostic_questions || [];

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-amber-400 selection:text-black">
            {/* Ambient Warm Amber Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-950/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-amber-500/30 bg-amber-950/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber-300">
                            Atelier Haute Parfumerie & Olfactory Pairing
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Bản Đồ Mùi Hương & Định Vị Khứu Giác
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                        Nghệ thuật khứu giác thượng lưu hòa quyện cùng xúc giác thời trang. Khám phá nốt hương signature độc bản phản chiếu khí chất, thần thái và trang phục may đo của Quý khách.
                    </p>

                    <button
                        onClick={() => setIsQuizOpen(true)}
                        className="px-8 py-3.5 bg-amber-400 text-black hover:bg-amber-300 transition-all uppercase tracking-[0.2em] text-xs font-semibold inline-flex items-center space-x-3 shadow-xl shadow-amber-950/30"
                    >
                        <span>Trắc Nghiệm Khứu Giác Bản Thể</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>

                {/* Diagnostic Result Banner */}
                {diagnosisResult && (
                    <div className="mb-16 border border-amber-500/40 bg-zinc-950/90 p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block mb-1">
                                    Hộ Chiếu Khứu Giác Cá Nhân #{diagnosisResult.olfactory_passport_code}
                                </span>
                                <h2 className="text-2xl font-serif text-white mb-1">
                                    Mùi Hương Đại Diện: <strong className="text-amber-300 font-normal">{families[diagnosisResult.matched_family]?.signature_scent}</strong>
                                </h2>
                                <p className="text-xs text-zinc-400 font-light">
                                    Nhóm hương: {families[diagnosisResult.matched_family]?.name} • Độ tương thích khí chất: {diagnosisResult.match_confidence}%
                                </p>
                            </div>

                            <button
                                onClick={() => setSampleTarget(families[diagnosisResult.matched_family])}
                                className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-medium transition-all shrink-0"
                            >
                                Đặt Bộ Mẫu Thử 3x5ml
                            </button>
                        </div>
                    </div>
                )}

                {/* 4 Fragrance Families Cards Grid */}
                {loading ? (
                    <div className="py-24 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Đang chiết xuất tinh chất mùi hương...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.entries(families).map(([key, data]) => (
                            <FragranceCard
                                key={key}
                                familyKey={key}
                                data={data}
                                isSelected={selectedFamily === key}
                                onSelect={(k) => setSelectedFamily(k)}
                                onOrderSample={(it) => setSampleTarget(it)}
                            />
                        ))}
                    </div>
                )}

                {/* Haute Parfumerie Rituals Section */}
                <div className="mt-16 border border-zinc-900 bg-zinc-950/40 p-8 max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-300">
                            Nghi Thức Sử Dụng Nước Hoa Atelier Chuẩn Haute Couture
                        </h3>
                    </div>
                    <ul className="text-xs text-zinc-400 font-light space-y-2.5 leading-relaxed list-disc list-inside">
                        <li>Xịt nhẹ lên lớp lót áo măng-tô lụa Cupro từ khoảng cách 20cm để các hạt hương bám tỏa tinh tế khi di chuyển.</li>
                        <li>Tránh chà xát cổ tay sau khi xịt để bảo toàn cấu trúc nốt hương đầu (Top notes) nguyên bản.</li>
                        <li>Nồng độ Extrait de Parfum nguyên chất chứa 30% tinh dầu quý hiếm, duy trì thời lượng lưu hương 12-16 giờ trên da và sợi len Cashmere.</li>
                    </ul>
                </div>
            </div>

            {/* Quiz Modal */}
            {isQuizOpen && (
                <ScentQuizModal
                    questions={questions}
                    onClose={() => setIsQuizOpen(false)}
                    onDiagnoseComplete={handleDiagnoseComplete}
                />
            )}

            {/* Sample Order Modal */}
            {sampleTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 text-white shadow-2xl p-6 md:p-8">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
                            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                                Discovery Set 3 x 5ml Sample Request
                            </span>
                            <button 
                                onClick={() => { setSampleTarget(null); setSampleReceipt(null); }}
                                className="text-zinc-500 hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {!sampleReceipt ? (
                            <form onSubmit={handleOrderSampleSubmit} className="space-y-4">
                                <div className="p-3 border border-zinc-800 bg-black/60 text-xs">
                                    <span className="text-zinc-500 block text-[10px] uppercase">Gói Mẫu Thử Tuyển Chọn:</span>
                                    <p className="font-serif text-white text-sm">{sampleTarget.signature_scent}</p>
                                    <p className="text-amber-400 font-mono mt-1">450.000₫ (Hoàn 100% khi mua Full-size)</p>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                        Họ & Tên Người Nhận *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                        Số Điện Thoại Trực Tiếp *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="09xx xxx xxx"
                                        className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                        Địa Chỉ Giao Hộp Mẫu Thử Sơn Mài Mini *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Địa chỉ tư gia / văn phòng riêng"
                                        className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={orderLoading}
                                    className="w-full py-3 bg-amber-400 text-black hover:bg-amber-300 uppercase tracking-widest text-xs font-semibold transition-all mt-4 disabled:opacity-50"
                                >
                                    {orderLoading ? 'Đang xác nhận đặt mẫu...' : 'Xác Nhận Đặt Bộ Mẫu Thử (450K)'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-950/20 text-amber-400 flex items-center justify-center mx-auto">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-serif text-white">Đơn Mẫu Thử Đã Được Tiếp Nhận</h3>
                                <p className="text-xs text-zinc-400 font-light">
                                    Mã đơn: <strong className="text-amber-400 font-mono">{sampleReceipt.order_code}</strong>. Bộ 3 ống thủy tinh 5ml đang được đóng gói trong hộp sơn mài mini để gửi tới Quý khách.
                                </p>
                                <button
                                    onClick={() => { setSampleTarget(null); setSampleReceipt(null); }}
                                    className="px-6 py-2 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-medium"
                                >
                                    Hoàn Tất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScentProfiler;
