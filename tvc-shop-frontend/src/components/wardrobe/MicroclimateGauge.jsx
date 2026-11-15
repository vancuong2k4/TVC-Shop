import React from 'react';
import { 
    Thermometer, 
    Droplets, 
    Wind, 
    ShieldCheck, 
    AlertTriangle, 
    Radio, 
    CheckCircle2, 
    Sparkles 
} from 'lucide-react';

const MicroclimateGauge = ({ residence, onTriggerAction, loadingAction }) => {
    if (!residence) return null;

    const isOptimal = residence.status === 'OPTIMAL';
    const isElevated = residence.status === 'ELEVATED_HUMIDITY';

    return (
        <div className="border border-zinc-800 bg-zinc-950/90 rounded-sm p-6 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div 
                className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 ${
                    isOptimal ? 'bg-emerald-500' : isElevated ? 'bg-amber-500' : 'bg-rose-500'
                }`}
            />

            {/* Residence Title & Live Connectivity */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-4 gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                            Sensirion SHT45 Swiss Sensor Live
                        </span>
                    </div>
                    <h3 className="text-xl font-serif text-white mt-1">{residence.name}</h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        {residence.city} • ID: {residence.sensorId} • Ping: {residence.lastPing}
                    </p>
                </div>

                <div className={`px-3 py-1 rounded-sm border font-mono text-xs flex items-center gap-1.5 self-start sm:self-auto ${
                    isOptimal 
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                        : 'bg-amber-950/40 border-amber-800 text-amber-300'
                }`}>
                    {isOptimal ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span className="font-semibold uppercase tracking-wider">{residence.status.replace('_', ' ')}</span>
                </div>
            </div>

            {/* Core Telemetry Gauges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Humidity Gauge */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-sm space-y-1">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                        <span className="uppercase">Relative Humidity</span>
                        <Droplets className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                        {residence.currentHumidityPct}%
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 flex justify-between">
                        <span>Target: {residence.targetHumidityPct}%</span>
                        <span className={residence.currentHumidityPct > 52 ? 'text-amber-400' : 'text-emerald-400'}>
                            {residence.currentHumidityPct > 52 ? '+6.2% spike' : 'Balanced'}
                        </span>
                    </div>
                </div>

                {/* Temperature Gauge */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-sm space-y-1">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                        <span className="uppercase">Internal Temp</span>
                        <Thermometer className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                        {residence.currentTemperature}°C
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 flex justify-between">
                        <span>Target: {residence.targetTemperature}°C</span>
                        <span className="text-emerald-400">Stable</span>
                    </div>
                </div>

                {/* Air Quality (AQI) */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-sm space-y-1">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                        <span className="uppercase">Purity (AQI)</span>
                        <Wind className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-300">
                        {residence.airQualityAqi}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500">
                        Ultra-low VOC / PM2.5: 0
                    </div>
                </div>

                {/* Cedar Terpene Level */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-sm space-y-1">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                        <span className="uppercase">Cedar Terpenes</span>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
                        {residence.mothRepellentLevelPct}%
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500">
                        Moth Shield Active
                    </div>
                </div>
            </div>

            {/* Status Description Banner */}
            <div className="p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-sm text-xs text-zinc-300 flex items-start gap-2.5">
                <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                    <span className="font-mono uppercase text-[10px] text-zinc-500 block">Atelier Diagnostic Engine:</span>
                    <p className="leading-relaxed">{residence.statusDescription}</p>
                </div>
            </div>

            {/* IoT Remote Intervention Controls */}
            <div className="space-y-3 pt-2">
                <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 block">
                    Remote Environmental Override Actions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                        onClick={() => onTriggerAction(residence.id, 'ACTIVATE_DEHUMIDIFIER')}
                        disabled={loadingAction}
                        className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-400/80 text-white text-xs font-mono uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Peltier Dehumidifier</span>
                    </button>

                    <button
                        onClick={() => onTriggerAction(residence.id, 'PULSE_HEPA_PURIFIER')}
                        disabled={loadingAction}
                        className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-400/80 text-white text-xs font-mono uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Wind className="w-3.5 h-3.5 text-emerald-400" />
                        <span>HEPA Pulse Purge</span>
                    </button>

                    <button
                        onClick={() => onTriggerAction(residence.id, 'REFILL_CEDAR_OIL')}
                        disabled={loadingAction}
                        className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/80 text-white text-xs font-mono uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Cedar Terpene Mist</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MicroclimateGauge;
