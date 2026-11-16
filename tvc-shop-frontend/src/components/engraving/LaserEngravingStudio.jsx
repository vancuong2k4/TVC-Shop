import React from 'react';
import { Sparkles, Shield, Cpu, Check, Layers } from 'lucide-react';

const LaserEngravingStudio = ({
    metals = [],
    components = [],
    hallmarks = [],
    selectedMetal,
    onSelectMetal,
    selectedComponent,
    onSelectComponent,
    selectedHallmark,
    onSelectHallmark,
    inscriptionText,
    onInscriptionTextChange,
    typographyStyle,
    onTypographyStyleChange
}) => {
    const fonts = [
        { id: 'font-micro-sans', name: 'Haute Horlogerie Technical', sample: 'CALIBRE 01', styleClass: 'font-mono tracking-widest uppercase font-semibold' },
        { id: 'font-baskerville-serif', name: 'Imperial Roman Serif', sample: 'ANNO MMXXIV', styleClass: 'font-serif tracking-widest font-normal' },
        { id: 'font-geneva-italic', name: 'Geneva Hand-Chiseled Italic', sample: 'Atelier TVC', styleClass: 'italic font-serif tracking-wider font-light' },
        { id: 'font-bauhaus-clean', name: 'Minimalist Architectural', sample: 'ARCHIVE 084', styleClass: 'font-sans tracking-[0.25em] uppercase font-light' }
    ];

    const currentFont = fonts.find(f => f.id === typographyStyle) || fonts[0];

    return (
        <div className="space-y-8">
            {/* Live Laser-Carved Metallic Canvas Preview */}
            <div className="relative border border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-8 rounded-sm overflow-hidden text-center shadow-2xl">
                {/* Tech Status Pill */}
                <div className="absolute top-3 left-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span className="text-[10px] tracking-widest uppercase text-cyan-300 font-mono">
                        MOPA Fiber Laser 0.015mm
                    </span>
                </div>
                <div className="absolute top-3 right-4 text-[10px] tracking-widest uppercase text-zinc-500 font-mono">
                    {selectedComponent?.depth || '0.35mm Cut Depth'}
                </div>

                {/* Metallic Hardware Plaque Simulation */}
                <div className="py-12 flex flex-col items-center justify-center min-h-[220px]">
                    <div 
                        className="relative p-6 sm:p-8 rounded border transition-all duration-500 max-w-lg w-full mx-auto"
                        style={{
                            background: selectedMetal?.id === 'grade5-titanium-dlc'
                                ? 'linear-gradient(145deg, #1f1f1f, #121212)'
                                : selectedMetal?.id === 'solid-18k-rose-gold'
                                ? 'linear-gradient(145deg, #c47d88, #8c4e57)'
                                : selectedMetal?.id === 'palladium-ruthenium'
                                ? 'linear-gradient(145deg, #e3e3e3, #a8a8a8)'
                                : 'linear-gradient(145deg, #b87333, #6e411b)',
                            borderColor: 'rgba(255,255,255,0.15)',
                            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.8)'
                        }}
                    >
                        {/* Screws / Rivets Detail */}
                        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-600"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-600"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-600"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-600"></div>

                        {/* Inscription Laser Carve */}
                        <div 
                            className={`text-2xl sm:text-4xl transition-all duration-300 ${currentFont.styleClass}`}
                            style={{
                                color: selectedMetal?.id === 'palladium-ruthenium' ? '#1a1a1a' : '#f5f5f5',
                                textShadow: selectedMetal?.id === 'palladium-ruthenium' 
                                    ? '0 1px 1px rgba(255,255,255,0.8), 0 -1px 2px rgba(0,0,0,0.6)'
                                    : '0 -1px 2px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.2)'
                            }}
                        >
                            {inscriptionText.trim() ? inscriptionText : 'INSCRIPTION'}
                        </div>

                        {selectedHallmark && (
                            <div className="mt-3 flex items-center justify-center gap-2">
                                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-black/40 text-white/90 border border-white/20">
                                    ★ {selectedHallmark.title}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-4 flex flex-wrap items-center justify-between text-xs text-zinc-400 font-mono">
                    <div>
                        <span className="text-zinc-600">ALLOY: </span>
                        <span className="text-zinc-200 font-medium">{selectedMetal?.name?.split(' ')[0] || 'Titanium'}</span>
                    </div>
                    <div>
                        <span className="text-zinc-600">COMPONENT: </span>
                        <span className="text-zinc-200">{selectedComponent?.name}</span>
                    </div>
                    <div>
                        <span className="text-zinc-600">TOLERANCE: </span>
                        <span className="text-cyan-400">±0.005mm</span>
                    </div>
                </div>
            </div>

            {/* Input & Typography Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950/60 p-6 border border-zinc-800/80 rounded-sm">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-300 mb-2 font-mono">
                        1. Inscription Text or Sovereign Cipher
                    </label>
                    <input
                        type="text"
                        maxLength={selectedComponent?.maxChars || 16}
                        value={inscriptionText}
                        onChange={(e) => onInscriptionTextChange(e.target.value)}
                        placeholder="e.g. C.V.T 2026 or ARCHIVE-01"
                        className="w-full bg-black border border-zinc-800 focus:border-cyan-400/80 text-white px-4 py-3 text-sm tracking-widest outline-none transition rounded-sm placeholder:text-zinc-700 font-mono uppercase"
                    />
                    <div className="flex justify-between items-center mt-2 text-[11px] text-zinc-500 font-mono">
                        <span>Max {selectedComponent?.maxChars || 16} characters</span>
                        <span>{inscriptionText.length} / {selectedComponent?.maxChars || 16}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-300 mb-2 font-mono">
                        2. Horlogerie Engraving Typography
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {fonts.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => onTypographyStyleChange(f.id)}
                                className={`p-2.5 text-left border rounded-sm transition flex flex-col justify-between ${
                                    typographyStyle === f.id
                                        ? 'border-cyan-400 bg-cyan-400/10 text-white'
                                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                }`}
                            >
                                <span className="text-[10px] uppercase font-mono tracking-wider">{f.name.split(' ')[0]}</span>
                                <span className={`text-xs mt-1 truncate ${f.styleClass}`}>{f.sample}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metal Selection */}
            <div>
                <h3 className="text-sm uppercase tracking-widest text-zinc-200 mb-4 font-mono flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    3. Horological Alloy & Metallurgy Selection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {metals.map((metal) => {
                        const isSelected = selectedMetal?.id === metal.id;
                        return (
                            <div
                                key={metal.id}
                                onClick={() => onSelectMetal(metal)}
                                className={`cursor-pointer p-5 border rounded-sm transition-all relative ${
                                    isSelected
                                        ? 'border-cyan-400 bg-zinc-900/90 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                                        : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700'
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-2">
                                    <span 
                                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: metal.hex }}
                                    ></span>
                                    <h4 className="text-sm font-serif font-medium text-white">{metal.name}</h4>
                                </div>
                                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{metal.description}</p>
                                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                                    <span className="text-cyan-300 font-medium">+{Number(metal.surcharge).toLocaleString('vi-VN')} ₫</span>
                                    <span>{metal.hardness}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hardware Component Location */}
            <div>
                <h3 className="text-sm uppercase tracking-widest text-zinc-200 mb-4 font-mono flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    4. Hardware Component Fixture
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {components.map((comp) => {
                        const isSelected = selectedComponent?.id === comp.id;
                        return (
                            <div
                                key={comp.id}
                                onClick={() => onSelectComponent(comp)}
                                className={`cursor-pointer p-4 border rounded-sm transition ${
                                    isSelected
                                        ? 'border-white bg-zinc-900 text-white'
                                        : 'border-zinc-800/80 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-medium text-zinc-100">{comp.name}</h4>
                                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded">
                                        {comp.previewScale}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 mb-2">{comp.depth}</p>
                                <div className="text-[11px] text-zinc-500 font-mono border-t border-zinc-800/60 pt-2">
                                    Compatible: {comp.garmentTypes.join(', ')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hallmark Punches */}
            <div>
                <h3 className="text-sm uppercase tracking-widest text-zinc-200 mb-4 font-mono flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    5. Official Guild Hallmark Punch
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                        onClick={() => onSelectHallmark(null)}
                        className={`cursor-pointer p-3.5 border rounded-sm text-center transition ${
                            !selectedHallmark
                                ? 'border-zinc-300 bg-zinc-900 text-white'
                                : 'border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:border-zinc-700'
                        }`}
                    >
                        <span className="text-xs font-mono uppercase">None (Inscription Only)</span>
                    </div>
                    {hallmarks.map((mark) => {
                        const isSelected = selectedHallmark?.id === mark.id;
                        return (
                            <div
                                key={mark.id}
                                onClick={() => onSelectHallmark(mark)}
                                className={`cursor-pointer p-3.5 border rounded-sm transition ${
                                    isSelected
                                        ? 'border-cyan-400 bg-zinc-900 text-white'
                                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                                }`}
                            >
                                <div className="text-xs font-medium text-zinc-200 mb-1">{mark.title}</div>
                                <div className="text-[11px] text-cyan-300 font-mono mb-1">
                                    +{Number(mark.surcharge).toLocaleString('vi-VN')} ₫
                                </div>
                                <div className="text-[10px] text-zinc-500 line-clamp-2">{mark.description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LaserEngravingStudio;
