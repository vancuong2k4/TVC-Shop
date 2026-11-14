import React, { useState, useEffect } from 'react';
import { 
    Scissors, 
    Layers, 
    UserCheck, 
    Clock, 
    Calendar, 
    Sparkles, 
    ChevronRight, 
    AlertCircle, 
    ShieldCheck, 
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import AssignArtisanModal from '../../components/admin/AssignArtisanModal';

const AdminBespokeKanban = () => {
    const [columns, setColumns] = useState([]);
    const [commissions, setCommissions] = useState([]);
    const [artisans, setArtisans] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedCommission, setSelectedCommission] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [filterPriority, setFilterPriority] = useState('ALL');

    const fetchKanban = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/bespoke-kanban', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            const data = await res.json();
            if (data.success) {
                setColumns(data.columns);
                setCommissions(data.commissions);
                setArtisans(data.artisans);
                setSummary(data.summary);
            }
        } catch (err) {
            console.error('Failed to load bespoke kanban board', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKanban();
    }, []);

    const handleCommissionClick = (commission) => {
        setSelectedCommission(commission);
        setIsAssignModalOpen(true);
    };

    const handleUpdateCommissionState = (id, updatedFields) => {
        setCommissions(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, ...updatedFields };
            }
            return c;
        }));
    };

    const filteredCommissions = commissions.filter(c => {
        if (filterPriority === 'ALL') return true;
        return c.priority === filterPriority;
    });

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'DIPLOMATIC_EXPEDITE':
            case 'URGENT_RUNWAY':
                return 'bg-rose-950/60 border-rose-800 text-rose-300';
            case 'HIGH':
                return 'bg-amber-950/60 border-amber-800 text-amber-300';
            default:
                return 'bg-zinc-800/60 border-zinc-700 text-zinc-300';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Title & Metrics */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
                        <Scissors className="w-4 h-4" />
                        <span>Haute Couture Atelier Dispatch</span>
                    </div>
                    <h1 className="text-2xl font-serif text-white tracking-tight mt-1">
                        Bespoke Production & Artisan Assignment Kanban
                    </h1>
                    <p className="text-xs text-zinc-400 mt-1">
                        Live stage tracking of bespoke commissions, canvas basting, gold bullion work, and white-glove inspection.
                    </p>
                </div>

                {/* KPI Pill Summary */}
                {summary && (
                    <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-3 rounded-sm font-mono text-xs">
                        <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">Active Pipeline</span>
                            <span className="text-white font-bold">{summary.totalCommissions} Commissions</span>
                        </div>
                        <div className="w-[1px] h-8 bg-zinc-800"></div>
                        <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">Total Commission Value</span>
                            <span className="text-amber-400 font-bold">{Number(summary.activePipelineValue).toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="w-[1px] h-8 bg-zinc-800"></div>
                        <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">On-Track Velocity</span>
                            <span className="text-emerald-400 font-bold">{summary.onTrackRatePct}%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Artisans Roster Mini Bar */}
            <div className="bg-zinc-950/70 border border-zinc-800/80 p-4 rounded-sm">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-3 block">
                    Guildsman & Master Artisan Workload Allocation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {artisans.map(a => (
                        <div key={a.id} className="p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-sm flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                                    {a.avatar}
                                </div>
                                <div>
                                    <div className="text-zinc-200 font-medium">{a.name}</div>
                                    <div className="text-[10px] text-zinc-500 truncate max-w-[140px]">{a.role}</div>
                                </div>
                            </div>
                            <span className="font-mono text-[11px] text-zinc-400">
                                {a.activeCommissions} jobs
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kanban Columns Board */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                        Loading Atelier Production Stream...
                    </span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
                    {columns.map((col) => {
                        const colCommissions = filteredCommissions.filter(c => c.stage === col.id);
                        return (
                            <div key={col.id} className="bg-zinc-950/90 border border-zinc-800/90 rounded-sm flex flex-col min-h-[580px]">
                                {/* Column Header */}
                                <div className="p-3.5 border-b border-zinc-800/90 bg-zinc-900/40">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xs font-mono uppercase font-semibold text-zinc-200 truncate" title={col.title}>
                                            {col.title.split('. ')[1] || col.title}
                                        </h3>
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                                            {colCommissions.length}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 leading-tight truncate">
                                        {col.description}
                                    </p>
                                </div>

                                {/* Commission Cards List */}
                                <div className="p-2.5 space-y-3 flex-1 overflow-y-auto">
                                    {colCommissions.length === 0 ? (
                                        <div className="h-28 border border-dashed border-zinc-800/80 rounded-sm flex items-center justify-center text-zinc-600 text-[11px] font-mono">
                                            Stage Idle
                                        </div>
                                    ) : (
                                        colCommissions.map((comm) => (
                                            <div
                                                key={comm.id}
                                                onClick={() => handleCommissionClick(comm)}
                                                className="cursor-pointer p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-400/80 rounded-sm transition-all group space-y-2.5 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between text-[10px] font-mono">
                                                    <span className="text-amber-400 font-semibold">{comm.id}</span>
                                                    <span className={`px-1.5 py-0.5 border rounded uppercase ${getPriorityBadgeClass(comm.priority)}`}>
                                                        {comm.priority.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <h4 className="text-xs font-serif text-white font-medium line-clamp-2 group-hover:text-amber-300 transition-colors">
                                                    {comm.garmentTitle}
                                                </h4>

                                                <div className="text-[11px] text-zinc-400 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-zinc-500 font-mono text-[10px]">Client:</span>
                                                        <span className="text-zinc-300 truncate max-w-[120px] font-medium">{comm.clientName}</span>
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 truncate">
                                                        {comm.fabric}
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="space-y-1 pt-1 border-t border-zinc-800/60">
                                                    <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                                                        <span>Progress</span>
                                                        <span className="text-amber-400">{comm.progressPct}%</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-amber-400 transition-all duration-300"
                                                            style={{ width: `${comm.progressPct}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Footer: Artisan & Deadline */}
                                                <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-zinc-900">
                                                    <span className="text-zinc-300 truncate max-w-[90px]">{comm.assignedArtisan.split(' ')[0]} {comm.assignedArtisan.split(' ')[1]}</span>
                                                    <span className="flex items-center gap-1 text-zinc-400">
                                                        <Clock className="w-3 h-3 text-amber-400" />
                                                        {comm.deadline.slice(5)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal for Reassignment & Stage Progression */}
            <AssignArtisanModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                commission={selectedCommission}
                artisans={artisans}
                columns={columns}
                onUpdateCommission={handleUpdateCommissionState}
            />
        </div>
    );
};

export default AdminBespokeKanban;
