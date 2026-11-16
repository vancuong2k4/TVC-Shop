import React, { useState } from 'react';
import { X, Download, CheckCircle2, Shield, FileCheck, Layers, Sparkles } from 'lucide-react';

const PatternDownloadModal = ({
    isOpen,
    onClose,
    patternResult,
    selectedArchetype,
    selectedFormat
}) => {
    if (!isOpen || !patternResult) return null;

    const [downloading, setDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const handleConfirmDownload = () => {
        setDownloading(true);
        setTimeout(() => {
            setDownloading(false);
            setDownloadSuccess(true);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 text-white rounded-sm shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
                    <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Atelier Vector CAD Pattern Package
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {downloadSuccess ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/30 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-lg font-serif text-white">Pattern Archive Generated</h4>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Dossier: <span className="text-cyan-400">{patternResult.dossier_id}</span>
                                </p>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                                The architectural vector bundle (.PDF plot, DXF-AAMA layers, and tailoring balance manual) has been bundled.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black text-xs uppercase font-mono tracking-widest font-semibold hover:bg-zinc-200 transition rounded-sm"
                            >
                                Return To Workbench
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-sm space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Archetype:</span>
                                    <span className="text-white font-medium">{selectedArchetype?.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Output Protocol:</span>
                                    <span className="text-cyan-300 font-mono">{selectedFormat}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Panels Included:</span>
                                    <span className="text-zinc-300">{patternResult.panels?.length || 6} Pattern Pieces</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Calculated Yardage:</span>
                                    <span className="text-amber-300 font-mono font-bold">{patternResult.estimated_cloth_yardage_meters} meters</span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/40 rounded-sm text-[11px] text-cyan-200 space-y-1">
                                <div className="font-semibold flex items-center gap-1.5 font-mono uppercase text-cyan-400">
                                    <Shield className="w-3.5 h-3.5" />
                                    Bespoke Cutter Guarantee
                                </div>
                                <p className="text-zinc-400 leading-relaxed">
                                    Includes 12.5mm inlay allowances on side seams and shoulder vents for future anatomical refitting over decades of wear.
                                </p>
                            </div>

                            <button
                                onClick={handleConfirmDownload}
                                disabled={downloading}
                                className="w-full py-3.5 bg-cyan-400 text-black hover:bg-cyan-300 transition text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
                            >
                                <Download className="w-4 h-4" />
                                <span>{downloading ? 'Compiling Vector CAD Bundle...' : 'Download Full Pattern Archive'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatternDownloadModal;
