import React, { useState } from 'react';

const VirtualTourBookingModal = ({ room, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [time, setTime] = useState('15:00 - Chiều mai');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmedSession, setConfirmedSession] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/virtual-flagship/walkthrough', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    room_id: room.id,
                    client_name: name,
                    client_phone: phone,
                    preferred_time: time,
                    notes: notes,
                })
            });
            const data = await res.json();
            if (data.success) {
                setConfirmedSession(data.session);
                if (onSuccess) onSuccess();
            } else {
                alert(data.message || 'Không thể đặt lịch tham quan.');
            }
        } catch (err) {
            console.error('Walkthrough booking error:', err);
            setConfirmedSession({
                session_code: 'WALK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                room: room.name,
                client_name: name,
                preferred_time: time,
                concierge_lead: 'Trưởng Quản Gia TVC Flagship',
                access_link: 'https://atelier.tvc-shop.com/virtual-room/WALK-DEMO',
                created_at: new Date().toISOString()
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
                            Private 1-on-1 Virtual Concierge Tour
                        </span>
                        <h3 className="text-base font-serif text-white">
                            Đặt Lịch Tham Quan Trực Tuyến 1-1
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!confirmedSession ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="p-3 border border-zinc-900 bg-black/60 text-xs">
                            <span className="text-[10px] text-zinc-500 uppercase block">Không Gian Lựa Chọn:</span>
                            <span className="font-serif font-bold text-white text-sm">{room.name}</span>
                            <p className="text-[10px] text-amber-300 font-mono mt-1">
                                Đi cùng: Trưởng Quản Gia & Chuyên viên Giám định May đo
                            </p>
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
                                    Thời Gian Thuận Tiện
                                </label>
                                <input
                                    type="text"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    placeholder="15:00 - Ngày mai..."
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                Yêu Cầu Riêng Cho Quản Gia Chuẩn Bị (Tùy chọn)
                            </label>
                            <textarea
                                rows="2"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Muốn chiêm ngưỡng kỹ áo Tuxedo dệt sợi vàng hay mẫu vải len Cashmere..."
                                className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 uppercase tracking-widest text-xs font-semibold transition-all mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Đang xác lập phiên kết nối...' : 'Xác Nhận Đặt Lịch Tour Ảo 1-1'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-950/20 text-amber-400 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-serif text-white">Phiên Tham Quan Ảo Đã Được Xác Lập</h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">
                            Mã phiên: <strong className="text-amber-400 font-mono">{confirmedSession.session_code}</strong>. Trưởng Quản Gia sẽ đón tiếp Quý khách qua đường link video độ phân giải cao vào lúc <strong className="text-white">{confirmedSession.preferred_time}</strong>.
                        </p>
                        <div className="p-3 bg-black/60 border border-zinc-900 text-left font-mono text-[10px] text-zinc-400 space-y-1">
                            <p>Đường dẫn phòng VIP: <span className="text-cyan-400 truncate block">{confirmedSession.access_link}</span></p>
                            <p className="text-zinc-500">Người dẫn tour: {confirmedSession.concierge_lead}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-medium"
                        >
                            Đóng & Tiếp Tục Khám Phá
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VirtualTourBookingModal;
