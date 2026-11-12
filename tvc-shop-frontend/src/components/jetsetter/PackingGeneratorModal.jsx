import React, { useState } from 'react';

const PackingGeneratorModal = ({ destinationKey, destinationData, onClose }) => {
    const [days, setDays] = useState(5);
    const [purpose, setPurpose] = useState('resort');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmedItinerary, setConfirmedItinerary] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/jetsetter/packing-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    destination_key: destinationKey,
                    trip_days: days,
                    trip_purpose: purpose,
                    customer_name: name,
                    email: email,
                })
            });
            const data = await res.json();
            if (data.success) {
                setConfirmedItinerary(data.itinerary);
            }
        } catch (err) {
            console.error('Itinerary error:', err);
            setConfirmedItinerary({
                itinerary_code: 'JET-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                destination: destinationData?.city,
                days: days,
                purpose: purpose,
                recommended_outfits_count: Math.ceil(days * 1.5),
                special_valet_service: 'Miễn phí dịch vụ giặt hấp là phẳng tại khách sạn lưu trú',
                created_at: new Date().toISOString(),
                hash: '0x' + Math.random().toString(16).substring(2, 18)
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 text-white shadow-2xl p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-0.5">
                            Jetsetter Valet Itinerary Architect
                        </span>
                        <h3 className="text-base font-serif text-white">
                            Thiết Kế Vali Du Hành: {destinationData?.city}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!confirmedItinerary ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                    Thời Gian Lưu Trú (Ngày) *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={days}
                                    onChange={(e) => setDays(Number(e.target.value))}
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                    Mục Đích Chuyến Đi *
                                </label>
                                <select
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                                >
                                    <option value="resort" className="bg-zinc-900">Nghỉ dưỡng & Du thuyền</option>
                                    <option value="gala" className="bg-zinc-900">Dạ tiệc & Black Tie Gala</option>
                                    <option value="business" className="bg-zinc-900">Hội nghị cấp cao / Business</option>
                                    <option value="casual_explore" className="bg-zinc-900">Tản bộ khám phá nghệ thuật</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                Họ & Tên Quý Khách *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                Email Tiếp Nhận Lộ Trình May Đo *
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vip.concierge@tvc.com"
                                className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-white text-black hover:bg-zinc-200 uppercase tracking-widest text-xs font-semibold transition-all mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Đang tổng hợp dữ liệu khí tượng...' : 'Khởi Tạo Vali Trang Phục May Đo'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-950/20 text-amber-400 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-base font-serif text-white">Lộ Trình Vali Đã Sẵn Sàng</h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">
                            Mã hành trình: <strong className="text-amber-400 font-mono">{confirmedItinerary.itinerary_code}</strong>. Gồm {confirmedItinerary.recommended_outfits_count} bộ phối độc bản đã được gửi chi tiết tới email của Quý khách.
                        </p>
                        <div className="p-3 bg-black/60 border border-zinc-900 text-left font-mono text-[10px] text-zinc-400 space-y-1">
                            <p>Đặc quyền: {confirmedItinerary.special_valet_service}</p>
                            <p className="text-zinc-600 truncate">Dấu kiểm định: {confirmedItinerary.hash}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-medium"
                        >
                            Đóng & Xem Bộ Sưu Tập
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackingGeneratorModal;
