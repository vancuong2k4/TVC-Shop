import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';

const VaultItemCard = ({ item, userTier, onAcquire }) => {
    const tierPriority = { bronze: 1, silver: 2, gold: 3, diamond: 4 };
    const userLevel = tierPriority[userTier] || 1;
    const requiredLevel = tierPriority[item.required_tier] || 2;
    const isUnlocked = userLevel >= requiredLevel;

    return (
        <div className={`relative group border transition-all duration-500 flex flex-col justify-between ${
            isUnlocked 
                ? 'border-zinc-800 bg-zinc-950/80 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-950/20' 
                : 'border-zinc-900 bg-black/60 opacity-75 backdrop-blur-sm'
        }`}>
            {/* Top Status & Tier Tag */}
            <div className="p-6 pb-0 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'}`}></span>
                    <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-zinc-400">
                        {item.code}
                    </span>
                </div>
                <div className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] font-medium border ${
                    item.required_tier === 'diamond' 
                        ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20' 
                        : item.required_tier === 'gold' 
                        ? 'border-amber-500/30 text-amber-400 bg-amber-950/20' 
                        : 'border-zinc-500/30 text-zinc-300 bg-zinc-900/40'
                }`}>
                    Requires {item.required_tier}
                </div>
            </div>

            {/* Product Visual */}
            <div className="relative overflow-hidden aspect-[4/5] mx-6 my-4 bg-zinc-900">
                <img 
                    src={item.image} 
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                        isUnlocked ? 'group-hover:scale-105' : 'filter grayscale contrast-125'
                    }`}
                />
                
                {/* Year Stamp */}
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 border border-zinc-800 text-[10px] font-mono tracking-widest text-zinc-300">
                    {item.year}
                </div>

                {/* Scarcity Counter */}
                <div className="absolute top-3 right-3 bg-red-950/80 backdrop-blur-md px-2.5 py-1 border border-red-800/40 text-[10px] font-mono tracking-widest text-red-300">
                    Còn {item.stock_left}/{item.total_produced} bản
                </div>

                {/* Locked Shield Overlay */}
                {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center mb-3 text-zinc-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-xs uppercase tracking-widest font-serif text-zinc-300 mb-1">Quyền truy cập bị khóa</p>
                        <p className="text-[11px] text-zinc-500 font-light max-w-[200px]">
                            Dành riêng cho thứ hạng {item.required_tier.toUpperCase()} trở lên
                        </p>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="px-6 pb-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-serif text-white tracking-wide mb-2 line-clamp-1 group-hover:text-amber-200 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                    </p>

                    <div className="space-y-1.5 py-3 border-t border-b border-zinc-900 text-[11px] font-light">
                        <div className="flex items-start text-zinc-400">
                            <span className="text-zinc-600 w-16 shrink-0 uppercase tracking-wider text-[9px]">Chất liệu:</span>
                            <span className="text-zinc-300">{item.fabric}</span>
                        </div>
                        <div className="flex items-start text-zinc-400">
                            <span className="text-zinc-600 w-16 shrink-0 uppercase tracking-wider text-[9px]">Phụ kiện:</span>
                            <span className="text-zinc-300">{item.hardware}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-2">
                    <div className="flex items-baseline justify-between mb-4">
                        <div>
                            <span className="text-[9px] uppercase tracking-widest text-zinc-500 block">Đặc quyền Hầm Kín</span>
                            <span className="text-lg font-serif text-amber-400 font-semibold tracking-wide">
                                {formatPrice(item.vault_price)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] uppercase tracking-widest text-zinc-600 block line-through">Giá niêm yết</span>
                            <span className="text-xs font-mono text-zinc-500 line-through">
                                {formatPrice(item.price)}
                            </span>
                        </div>
                    </div>

                    {isUnlocked ? (
                        <button
                            onClick={() => onAcquire(item)}
                            className="w-full py-3 bg-white text-black hover:bg-amber-300 hover:text-black transition-all uppercase tracking-[0.2em] text-[11px] font-medium flex items-center justify-center space-x-2"
                        >
                            <span>Yêu cầu mở khóa báu vật</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-600 uppercase tracking-[0.2em] text-[10px] font-medium cursor-not-allowed"
                        >
                            Chưa đủ điều kiện xếp hạng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VaultItemCard;
