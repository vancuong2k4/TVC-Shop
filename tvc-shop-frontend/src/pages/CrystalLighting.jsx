import React, { useState, useEffect } from 'react';
import { 
    Sparkles, 
    Sun, 
    Shield, 
    Eye, 
    Calendar, 
    Check, 
    ArrowRight, 
    Loader2, 
    Award,
    Flame
} from 'lucide-react';
import CrystalCanvas from '../components/crystal/CrystalCanvas';
import CrystalFittingModal from '../components/crystal/CrystalFittingModal';

const CrystalLighting = () => {
    const [crystals, setCrystals] = useState([]);
    const [environments, setEnvironments] = useState([]);
    const [silhouettes, setSilhouettes] = useState([]);
    const [beadingGuild, setBeadingGuild] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedCrystal, setSelectedCrystal] = useState(null);
    const [selectedEnvironment, setSelectedEnvironment] = useState(null);
    const [selectedSilhouette, setSelectedSilhouette] = useState(null);
    const [luxIntensity, setLuxIntensity] = useState(100);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fittingSuccess, setFittingSuccess] = useState(null);

    useEffect(() => {
        const fetchStudioConfig = async () => {
            try {
                const res = await fetch('/api/crystal-lighting/config');
                const data = await res.json();
                if (data.success) {
                    setCrystals(data.crystals);
                    setEnvironments(data.environments);
                    setSilhouettes(data.silhouettes);
                    setBeadingGuild(data.beadingGuild);

                    if (data.crystals?.length) setSelectedCrystal(data.crystals[0]);
                    if (data.environments?.length) setSelectedEnvironment(data.environments[0]);
                    if (data.silhouettes?.length) setSelectedSilhouette(data.silhouettes[0]);
                }
            } catch (err) {
                console.error('Failed to load crystal studio config', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudioConfig();
    }, []);

    const totalEstimate = selectedCrystal?.surcharge || 0;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-mono tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Photometric Haute Couture Lab & Lesage Beading Guild</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Haute Couture Crystal Lighting Simulator
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        Simulating dynamic light refraction across Swarovski Aurora Borealis, Bohemian Jet Hematite, and Vintage Champagne Quartz under 4 authentic gala lighting atmospheres.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Sun className="w-4 h-4 text-amber-400" /> 1900K Candlelight to 5600K Red Carpet Flash
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-400" /> Hand-Embroidered by Lesage Guild
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-amber-400" /> Dispersion Index 1.585 - 2.100
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                            Illuminating Dark Chamber Photometrics...
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Interactive Photometric Studio */}
                        <div className="lg:col-span-2">
                            <CrystalCanvas
                                crystals={crystals}
                                environments={environments}
                                silhouettes={silhouettes}
                                selectedCrystal={selectedCrystal}
                                onSelectCrystal={setSelectedCrystal}
                                selectedEnvironment={selectedEnvironment}
                                onSelectEnvironment={setSelectedEnvironment}
                                selectedSilhouette={selectedSilhouette}
                                onSelectSilhouette={setSelectedSilhouette}
                                luxIntensity={luxIntensity}
                                onLuxIntensityChange={setLuxIntensity}
                            />
                        </div>

                        {/* Fitting Reservation Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-6 rounded-sm space-y-6 shadow-xl">
                                <div>
                                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
                                        Private Chamber Commission
                                    </span>
                                    <h3 className="text-xl font-serif text-white">Gown Luminescence Dossier</h3>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Personalized crystal beading calibrated for your upcoming gala.
                                    </p>
                                </div>

                                <div className="space-y-3 border-t border-zinc-900 pt-4 text-xs font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Silhouette:</span>
                                        <span className="text-zinc-200 text-right max-w-[150px] truncate">{selectedSilhouette?.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Crystal Facet:</span>
                                        <span className="text-amber-300 text-right max-w-[150px] truncate">{selectedCrystal?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Environment:</span>
                                        <span className="text-zinc-300 text-right max-w-[150px] truncate">{selectedEnvironment?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Estimated Density:</span>
                                        <span className="text-zinc-300">{selectedSilhouette?.crystalDensity?.split(' ')[0]} crystals</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Crystal Surcharge:</span>
                                        <span className="text-amber-400">
                                            +{Number(selectedCrystal?.surcharge || 0).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-800 pt-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Beading Commission:</span>
                                        <span className="text-lg font-mono text-amber-300 font-semibold">
                                            {totalEstimate.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500">
                                        *Includes 1-on-1 private dark chamber photometric rehearsal with lighting technician.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 transition text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                                >
                                    <span>Reserve Private Dark Chamber Fitting</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                {fittingSuccess && (
                                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs rounded-sm space-y-1">
                                        <div className="font-mono text-white text-[11px]">Ref: {fittingSuccess.booking_ref}</div>
                                        <div className="font-mono text-amber-300 text-[10px]">Date: {fittingSuccess.fitting_date}</div>
                                    </div>
                                )}

                                <div className="p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-sm text-[11px] text-zinc-400 space-y-2">
                                    <div className="flex items-center gap-2 text-zinc-300 font-medium">
                                        <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span>Photometric Guarantee</span>
                                    </div>
                                    <p className="text-zinc-500 leading-relaxed">
                                        Each crystal is hand-stitched with reinforced wax filament silk to guarantee zero gemstone loss during active ballroom dancing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <CrystalFittingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedCrystal={selectedCrystal}
                selectedEnvironment={selectedEnvironment}
                selectedSilhouette={selectedSilhouette}
                onSuccess={(dossier) => {
                    setFittingSuccess(dossier);
                }}
            />
        </div>
    );
};

export default CrystalLighting;
