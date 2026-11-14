import React, { useState, useEffect } from 'react';
import { Award, Sparkles, Shield, Clock, Info, Check, ArrowRight, Loader2 } from 'lucide-react';
import EmbroideryStyleSelector from '../components/embroidery/EmbroideryStyleSelector';
import ArtisanSealModal from '../components/embroidery/ArtisanSealModal';

const GoldEmbroidery = () => {
    const [threads, setThreads] = useState([]);
    const [zones, setZones] = useState([]);
    const [seals, setSeals] = useState([]);
    const [standardLeadTime, setStandardLeadTime] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedThread, setSelectedThread] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedSeal, setSelectedSeal] = useState(null);
    const [monogramText, setMonogramText] = useState('TVC');
    const [fontStyle, setFontStyle] = useState('serif-couture');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commissionSuccess, setCommissionSuccess] = useState(null);

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const res = await fetch('/api/bespoke-embroidery/catalog');
                const data = await res.json();
                if (data.success) {
                    setThreads(data.threads);
                    setZones(data.zones);
                    setSeals(data.seals);
                    setStandardLeadTime(data.standardLeadTime);

                    if (data.threads?.length) setSelectedThread(data.threads[0]);
                    if (data.zones?.length) setSelectedZone(data.zones[0]);
                }
            } catch (err) {
                console.error('Failed to load embroidery catalog', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCatalog();
    }, []);

    const totalEstimate = (selectedThread?.surcharge || 0) + (selectedSeal?.surcharge || 0);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-mono tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Haute Horlogerie & Hand Embroidery Atelier</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Bespoke 24K Gold Embroidery
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        Handcrafted by generational master embroiderers using Kyoto 24K aurum bullion wire, Lyon platinum thread, and Como raw mulberry filament silk.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-amber-400" /> Lifetime Stitch Warranty
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-400" /> {standardLeadTime || '7-10 Business Days'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-400" /> Cryptographic Heirloom Seal
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Interactive Studio */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                        <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
                            Loading Atelier Filaments & Master Stamps...
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Customizer Controls */}
                        <div className="lg:col-span-2">
                            <EmbroideryStyleSelector
                                threads={threads}
                                zones={zones}
                                seals={seals}
                                selectedThread={selectedThread}
                                onSelectThread={setSelectedThread}
                                selectedZone={selectedZone}
                                onSelectZone={setSelectedZone}
                                selectedSeal={selectedSeal}
                                onSelectSeal={setSelectedSeal}
                                monogramText={monogramText}
                                onMonogramTextChange={setMonogramText}
                                fontStyle={fontStyle}
                                onFontStyleChange={setFontStyle}
                            />
                        </div>

                        {/* Order Summary & Commission Action Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-6 rounded-sm space-y-6 shadow-xl">
                                <div>
                                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
                                        Atelier Commission Dossier
                                    </span>
                                    <h3 className="text-xl font-serif text-white">Bespoke Monogram</h3>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Custom personalized embellishment applied to your TVC garment.
                                    </p>
                                </div>

                                <div className="space-y-3 border-t border-zinc-900 pt-4 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 font-mono">Inscribed Initials:</span>
                                        <span className="text-white font-serif tracking-widest font-semibold">
                                            {monogramText || 'None'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 font-mono">Filament Metal:</span>
                                        <span className="text-zinc-200">{selectedThread?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 font-mono">Thread Surcharge:</span>
                                        <span className="text-amber-400 font-mono">
                                            +{Number(selectedThread?.surcharge || 0).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 font-mono">Anatomical Placement:</span>
                                        <span className="text-zinc-200 text-right max-w-[140px] truncate">{selectedZone?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 font-mono">Insignia Seal:</span>
                                        <span className="text-zinc-300">{selectedSeal ? selectedSeal.title : 'None'}</span>
                                    </div>
                                    {selectedSeal && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500 font-mono">Seal Surcharge:</span>
                                            <span className="text-amber-400 font-mono">
                                                +{Number(selectedSeal.surcharge).toLocaleString('vi-VN')} ₫
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-zinc-800 pt-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Total Customization:</span>
                                        <span className="text-lg font-mono text-amber-300 font-semibold">
                                            {totalEstimate.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500">
                                        *Excludes base garment price. Invoiced upon artisan sign-off.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 transition text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                >
                                    <span>Commission Atelier Artisan</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                {commissionSuccess && (
                                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs rounded-sm">
                                        Active Commission Code: <span className="font-mono text-white">{commissionSuccess.commission_code}</span>
                                    </div>
                                )}

                                <div className="p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-sm text-[11px] text-zinc-400 space-y-2">
                                    <div className="flex items-center gap-2 text-zinc-300 font-medium">
                                        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span>Artisan Craftsmanship Protocol</span>
                                    </div>
                                    <p className="text-zinc-500 leading-relaxed">
                                        Each monogram is tension-tested under 50x magnification to ensure gold leaves do not snag or unwind across decades of dry cleaning.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Commission Modal */}
            <ArtisanSealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedThread={selectedThread}
                selectedZone={selectedZone}
                selectedSeal={selectedSeal}
                monogramText={monogramText}
                fontStyle={fontStyle}
                onOrderSuccess={(order) => {
                    setCommissionSuccess(order);
                }}
            />
        </div>
    );
};

export default GoldEmbroidery;
