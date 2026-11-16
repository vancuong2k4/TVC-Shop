import React from 'react';
import { Plane, ShieldCheck, Clock, MapPin, Car, ArrowRight, Sparkles } from 'lucide-react';

const AviationHubCard = ({ hub, onSelectHub }) => {
    if (!hub) return null;

    return (
        <div className="border border-zinc-800 bg-zinc-950/90 rounded-sm overflow-hidden flex flex-col justify-between hover:border-cyan-400/80 transition-all duration-300 group shadow-xl">
            {/* Hub Terminal Photography */}
            <div className="relative aspect-[16/9] overflow-hidden bg-black">
                <img 
                    src={hub.image} 
                    alt={hub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                
                {/* ICAO Code Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-[10px] font-mono uppercase tracking-widest rounded-sm">
                        {hub.icao} • {hub.city}
                    </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono flex items-center gap-1.5 rounded-sm">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{hub.clearanceTimeMin} min Clearance</span>
                </div>
            </div>

            {/* Hub Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                    <h3 className="text-base font-serif font-medium text-white group-hover:text-cyan-300 transition-colors">
                        {hub.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                        {hub.terminal}
                    </p>
                </div>

                <div className="p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-sm space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300 font-mono text-[11px]">
                        <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{hub.limousineFleet}</span>
                    </div>
                    <div className="flex items-start gap-2 text-zinc-400 text-[11px] leading-relaxed">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{hub.atelierService}</span>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={() => onSelectHub(hub)}
                        className="w-full py-2.5 bg-zinc-900 hover:bg-cyan-400 hover:text-black border border-zinc-700 hover:border-cyan-400 text-white transition-all text-xs font-mono font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 rounded-sm"
                    >
                        <span>Book Tarmac Escort</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AviationHubCard;
