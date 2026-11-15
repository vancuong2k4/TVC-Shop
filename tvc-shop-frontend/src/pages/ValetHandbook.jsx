import React, { useState, useEffect } from 'react';
import { 
    Sparkles, 
    Shield, 
    Truck, 
    Droplet, 
    AlertTriangle, 
    PhoneCall, 
    Check, 
    ArrowRight,
    Loader2,
    Clock,
    BookOpen
} from 'lucide-react';
import FabricCareMatrix from '../components/valet/FabricCareMatrix';
import ValetDispatchModal from '../components/valet/ValetDispatchModal';

const ValetHandbook = () => {
    const [protocols, setProtocols] = useState([]);
    const [selectedProtocol, setSelectedProtocol] = useState(null);
    const [stainGuide, setStainGuide] = useState([]);
    const [valetServices, setValetServices] = useState([]);
    const [conciergeHotline, setConciergeHotline] = useState('');
    const [loading, setLoading] = useState(true);

    const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    useEffect(() => {
        const fetchHandbook = async () => {
            try {
                const res = await fetch('/api/valet-handbook/protocols');
                const data = await res.json();
                if (data.success) {
                    setProtocols(data.protocols);
                    setStainGuide(data.stainGuide);
                    setValetServices(data.valetServices);
                    setConciergeHotline(data.conciergeHotline);
                    if (data.protocols?.length) {
                        setSelectedProtocol(data.protocols[0]);
                    }
                }
            } catch (err) {
                console.error('Failed to load valet handbook', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHandbook();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-mono tracking-widest uppercase">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Atelier Master Butler & Valet Protocol</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Haute Care & Valet Handbook
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        The definitive manual on preserving vicuña underfleece, hand-loomed mulberry silk, and canvassed tailoring across decades. Chauffeured white-glove courier restoration on demand.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-amber-400" /> GreenEarth® Silicone Eco-Cleansing
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-amber-400" /> Chauffeured Wardrobe Fleet
                        </span>
                        <span className="flex items-center gap-1.5">
                            <PhoneCall className="w-4 h-4 text-amber-400" /> {conciergeHotline || 'VIP Butler Desk'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                            Unsealing Atelier Butler Protocols...
                        </span>
                    </div>
                ) : (
                    <>
                        {/* Section 1: Fabric Protocols Matrix */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    I. Material Preservation & Steaming Guidelines
                                </h2>
                                <span className="text-xs text-zinc-500 font-mono">100-Year Longevity Standards</span>
                            </div>

                            <FabricCareMatrix
                                protocols={protocols}
                                selectedProtocol={selectedProtocol}
                                onSelectProtocol={setSelectedProtocol}
                            />
                        </div>

                        {/* Section 2: Emergency Stain Solver */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                                    II. Emergency Stain First-Response Protocol
                                </h2>
                                <span className="text-xs text-rose-400 font-mono">DO NOT RUB RULE</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stainGuide.map((item, idx) => (
                                    <div key={idx} className="p-5 bg-zinc-950/80 border border-zinc-800 rounded-sm space-y-3">
                                        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                                            <h4 className="text-sm font-serif font-medium text-white">{item.stainType}</h4>
                                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                                                Immediate
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">
                                                Immediate Butler Action
                                            </span>
                                            <p className="text-xs text-zinc-300 leading-relaxed">{item.immediateAction}</p>
                                        </div>
                                        <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-sm text-[11px] text-rose-300/90 flex items-start gap-2">
                                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                            <span>{item.criticalWarning}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: White Glove Valet Services */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-amber-400" />
                                    III. Private Chauffeured Valet & Archival Vault Services
                                </h2>
                                <button
                                    onClick={() => setIsDispatchModalOpen(true)}
                                    className="px-4 py-2 bg-amber-400 text-black text-xs font-mono font-semibold uppercase tracking-wider hover:bg-amber-300 transition flex items-center gap-1.5 rounded-sm"
                                >
                                    <span>Schedule Valet Courier</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {valetServices.map((service) => (
                                    <div
                                        key={service.id}
                                        className="p-5 bg-zinc-950/80 border border-zinc-800 rounded-sm space-y-3 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="text-[10px] uppercase font-mono text-amber-400 mb-1">{service.leadTime}</div>
                                            <h4 className="text-sm font-serif font-medium text-white mb-2">{service.title}</h4>
                                            <p className="text-xs text-zinc-400 leading-relaxed mb-3">{service.description}</p>
                                        </div>
                                        <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
                                            <span className="text-zinc-500">Fee:</span>
                                            <span className="text-amber-300 font-medium">{service.cost}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Valet Dispatch Modal */}
            <ValetDispatchModal
                isOpen={isDispatchModalOpen}
                onClose={() => setIsDispatchModalOpen(false)}
                valetServices={valetServices}
                onSuccess={(dossier) => {
                    setConfirmedBooking(dossier);
                }}
            />
        </div>
    );
};

export default ValetHandbook;
