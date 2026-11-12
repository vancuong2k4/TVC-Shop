import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';

const ProvenanceDeedCard = ({ asset, onInitiateTransfer }) => {
    const [copiedHash, setCopiedHash] = useState(false);

    const handleCopyHash = () => {
        navigator.clipboard.writeText(asset.blockchain_hash);
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
    };

    return (
        <div className="border border-zinc-800 bg-zinc-950/80 p-6 flex flex-col justify-between transition-all hover:border-amber-400/50 shadow-2xl relative overflow-hidden group">
            {/* Top Deed ID & Status */}
            <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                            {asset.deed_id}
                        </span>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-950/20">
                        {asset.authenticity_status}
                    </span>
                </div>

                {/* Asset Visual & Info */}
                <div className="flex space-x-4 mb-4">
                    <img
                        src={asset.image}
                        alt={asset.title}
                        className="w-24 h-32 object-cover border border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-amber-400 block mb-1">
                            Serial: {asset.serial_number}
                        </span>
                        <h3 className="text-base font-serif text-white leading-snug truncate mb-1">
                            {asset.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400 font-light line-clamp-2 mb-2">
                            {asset.fabric}
                        </p>
                        <div className="text-[10px] font-mono text-zinc-500">
                            <span>Chủ sở hữu hiện tại: </span>
                            <span className="text-zinc-300 block font-sans truncate">{asset.current_owner}</span>
                        </div>
                    </div>
                </div>

                {/* Valuation & Ledger Hash */}
                <div className="p-3 bg-black/60 border border-zinc-900 text-xs mb-4 space-y-1.5">
                    <div className="flex justify-between items-baseline font-mono text-[11px]">
                        <span className="text-zinc-500">Định Giá Giám Định:</span>
                        <span className="text-white font-serif font-bold text-sm">{formatPrice(asset.appraised_value)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-900">
                        <span>Ledger TX:</span>
                        <button 
                            onClick={handleCopyHash}
                            className="text-amber-400 hover:text-amber-300 truncate max-w-[140px] text-right underline"
                            title="Bấm để sao chép mã băm chuỗi khối"
                        >
                            {copiedHash ? 'Đã chép!' : asset.blockchain_hash}
                        </button>
                    </div>
                </div>

                {/* Transferable Perks */}
                <div className="mb-4">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-1.5">
                        Quyền Lợi Di Sản Sẽ Chuyển Giao:
                    </span>
                    <ul className="text-[11px] text-zinc-400 font-light space-y-1 list-disc list-inside">
                        {asset.perks_transferable.map((p, idx) => (
                            <li key={idx} className="line-clamp-1">{p}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Action button */}
            <div className="pt-3 border-t border-zinc-900">
                <button
                    onClick={() => onInitiateTransfer(asset)}
                    className="w-full py-2.5 bg-white text-black hover:bg-amber-300 hover:text-black uppercase tracking-[0.2em] text-[10px] font-medium transition-all flex items-center justify-center space-x-1.5"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Ký Chuyển Nhượng Cho Người Thừa Kế</span>
                </button>
            </div>
        </div>
    );
};

export default ProvenanceDeedCard;
