import React, { useState } from 'react';
import { X, Award, CheckCircle, Shield, AlertCircle, Loader2 } from 'lucide-react';

const ArtisanSealModal = ({
    isOpen,
    onClose,
    selectedThread,
    selectedZone,
    selectedSeal,
    monogramText,
    fontStyle,
    onOrderSuccess
}) => {
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [garmentItem, setGarmentItem] = useState('TVC Archival Wool Trench Coat (Black / 48)');
    const [artisanNotes, setArtisanNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const totalEstimate = (selectedThread?.surcharge || 0) + (selectedSeal?.surcharge || 0);

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSubmitting(true);

        try {
            const payload = {
                client_name: clientName,
                client_email: clientEmail,
                client_phone: clientPhone,
                garment_item: garmentItem,
                thread_id: selectedThread?.id || 'gold-24k',
                placement_zone: selectedZone?.id || 'inner-breast-pocket',
                monogram_text: monogramText || 'TVC',
                font_style: fontStyle,
                artisan_seal_id: selectedSeal?.id || null,
                artisan_notes: artisanNotes
            };

            const response = await fetch('/api/bespoke-embroidery/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                setConfirmedOrder(data.order);
                if (onOrderSuccess) onOrderSuccess(data.order);
            } else {
                setErrorMessage(data.message || 'Submission encountered an error.');
            }
        } catch (err) {
            setErrorMessage('Network or server connection issue. Please retry.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 text-white rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <h2 className="text-sm uppercase tracking-widest font-mono text-zinc-200">
                            Artisan Bespoke Commission Sign-Off
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {confirmedOrder ? (
                        <div className="text-center py-8 space-y-5">
                            <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/40 rounded-full flex items-center justify-center mx-auto text-amber-400">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif text-white mb-1">Commission Registered</h3>
                                <p className="text-xs text-zinc-400 font-mono">
                                    Dossier Code: <span className="text-amber-400">{confirmedOrder.commission_code}</span>
                                </p>
                            </div>

                            <div className="bg-zinc-900/60 p-5 rounded-sm border border-zinc-800 text-left space-y-3 text-xs">
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Assigned Master Artisan:</span>
                                    <span className="text-zinc-200 font-medium">{confirmedOrder.artisan_assigned}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Digital Certificate No:</span>
                                    <span className="text-amber-400 font-mono">{confirmedOrder.certificate_number}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Estimated Dispatch:</span>
                                    <span className="text-zinc-200">{confirmedOrder.estimated_dispatch}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Commission Status:</span>
                                    <span className="text-emerald-400 font-mono">{confirmedOrder.status}</span>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
                                Our Master Artisan will hand-stretch the backing linen and perform test embroidery tension calibration before final application. An atelier update will be dispatched to {clientEmail || 'your email'}.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black text-xs uppercase tracking-widest font-mono hover:bg-zinc-200 transition font-medium"
                            >
                                Return to Studio
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitOrder} className="space-y-5">
                            {/* Commission Summary Card */}
                            <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-sm space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Thread:</span>
                                    <span className="text-amber-300 font-medium">{selectedThread?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Placement:</span>
                                    <span className="text-zinc-300">{selectedZone?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Inscription:</span>
                                    <span className="text-white font-serif tracking-wider font-semibold">"{monogramText}"</span>
                                </div>
                                {selectedSeal && (
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 font-mono">Insignia Seal:</span>
                                        <span className="text-zinc-300">{selectedSeal.title}</span>
                                    </div>
                                )}
                                <div className="pt-2 border-t border-zinc-800 flex justify-between font-mono text-xs">
                                    <span className="text-zinc-400">Total Bespoke Surcharge:</span>
                                    <span className="text-amber-400 font-bold">+{totalEstimate.toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* Client Information Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Madame / Monsieur Le"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                                        VIP Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="concierge@haute.tvc"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                                        Phone / WhatsApp (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="+84 90 123 4567"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                                        Garment Piece To Embroider *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={garmentItem}
                                        onChange={(e) => setGarmentItem(e.target.value)}
                                        placeholder="Garment SKU or Title"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                                    Artisan Instructions / Tailoring Notes
                                </label>
                                <textarea
                                    rows={2}
                                    value={artisanNotes}
                                    onChange={(e) => setArtisanNotes(e.target.value)}
                                    placeholder="Special spacing, vertical stacking preference, or commemorative date details..."
                                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm resize-none"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 transition text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Submitting To Atelier...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4" />
                                            <span>Authorize Commission & Assign Master Artisan</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-zinc-500 text-center mt-2 font-mono">
                                    Each piece includes a cryptographic authenticity seal & complimentary lifetime re-tightening.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtisanSealModal;
