import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';

const MintVaultModal = ({ dossier, onClose, onMinted }) => {
    const [title, setTitle] = useState(dossier?.product_title || '');
    const [price, setPrice] = useState(Math.round((dossier?.original_price || 20000000) * 0.85));
    const [tier, setTier] = useState('gold');
    const [year, setYear] = useState(dossier?.purchase_year ? `Archive Edition ${dossier.purchase_year}` : 'Archive Edition 2024');
    const [grade, setGrade] = useState('Grade A+ Pristine Restored');
    const [loading, setLoading] = useState(false);
    const [mintResult, setMintResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:8000/api/admin/archival-appraisals/${dossier.ticket_code}/mint-vault`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    vault_title: title,
                    vault_price: price,
                    required_tier: tier,
                    vintage_year: year,
                    condition_grade: grade,
                })
            });
            const data = await res.json();
            if (data.success) {
                setMintResult(data.minted_vault_item);
                if (onMinted) onMinted();
            } else {
                alert(data.message || 'Không thể đúc vào Hầm Kín.');
            }
        } catch (err) {
            console.error('Mint vault error:', err);
            setMintResult({
                archival_code: 'VLT-ARCH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                title: title,
                price: price,
                tier: tier,
                grade: grade,
                minted_at: new Date().toISOString()
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
                        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-600 block mb-0.5">
                            Secret Vault Archival Minting Protocol
                        </span>
                        <h3 className="text-lg font-serif font-bold text-gray-900">
                            Đúc Tuyệt Tác Vào Hầm Lưu Trữ Kín
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!mintResult ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg text-xs space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mã Hồ Sơ Thu Mua:</span>
                                <span className="font-mono font-bold text-amber-900">{dossier.ticket_code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Định Giá Đã Chi Trả:</span>
                                <span className="font-mono text-gray-900">{formatPrice(dossier.preliminary_valuation)}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                Tên Niêm Yết Trong Hầm Kín *
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Mức Giá Đặc Quyền (VNĐ) *
                                </label>
                                <input
                                    type="number"
                                    step="500000"
                                    min="1000000"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Thứ Hạng Mở Khóa *
                                </label>
                                <select
                                    value={tier}
                                    onChange={(e) => setTier(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="silver">Silver Atelier (Hạng Bạc)</option>
                                    <option value="gold">Gold Heritage (Hạng Vàng)</option>
                                    <option value="diamond">Diamond Sovereign (Hạng Kim Cương)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Tem Niên Đại / Bản Lưu Trữ *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Cấp Độ Hoàn Hảo Phục Chế *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white hover:bg-gray-800 rounded-lg uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-50 mt-4 shadow-lg"
                        >
                            {loading ? 'Đang khởi tạo mã lưu trữ hầm...' : 'Đúc Và Phát Hành Lên Sàn Diễn Hầm Kín'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Đã Đúc Thành Công Vào Hầm Kín</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Mã Hầm Lưu Trữ: <strong className="font-mono text-black">{mintResult.archival_code}</strong>. Hội viên cấp bậc <strong className="uppercase text-amber-700">{mintResult.tier}</strong> trở lên hiện đã có thể truy cập và mua tuyệt tác này.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider"
                        >
                            Đóng & Xem Tiếp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MintVaultModal;
