import React from 'react';

const AtelierCartographyMap = ({ ateliers, selectedAtelier, onSelect }) => {
    return (
        <div className="border border-zinc-900 bg-zinc-950/80 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-0.5">
                        Global Master Tailoring Cartography
                    </span>
                    <h3 className="text-lg font-serif text-white">Mạng Lưới Xưởng May Đo Di Sản Toàn Cầu</h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                    5 Điểm Tụ Tinh Hoa Thế Giới
                </span>
            </div>

            {/* Stylized Node Map Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                {ateliers.map((atl) => {
                    const isSelected = selectedAtelier?.id === atl.id;
                    return (
                        <button
                            key={atl.id}
                            onClick={() => onSelect(atl)}
                            className={`p-3.5 border text-left transition-all relative ${
                                isSelected 
                                    ? 'border-amber-400 bg-amber-950/20 shadow-lg ring-1 ring-amber-400/30' 
                                    : 'border-zinc-800/80 bg-black/60 hover:border-zinc-700'
                            }`}
                        >
                            <div className="flex items-center space-x-1.5 mb-1.5">
                                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'}`}></span>
                                <span className="text-[10px] font-mono uppercase text-zinc-400">{atl.country}</span>
                            </div>
                            <h4 className="text-xs font-serif text-white font-medium truncate mb-1">{atl.city}</h4>
                            <p className="text-[10px] text-zinc-500 font-light truncate">{atl.specialty}</p>
                        </button>
                    );
                })}
            </div>

            {/* Selected Atelier Detail Card */}
            {selectedAtelier && (
                <div className="p-5 border border-zinc-900 bg-black/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[10px] font-mono text-amber-400 uppercase">Trưởng Xưởng Nghệ Nhân:</span>
                            <span className="text-xs font-serif text-white font-semibold">{selectedAtelier.head_artisan}</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-light">
                            Chuyên môn độc quyền: <strong className="text-amber-200">{selectedAtelier.specialty}</strong>
                        </p>
                    </div>

                    <div className="text-left md:text-right font-mono text-xs text-zinc-400 shrink-0">
                        <span className="text-[10px] text-zinc-500 uppercase block">Năng suất tiếp nhận:</span>
                        <span className="text-emerald-400 font-medium">{selectedAtelier.current_capacity}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AtelierCartographyMap;
