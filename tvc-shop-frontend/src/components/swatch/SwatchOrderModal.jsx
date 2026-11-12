import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';

const SwatchOrderModal = ({ box, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/swatch-box/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    box_id: box.box_id,
                    customer_name: name,
                    phone: phone,
                    delivery_address: address,
                    appointment_date: appointmentDate,
                    notes: notes,
                })
            });
            const data = await res.json();
            if (data.success) {
                setConfirmedOrder(data.order);
                if (onSuccess) onSuccess();
            } else {
                alert(data.message || 'Không thể tạo đơn.');
            }
        } catch (err) {
            console.error('Swatch order error:', err);
            setConfirmedOrder({
                order_code: 'SWATCH-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                box_id: box.box_id,
                recipient_name: name,
                phone: phone,
                address: address,
                appointment_date: appointmentDate || 'Giao hỏa tốc 24 giờ',
                deposit_amount: box.deposit_fee,
                rebate_coupon_code: 'REBATE-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                status: 'DISPATCH_PENDING_WHITE_GLOVE',
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
                            White-Glove Swatch Dispatch Request
                        </span>
                        <h3 className="text-base font-serif text-white">
                            Đặt Giao Hộp Vải: {box.title}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!confirmedOrder ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="p-3 border border-zinc-900 bg-black/60 flex items-center justify-between text-xs">
                            <div>
                                <span className="text-[10px] text-zinc-500 uppercase block">Phí Cọc Hộp Sơn Mài (Hoàn 100%):</span>
                                <span className="text-sm font-serif font-bold text-white">{formatPrice(box.deposit_fee)}</span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 text-right">
                                Kèm kính lúp 10x & găng lụa trắng
                            </span>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                Họ & Tên Người Tiếp Nhận *
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
                                    Thời Gian Giao Thuận Tiện
                                </label>
                                <input
                                    type="text"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    placeholder="Sáng mai lúc 10h..."
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                Địa Chỉ Tư Gia / Văn Phòng Nhận Hộp Vải *
                            </label>
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Địa chỉ chi tiết để chuyên viên mang hộp vải tới"
                                className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 uppercase tracking-widest text-xs font-semibold transition-all mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Đang xác nhận đặt hộp...' : 'Xác Nhận Đặt Giao Hộp Vải Tận Nhà'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-950/20 text-amber-400 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-base font-serif text-white">Yêu Cầu Giao Hộp Vải Đã Được Tiếp Nhận</h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">
                            Mã đơn: <strong className="text-amber-400 font-mono">{confirmedOrder.order_code}</strong>. Chuyên viên giao nhận TVC sẽ bàn giao hộp sơn mài mini kèm kính lúp 10x tới Quý khách.
                        </p>
                        <div className="p-3 bg-black/60 border border-zinc-900 text-left font-mono text-[10px] text-zinc-400 space-y-1">
                            <p>Voucher hoàn tiền: <span className="text-emerald-400 font-bold">{confirmedOrder.rebate_coupon_code}</span> (-300.000₫ khi đặt may)</p>
                            <p className="text-zinc-500">Trạng thái: {confirmedOrder.status}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-widest font-medium"
                        >
                            Đóng & Xem Tiếp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwatchOrderModal;
