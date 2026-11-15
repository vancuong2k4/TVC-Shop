import React, { useState } from 'react';
import { X, Wrench, Shield, CheckCircle2, Clock, Phone, Loader2 } from 'lucide-react';

const SensorDiagnosticModal = ({
    isOpen,
    onClose,
    residence,
    onSuccess
}) => {
    if (!isOpen || !residence) return null;

    const [technicianNotes, setTechnicianNotes] = useState('');
    const [preferredTime, setPreferredTime] = useState('MORNING_09_12');
    const [submitting, setSubmitting] = useState(false);
    const [dispatchedTicket, setDispatchedTicket] = useState(null);

    const handleDispatch = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/wardrobe-tracker/calibrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    residence_id: residence.id,
                    action: 'DISPATCH_TECHNICIAN',
                    target_humidity: 48
                })
            });

            const data = await res.json();
            if (data.success) {
                setDispatchedTicket(data.event);
                if (onSuccess) onSuccess(data.event);
            }
        } catch (err) {
            console.error('Dispatch failed', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 text-white rounded-sm shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
                    <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Atelier IoT Environmental Technician Request
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {dispatchedTicket ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-lg font-serif text-white">Technician Ticket Dispatched</h4>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Reference: <span className="text-amber-400">{dispatchedTicket.event_id}</span>
                                </p>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed">
                                An Atelier Environmental Specialist equipped with Swiss Sensirion calibration tools will arrive at <span className="text-white">{residence.name}</span>.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black text-xs uppercase font-mono tracking-widest font-semibold hover:bg-zinc-200 transition rounded-sm"
                            >
                                Back To Live Telemetry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleDispatch} className="space-y-4">
                            <div className="p-3 bg-zinc-900/50 border border-zinc-800 text-xs space-y-1">
                                <div className="text-zinc-500 font-mono">Target Residence:</div>
                                <div className="text-white font-serif">{residence.name} ({residence.city})</div>
                                <div className="text-zinc-400 font-mono text-[11px]">Sensor: {residence.sensorId}</div>
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                    Preferred Visit Window
                                </label>
                                <select
                                    value={preferredTime}
                                    onChange={(e) => setPreferredTime(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm font-mono"
                                >
                                    <option value="MORNING_09_12">Morning (09:00 - 12:00)</option>
                                    <option value="AFTERNOON_14_17">Afternoon (14:00 - 17:00)</option>
                                    <option value="EVENING_18_20">Evening (18:00 - 20:00)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                    Microclimate Notes / Wardrobe Observations
                                </label>
                                <textarea
                                    rows={3}
                                    value={technicianNotes}
                                    onChange={(e) => setTechnicianNotes(e.target.value)}
                                    placeholder="e.g. Cedar terpene cartridge replacement, check silicone door seals, sensor recalibration..."
                                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-amber-400 text-black hover:bg-amber-300 transition text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Dispatching Ticket...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wrench className="w-4 h-4" />
                                        <span>Dispatch Environmental Specialist</span>
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

export default SensorDiagnosticModal;
