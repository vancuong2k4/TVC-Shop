import React from 'react';
import { formatPrice } from '../../utils/formatPrice';

const SwatchBoxCard = ({ boxKey, data, onOrder }) => {
    return (
        <div className="border border-zinc-800 bg-zinc-950/80 p-6 flex flex-col justify-between transition-all hover:border-amber-400/50 shadow-2xl group">
            <div>
                {/* Header Origin & ID */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400">
                        {data.origin}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                        {data.box_id}
                    </span>
                </div>

                {/* Visual Image */}
                <div className="relative aspect-[16/9] overflow-hidden mb-4 border border-zinc-900 bg-black">
                    <img
                        src={data.image}
                        alt={data.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-2.5 left-3 text-[10px] font-mono text-white bg-black/70 px-2 py-0.5 border border-zinc-800 backdrop-blur-sm">
                        Gồm 6 mẫu vải thật 15x15cm
                    </span>
                </div>

                <h3 className="text-lg font-serif text-white mb-2 leading-snug">
                    {data.title}
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                    {data.description}
                </p>

                {/* Swatches Color/Weight List */}
                <div className="space-y-2 mb-6">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-2">
                        Chi Tiết 6 Mẫu Vải Kèm Theo:
                    </span>
                    {data.swatches.map((sw, idx) => (
                        <div key={idx} className="p-2.5 bg-black/60 border border-zinc-900 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2.5 truncate">
                                <span 
                                    className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" 
                                    style={{ backgroundColor: sw.color }}
                                ></span>
                                <div className="truncate">
                                    <p className="text-white truncate font-medium text-[11px]">{sw.name}</p>
                                    <p className="text-[10px] text-zinc-500 font-light truncate">{sw.texture}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono text-amber-300 shrink-0 ml-2">{sw.weight}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-900">
                <div className="flex items-baseline justify-between mb-3">
                    <div>
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 block">Phí Cọc Hộp Sơn Mài</span>
                        <span className="text-base font-serif text-white font-bold">
                            {formatPrice(data.deposit_fee)}
                        </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">
                        Hoàn 100% bằng voucher
                    </span>
                </div>

                <button
                    onClick={() => onOrder(data)}
                    className="w-full py-3 bg-white text-black hover:bg-amber-300 uppercase tracking-[0.2em] text-[10px] font-semibold transition-all flex items-center justify-center space-x-2 shadow-xl"
                >
                    <span>Yêu Cầu Giao Hộp Vải Tận Nhà</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SwatchBoxCard;
