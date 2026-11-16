import React from 'react';
import { Compass, Ruler, Grid, Layers, Download, Check, ShieldCheck, FileText } from 'lucide-react';

const PatternBlueprintViewer = ({
    patternResult,
    selectedArchetype,
    selectedFormat,
    onDownloadTrigger
}) => {
    if (!patternResult) {
        return (
            <div className="border border-zinc-800 bg-zinc-950/80 rounded-sm p-8 text-center space-y-4">
                <Compass className="w-12 h-12 text-zinc-600 mx-auto animate-spin-slow" />
                <h4 className="text-sm font-serif text-zinc-400">Architectural Cutting Mat Idle</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto font-mono">
                    Enter anatomical girth and length coordinates to calculate true-to-scale drafting balance and seam notches.
                </p>
            </div>
        );
    }

    const { calculated_metrics, panels, estimated_cloth_yardage_meters, dossier_id, sha256_fingerprint } = patternResult;

    return (
        <div className="space-y-6">
            {/* Blueprint Blueprint Vector Viewport */}
            <div className="relative border border-cyan-900/60 bg-[#070b12] rounded-sm p-6 overflow-hidden shadow-2xl">
                {/* Architectural Blueprint Grid Background */}
                <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Blueprint Header */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-cyan-800/40 pb-4 gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                                CAD Drafting Blueprint 1:1 Vector Scale
                            </span>
                        </div>
                        <h3 className="text-lg font-serif text-white mt-1">{selectedArchetype?.title}</h3>
                        <p className="text-[11px] text-zinc-400 font-mono">Dossier: {dossier_id} • SHA-256: {sha256_fingerprint}</p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-700/60 text-cyan-300 font-mono text-xs">
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Curvature Deviation: ±0.5mm</span>
                    </div>
                </div>

                {/* Vector Silhouette Panel Schematics */}
                <div className="relative z-10 py-8 grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
                    {panels.map((panel, idx) => (
                        <div 
                            key={idx} 
                            className="p-3.5 bg-black/60 border border-cyan-500/20 hover:border-cyan-400/60 rounded transition group"
                        >
                            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                                <span>P-{idx + 1}</span>
                                <span>{panel.areaSqM} m²</span>
                            </div>
                            <h5 className="text-xs font-serif text-white group-hover:text-cyan-200 transition-colors">{panel.name}</h5>
                            <p className="text-[10px] text-zinc-400 font-mono mt-1">Grain: {panel.grain}</p>
                        </div>
                    ))}
                </div>

                {/* Mathematical Balance Ledger */}
                <div className="relative z-10 border-t border-cyan-800/40 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 bg-cyan-950/20 border border-cyan-900/40 rounded">
                        <span className="text-zinc-500 block text-[10px]">SCYE DEPTH:</span>
                        <span className="text-cyan-300 font-bold">{calculated_metrics.scye_depth_cm} cm</span>
                    </div>
                    <div className="p-2.5 bg-cyan-950/20 border border-cyan-900/40 rounded">
                        <span className="text-zinc-500 block text-[10px]">HALF-CHEST SCALE:</span>
                        <span className="text-cyan-300 font-bold">{calculated_metrics.chest_scale_with_ease_cm} cm</span>
                    </div>
                    <div className="p-2.5 bg-cyan-950/20 border border-cyan-900/40 rounded">
                        <span className="text-zinc-500 block text-[10px]">WAIST DART:</span>
                        <span className="text-cyan-300 font-bold">{calculated_metrics.waist_suppression_dart_cm} cm</span>
                    </div>
                    <div className="p-2.5 bg-cyan-950/20 border border-cyan-900/40 rounded">
                        <span className="text-zinc-500 block text-[10px]">EST. YARDAGE:</span>
                        <span className="text-amber-300 font-bold">{estimated_cloth_yardage_meters} m</span>
                    </div>
                </div>
            </div>

            {/* Export Actions Bar */}
            <div className="border border-zinc-800 bg-zinc-950 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                        <div className="text-xs font-mono uppercase text-zinc-300">Format: {selectedFormat}</div>
                        <div className="text-[11px] text-zinc-500">Ready for CAD nesting or wide-format plotter printing</div>
                    </div>
                </div>

                <button
                    onClick={onDownloadTrigger}
                    className="w-full sm:w-auto px-5 py-2.5 bg-cyan-400 text-black hover:bg-cyan-300 transition text-xs font-mono font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                    <Download className="w-4 h-4" />
                    <span>Download Vector Package (.PDF / .DXF)</span>
                </button>
            </div>
        </div>
    );
};

export default PatternBlueprintViewer;
