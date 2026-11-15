import React, { useState } from 'react';
import { X, Truck, Shield, Clock, CheckCircle2, AlertCircle, PhoneCall, Loader2 } from 'lucide-react';

const ValetDispatchModal = ({
    isOpen,
    onClose,
    valetServices = [],
    onSuccess
}) => {
    if (!isOpen) return null;

    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [serviceType, setServiceType] = useState(valetServices[0]?.id || 'valet-white-glove-pickup');
    const [garmentDescription, setGarmentDescription] = useState('Bespoke Cashmere Overcoat + 2 Tailored Suits');
    const [urgency, setUrgency] = useState('STANDARD');
    const [specialInstructions, setSpecialInstructions] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [confirmedDossier, setConfirmedDossier] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/valet-handbook/dispatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_name: clientName,
                    client_phone: clientPhone,
                    client_address: clientAddress,
                    service_type: serviceType,
                    garment_description: garmentDescription,
                    urgency: urgency,
                    special_instructions: specialInstructions
                })
            });

            const data = await res.json();
            if (data.success) {
                setConfirmedDossier(data.dossier);
                if (onSuccess) onSuccess(data.dossier);
            } else {
                setErrorMessage(data.message || 'Dispatch booking failed.');
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
                        <Truck className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Private Butler Wardrobe Courier Dispatch
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {confirmedDossier ? (
                        <div className="text-center py-6 space-y-5">
                            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-lg font-serif text-white">Chauffeured Courier Booked</h4>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Dossier: <span className="text-amber-400">{confirmedDossier.dossier_code}</span>
                                </p>
                            </div>

                            <div className="bg-zinc-900/60 p-4 rounded-sm border border-zinc-800 text-left text-xs space-y-2.5">
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Service Selected:</span>
                                    <span className="text-zinc-200 font-medium">{confirmedDossier.service_type}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Courier Window:</span>
                                    <span className="text-emerald-400 font-mono font-medium">{confirmedDossier.courier_eta}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Status:</span>
                                    <span className="text-amber-300 font-mono">{confirmedDossier.status}</span>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                                The Butler Desk will place a brief courtesy call to confirm gate entry and garment handover protocols.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black text-xs uppercase font-mono tracking-widest font-semibold hover:bg-zinc-200 transition"
                            >
                                Return To Handbook
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errorMessage && (
                                <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                    Select Butler Valet Service *
                                </label>
                                <select
                                    value={serviceType}
                                    onChange={(e) => setServiceType(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                >
                                    {valetServices.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.title} — ({s.cost})
                                        </option>
                                    ))}
                                </select>
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
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                    Residence Address (Hanoi or HCMC) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={clientAddress}
                                    onChange={(e) => setClientAddress(e.target.value)}
                                    placeholder="Villa No. 12, Tay Ho District, Hanoi"
                                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                    Garment Pieces To Entrust *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={garmentDescription}
                                    onChange={(e) => setGarmentDescription(e.target.value)}
                                    placeholder="e.g. 1 Cashmere Greatcoat, 1 Silk Crepe Evening Gown"
                                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Dispatch Urgency
                                    </label>
                                    <select
                                        value={urgency}
                                        onChange={(e) => setUrgency(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm font-mono"
                                    >
                                        <option value="STANDARD">Next Day Courier</option>
                                        <option value="EXPEDITED_SAME_DAY">Priority Same-Day (Within 3h)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Special Concierge Note
                                    </label>
                                    <input
                                        type="text"
                                        value={specialInstructions}
                                        onChange={(e) => setSpecialInstructions(e.target.value)}
                                        placeholder="e.g. Red wine spot on right lapel"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                                    />
                                </div>
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
                                            <span>Transmitting to Butler Desk...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Truck className="w-4 h-4" />
                                            <span>Authorize Valet Courier Dispatch</span>
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

export default ValetDispatchModal;
