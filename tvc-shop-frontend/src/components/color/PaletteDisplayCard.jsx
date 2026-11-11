import React, { useState } from 'react';

const PaletteDisplayCard = ({ palette, isSelected, onSelect }) => {
    const [copiedColor, setCopiedColor] = useState(null);

    const handleCopyHex = (hex, name) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(name);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className={`p-6 border transition-all duration-500 flex flex-col justify-between ${
            isSelected 
                ? 'border-white bg-zinc-950 shadow-2xl ring-1 ring-white/20' 
                : 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700'
        }`}>
            {/* Header info */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                        {palette.code}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-zinc-800 text-zinc-300">
                        {palette.undertone}
                    </span>
                </div>

                <h3 className="text-xl font-serif text-white tracking-wide mb-1">
                    {palette.season}
                </h3>
                <p className="text-xs text-zinc-400 font-light italic mb-4">
                    "{palette.tagline}"
                </p>

                {/* Swatches Visual Matrix */}
                <div className="mb-6 space-y-2">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 block">
                        Bảng 5 Sắc Độ Di Sản (Bấm để copy mã Hex)
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 h-16">
                        {palette.hex_colors.map((color, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleCopyHex(color.hex, color.name)}
                                title={`${color.name} (${color.hex}): ${color.role}`}
                                style={{ backgroundColor: color.hex }}
                                className="group relative rounded-sm h-full w-full transition-transform hover:scale-105 hover:z-10 focus:outline-none border border-white/10"
                            >
                                <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] font-mono text-white">
                                    {color.hex}
                                </span>
                            </button>
                        ))}
                    </div>
                    {copiedColor && (
                        <p className="text-[10px] text-emerald-400 font-mono text-center">
                            Đã sao chép mã màu: {copiedColor}
                        </p>
                    )}
                </div>

                {/* Swatch Details List */}
                <div className="space-y-2 py-3 border-t border-b border-zinc-900 text-[11px]">
                    {palette.hex_colors.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-zinc-400">
                            <div className="flex items-center space-x-2 truncate">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: c.hex }}></span>
                                <span className="text-zinc-200 truncate">{c.name}</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-light truncate max-w-[130px]">{c.role}</span>
                        </div>
                    ))}
                </div>

                {/* Contrast & Guidelines */}
                <div className="mt-4 space-y-2 text-xs">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Độ tương phản khuyên dùng:</span>
                        <p className="text-zinc-300 font-light">{palette.contrast}</p>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Chỉ dẫn phối vải & may đo:</span>
                        <p className="text-zinc-400 text-[11px] font-light leading-relaxed">{palette.style_guidelines}</p>
                    </div>
                </div>
            </div>

            {/* Avoid colors & Select Action */}
            <div className="mt-6 pt-4 border-t border-zinc-900">
                <div className="mb-4">
                    <span className="text-[9px] uppercase tracking-widest text-rose-400 block mb-1">Cần tránh / Giảm thiểu:</span>
                    <div className="flex flex-wrap gap-1.5">
                        {palette.avoid_colors.map((ac, idx) => (
                            <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-rose-950/30 text-rose-300 border border-rose-900/40">
                                {ac}
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => onSelect(palette)}
                    className={`w-full py-2.5 uppercase tracking-[0.2em] text-[10px] font-medium transition-all ${
                        isSelected 
                            ? 'bg-white text-black' 
                            : 'border border-zinc-800 text-zinc-300 hover:border-white hover:text-white'
                    }`}
                >
                    {isSelected ? 'Đang kích hoạt bảng màu này' : 'Chọn áp dụng bộ sắc độ này'}
                </button>
            </div>
        </div>
    );
};

export default PaletteDisplayCard;
