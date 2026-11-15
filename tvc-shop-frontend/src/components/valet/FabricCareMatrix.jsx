import React from 'react';
import { ShieldCheck, Wind, Droplets, Thermometer, Box, AlertTriangle, Sparkles } from 'lucide-react';

const FabricCareMatrix = ({ protocols = [], selectedProtocol, onSelectProtocol }) => {
    if (!protocols.length) return null;

    const current = selectedProtocol || protocols[0];

    return (
        <div className="space-y-6">
            {/* Material Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {protocols.map((p) => {
                    const isSelected = current.id === p.id;
                    return (
                        <button
                            key={p.id}
                            onClick={() => onSelectProtocol(p)}
                            className={`p-3.5 text-left border rounded-sm transition flex flex-col justify-between ${
                                isSelected
                                    ? 'border-amber-400 bg-zinc-900/90 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                            }`}
                        >
                            <span className="text-[10px] font-mono uppercase text-zinc-500 mb-1">Material Guild</span>
                            <span className="text-xs font-serif font-medium leading-tight">{p.materialName}</span>
                        </button>
                    );
                })}
            </div>

            {/* Protocol Detail Dossier Card */}
            <div className="border border-zinc-800 bg-zinc-950/80 p-6 rounded-sm shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-4 gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-mono uppercase tracking-widest text-amber-300">
                                Atelier Preservation Standard
                            </span>
                        </div>
                        <h3 className="text-xl font-serif text-white mt-1">{current.materialName}</h3>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">{current.composition}</p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-sm font-mono text-[11px] text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Certified 100-Year Longevity</span>
                    </div>
                </div>

                {/* 4 Pillars of Wardrobe Care */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Steaming & Heat */}
                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-sm space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-300">
                            <Thermometer className="w-4 h-4 text-amber-400" />
                            <span>Steaming & Thermal Protocol</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-medium">{current.steamingTemp}</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Always steam vertically with mineral-free distilled vapor. Direct iron soleplate contact flattens fiber hair and damages natural cloth loft.
                        </p>
                    </div>

                    {/* Washing & Solvents */}
                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-sm space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-300">
                            <Droplets className="w-4 h-4 text-cyan-400" />
                            <span>Cleansing & Ecological Solvents</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-medium">{current.washingMethod}</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Strictly avoid petroleum-derived perchlorethylene dry cleaning which strips natural lanolin and silk sericin proteins.
                        </p>
                    </div>

                    {/* Anatomical Hangers */}
                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-sm space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-300">
                            <Box className="w-4 h-4 text-emerald-400" />
                            <span>Hanger Geometry & Rest Cadence</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-medium">{current.hangerRequirement}</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Rest 24 hours between wearings. Anatomically correct shoulder pads preserve roll-lines and prevent canvas collar sagging.
                        </p>
                    </div>

                    {/* Brushing & Climate */}
                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-sm space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-300">
                            <Wind className="w-4 h-4 text-rose-400" />
                            <span>Brushing Technique & Microclimate</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-medium">{current.brushingTechnique}</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Storage atmosphere: {current.storageClimate}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FabricCareMatrix;
