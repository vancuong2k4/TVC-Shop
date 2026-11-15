import React, { useState, useEffect } from 'react';
import { 
    Activity, 
    Radio, 
    Droplets, 
    Thermometer, 
    Shield, 
    Wrench, 
    Sparkles, 
    RefreshCw, 
    CheckCircle2, 
    Loader2,
    Home,
    AlertCircle
} from 'lucide-react';
import MicroclimateGauge from '../components/wardrobe/MicroclimateGauge';
import SensorDiagnosticModal from '../components/wardrobe/SensorDiagnosticModal';

const WardrobeTracker = () => {
    const [residences, setResidences] = useState([]);
    const [selectedResidence, setSelectedResidence] = useState(null);
    const [sensorHistory, setSensorHistory] = useState([]);
    const [thresholds, setThresholds] = useState(null);
    const [sensorModel, setSensorModel] = useState('');
    const [loading, setLoading] = useState(true);

    const [loadingAction, setLoadingAction] = useState(false);
    const [actionMessage, setActionMessage] = useState('');
    const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

    const fetchTelemetry = async () => {
        try {
            const res = await fetch('/api/wardrobe-tracker/telemetry');
            const data = await res.json();
            if (data.success) {
                setResidences(data.residences);
                setSensorHistory(data.sensorHistory);
                setThresholds(data.thresholds);
                setSensorModel(data.smartSensorModel);
                if (data.residences?.length) {
                    setSelectedResidence(prev => prev ? data.residences.find(r => r.id === prev.id) || data.residences[0] : data.residences[0]);
                }
            }
        } catch (err) {
            console.error('Failed to load wardrobe telemetry', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTelemetry();
        // Telemetry poll every 30s
        const interval = setInterval(fetchTelemetry, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleTriggerAction = async (residenceId, actionType) => {
        setLoadingAction(true);
        setActionMessage('');

        try {
            const res = await fetch('/api/wardrobe-tracker/calibrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    residence_id: residenceId,
                    action: actionType,
                    target_humidity: 48
                })
            });

            const data = await res.json();
            if (data.success) {
                setActionMessage(data.message);
                fetchTelemetry();
                setTimeout(() => setActionMessage(''), 6000);
            }
        } catch (err) {
            console.error('Action failed', err);
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 text-xs font-mono tracking-widest uppercase">
                        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>IoT Haute Horlogerie Environmental Intelligence</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Atelier Microclimate & Wardrobe Telemetry
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        Swiss-engineered Sensirion SHT45 continuous sensing protecting your bespoke vicuña, cashmere coats, and mulberry silks across your private residences in real time.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-cyan-400" /> Continuous Sub-Second Telemetry
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Droplets className="w-4 h-4 text-cyan-400" /> Automated Peltier Dehumidification
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-cyan-400" /> Anti-Moth Terpene Shield
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                {/* Residence Selector Tabs */}
                {residences.length > 0 && (
                    <div className="space-y-3">
                        <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 flex items-center gap-2">
                            <Home className="w-3.5 h-3.5 text-cyan-400" />
                            Select Monitored Estate Chamber:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {residences.map((res) => {
                                const isSelected = selectedResidence?.id === res.id;
                                return (
                                    <button
                                        key={res.id}
                                        onClick={() => setSelectedResidence(res)}
                                        className={`p-4 text-left border rounded-sm transition flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-cyan-400 bg-zinc-900/90 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                                                : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-mono uppercase text-zinc-500">{res.city}</span>
                                            <span className={`w-2 h-2 rounded-full ${res.status === 'OPTIMAL' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                        </div>
                                        <div className="text-sm font-serif font-medium text-white truncate">{res.name}</div>
                                        <div className="text-[11px] font-mono text-zinc-400 mt-2 flex justify-between">
                                            <span>{res.garmentsProtectedCount} garments</span>
                                            <span className="text-cyan-300">{res.currentHumidityPct}% RH</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Remote Feedback Banner */}
                {actionMessage && (
                    <div className="p-4 bg-cyan-950/40 border border-cyan-800/80 rounded-sm text-xs text-cyan-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>{actionMessage}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">IoT Dispatch Executed</span>
                    </div>
                )}

                {/* Main Gauge View */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                            Polling Swiss Sensirion Environmental Satellites...
                        </span>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <MicroclimateGauge
                            residence={selectedResidence}
                            onTriggerAction={handleTriggerAction}
                            loadingAction={loadingAction}
                        />

                        {/* Historical 24h Telemetry Strip */}
                        <div className="border border-zinc-800 bg-zinc-950/80 p-6 rounded-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                                <div>
                                    <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300">
                                        24-Hour Microclimate Stability Curve
                                    </h4>
                                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                                        Sensor telemetry: {sensorModel}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsDiagnosticModalOpen(true)}
                                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-amber-400 text-zinc-300 hover:text-white text-xs font-mono uppercase tracking-wider rounded-sm transition flex items-center gap-1.5"
                                >
                                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Dispatch Technician</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                                {sensorHistory.map((point, idx) => (
                                    <div key={idx} className="p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-sm text-center space-y-1">
                                        <span className="text-[10px] font-mono text-zinc-500 block">{point.time}</span>
                                        <div className="text-sm font-mono text-cyan-300 font-medium">{point.humidity}% RH</div>
                                        <div className="text-[11px] font-mono text-zinc-400">{point.temp}°C</div>
                                    </div>
                                ))}
                            </div>

                            {thresholds && (
                                <div className="pt-3 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono text-zinc-400">
                                    <div>
                                        <span className="text-zinc-500 block">OPTIMAL RH:</span>
                                        <span className="text-emerald-400">{thresholds.optimalHumidityRange}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500 block">DANGER UPPER LIMIT:</span>
                                        <span className="text-rose-400">{thresholds.dangerHumidityHigh}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500 block">PURGE CYCLE:</span>
                                        <span className="text-zinc-300">{thresholds.airCirculationCycle}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Diagnostic Modal */}
            <SensorDiagnosticModal
                isOpen={isDiagnosticModalOpen}
                onClose={() => setIsDiagnosticModalOpen(false)}
                residence={selectedResidence}
            />
        </div>
    );
};

export default WardrobeTracker;
