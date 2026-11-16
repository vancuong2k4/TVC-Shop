import React from 'react';
import { ShieldCheck, Clock, Award, Lock, ArrowUpRight, Flame, Eye } from 'lucide-react';

const AuctionLotCard = ({ lot, onSelectLot }) => {
    if (!lot) return null;

    return (
        <div className="border border-zinc-800 bg-zinc-950/90 rounded-sm overflow-hidden flex flex-col justify-between hover:border-amber-400/80 transition-all duration-300 group shadow-xl">
            {/* Lot Hero Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <img 
                    src={lot.heroImage} 
                    alt={lot.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                
                {/* Status Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[10px] font-mono uppercase tracking-widest rounded-sm">
                        {lot.edition}
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-900/90 text-zinc-300 text-[10px] font-mono uppercase rounded-sm border border-zinc-700">
                        {lot.id}
                    </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono flex items-center gap-1.5 rounded-sm">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Sealed Vickrey Escrow</span>
                </div>
            </div>

            {/* Lot Details */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                        {lot.collection}
                    </span>
                    <h3 className="text-lg font-serif font-medium text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {lot.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono line-clamp-2">
                        {lot.material}
                    </p>
                </div>

                <div className="p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-sm text-[11px] text-zinc-400 space-y-1">
                    <div className="text-zinc-500 font-mono text-[10px] uppercase">Curator Provenance:</div>
                    <p className="line-clamp-2 italic text-zinc-300 font-serif">"{lot.curatorProvenance}"</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-900">
                    <div className="flex justify-between items-baseline text-xs font-mono">
                        <span className="text-zinc-500 uppercase">Minimum Reserve:</span>
                        <span className="text-sm font-bold text-amber-300">
                            {Number(lot.minimumReserveVnd).toLocaleString('vi-VN')} ₫
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1 text-zinc-500">
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> Closes: {lot.biddingClosesAt.slice(0, 10)}
                        </span>
                        <span className="text-cyan-400">{lot.currentBidsCount} sealed bids committed</span>
                    </div>

                    <button
                        onClick={() => onSelectLot(lot)}
                        className="w-full py-3 bg-zinc-900 hover:bg-amber-400 hover:text-black border border-zinc-700 hover:border-amber-400 text-white transition-all text-xs font-mono font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 rounded-sm"
                    >
                        <span>Submit Encrypted Sealed Bid</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuctionLotCard;
