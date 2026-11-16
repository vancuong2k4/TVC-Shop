import React, { useState, useEffect } from 'react';
import { 
    Cpu, 
    Sparkles, 
    Shield, 
    Layers, 
    Check, 
    ArrowRight, 
    Loader2, 
    Clock, 
    Award 
} from 'lucide-react';
import LaserEngravingStudio from '../components/engraving/LaserEngravingStudio';
import HardwareStampingModal from '../components/engraving/HardwareStampingModal';

const HardwareEngraving = () => {
    const [metals, setMetals] = useState([]);
    const [components, setComponents] = useState([]);
    const [hallmarks, setHallmarks] = useState([]);
    const [engravingTooling, setEngravingTooling] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedMetal, setSelectedMetal] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedHallmark, setSelectedHallmark] = useState(null);
    const [inscriptionText, setInscriptionText] = useState('TVC CALIBRE 01');
    const [typographyStyle, setTypographyStyle] = useState('font-micro-sans');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commissionSuccess, setCommissionSuccess] = useState(null);

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const res = await fetch('/api/hardware-engraving/catalog');
                const data = await res.json();
                if (data.success) {
                    setMetals(data.metals);
                    setComponents(data.components);
                    setHallmarks(data.hallmarks);
                    setEngravingTooling(data.engravingTooling);

                    if (data.metals?.length) setSelectedMetal(data.metals[0]);
                    if (data.components?.length) setSelectedComponent(data.components[0]);
                }
            } catch (err) {
                console.error('Failed to load hardware engraving catalog', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCatalog();
    }, []);

    const totalEstimate = (selectedMetal?.surcharge || 0) + (selectedHallmark?.surcharge || 0);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 text-xs font-mono tracking-widest uppercase">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Haute Horlogerie Metallurgy & CNC Fiber Laser Lab</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Haute Hardware Engraving & Serial Stamping
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        Swiss-grade laser carving across Grade 5 Titanium DLC, Solid 18K Rose Gold, and Platinum 950. Laser-punched with cryptographic provenance serials and official guild hallmarks.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-cyan-400" /> Vickers 3,200 HV Scratch Immunity
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-cyan-400" /> Poinçon d’Atelier TVC Hallmark
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-cyan-400" /> ±0.005mm Tolerance
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                            Calibrating MOPA Fiber Laser Optics...
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Customizer Studio Controls */}
                        <div className="lg:col-span-2">
                            <LaserEngravingStudio
                                metals={metals}
                                components={components}
                                hallmarks={hallmarks}
                                selectedMetal={selectedMetal}
                                onSelectMetal={setSelectedMetal}
                                selectedComponent={selectedComponent}
                                onSelectComponent={setSelectedComponent}
                                selectedHallmark={selectedHallmark}
                                onSelectHallmark={setSelectedHallmark}
                                inscriptionText={inscriptionText}
                                onInscriptionTextChange={setInscriptionText}
                                typographyStyle={typographyStyle}
                                onTypographyStyleChange={setTypographyStyle}
                            />
                        </div>

                        {/* Order Summary & Commission Action Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-6 rounded-sm space-y-6 shadow-xl">
                                <div>
                                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block mb-1">
                                        Horlogerie Hardware Commission
                                    </span>
                                    <h3 className="text-xl font-serif text-white">Metal Plaque & Fixture</h3>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Precision micro-carving executed in the Le Locle metallurgy lab.
                                    </p>
                                </div>

                                <div className="space-y-3 border-t border-zinc-900 pt-4 text-xs font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Inscription:</span>
                                        <span className="text-white font-bold tracking-wider uppercase">
                                            {inscriptionText || 'None'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Component:</span>
                                        <span className="text-zinc-200 text-right max-w-[150px] truncate">{selectedComponent?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Alloy Grade:</span>
                                        <span className="text-zinc-300 text-right max-w-[150px] truncate">{selectedMetal?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Alloy Surcharge:</span>
                                        <span className="text-cyan-300">
                                            +{Number(selectedMetal?.surcharge || 0).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Hallmark Punch:</span>
                                        <span className="text-zinc-300">{selectedHallmark ? selectedHallmark.title : 'None'}</span>
                                    </div>
                                    {selectedHallmark && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Hallmark Surcharge:</span>
                                            <span className="text-cyan-300">
                                                +{Number(selectedHallmark.surcharge).toLocaleString('vi-VN')} ₫
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-zinc-800 pt-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Total Tooling Surcharge:</span>
                                        <span className="text-lg font-mono text-cyan-300 font-semibold">
                                            {totalEstimate.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500">
                                        *Includes Swiss CNC setup, laser pulse calibration, and microscopic inspection.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-3.5 bg-cyan-400 text-black hover:bg-cyan-300 transition text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                >
                                    <span>Commission Laser Stamping</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                {commissionSuccess && (
                                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs rounded-sm space-y-1">
                                        <div className="font-mono text-white text-[11px]">Dossier: {commissionSuccess.commission_code}</div>
                                        <div className="font-mono text-cyan-300 text-[10px]">Serial: {commissionSuccess.serial_number}</div>
                                    </div>
                                )}

                                <div className="p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-sm text-[11px] text-zinc-400 space-y-2">
                                    <div className="flex items-center gap-2 text-zinc-300 font-medium">
                                        <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                        <span>Horlogerie Tolerancing Guarantee</span>
                                    </div>
                                    <p className="text-zinc-500 leading-relaxed">
                                        Every workpiece is engraved with high-frequency 1064nm infrared laser pulses, eliminating mechanical heat distortion and burrs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <HardwareStampingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedMetal={selectedMetal}
                selectedComponent={selectedComponent}
                selectedHallmark={selectedHallmark}
                inscriptionText={inscriptionText}
                typographyStyle={typographyStyle}
                onSuccess={(dossier) => {
                    setCommissionSuccess(dossier);
                }}
            />
        </div>
    );
};

export default HardwareEngraving;
