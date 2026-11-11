import React from 'react';
import { formatPrice } from '../../utils/formatPrice';

const FragranceCard = ({ familyKey, data, isSelected, onSelect, onOrderSample }) => {
    return (
        <div className={`p-6 border transition-all duration-500 flex flex-col justify-between ${
            isSelected 
                ? 'border-amber-400/80 bg-zinc-950 shadow-2xl ring-1 ring-amber-400/30' 
                : 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700'
        }`}>
            {/* Header info */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400">
                        Haute Parfumerie
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-zinc-800 text-zinc-400">
                        Extrait de Parfum
                    </span>
                </div>

                <h3 className="text-xl font-serif text-white tracking-wide mb-1">
                    {data.signature_scent}
                </h3>
                <p className="text-xs text-amber-200/80 font-mono mb-2">
                    {data.name}
                </p>
                <p className="text-xs text-zinc-400 font-light italic leading-relaxed mb-4">
                    "{data.vibe}"
                </p>

                <p className="text-[11px] text-zinc-400 font-light leading-relaxed mb-4">
                    {data.description}
                </p>

                {/* Olfactory Pyramids / Notes */}
                <div className="mb-4 pt-3 border-t border-zinc-900">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-2">
                        Tầng Hương Cốt Lõi (Key Olfactory Notes):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {data.key_notes.map((note, idx) => (
                            <span 
                                key={idx}
                                className="text-[10px] font-light px-2.5 py-1 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-sm"
                            >
                                {note}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Sillage & Pairing */}
                <div className="space-y-2 py-3 border-t border-b border-zinc-900 text-[11px]">
                    <div className="flex items-start text-zinc-400">
                        <span className="text-zinc-600 w-20 shrink-0 uppercase tracking-wider text-[9px]">Độ lưu tỏa:</span>
                        <span className="text-zinc-300">{data.sillage}</span>
                    </div>
                    <div className="flex items-start text-zinc-400">
                        <span className="text-zinc-600 w-20 shrink-0 uppercase tracking-wider text-[9px]">Gợi ý phối đồ:</span>
                        <span className="text-amber-300/90 font-light">{data.best_paired_with}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Actions & Price */}
            <div className="mt-6 pt-2">
                <div className="flex items-baseline justify-between mb-4">
                    <div>
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 block">Chai 100ml Full-Size</span>
                        <span className="text-lg font-serif text-white font-semibold">
                            {formatPrice(data.price)}
                        </span>
                    </div>
                    <button
                        onClick={() => onOrderSample(data)}
                        className="text-[10px] uppercase font-mono tracking-wider text-amber-400 hover:text-amber-300 underline underline-offset-4"
                    >
                        Thử mẫu 3x5ml (450K)
                    </button>
                </div>

                <button
                    onClick={() => onSelect(familyKey)}
                    className={`w-full py-2.5 uppercase tracking-[0.2em] text-[10px] font-medium transition-all ${
                        isSelected 
                            ? 'bg-amber-400 text-black font-semibold' 
                            : 'border border-zinc-800 text-zinc-300 hover:border-white hover:text-white'
                    }`}
                >
                    {isSelected ? 'Đang chọn làm mùi hương đại diện' : 'Chọn làm mùi hương bản sắc'}
                </button>
            </div>
        </div>
    );
};

export default FragranceCard;
