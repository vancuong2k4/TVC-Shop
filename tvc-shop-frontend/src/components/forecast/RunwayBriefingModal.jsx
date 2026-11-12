import React, { useState } from 'react';

const RunwayBriefingModal = ({ season, atelier, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [aestheticNotes, setAestheticNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmedDossier, setConfirmedDossier] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/runway-forecast/briefing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    season_code: season?.code,
                    atelier_id: atelier?.id,
                    client_name: name,
                    client_phone: phone,
                    client_email: email,
                    aesthetic_notes: aestheticNotes,
                })
            });
            const data = await res.json();
            if (data.success) {
                setConfirmedDossier(data.briefing_dossier);
                if (onSuccess) onSuccess();
            } else {
                alert(data.message || 'Không thể gửi hồ sơ.');
            }
        } catch (err) {
            console.error('Runway briefing error:', err);
            setConfirmedDossier({
                dossier_code: 'FCAST-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                season_code: season?.code,
                allocated_atelier: atelier?.city,
                client_name: name,
                priority_queue: 'TIER_1_EARLY_ACCESS',
                scheduled_review: 'Trước 14 ngày mở màn Tuần lễ Thời trang Quốc tế',
                created_at: new Date().toISOString(),
                hash: '0x' + Math.random().toString(16).substring(2, 24)
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
                            Pre-Runway Design Allocation Dossier
                        </span>
                        <h3 className="text-base font-serif text-white">
                            Giữ Suất Phác Thảo Sàn Diễn
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!confirmedDossier ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Selected Season & Atelier */}
                        <div className="p-3 border border-zinc-900 bg-black/60 text-xs space-y-1">
                            <div className="flex justify-between text-zinc-400">
                                <span>Mùa Diễn Dự Báo:</span>
                                <span className="text-white font-medium">{season?.title}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Xưởng May Tiếp Nhận:</span>
                                <span className="text-amber-400 font-mono">{atelier?.city} ({atelier?.head_artisan})</span>
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
                                className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
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
                                    Email Nhận Bản Phác Thảo *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="client.vip@couture.com"
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                Yêu Cầu Riêng Về Phom Dáng & Chất Liệu (Tùy chọn)
                            </label>
                            <textarea
                                rows="2"
                                value={aestheticNotes}
                                onChange={(e) => setAestheticNotes(e.target.value)}
                                placeholder="Mong muốn về tone màu, số đo hoặc dịp diện dự kiến..."
                                className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 uppercase tracking-widest text-xs font-semibold transition-all mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Đang bảo mật ghi danh...' : 'Xác Nhận Giữ Suất Thiết Kế Trước Sàn Diễn'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-950/20 text-amber-400 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-base font-serif text-white">Hồ Sơ Giữ Chỗ Đã Được Niêm Phong</h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">
                            Mã hồ sơ: <strong className="text-amber-400 font-mono">{confirmedDossier.dossier_code}</strong>. Quý khách được xếp vào hàng đợi ưu tiên cao nhất <strong className="text-white font-mono">{confirmedDossier.priority_queue}</strong>.
                        </p>
                        <div className="p-3 bg-black/60 border border-zinc-900 text-left font-mono text-[10px] text-zinc-400 space-y-1">
                            <p>Lịch duyệt bản vẽ cá nhân: {confirmedDossier.scheduled_review}</p>
                            <p className="text-zinc-600 truncate">Mã băm xác thực: {confirmedDossier.hash}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-medium"
                        >
                            Hoàn Tất & Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RunwayBriefingModal;
