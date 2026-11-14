import React, { useState } from 'react';
import { X, UserCheck, Shield, Clock, AlertCircle, CheckCircle2, Scissors, ArrowRight } from 'lucide-react';

const AssignArtisanModal = ({
    isOpen,
    onClose,
    commission,
    artisans = [],
    columns = [],
    onUpdateCommission
}) => {
    if (!isOpen || !commission) return null;

    const [selectedArtisan, setSelectedArtisan] = useState(commission.assignedArtisan || '');
    const [selectedStage, setSelectedStage] = useState(commission.stage || '');
    const [progressPct, setProgressPct] = useState(commission.progressPct || 0);
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/bespoke-kanban/commissions/${commission.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    stage: selectedStage,
                    assignedArtisan: selectedArtisan,
                    progressPct: Number(progressPct),
                    note: note
                })
            });

            const data = await res.json();
            if (data.success) {
                setSuccessMessage('Commission dossier updated successfully.');
                if (onUpdateCommission) {
                    onUpdateCommission(commission.id, {
                        stage: selectedStage,
                        assignedArtisan: selectedArtisan,
                        progressPct: Number(progressPct)
                    });
                }
                setTimeout(() => {
                    onClose();
                }, 800);
            }
        } catch (err) {
            console.error('Update commission failed', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 text-white rounded-sm shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
                    <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-200">
                            Atelier Commission Dispatch & Artisan Assignment
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-5">
                    {/* Commission Info */}
                    <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-sm space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-amber-400">{commission.id}</span>
                            <span className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-[10px] text-zinc-300">
                                {commission.clientTier}
                            </span>
                        </div>
                        <div className="font-serif text-sm font-medium text-white">{commission.garmentTitle}</div>
                        <div className="text-zinc-400 text-[11px] font-mono">Client: {commission.clientName}</div>
                        <div className="text-zinc-500 text-[11px] truncate">Detail: {commission.customDetail}</div>
                    </div>

                    {successMessage && (
                        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 rounded-sm">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Master Artisan Assignment */}
                    <div>
                        <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                            Assigned Guildsman / Master Artisan
                        </label>
                        <select
                            value={selectedArtisan}
                            onChange={(e) => setSelectedArtisan(e.target.value)}
                            className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm"
                        >
                            {artisans.map((artisan) => (
                                <option key={artisan.id} value={artisan.name}>
                                    {artisan.name} — {artisan.role} ({artisan.activeCommissions} active tasks)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Production Stage */}
                    <div>
                        <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                            Production Stage
                        </label>
                        <select
                            value={selectedStage}
                            onChange={(e) => setSelectedStage(e.target.value)}
                            className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm font-mono"
                        >
                            {columns.map((col) => (
                                <option key={col.id} value={col.id}>
                                    {col.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Progress Percentage */}
                    <div>
                        <div className="flex justify-between text-xs font-mono mb-1.5">
                            <span className="text-zinc-400">Atelier Construction Completion</span>
                            <span className="text-amber-400 font-semibold">{progressPct}%</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={progressPct}
                            onChange={(e) => setProgressPct(e.target.value)}
                            className="w-full accent-amber-400 bg-zinc-800 cursor-pointer"
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-[11px] uppercase font-mono tracking-wider text-zinc-400 mb-1.5">
                            Artisan Handover / Atelier Notes
                        </label>
                        <textarea
                            rows={2}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. Chest canvas pad-stitching completed; basted for second fitting..."
                            className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-white focus:border-amber-400 outline-none rounded-sm resize-none"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider rounded-sm transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 bg-amber-400 text-black hover:bg-amber-300 transition text-xs font-mono font-semibold uppercase tracking-wider rounded-sm disabled:opacity-50 flex items-center gap-1.5"
                        >
                            {submitting ? 'Updating...' : 'Dispatch Atelier Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignArtisanModal;
