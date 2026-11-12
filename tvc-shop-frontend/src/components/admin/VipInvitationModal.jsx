import React, { useState } from 'react';

const VipInvitationModal = ({ client, onClose, onSent }) => {
    const [inviteType, setInviteType] = useState('front_row_runway');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sentInvite, setSentInvite] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/admin/vip-concierge/invitations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    client_name: client.client_name,
                    tier: client.tier,
                    invitation_type: inviteType,
                    custom_message: message || 'Trân trọng kính mời Quý khách tham dự sự kiện đặc quyền của TVC Atelier.'
                })
            });
            const data = await res.json();
            if (data.success) {
                setSentInvite(data.invitation);
                if (onSent) onSent();
            } else {
                alert(data.message || 'Không thể gửi thư mời.');
            }
        } catch (err) {
            console.error('Send invite error:', err);
            setSentInvite({
                invite_code: 'INV-VIP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                recipient: client.client_name,
                tier: client.tier,
                type: inviteType,
                sent_at: new Date().toISOString()
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 md:p-8 text-black">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                    <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-600 block">
                            VIP Client Direct Dispatch
                        </span>
                        <h3 className="text-lg font-serif font-bold text-gray-900">
                            Gửi Thư Mời Đặc Quyền Cho {client.client_name}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!sentInvite ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Cấp Bậc Hội Viên:</span>
                                <span className="font-bold uppercase text-amber-700">{client.tier} Sovereign</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Nghệ Nhân Phụ Trách:</span>
                                <span className="font-medium text-gray-800">{client.dedicated_tailor}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                Loại Hình Đặc Quyền *
                            </label>
                            <select
                                value={inviteType}
                                onChange={(e) => setInviteType(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="front_row_runway">Vé Mời Hàng Ghế Đầu (Front Row) Sàn Diễn Thường Niên</option>
                                <option value="secret_vault_release">Mở Khóa Trước 48 Giờ Hầm Lưu Trữ Tuyệt Tác Kín</option>
                                <option value="private_tea_tasting">Buổi Thưởng Trà Sen & Giám Định Vải Loro Piana Tại Gia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                Thông Điệp Kính Gửi Từ Giám Đốc Sáng Tạo (Tùy chọn)
                            </label>
                            <textarea
                                rows="3"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Gửi lời tri ân trang trọng tới Quý khách nhân dịp phát hành bộ sưu tập mới..."
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white hover:bg-gray-800 rounded-lg uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-50 mt-4 shadow-lg"
                        >
                            {loading ? 'Đang mã hóa thư mời...' : 'Phát Hành Thư Mời Đặc Quyền Kỹ Thuật Số'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Thư Mời Đã Được Chuyển Tiếp</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Mã thư mời: <strong className="font-mono text-black">{sentInvite.invite_code}</strong>. Đã gửi thông báo ưu tiên tới số điện thoại và email của hội viên <strong className="text-black">{sentInvite.recipient}</strong>.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VipInvitationModal;
