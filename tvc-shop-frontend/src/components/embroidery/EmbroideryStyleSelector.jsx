import React from 'react';
import { Sparkles, Check, ShieldCheck, MapPin } from 'lucide-react';

const EmbroideryStyleSelector = ({
    threads = [],
    zones = [],
    seals = [],
    selectedThread,
    onSelectThread,
    selectedZone,
    onSelectZone,
    selectedSeal,
    onSelectSeal,
    monogramText,
    onMonogramTextChange,
    fontStyle,
    onFontStyleChange
}) => {
    const fonts = [
        { id: 'serif-couture', name: 'Atelier Serif', sample: 'TVC MMI', styleClass: 'font-serif tracking-widest' },
        { id: 'sans-geometric', name: 'Haute Sans', sample: 'TVC MMI', styleClass: 'font-sans tracking-widest uppercase font-light' },
        { id: 'cursive-script', name: 'Imperial Calligraphy', sample: 'T. V. C.', styleClass: 'italic font-serif tracking-wide font-normal' },
        { id: 'roman-numerals', name: 'Archival Roman', sample: 'MMXXIV', styleClass: 'font-mono tracking-widest' }
    ];

    return (
        <div className="space-y-10">
            {/* Live Visual Canvas Preview */}
            <div className="relative border border-zinc-800 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-8 rounded-sm overflow-hidden text-center shadow-2xl">
                <div className="absolute top-3 left-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-mono">Real-Time Thread Render</span>
                </div>
                <div className="absolute top-3 right-4 text-[10px] tracking-widest uppercase text-zinc-500 font-mono">
                    {selectedZone?.name || 'Breast Pocket'}
                </div>

                <div className="py-14 flex flex-col items-center justify-center min-h-[220px]">
                    <div 
                        className={`text-3xl md:text-5xl transition-all duration-300 drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)] ${
                            fonts.find(f => f.id === fontStyle)?.styleClass || 'font-serif'
                        }`}
                        style={{
                            color: selectedThread?.hex || '#D4AF37',
                            textShadow: selectedThread?.id === 'gold-24k' 
                                ? '0 0 16px rgba(212,175,55,0.6), 0 0 3px #FFE57F' 
                                : selectedThread?.id === 'silver-platinum'
                                ? '0 0 16px rgba(229,228,226,0.6), 0 0 3px #FFFFFF'
                                : '0 1px 2px rgba(0,0,0,0.8)'
                        }}
                    >
                        {monogramText.trim() ? monogramText : 'YOUR INITIALS'}
                    </div>

                    {selectedSeal && (
                        <div className="mt-4 flex items-center gap-2 px-3 py-1 border border-zinc-800 rounded bg-zinc-900/60 backdrop-blur-sm">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[11px] uppercase tracking-wider text-zinc-300">
                                {selectedSeal.title}
                            </span>
                        </div>
                    )}
                </div>

                <div className="border-t border-zinc-900 pt-4 flex flex-wrap items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 font-mono">YARN:</span>
                        <span className="text-zinc-200 font-medium">{selectedThread?.name || '24K Gold'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 font-mono">ESTIMATED STITCHES:</span>
                        <span className="text-amber-400 font-mono">~{(monogramText.length || 4) * 420 + (selectedSeal ? 1200 : 0)} stitches</span>
                    </div>
                </div>
            </div>

            {/* Monogram Text Input & Font Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950/60 p-6 border border-zinc-800/80 rounded-sm">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-300 mb-2 font-mono">
                        1. Monogram or Custom Inscription
                    </label>
                    <input
                        type="text"
                        maxLength={selectedZone?.maxCharacters || 24}
                        value={monogramText}
                        onChange={(e) => onMonogramTextChange(e.target.value)}
                        placeholder="e.g. C.V.T or MCMXCIV"
                        className="w-full bg-black border border-zinc-800 focus:border-amber-400/80 text-white px-4 py-3 text-sm tracking-wider outline-none transition rounded-sm placeholder:text-zinc-700 font-serif"
                    />
                    <div className="flex justify-between items-center mt-2 text-[11px] text-zinc-500">
                        <span>Max {selectedZone?.maxCharacters || 24} characters</span>
                        <span>{monogramText.length} / {selectedZone?.maxCharacters || 24}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-300 mb-2 font-mono">
                        2. Typographic Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {fonts.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => onFontStyleChange(f.id)}
                                className={`p-2.5 text-left border rounded-sm transition flex flex-col justify-between ${
                                    fontStyle === f.id
                                        ? 'border-amber-400 bg-amber-400/10 text-white'
                                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                }`}
                            >
                                <span className="text-[10px] uppercase font-mono tracking-wider">{f.name}</span>
                                <span className={`text-sm mt-1 truncate ${f.styleClass}`}>{f.sample}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Thread Metallics Selection */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm uppercase tracking-widest text-zinc-200 font-mono flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        3. Precious Filament & Metal Wire Selection
                    </h3>
                    <span className="text-xs text-zinc-500 font-mono">Master Atelier Certified</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {threads.map((thread) => {
                        const isSelected = selectedThread?.id === thread.id;
                        return (
                            <div
                                key={thread.id}
                                onClick={() => onSelectThread(thread)}
                                className={`cursor-pointer p-5 border rounded-sm transition-all relative ${
                                    isSelected
                                        ? 'border-amber-400 bg-zinc-900/90 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                                        : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700'
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-2">
                                    <span 
                                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: thread.hex }}
                                    ></span>
                                    <h4 className="text-sm font-serif font-medium text-white">{thread.name}</h4>
                                </div>
                                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{thread.description}</p>
                                
                                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                                    <span className="text-amber-300 font-medium">+{Number(thread.surcharge).toLocaleString('vi-VN')} ₫</span>
                                    <span>{thread.durability}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Placement Zones */}
            <div>
                <h3 className="text-sm uppercase tracking-widest text-zinc-200 mb-4 font-mono flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    4. Placement Location & Anatomical Placement
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {zones.map((zone) => {
                        const isSelected = selectedZone?.id === zone.id;
                        return (
                            <div
                                key={zone.id}
                                onClick={() => onSelectZone(zone)}
                                className={`cursor-pointer p-4 border rounded-sm transition ${
                                    isSelected
                                        ? 'border-white bg-zinc-900 text-white'
                                        : 'border-zinc-800/80 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-medium text-zinc-100">{zone.name}</h4>
                                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded">
                                        {zone.visibility.split(' ')[0]}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 mb-2">{zone.visibility}</p>
                                <div className="text-[11px] text-zinc-500 font-mono flex items-center justify-between border-t border-zinc-800/60 pt-2 mt-2">
                                    <span>Compatible: {zone.garmentTypes.slice(0, 2).join(', ')}</span>
                                    <span className="text-zinc-400">{zone.artisanHours}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Artisan Wax / Embroidered Seals */}
            <div>
                <h3 className="text-sm uppercase tracking-widest text-zinc-200 mb-4 font-mono flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    5. Optional Artisan Insignia Seal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                        onClick={() => onSelectSeal(null)}
                        className={`cursor-pointer p-3.5 border rounded-sm text-center transition ${
                            !selectedSeal
                                ? 'border-zinc-300 bg-zinc-900 text-white'
                                : 'border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:border-zinc-700'
                        }`}
                    >
                        <span className="text-xs font-mono uppercase">None (Monogram Only)</span>
                    </div>
                    {seals.map((seal) => {
                        const isSelected = selectedSeal?.id === seal.id;
                        return (
                            <div
                                key={seal.id}
                                onClick={() => onSelectSeal(seal)}
                                className={`cursor-pointer p-3.5 border rounded-sm transition ${
                                    isSelected
                                        ? 'border-amber-400 bg-zinc-900 text-white'
                                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                                }`}
                            >
                                <div className="text-xs font-medium text-zinc-200 mb-1">{seal.title}</div>
                                <div className="text-[11px] text-amber-300/90 font-mono mb-1">
                                    +{Number(seal.surcharge).toLocaleString('vi-VN')} ₫
                                </div>
                                <div className="text-[10px] text-zinc-500 line-clamp-2">{seal.description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EmbroideryStyleSelector;
