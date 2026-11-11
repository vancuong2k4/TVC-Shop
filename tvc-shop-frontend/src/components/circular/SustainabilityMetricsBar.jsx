import React from 'react';

const SustainabilityMetricsBar = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border border-zinc-900 bg-zinc-950/60 backdrop-blur-md">
            <div className="text-center p-3 border-r border-zinc-900 last:border-r-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                    Trang phục được tái sinh
                </span>
                <span className="text-xl md:text-2xl font-serif text-white font-bold">
                    {stats?.total_items_recycled?.toLocaleString() || '418'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">Mảnh ghép di sản</span>
            </div>

            <div className="text-center p-3 border-r border-zinc-900 last:border-r-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                    Lượng CO₂ cắt giảm
                </span>
                <span className="text-xl md:text-2xl font-serif text-emerald-400 font-bold">
                    {stats?.co2_saved_kg?.toLocaleString() || '12,450'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">kg CO₂e tương đương</span>
            </div>

            <div className="text-center p-3 border-r border-zinc-900 last:border-r-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                    Nước sạch bảo tồn
                </span>
                <span className="text-xl md:text-2xl font-serif text-cyan-400 font-bold">
                    {stats?.water_saved_liters?.toLocaleString() || '840,000'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">Lít nước sinh thái</span>
            </div>

            <div className="text-center p-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                    Sản phẩm trong Archive
                </span>
                <span className="text-xl md:text-2xl font-serif text-amber-400 font-bold">
                    {stats?.active_archival_listings || '24'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">Đang niêm yết bán</span>
            </div>
        </div>
    );
};

export default SustainabilityMetricsBar;
