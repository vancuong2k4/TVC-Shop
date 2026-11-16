import React from 'react';
import { Sparkles, Sun, Eye, Layers, ShieldCheck, Flame, Camera } from 'lucide-react';

const CrystalCanvas = ({
    crystals = [],
    environments = [],
    silhouettes = [],
    selectedCrystal,
    onSelectCrystal,
    selectedEnvironment,
    onSelectEnvironment,
    selectedSilhouette,
    onSelectSilhouette,
    luxIntensity = 100,
    onLuxIntensityChange
}) => {
    const currentEnv = selectedEnvironment || environments[0];
    const currentCrystal = selectedCrystal || crystals[0];
    const currentSil = selectedSilhouette || silhouettes[0];

    // Compute dynamic glow effect based on crystal and lighting environment
    const getGlowColor = () => {
        if (currentCrystal?.id === 'swarovski-aurora-borealis') {
            return currentEnv?.id === 'cannes-red-carpet-flash' 
                ? 'rgba(147, 197, 253, 0.8), rgba(244, 114, 182, 0.7), rgba(251, 191, 36, 0.8)' 
                : 'rgba(192, 132, 252, 0.6), rgba(96, 165, 250, 0.6)';
        }
        if (currentCrystal?.id === 'vintage-champagne-crystal') {
            return 'rgba(251, 191, 36, 0.8), rgba(217, 119, 6, 0.5)';
        }
        if (currentCrystal?.id === 'jet-hematite-noir') {
            return 'rgba(148, 163, 184, 0.4), rgba(71, 85, 105, 0.8)';
        }
        return 'rgba(226, 232, 240, 0.9), rgba(255, 255, 255, 0.9)';
    };

    return (
        <div className="space-y-8">
            {/* Live Interactive Photometric Simulator Canvas */}
            <div 
                className="relative border border-zinc-800 rounded-sm overflow-hidden p-8 text-center shadow-2xl transition-colors duration-700 min-h-[420px] flex flex-col justify-between"
                style={{ backgroundColor: currentEnv?.bgHex || '#0a0a0c' }}
            >
                {/* Header Ambient Info */}
                <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                        <span className="text-zinc-300 uppercase tracking-widest text-[10px]">
                            {currentEnv?.name} ({currentEnv?.kelvin})
                        </span>
                    </div>
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px]">
                        Dispersion: {currentCrystal?.refractionIndex}
                    </span>
                </div>

                {/* Silhouette & Dynamic Crystal Particle Spray */}
                <div className="py-12 relative flex items-center justify-center">
                    {/* Background Radial Light Source */}
                    <div 
                        className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700"
                        style={{
                            background: currentEnv?.id === 'cannes-red-carpet-flash'
                                ? 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(59,130,246,0.1) 70%, transparent 100%)'
                                : currentEnv?.id === 'venetian-candlelight-soiree'
                                ? 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(180,83,9,0.08) 70%, transparent 100%)'
                                : 'radial-gradient(circle, rgba(253,230,138,0.18) 0%, rgba(0,0,0,0) 70%)',
                            transform: `scale(${luxIntensity / 80})`
                        }}
                    />

                    {/* Architectural Silhouette Visual */}
                    <div className="relative z-10 max-w-sm mx-auto p-6 rounded border border-white/10 bg-black/40 backdrop-blur-md text-center space-y-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                            {currentSil?.title}
                        </div>
                        
                        {/* Shimmering Crystal Meridian Line */}
                        <div className="relative py-6 flex justify-center items-center gap-2 flex-wrap max-w-xs mx-auto">
                            {[...Array(14)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="w-3.5 h-3.5 rotate-45 border border-white/40 transition-all duration-500 hover:scale-150 cursor-pointer"
                                    style={{
                                        background: `radial-gradient(circle, #fff 10%, ${currentCrystal?.id === 'jet-hematite-noir' ? '#1e293b' : '#fef08a'} 90%)`,
                                        boxShadow: `0 0 ${12 + (i % 3) * 6}px ${getGlowColor()}`,
                                        animation: `pulse ${(1.2 + (i % 5) * 0.3)}s infinite alternate ease-in-out`
                                    }}
                                />
                            ))}
                        </div>

                        <p className="text-xs text-zinc-300 font-serif italic">
                            "{currentEnv?.vibe}"
                        </p>
                    </div>
                </div>

                {/* Footer Canvas Control Bar */}
                <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-400 gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-[10px] uppercase text-zinc-500 whitespace-nowrap">Luminance Beam:</span>
                        <input
                            type="range"
                            min={40}
                            max={160}
                            value={luxIntensity}
                            onChange={(e) => onLuxIntensityChange(Number(e.target.value))}
                            className="w-full sm:w-36 accent-amber-400 bg-zinc-800 cursor-pointer"
                        />
                        <span className="text-amber-300 text-[11px]">{luxIntensity}%</span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] uppercase">
                        <span>Beading Density: {currentSil?.crystalDensity?.split(' ')[0]} gems</span>
                        <span className="text-emerald-400 font-semibold">{currentSil?.artisanHours}</span>
                    </div>
                </div>
            </div>

            {/* Lighting Environment Selector */}
            <div className="space-y-3">
                <span className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    1. Select Architectural Gala Lighting Scenario
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {environments.map((env) => {
                        const isSelected = currentEnv?.id === env.id;
                        return (
                            <button
                                key={env.id}
                                onClick={() => onSelectEnvironment(env)}
                                className={`p-4 text-left border rounded-sm transition flex flex-col justify-between ${
                                    isSelected
                                        ? 'border-amber-400 bg-zinc-900/90 text-white shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                }`}
                            >
                                <span className="text-[10px] font-mono uppercase text-zinc-500 mb-1">{env.intensityLux}</span>
                                <span className="text-xs font-serif font-medium text-white mb-2">{env.name}</span>
                                <span className="text-[11px] font-mono text-amber-300/80">{env.kelvin}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Crystal Faceting & Grade Selection */}
            <div className="space-y-3">
                <span className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    2. Select Haute Joaillerie Crystal Grade
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {crystals.map((c) => {
                        const isSelected = currentCrystal?.id === c.id;
                        return (
                            <div
                                key={c.id}
                                onClick={() => onSelectCrystal(c)}
                                className={`cursor-pointer p-5 border rounded-sm transition-all ${
                                    isSelected
                                        ? 'border-amber-400 bg-zinc-900/90 shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                                        : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-serif font-medium text-white">{c.name}</h4>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300">
                                        Index {c.sparkleIntensity}/100
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 mb-2 font-mono">{c.cut} • {c.coating}</p>
                                <p className="text-xs text-zinc-500 mb-3">{c.description}</p>
                                <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[11px] font-mono text-zinc-400">
                                    <span className="text-amber-300">+{Number(c.surcharge).toLocaleString('vi-VN')} ₫</span>
                                    <span>Origin: {c.origin}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Silhouette Selection */}
            <div className="space-y-3">
                <span className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    3. Select Haute Couture Gown Silhouette
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {silhouettes.map((sil) => {
                        const isSelected = currentSil?.id === sil.id;
                        return (
                            <div
                                key={sil.id}
                                onClick={() => onSelectSilhouette(sil)}
                                className={`cursor-pointer p-4 border rounded-sm transition ${
                                    isSelected
                                        ? 'border-white bg-zinc-900 text-white'
                                        : 'border-zinc-800/80 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                                }`}
                            >
                                <h4 className="text-xs font-serif font-medium text-zinc-100 mb-1">{sil.title}</h4>
                                <p className="text-[11px] text-zinc-400 mb-2">{sil.fabric}</p>
                                <div className="text-[10px] font-mono text-zinc-500 border-t border-zinc-800 pt-2 flex justify-between">
                                    <span>{sil.crystalDensity.split(' ')[0]} gems</span>
                                    <span className="text-zinc-300">{sil.artisanHours}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CrystalCanvas;
