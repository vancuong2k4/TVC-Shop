import React, { useState } from 'react';
import { X, Lock, ShieldCheck, CheckCircle2, AlertCircle, FileCheck, ArrowRight, Loader2 } from 'lucide-react';

const SealedBidModal = ({
    isOpen,
    onClose,
    lot,
    onSuccess
}) => {
    if (!isOpen || !lot) return null;

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [bidAmountVnd, setBidAmountVnd] = useState(lot.minimumReserveVnd + 10000000);
    const [vipTier, setVipTier] = useState('DIAMOND_ELITE');
    const [escrowAccepted, setEscrowAccepted] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [confirmedReceipt, setConfirmedReceipt] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage('');

        if (bidAmountVnd < lot.minimumReserveVnd) {
            setErrorMessage(`Bid cannot be lower than the minimum reserve of ${Number(lot.minimumReserveVnd).toLocaleString('vi-VN')} ₫`);
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/sealed-auction/bid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lot_id: lot.id,
                    client_name: clientName,
                    client_email: clientEmail,
                    client_phone: clientPhone,
                    bid_amount_vnd: bidAmountVnd,
                    vip_tier: vipTier,
                    escrow_confirmation: escrowAccepted
                })
            });

            const data = await res.json();
            if (data.success) {
                setConfirmedReceipt(data.receipt);
                if (onSuccess) onSuccess(data.receipt);
            } else {
                setErrorMessage(data.message || 'Bid submission failed.');
            }
        } catch (err) {
            setErrorMessage('Network or escrow connection issue. Please retry.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 text-white rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Vickrey Encrypted Sealed-Bid Submission
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5">
                    {confirmedReceipt ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-lg font-serif text-white">Sealed Bid Committed to Escrow</h4>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Receipt: <span className="text-amber-400">{confirmedReceipt.receipt_id}</span>
                                </p>
                            </div>

                            <div className="bg-zinc-900/60 p-4 rounded-sm border border-zinc-800 text-left text-xs space-y-2.5 font-mono">
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500">Cryptographic Seal:</span>
                                    <span className="text-cyan-300">{confirmedReceipt.sha256_cryptographic_seal}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500">Encrypted Committed Bid:</span>
                                    <span className="text-amber-300 font-bold">{Number(confirmedReceipt.bid_amount_vnd).toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Escrow Security:</span>
                                    <span className="text-emerald-400">{confirmedReceipt.escrow_status}</span>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                                The curator will open the sealed dossier upon auction termination. If winning, an armored courier will be assigned to your estate.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black text-xs uppercase font-mono tracking-widest font-semibold hover:bg-zinc-200 transition rounded-sm"
                            >
                                Return To Auction Room
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Lot Brief */}
                            <div className="bg-zinc-900/40 border border-zinc-800 p-3.5 rounded-sm space-y-1.5 text-xs">
                                <div className="text-[10px] font-mono uppercase text-zinc-500">{lot.id} • {lot.edition}</div>
                                <div className="text-white font-serif font-medium">{lot.title}</div>
                                <div className="flex justify-between text-zinc-400 font-mono pt-1 text-[11px]">
                                    <span>Minimum Reserve:</span>
                                    <span className="text-amber-300 font-semibold">{Number(lot.minimumReserveVnd).toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                    Your Encrypted Sealed Valuation (VND) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    step="1000000"
                                    min={lot.minimumReserveVnd}
                                    value={bidAmountVnd}
                                    onChange={(e) => setBidAmountVnd(Number(e.target.value))}
                                    className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-sm text-amber-300 font-mono focus:border-amber-400 outline-none rounded-sm font-bold"
                                />
                                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                                    Highest secret bidder wins. No competitor can view your valuation.
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Client Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Monsieur / Madame"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Private VIP Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="curator@haute.tvc"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Private Telephone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="+84 90 999 8888"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Membership Patron Tier
                                    </label>
                                    <select
                                        value={vipTier}
                                        onChange={(e) => setVipTier(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm font-mono"
                                    >
                                        <option value="DIAMOND_ELITE">Diamond Elite Patron</option>
                                        <option value="GOLD_PATRON">Gold Member</option>
                                        <option value="SILVER_ARCHIVE">Silver Collector</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-sm flex items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    id="escrowAccept"
                                    checked={escrowAccepted}
                                    onChange={(e) => setEscrowAccepted(e.target.checked)}
                                    required
                                    className="mt-0.5 accent-amber-400 cursor-pointer"
                                />
                                <label htmlFor="escrowAccept" className="text-[11px] text-zinc-400 leading-relaxed cursor-pointer font-mono">
                                    I authorize the 10% refundable security deposit of {Number(lot.securityDepositVnd).toLocaleString('vi-VN')} ₫ held by {lot.escrowProvider}. Fully returned within 24h if outbid.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !escrowAccepted}
                                className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 transition text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Cryptographically Sealing Bid...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>Commit Encrypted Sealed Bid to Escrow</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SealedBidModal;
