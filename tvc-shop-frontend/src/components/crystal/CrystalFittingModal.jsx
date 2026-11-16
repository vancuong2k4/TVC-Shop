import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Shield, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';

const CrystalFittingModal = ({
    isOpen,
    onClose,
    selectedCrystal,
    selectedEnvironment,
    selectedSilhouette,
    onSuccess
}) => {
    if (!isOpen) return null;

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [fittingDate, setFittingDate] = useState('2026-11-25');
    const [specialRequests, setSpecialRequests] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/crystal-lighting/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_name: clientName,
                    client_email: clientEmail,
                    client_phone: clientPhone,
                    crystal_id: selectedCrystal?.id || 'swarovski-aurora-borealis',
                    environment_id: selectedEnvironment?.id || 'grand-opera-chandelier',
                    silhouette_id: selectedSilhouette?.id || 'gown-bias-cut-noir',
                    fitting_date: fittingDate,
                    special_requests: specialRequests
                })
            });

            const data = await res.json();
            if (data.success) {
                setConfirmedBooking(data.dossier);
                if (onSuccess) onSuccess(data.dossier);
            } else {
                setErrorMessage(data.message || 'Fitting reservation failed.');
            }
        } catch (err) {
            setErrorMessage('Network or server connection issue. Please retry.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 text-white rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Private Chamber Crystal Fitting Reservation
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5">
                    {confirmedBooking ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-lg font-serif text-white">Chamber Fitting Confirmed</h4>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Reservation: <span className="text-amber-400">{confirmedBooking.booking_ref}</span>
                                </p>
                            </div>

                            <div className="bg-zinc-900/60 p-4 rounded-sm border border-zinc-800 text-left text-xs space-y-2.5">
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Location:</span>
                                    <span className="text-zinc-200">{confirmedBooking.salon_chamber}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Scheduled Date:</span>
                                    <span className="text-amber-300 font-mono font-medium">{confirmedBooking.fitting_date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Status:</span>
                                    <span className="text-emerald-400 font-mono">{confirmedBooking.status}</span>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                                The dark chamber will be calibrated with 2,700K tungsten chandeliers and directional pin spots to preview your gown's exact gala luminescence.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black text-xs uppercase font-mono tracking-widest font-semibold hover:bg-zinc-200 transition rounded-sm"
                            >
                                Return To Studio
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Commission Summary */}
                            <div className="bg-zinc-900/40 border border-zinc-800 p-3.5 rounded-sm space-y-1.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Silhouette:</span>
                                    <span className="text-zinc-200 font-medium">{selectedSilhouette?.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Crystal:</span>
                                    <span className="text-amber-300">{selectedCrystal?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Photometric Scenario:</span>
                                    <span className="text-zinc-300">{selectedEnvironment?.name}</span>
                                </div>
                                <div className="pt-2 border-t border-zinc-800 flex justify-between font-mono text-xs">
                                    <span className="text-zinc-400">Crystal Surcharge:</span>
                                    <span className="text-amber-400 font-bold">+{Number(selectedCrystal?.surcharge || 0).toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Client Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Madame / Monsieur"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        VIP Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="gala@haute.tvc"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Private Telephone
                                    </label>
                                    <input
                                        type="tel"
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="+84 90 999 8888"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Fitting Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={fittingDate}
                                        onChange={(e) => setFittingDate(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                    Special Beading Notes / Gala Venue Details
                                </label>
                                <input
                                    type="text"
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    placeholder="e.g. Red carpet step-and-repeat photography focus, high back drape"
                                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
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
                                            <span>Reserving Dark Chamber...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            <span>Reserve Private Chamber Fitting</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrystalFittingModal;
