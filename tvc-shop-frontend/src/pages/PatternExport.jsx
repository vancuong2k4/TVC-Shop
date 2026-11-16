import React, { useState, useEffect } from 'react';
import { 
    Compass, 
    Ruler, 
    FileText, 
    Layers, 
    Sparkles, 
    Download, 
    Check, 
    Shield, 
    Loader2,
    Sliders
} from 'lucide-react';
import PatternBlueprintViewer from '../components/pattern/PatternBlueprintViewer';
import PatternDownloadModal from '../components/pattern/PatternDownloadModal';

const PatternExport = () => {
    const [archetypes, setArchetypes] = useState([]);
    const [notations, setNotations] = useState([]);
    const [exportFormats, setExportFormats] = useState([]);
    const [selectedArchetype, setSelectedArchetype] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState('VECTOR_PDF_PLOTTER');
    const [loading, setLoading] = useState(true);

    // Anatomical Measurement Inputs
    const [clientName, setClientName] = useState('Monsieur Le');
    const [clientEmail, setClientEmail] = useState('artisan@tvc-atelier.com');
    const [chestCirc, setChestCirc] = useState(102);
    const [waistCirc, setWaistCirc] = useState(86);
    const [hipCirc, setHipCirc] = useState(104);
    const [shoulderWidth, setShoulderWidth] = useState(47);
    const [backLength, setBackLength] = useState(115);
    const [sleeveLength, setSleeveLength] = useState(65);

    const [generating, setGenerating] = useState(false);
    const [patternResult, setPatternResult] = useState(null);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const res = await fetch('/api/pattern-export/schema');
                const data = await res.json();
                if (data.success) {
                    setArchetypes(data.archetypes);
                    setNotations(data.notations);
                    setExportFormats(data.exportFormats);
                    if (data.archetypes?.length) setSelectedArchetype(data.archetypes[0]);
                }
            } catch (err) {
                console.error('Failed to load pattern drafting schema', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchema();
    }, []);

    // Compute Pattern Coordinates
    const handleGeneratePattern = async (e) => {
        if (e) e.preventDefault();
        setGenerating(true);

        try {
            const res = await fetch('/api/pattern-export/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_name: clientName,
                    client_email: clientEmail,
                    archetype_id: selectedArchetype?.id || 'archival-savile-coat',
                    chest_circ_cm: chestCirc,
                    waist_circ_cm: waistCirc,
                    hip_circ_cm: hipCirc,
                    shoulder_width_cm: shoulderWidth,
                    back_length_cm: backLength,
                    sleeve_length_cm: sleeveLength,
                    format: selectedFormat,
                    include_seam_allowance: true
                })
            });

            const data = await res.json();
            if (data.success) {
                setPatternResult(data.pattern);
            }
        } catch (err) {
            console.error('Pattern generation failed', err);
        } finally {
            setGenerating(false);
        }
    };

    // Auto-compute on initial load or archetype change
    useEffect(() => {
        if (selectedArchetype) {
            handleGeneratePattern();
        }
    }, [selectedArchetype]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 text-xs font-mono tracking-widest uppercase">
                        <Compass className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Bespoke Architectural Pattern Drafting CAD</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Architectural Garment Pattern Engine
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        Precision true-to-scale drafting geometry exported in 1:1 vector formats (.PDF Plotter, DXF-AAMA CAD). Calibrated for bespoke laser cutting or traditional hand-basting.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Ruler className="w-4 h-4 text-cyan-400" /> True 1:1 Scale Vector
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-cyan-400" /> 18-Piece Fully Canvassed Greatcoat
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-cyan-400" /> Standard Inlay Allowance 12.5mm
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Archetype Selector */}
                {archetypes.length > 0 && (
                    <div className="space-y-3">
                        <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-cyan-400" />
                            1. Select Tailoring Master Archetype:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {archetypes.map((arch) => {
                                const isSelected = selectedArchetype?.id === arch.id;
                                return (
                                    <button
                                        key={arch.id}
                                        onClick={() => setSelectedArchetype(arch)}
                                        className={`p-5 text-left border rounded-sm transition flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-cyan-400 bg-zinc-900/90 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                                                : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-mono uppercase text-zinc-500">{arch.category}</span>
                                                <span className="text-[10px] font-mono text-cyan-300">{arch.panelCount} panels</span>
                                            </div>
                                            <h4 className="text-sm font-serif font-medium text-white mb-2">{arch.title}</h4>
                                            <p className="text-xs text-zinc-400 leading-relaxed mb-3">{arch.description}</p>
                                        </div>
                                        <div className="pt-2 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                                            {arch.canvasInterfacing}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Drafting Inputs and Blueprint Canvas Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Measurement Sliders Panel */}
                    <div className="lg:col-span-1 border border-zinc-800 bg-zinc-950/70 p-6 rounded-sm space-y-6">
                        <div className="border-b border-zinc-900 pb-3">
                            <h3 className="text-sm uppercase font-mono tracking-widest text-zinc-200 flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-cyan-400" />
                                2. Anatomical Coordinates
                            </h3>
                            <p className="text-[11px] text-zinc-500 mt-0.5">Calibrate girth and length contours</p>
                        </div>

                        {/* Chest Circ */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Chest Circumference</span>
                                <span className="text-cyan-300 font-semibold">{chestCirc} cm</span>
                            </div>
                            <input
                                type="range"
                                min={80}
                                max={140}
                                value={chestCirc}
                                onChange={(e) => setChestCirc(Number(e.target.value))}
                                className="w-full accent-cyan-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        {/* Waist Circ */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Waist Suppression</span>
                                <span className="text-cyan-300 font-semibold">{waistCirc} cm</span>
                            </div>
                            <input
                                type="range"
                                min={65}
                                max={130}
                                value={waistCirc}
                                onChange={(e) => setWaistCirc(Number(e.target.value))}
                                className="w-full accent-cyan-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        {/* Shoulder Width */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Shoulder Width</span>
                                <span className="text-cyan-300 font-semibold">{shoulderWidth} cm</span>
                            </div>
                            <input
                                type="range"
                                min={38}
                                max={58}
                                value={shoulderWidth}
                                onChange={(e) => setShoulderWidth(Number(e.target.value))}
                                className="w-full accent-cyan-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        {/* Back Length */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Back Length</span>
                                <span className="text-cyan-300 font-semibold">{backLength} cm</span>
                            </div>
                            <input
                                type="range"
                                min={60}
                                max={130}
                                value={backLength}
                                onChange={(e) => setBackLength(Number(e.target.value))}
                                className="w-full accent-cyan-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        {/* Export Protocol Format */}
                        <div className="space-y-2 pt-2 border-t border-zinc-900">
                            <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400">
                                3. Target CAD Vector Protocol
                            </label>
                            <select
                                value={selectedFormat}
                                onChange={(e) => setSelectedFormat(e.target.value)}
                                className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm font-mono"
                            >
                                {exportFormats.map(fmt => (
                                    <option key={fmt.format} value={fmt.format}>
                                        {fmt.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleGeneratePattern}
                            disabled={generating}
                            className="w-full py-3 bg-cyan-400 text-black hover:bg-cyan-300 transition text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Recalculating Vector Scye...</span>
                                </>
                            ) : (
                                <>
                                    <Compass className="w-4 h-4" />
                                    <span>Compute Architectural Blueprint</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Blueprint Display Viewport */}
                    <div className="lg:col-span-2">
                        <PatternBlueprintViewer
                            patternResult={patternResult}
                            selectedArchetype={selectedArchetype}
                            selectedFormat={selectedFormat}
                            onDownloadTrigger={() => setIsDownloadModalOpen(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Download Modal */}
            <PatternDownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
                patternResult={patternResult}
                selectedArchetype={selectedArchetype}
                selectedFormat={selectedFormat}
            />
        </div>
    );
};

export default PatternExport;
