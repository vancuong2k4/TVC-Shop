import React, { useState } from 'react';
import { X, Cpu, CheckCircle, Shield, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const HardwareStampingModal = ({
    isOpen,
    onClose,
    selectedMetal,
    selectedComponent,
    selectedHallmark,
    inscriptionText,
    typographyStyle,
    onSuccess
}) => {
    if (!isOpen) return null;

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [toolingNotes, setToolingNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmedDossier, setConfirmedDossier] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const totalEstimate = (selectedMetal?.surcharge || 0) + (selectedHallmark?.surcharge || 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/hardware-engraving/commission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_name: clientName,
                    client_email: clientEmail,
                    client_phone: clientPhone,
                    metal_id: selectedMetal?.id || 'grade5-titanium-dlc',
                    component_id: selectedComponent?.id || 'raccagni-zipper-pull',
                    inscription_text: inscriptionText || 'TVC',
                    typography_style: typographyStyle,
                    hallmark_id: selectedHallmark?.id || null,
                    special_tooling_notes: toolingNotes
                })
            });

            const data = await res.json();
            if (data.success) {
                setConfirmedDossier(data.dossier);
                if (onSuccess) onSuccess(data.dossier);
            } else {
                setErrorMessage(data.message || 'Engraving submission failed.');
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
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Horlogerie Metal Stamping Authorization
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5">
                    {confirmedDossier ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/30 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                                <CheckCircle className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-lg font-serif text-white">Laser Stamping Commission Dispatched</h4>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Dossier: <span className="text-cyan-400">{confirmedDossier.commission_code}</span>
                                </p>
                            </div>

                            <div className="bg-zinc-900/60 p-4 rounded-sm border border-zinc-800 text-left text-xs space-y-2.5">
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Serial Cryptograph:</span>
                                    <span className="text-cyan-300 font-mono font-medium">{confirmedDossier.serial_number}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Assigned Horloger:</span>
                                    <span className="text-zinc-200">{confirmedDossier.assigned_guildsman}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500 font-mono">Metrology Inspection:</span>
                                    <span className="text-emerald-400 font-mono">{confirmedDossier.inspection_tolerance}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Queue Status:</span>
                                    <span className="text-emerald-400 font-mono">{confirmedDossier.status}</span>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                                The metal workpiece will undergo 100x optical microscopy inspection before mounting onto your garment.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black text-xs uppercase font-mono tracking-widest font-semibold hover:bg-zinc-200 transition rounded-sm"
                            >
                                Return to Studio
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Commission Summary */}
                            <div className="bg-zinc-900/40 border border-zinc-800 p-3.5 rounded-sm space-y-1.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Alloy:</span>
                                    <span className="text-cyan-300 font-medium">{selectedMetal?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Fixture:</span>
                                    <span className="text-zinc-300">{selectedComponent?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500 font-mono">Laser Inscription:</span>
                                    <span className="text-white font-mono tracking-widest uppercase font-bold">"{inscriptionText}"</span>
                                </div>
                                {selectedHallmark && (
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500 font-mono">Hallmark Punch:</span>
                                        <span className="text-zinc-300">{selectedHallmark.title}</span>
                                    </div>
                                )}
                                <div className="pt-2 border-t border-zinc-800 flex justify-between font-mono text-xs">
                                    <span className="text-zinc-400">Total Tooling Surcharge:</span>
                                    <span className="text-cyan-400 font-bold">+{totalEstimate.toLocaleString('vi-VN')} ₫</span>
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
                                        placeholder="Monsieur / Madame"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        VIP Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="horlogerie@tvc-atelier.com"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="+84 90 999 8888"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Tooling / Surface Finish Notes
                                    </label>
                                    <input
                                        type="text"
                                        value={toolingNotes}
                                        onChange={(e) => setToolingNotes(e.target.value)}
                                        placeholder="e.g. Circular satin brushing or bead blast"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 bg-cyan-400 text-black hover:bg-cyan-300 transition text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Transmitting to CNC Laser Station...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Cpu className="w-4 h-4" />
                                            <span>Authorize Fiber Laser Stamping</span>
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

export default HardwareStampingModal;
