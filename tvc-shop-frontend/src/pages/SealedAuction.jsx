import React, { useState, useEffect } from 'react';
import { 
    Gavel, 
    Shield, 
    Lock, 
    Clock, 
    Award, 
    FileCheck, 
    Sparkles, 
    AlertCircle, 
    Loader2 
} from 'lucide-react';
import AuctionLotCard from '../components/auction/AuctionLotCard';
import SealedBidModal from '../components/auction/SealedBidModal';

const SealedAuction = () => {
    const [lots, setLots] = useState([]);
    const [rules, setRules] = useState(null);
    const [escrowStatus, setEscrowStatus] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedLot, setSelectedLot] = useState(null);
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);
    const [committedReceipt, setCommittedReceipt] = useState(null);

    useEffect(() => {
        const fetchAuctionData = async () => {
            try {
                const res = await fetch('/api/sealed-auction/catalog');
                const data = await res.json();
                if (data.success) {
                    setLots(data.lots);
                    setRules(data.rules);
                    setEscrowStatus(data.escrowStatus);
                }
            } catch (err) {
                console.error('Failed to load auction catalog', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctionData();
    }, []);

    const handleOpenBidModal = (lot) => {
        setSelectedLot(lot);
        setIsBidModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-mono tracking-widest uppercase">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Swiss Escrow Encrypted Sealed-Bid Salon</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Archival Sealed-Bid Luxury Auction
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        Acquiring One-of-a-Kind runway archives, museum prototypes, and Metiers d’Art masterpieces under Vickrey blind-bid rules. Backed by Swiss custody escrow.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-amber-400" /> 100% Blind Vickrey Protocol
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-400" /> Authenticity Deed on Ethereum L2
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-400" /> Chauffeured Armored Delivery
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Rules Banner */}
                {rules && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-zinc-950/80 border border-zinc-800 rounded-sm text-xs">
                        <div className="space-y-1">
                            <span className="font-mono text-amber-400 uppercase text-[10px] block">I. Blind Bidding</span>
                            <p className="text-zinc-400 leading-relaxed text-[11px]">{rules.blindProtocol}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="font-mono text-amber-400 uppercase text-[10px] block">II. Escrow Deposit</span>
                            <p className="text-zinc-400 leading-relaxed text-[11px]">{rules.securityDeposit}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="font-mono text-amber-400 uppercase text-[10px] block">III. Armored Logistics</span>
                            <p className="text-zinc-400 leading-relaxed text-[11px]">{rules.deliveryProtocol}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="font-mono text-amber-400 uppercase text-[10px] block">IV. Curatorial Deed</span>
                            <p className="text-zinc-400 leading-relaxed text-[11px]">{rules.curatorialSignoff}</p>
                        </div>
                    </div>
                )}

                {/* Auction Lots Showcase */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                            Accessing High-Security Vault Chambers...
                        </span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm uppercase font-mono tracking-widest text-zinc-200 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                Active Archival Lots in Vault
                            </h2>
                            <span className="text-xs font-mono text-emerald-400">
                                ● Escrow Encrypted Network: Active
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {lots.map((lot) => (
                                <AuctionLotCard
                                    key={lot.id}
                                    lot={lot}
                                    onSelectLot={handleOpenBidModal}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sealed Bid Modal */}
            <SealedBidModal
                isOpen={isBidModalOpen}
                onClose={() => setIsBidModalOpen(false)}
                lot={selectedLot}
                onSuccess={(receipt) => {
                    setCommittedReceipt(receipt);
                }}
            />
        </div>
    );
};

export default SealedAuction;
