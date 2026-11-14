import React, { useState } from 'react';
import { X, Calendar, Download, Sparkles, Check, Bookmark, Send } from 'lucide-react';

const WearScheduleModal = ({
    isOpen,
    onClose,
    garmentName,
    summary,
    wearsPerYear,
    estimatedYears
}) => {
    const [clientEmail, setClientEmail] = useState('');
    const [savedSuccess, setSavedSuccess] = useState(false);

    if (!isOpen) return null;

    const occasions = [
        { season: 'Winter / Gala', frequency: '2-3 wears / month', focus: 'Black Tie, Evening Banquets, Art Openings' },
        { season: 'Spring / Transitional', frequency: '3-4 wears / month', focus: 'VIP Salon Salons, Boardroom Presentations' },
        { season: 'Autumn / Runway', frequency: '4-5 wears / month', focus: 'Fashion Weeks, Travel Jetsetting, Private Dinners' }
    ];

    const handleSaveSchedule = (e) => {
        e.preventDefault();
        setSavedSuccess(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 text-white rounded-sm shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Rotational Wardrobe Calendar & Amortization Plan
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Garment Investment Portfolio</span>
                        <h4 className="text-lg font-serif text-white">{garmentName}</h4>
                        <p className="text-xs text-zinc-400 mt-1">
                            Calculated at {wearsPerYear} wears/year across {estimatedYears} years of heirloom preservation.
                        </p>
                    </div>

                    {/* Occasion Rotation Grid */}
                    <div className="space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                            Recommended Wear Cadence
                        </span>
                        <div className="space-y-2">
                            {occasions.map((occ, idx) => (
                                <div key={idx} className="p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-sm flex items-center justify-between text-xs">
                                    <div>
                                        <div className="text-zinc-200 font-medium">{occ.season}</div>
                                        <div className="text-[11px] text-zinc-500">{occ.focus}</div>
                                    </div>
                                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded">
                                        {occ.frequency}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preservation Tips */}
                    <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-sm text-xs space-y-1.5 text-zinc-400">
                        <div className="text-white font-medium flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-mono">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Garment Longevity Golden Rule
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Always allow natural fibers (cashmere, worsted wool, Mulberry silk) 24 hours of rest on a contoured cedar wood hanger between wearings to shed natural creases and restore loft without pressing.
                        </p>
                    </div>

                    {savedSuccess ? (
                        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-sm text-center space-y-2">
                            <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                            <div className="text-xs text-white font-medium">Investment Dossier Dispatched</div>
                            <p className="text-[11px] text-zinc-400 font-mono">
                                A tailored amortization schedule and care calendar has been sent to {clientEmail || 'your email'}.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-2 text-xs text-emerald-400 hover:underline uppercase font-mono tracking-wider"
                            >
                                Close Window
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveSchedule} className="space-y-3">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                                Export Amortization Dossier to VIP Email
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    required
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    placeholder="patron@tvc-atelier.com"
                                    className="flex-1 bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-emerald-400 outline-none rounded-sm"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-400 text-black text-xs font-mono font-semibold uppercase tracking-wider hover:bg-emerald-300 transition flex items-center gap-1.5 rounded-sm"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Export</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WearScheduleModal;
