import React from 'react';
import { TrendingDown, ShieldCheck, DollarSign, Sparkles, Clock, RefreshCw } from 'lucide-react';

const CostPerWearMatrix = ({
    summary,
    timeline = [],
    garmentName = 'Archival Garment',
    materialGrade = 'Heritage Grade'
}) => {
    if (!summary) return null;

    return (
        <div className="space-y-8">
            {/* Top Key Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 p-5 rounded-sm shadow-lg">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider">True Cost Per Wear</span>
                        <TrendingDown className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono text-emerald-400 font-bold">
                        {Number(summary.cost_per_wear).toLocaleString('vi-VN')} ₫
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2 font-mono">
                        Across {summary.total_wears} projected wears
                    </p>
                </div>

                <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 p-5 rounded-sm shadow-lg">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider">Projected Resale Value</span>
                        <RefreshCw className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono text-amber-300 font-bold">
                        {Number(summary.projected_resale_value).toLocaleString('vi-VN')} ₫
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2 font-mono">
                        TVC Circular Buyback Guarantee
                    </p>
                </div>

                <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 p-5 rounded-sm shadow-lg">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider">Fast-Fashion Waste Alt</span>
                        <Clock className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono text-zinc-300 font-bold">
                        {Number(summary.fast_fashion_cost_per_wear).toLocaleString('vi-VN')} ₫
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2 font-mono">
                        Total waste: {Number(summary.fast_fashion_total).toLocaleString('vi-VN')} ₫
                    </p>
                </div>

                <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 p-5 rounded-sm shadow-lg">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider">Net Wealth Saved</span>
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className={`text-2xl sm:text-3xl font-mono font-bold ${summary.net_savings >= 0 ? 'text-cyan-300' : 'text-zinc-400'}`}>
                        {Number(summary.net_savings).toLocaleString('vi-VN')} ₫
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2 font-mono">
                        {summary.is_profitable_luxury_investment ? '✓ Surplus Luxury Asset' : 'Equitable Amortization'}
                    </p>
                </div>
            </div>

            {/* Amortization Timeline Progression Table */}
            <div className="border border-zinc-800 bg-zinc-950/80 rounded-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-zinc-200 font-mono">
                            Multi-Year Value Preservation Trajectory
                        </h4>
                        <span className="text-[11px] text-zinc-500">{garmentName} • {materialGrade}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">Certified Archival Durability</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                        <thead>
                            <tr className="border-b border-zinc-900 bg-black/60 text-zinc-400 uppercase tracking-wider text-[10px]">
                                <th className="px-5 py-3">Lifespan Milestone</th>
                                <th className="px-5 py-3">Cumulative Wears</th>
                                <th className="px-5 py-3">Total Investment Inc. Care</th>
                                <th className="px-5 py-3">Effective Cost / Day</th>
                                <th className="px-5 py-3 text-right">Amortization Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                            {timeline.map((point) => (
                                <tr key={point.year} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-white flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80"></span>
                                        Year {point.year}
                                    </td>
                                    <td className="px-5 py-3.5 text-zinc-300">
                                        {point.cumulativeWears} times
                                    </td>
                                    <td className="px-5 py-3.5 text-zinc-400">
                                        {Number(point.cumulativeCost).toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td className="px-5 py-3.5 text-emerald-400 font-semibold">
                                        {Number(point.costPerWear).toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td className="px-5 py-3.5 text-right text-zinc-500 text-[11px]">
                                        {point.year === 1 
                                            ? 'Initial Acquisition' 
                                            : point.year >= 5 
                                            ? 'Heirloom Invariance' 
                                            : 'Steep Amortization'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CostPerWearMatrix;
