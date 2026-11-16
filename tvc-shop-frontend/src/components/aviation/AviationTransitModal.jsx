import React, { useState } from 'react';
import { X, Plane, CheckCircle2, Shield, AlertCircle, Clock, Calendar, Users, Briefcase, Loader2 } from 'lucide-react';

const AviationTransitModal = ({
    isOpen,
    onClose,
    hub,
    onSuccess
}) => {
    if (!isOpen || !hub) return null;

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [tailNumber, setTailNumber] = useState('VN-A888 (Gulfstream G700)');
    const [flightDate, setFlightDate] = useState('2026-11-26');
    const [flightTime, setFlightTime] = useState('14:30');
    const [passengerCount, setPassengerCount] = useState(4);
    const [wardrobePieces, setWardrobePieces] = useState(8);
    const [cateringNotes, setCateringNotes] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [confirmedDossier, setConfirmedDossier] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/aviation-concierge/transit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hub_id: hub.id,
                    client_name: clientName,
                    client_email: clientEmail,
                    client_phone: clientPhone,
                    tail_number: tailNumber,
                    flight_date: flightDate,
                    flight_time: flightTime,
                    passenger_count: Number(passengerCount),
                    wardrobe_pieces_count: Number(wardrobePieces),
                    special_catering_notes: cateringNotes
                })
            });

            const data = await res.json();
            if (data.success) {
                setConfirmedDossier(data.dossier);
                if (onSuccess) onSuccess(data.dossier);
            } else {
                setErrorMessage(data.message || 'Transit booking failed.');
            }
        } catch (err) {
            setErrorMessage('Network or flight operations server issue. Please retry.');
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
                        <Plane className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Private Jet Apron & Tarmac Wardrobe Transfer
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
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-lg font-serif text-white">Aviation Transit Clearance Confirmed</h4>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Dossier: <span className="text-cyan-400">{confirmedDossier.dossier_code}</span>
                                </p>
                            </div>

                            <div className="bg-zinc-900/60 p-4 rounded-sm border border-zinc-800 text-left text-xs space-y-2.5 font-mono">
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500">Terminal:</span>
                                    <span className="text-zinc-200">{hub.name} ({hub.icao})</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500">Ramp Escort Officer:</span>
                                    <span className="text-cyan-300 font-medium">{confirmedDossier.assigned_officer}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                                    <span className="text-zinc-500">Scheduled Departure:</span>
                                    <span className="text-zinc-200">{confirmedDossier.flight_date} at {confirmedDossier.flight_time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Clearance Status:</span>
                                    <span className="text-emerald-400">{confirmedDossier.status}</span>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                                The tarmac Maybach limousine escort will meet your party at the private aviation gate 15 minutes prior to engine start.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-white text-black text-xs uppercase font-mono tracking-widest font-semibold hover:bg-zinc-200 transition rounded-sm"
                            >
                                Return To Aviation Desk
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Hub Brief */}
                            <div className="bg-zinc-900/40 border border-zinc-800 p-3.5 rounded-sm space-y-1 text-xs">
                                <div className="text-[10px] font-mono uppercase text-cyan-400">{hub.icao} • {hub.city}</div>
                                <div className="text-white font-serif font-medium">{hub.name}</div>
                                <div className="text-zinc-400 text-[11px] font-mono">{hub.terminal}</div>
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
                                        Client Full Name *
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
                                        Private VIP Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="aviation@haute.tvc"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Private Phone / Satellite Line *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="+84 90 999 8888"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Aircraft Tail Number
                                    </label>
                                    <input
                                        type="text"
                                        value={tailNumber}
                                        onChange={(e) => setTailNumber(e.target.value)}
                                        placeholder="e.g. VN-A999"
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Departure Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={flightDate}
                                        onChange={(e) => setFlightDate(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Departure Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={flightTime}
                                        onChange={(e) => setFlightTime(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Passengers
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="16"
                                        value={passengerCount}
                                        onChange={(e) => setPassengerCount(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                        Wardrobe Trunks / Pieces
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={wardrobePieces}
                                        onChange={(e) => setWardrobePieces(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                                    Special On-Board Dressing & Catering Notes
                                </label>
                                <textarea
                                    rows={2}
                                    value={cateringNotes}
                                    onChange={(e) => setCateringNotes(e.target.value)}
                                    placeholder="e.g. Pre-steaming of gala gown in cabin wardrobe closet prior to landing"
                                    className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none rounded-sm resize-none"
                                />
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
                                            <span>Authorizing Apron Ramp Security...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plane className="w-4 h-4" />
                                            <span>Authorize Aviation Tarmac Transit</span>
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

export default AviationTransitModal;
