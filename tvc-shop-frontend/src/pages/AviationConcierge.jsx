import React, { useState, useEffect } from 'react';
import { 
    Plane, 
    Shield, 
    Clock, 
    MapPin, 
    Car, 
    Sparkles, 
    ArrowRight, 
    PhoneCall, 
    Briefcase,
    Loader2 
} from 'lucide-react';
import AviationHubCard from '../components/aviation/AviationHubCard';
import AviationTransitModal from '../components/aviation/AviationTransitModal';

const AviationConcierge = () => {
    const [hubs, setHubs] = useState([]);
    const [fleet, setFleet] = useState([]);
    const [protocol, setProtocol] = useState(null);
    const [conciergeDesk, setConciergeDesk] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedHub, setSelectedHub] = useState(null);
    const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);
    const [confirmedDossier, setConfirmedDossier] = useState(null);

    useEffect(() => {
        const fetchAviationData = async () => {
            try {
                const res = await fetch('/api/aviation-concierge/hubs');
                const data = await res.json();
                if (data.success) {
                    setHubs(data.hubs);
                    setFleet(data.fleet);
                    setProtocol(data.protocol);
                    setConciergeDesk(data.conciergeDesk);
                }
            } catch (err) {
                console.error('Failed to load aviation hubs', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAviationData();
    }, []);

    const handleSelectHub = (hub) => {
        setSelectedHub(hub);
        setIsTransitModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 text-xs font-mono tracking-widest uppercase">
                        <Plane className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Private Aviation Apron & FBO Tarmac Escort</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Aviation Concierge & Runway Transit Portal
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        Seamless wardrobe transfer from our Atelier salons directly into your Gulfstream or Bombardier cabin. Chauffeured tarmac ramp escorts across Hanoi, Saigon, Geneva, and Nice.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-cyan-400" /> Zero-Handling Luggage Integrity
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-cyan-400" /> 10-15 Min VIP Fast-Track
                        </span>
                        <span className="flex items-center gap-1.5">
                            <PhoneCall className="w-4 h-4 text-cyan-400" /> {conciergeDesk || '24/7 Aviation Desk'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Protocol Highlights */}
                {protocol && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-zinc-950/80 border border-zinc-800 rounded-sm text-xs font-mono">
                        <div className="space-y-1">
                            <span className="text-cyan-400 uppercase text-[10px] block">I. Direct Apron Escort</span>
                            <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">{protocol.tarmacEscort}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-cyan-400 uppercase text-[10px] block">II. Diplomatic Customs Fast-Track</span>
                            <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">{protocol.customsFastTrack}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-cyan-400 uppercase text-[10px] block">III. Zero-Handling Wardrobe</span>
                            <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">{protocol.luggageHandling}</p>
                        </div>
                    </div>
                )}

                {/* Aviation Hubs Showcase */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                            Connecting Global FBO Terminals...
                        </span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm uppercase font-mono tracking-widest text-zinc-200 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                Supported International Private Aviation Hubs
                            </h2>
                            <span className="text-xs font-mono text-cyan-400">
                                Global Apron Access
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {hubs.map((hub) => (
                                <AviationHubCard
                                    key={hub.id}
                                    hub={hub}
                                    onSelectHub={handleSelectHub}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Jet Fleet Amenity Bar */}
                {fleet.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-zinc-900">
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-400 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-cyan-400" />
                            Compatible Private Business Fleet & In-Cabin Wardrobe Amenities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fleet.map((jet) => (
                                <div key={jet.id} className="p-5 bg-zinc-950/70 border border-zinc-800 rounded-sm space-y-2 text-xs font-mono">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-serif font-medium text-white">{jet.name}</h4>
                                        <span className="text-[10px] text-cyan-300">{jet.rangeKm.split(' ')[0]} km range</span>
                                    </div>
                                    <p className="text-zinc-400 text-[11px] font-sans">{jet.capacity}</p>
                                    <div className="pt-2 border-t border-zinc-900/80 flex items-start gap-1.5 text-zinc-300 text-[11px]">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                        <span>Wardrobe: {jet.wardrobeAmenity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Transit Reservation Modal */}
            <AviationTransitModal
                isOpen={isTransitModalOpen}
                onClose={() => setIsTransitModalOpen(false)}
                hub={selectedHub}
                onSuccess={(dossier) => {
                    setConfirmedDossier(dossier);
                }}
            />
        </div>
    );
};

export default AviationConcierge;
