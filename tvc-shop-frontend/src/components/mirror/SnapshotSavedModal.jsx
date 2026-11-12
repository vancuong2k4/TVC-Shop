import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';

const SnapshotSavedModal = ({ item, snapshot, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.origin + '/virtual-mirror?ref=' + snapshot?.snapshot_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 text-white shadow-2xl p-6 text-center">
                {/* Visual badge */}
                <div className="w-16 h-16 rounded-full border border-amber-400/40 bg-amber-950/20 text-amber-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                </div>

                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block mb-1">
                    AR Snapshot Secured
                </span>
                <h3 className="text-xl font-serif text-white mb-2">Đã Lưu Khoảnh Khắc Thử Đồ Ảo</h3>
                <p className="text-xs text-zinc-400 font-light mb-6">
                    Bản ghi khoảnh khắc phối phụ kiện của Quý khách đã được định danh và lưu vào Hồ sơ cá nhân.
                </p>

                {/* Details box */}
                <div className="p-4 bg-black/60 border border-zinc-900 text-left font-mono text-[11px] space-y-2 mb-6">
                    <div className="flex justify-between text-zinc-400">
                        <span>Mã Khoảnh Khắc:</span>
                        <span className="text-amber-400 font-bold">{snapshot?.snapshot_code}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                        <span>Phụ Kiện Thử:</span>
                        <span className="text-white truncate max-w-[180px]">{item?.name}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                        <span>Giá Niêm Yết:</span>
                        <span className="text-zinc-200">{formatPrice(item?.price)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 text-[10px] pt-1 border-t border-zinc-900">
                        <span>Bảo Chứng Mật Mã:</span>
                        <span className="truncate max-w-[140px]">{snapshot?.hash}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <button
                        onClick={handleShare}
                        className="w-full py-2.5 bg-white text-black hover:bg-zinc-200 uppercase tracking-widest text-xs font-medium transition-all"
                    >
                        {copied ? 'Đã sao chép liên kết chia sẻ!' : 'Sao Chép Liên Kết Thử Đồ'}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 border border-zinc-800 text-zinc-400 hover:text-white uppercase tracking-widest text-xs font-light transition-all"
                    >
                        Tiếp Tục Thử Mẫu Khác
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SnapshotSavedModal;
