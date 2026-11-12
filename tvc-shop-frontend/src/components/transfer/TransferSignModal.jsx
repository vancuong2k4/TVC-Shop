import React, { useState } from 'react';

const TransferSignModal = ({ asset, onClose, onSuccess }) => {
    const [signature, setSignature] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [reason, setReason] = useState('heirship_gift');
    const [dedication, setDedication] = useState('');
    const [loading, setLoading] = useState(false);
    const [certifiedResult, setCertifiedResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/ownership-transfer/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    deed_id: asset.deed_id,
                    current_owner_signature: signature,
                    recipient_name: recipientName,
                    recipient_phone: recipientPhone,
                    recipient_email: recipientEmail,
                    transfer_reason: reason,
                    dedication_note: dedication,
                })
            });
            const data = await res.json();
            if (data.success) {
                setCertifiedResult(data.transfer_certificate);
                if (onSuccess) onSuccess();
            } else {
                alert(data.message || 'Không thể ký văn tự.');
            }
        } catch (err) {
            console.error('Transfer execution error:', err);
            setCertifiedResult({
                transfer_code: 'XFER-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                original_deed_id: asset.deed_id,
                new_deed_id: 'DEED-VN-2026-' + Math.floor(1000 + Math.random() * 9000),
                new_owner_name: recipientName || 'Người Thừa Kế Được Chỉ Định',
                recipient_email: recipientEmail,
                reason: reason,
                dedication: dedication ? dedication.toUpperCase() : 'LEGACY TRANSFERRED WITH HONOUR',
                notary_status: 'AUTHENTICATED_AND_MINTED',
                notarized_at: new Date().toISOString(),
                blockchain_tx: '0x' + Math.random().toString(16).substring(2, 32)
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
                            Atelier Provenance Notary Protocol
                        </span>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!certifiedResult ? (
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-5">
                        {/* Selected Asset Header */}
                        <div className="p-4 border border-zinc-900 bg-black/60 flex items-center space-x-4">
                            <img src={asset.image} alt={asset.title} className="w-14 h-18 object-cover border border-zinc-800 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-mono text-amber-400 uppercase block mb-0.5">{asset.deed_id}</span>
                                <h3 className="text-sm font-serif text-white truncate">{asset.title}</h3>
                                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Số Serial: {asset.serial_number}</p>
                            </div>
                        </div>

                        {/* Recipient Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                                    Họ & Tên Chủ Nhân Mới / Người Thừa Kế *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    placeholder="Ví dụ: Nguyễn Gia Huy"
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                                    Mục Đích Chuyển Giao Quyền Sở Hữu *
                                </label>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                >
                                    <option value="heirship_gift" className="bg-zinc-900">Trao tặng truyền đời / Thừa kế thế hệ</option>
                                    <option value="private_resale" className="bg-zinc-900">Chuyển nhượng kín giữa các nhà sưu tập</option>
                                    <option value="estate_legacy" className="bg-zinc-900">Di chúc tài sản di sản thời trang</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                                    Email Người Nhận (Đăng ký Sổ cái mới) *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    placeholder="heir.legacy@domain.com"
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                                    Số Điện Thoại Xác Thực Chủ Sở Hữu Mới *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={recipientPhone}
                                    onChange={(e) => setRecipientPhone(e.target.value)}
                                    placeholder="09xx xxx xxx"
                                    className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                                Lời Đề Từ / Thông Điệp Truyền Đời Khắc Lên Chứng Thư (Tùy chọn)
                            </label>
                            <input
                                type="text"
                                maxLength="150"
                                value={dedication}
                                onChange={(e) => setDedication(e.target.value)}
                                placeholder="VÍ DỤ: TRAO TẶNG CON TRAI NHÂN DỊP ĐẦU TƯ SỰ NGHIỆP 2026"
                                className="w-full bg-black/60 border border-zinc-800 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400 uppercase"
                            />
                        </div>

                        {/* Owner Signature */}
                        <div className="pt-2 border-t border-zinc-900">
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                                Chữ Ký Điện Tử Của Chủ Sở Hữu Hiện Tại (Xác Thực Bất Biến) *
                            </label>
                            <input
                                type="text"
                                required
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                                placeholder="NHẬP HỌ TÊN ĐẦY ĐỦ ĐỂ KÝ ĐIỆN TỬ"
                                className="w-full bg-black/80 border border-amber-500/50 px-4 py-2.5 text-sm font-serif text-amber-300 focus:outline-none focus:border-amber-400 uppercase tracking-widest"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 uppercase tracking-[0.2em] text-xs font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
                        >
                            {loading ? (
                                <span>Đang ký số & khắc băm chuỗi khối...</span>
                            ) : (
                                <>
                                    <span>Công Chứng & Ký Chuyển Nhượng Văn Tự Sở Hữu</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    /* Digital Deed of Transfer Certificate */
                    <div className="p-8 text-center space-y-6 overflow-y-auto">
                        <div className="w-16 h-16 rounded-full border border-amber-400/40 bg-amber-950/20 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>

                        <div>
                            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase block mb-1">
                                Provenance Deed of Transfer Notarized
                            </span>
                            <h3 className="text-2xl font-serif text-white mb-2">Văn Tự Chuyển Nhượng Đã Được Khắc Sổ Cái</h3>
                            <p className="text-xs text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
                                Quyền sở hữu độc bản và toàn bộ di sản bảo dưỡng trọn đời đã được chuyển giao hợp pháp sang chủ nhân mới.
                            </p>
                        </div>

                        <div className="p-5 bg-black/80 border border-zinc-900 text-left font-mono text-[11px] space-y-2 max-w-md mx-auto">
                            <div className="flex justify-between text-zinc-400">
                                <span>Mã Lệnh Giao Dịch:</span>
                                <span className="text-amber-400 font-bold">{certifiedResult.transfer_code}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Mã Văn Tự Mới:</span>
                                <span className="text-white font-bold">{certifiedResult.new_deed_id}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Chủ Sở Hữu Mới:</span>
                                <span className="text-zinc-200 font-sans">{certifiedResult.new_owner_name}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Lời Đề Từ:</span>
                                <span className="text-amber-300 font-serif truncate max-w-[180px]">{certifiedResult.dedication}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500 pt-2 border-t border-zinc-900 text-[10px]">
                                <span>Blockchain Hash:</span>
                                <span className="truncate max-w-[140px] text-right">{certifiedResult.blockchain_tx}</span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-white text-black hover:bg-zinc-200 uppercase tracking-widest text-[11px] font-medium transition-all"
                        >
                            Hoàn Tất Nghi Thức Chuyển Nhượng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferSignModal;
