import React, { useState, useEffect } from 'react';
import { Calculator, Sparkles, TrendingUp, ShieldAlert, Award, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import CostPerWearMatrix from '../components/investment/CostPerWearMatrix';
import WearScheduleModal from '../components/investment/WearScheduleModal';

const InvestmentCalculator = () => {
    const [presets, setPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [loadingPresets, setLoadingPresets] = useState(true);

    // Custom Simulation Parameters
    const [purchasePrice, setPurchasePrice] = useState(28500000);
    const [estimatedYears, setEstimatedYears] = useState(15);
    const [wearsPerYear, setWearsPerYear] = useState(45);
    const [maintenancePerYear, setMaintenancePerYear] = useState(650000);
    const [expectedResalePct, setExpectedResalePct] = useState(60);
    const [fastFashionAltPrice, setFastFashionAltPrice] = useState(2400000);

    const [simulationResult, setSimulationResult] = useState(null);
    const [simulating, setSimulating] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    // Fetch benchmarks
    useEffect(() => {
        const fetchBenchmarks = async () => {
            try {
                const res = await fetch('/api/investment-calc/benchmarks');
                const data = await res.json();
                if (data.success && data.presets?.length) {
                    setPresets(data.presets);
                    applyPreset(data.presets[0]);
                }
            } catch (err) {
                console.error('Failed to load benchmarks', err);
            } finally {
                setLoadingPresets(false);
            }
        };

        fetchBenchmarks();
    }, []);

    const applyPreset = (preset) => {
        setSelectedPreset(preset);
        setPurchasePrice(preset.basePrice);
        setEstimatedYears(preset.avgLifespanYears);
        setWearsPerYear(preset.projectedWearsPerYear);
        setMaintenancePerYear(preset.maintenanceCostPerYear);
        setExpectedResalePct(preset.resaleValueRetentionPct);
        setFastFashionAltPrice(preset.fastFashionComparisonPrice);
    };

    // Run simulation
    const runSimulation = async () => {
        setSimulating(true);
        try {
            const res = await fetch('/api/investment-calc/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    purchase_price: purchasePrice,
                    estimated_years: estimatedYears,
                    wears_per_year: wearsPerYear,
                    maintenance_per_year: maintenancePerYear,
                    expected_resale_pct: expectedResalePct,
                    fast_fashion_alt_price: fastFashionAltPrice
                })
            });
            const data = await res.json();
            if (data.success) {
                setSimulationResult(data);
            }
        } catch (err) {
            console.error('Simulation calculation error', err);
        } finally {
            setSimulating(false);
        }
    };

    // Auto calculate when sliders change
    useEffect(() => {
        const debounce = setTimeout(() => {
            runSimulation();
        }, 300);
        return () => clearTimeout(debounce);
    }, [purchasePrice, estimatedYears, wearsPerYear, maintenancePerYear, expectedResalePct, fastFashionAltPrice]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-400 selection:text-black">
            {/* Header Banner */}
            <div className="relative border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-black py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/5 text-emerald-300 text-xs font-mono tracking-widest uppercase">
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Haute Couture Financial Engineering</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-zinc-100">
                        Cost-Per-Wear & Investment Calculator
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-zinc-400 font-light leading-relaxed">
                        Quantifying the economic thesis of Quiet Luxury. Discover how archival tailoring, pure raw materials, and circular buybacks turn garment purchases into appreciating lifestyle assets.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Presets Bar */}
                {presets.length > 0 && (
                    <div className="space-y-3">
                        <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            Select Benchmark Atelier Archetype:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {presets.map((preset) => {
                                const isSelected = selectedPreset?.id === preset.id;
                                return (
                                    <button
                                        key={preset.id}
                                        onClick={() => applyPreset(preset)}
                                        className={`p-3.5 text-left border rounded-sm transition ${
                                            isSelected
                                                ? 'border-emerald-400 bg-zinc-900/90 text-white shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                                                : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                                        }`}
                                    >
                                        <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">{preset.category}</div>
                                        <div className="text-xs font-medium text-white truncate">{preset.name}</div>
                                        <div className="text-[11px] font-mono text-emerald-300 mt-1">
                                            {Number(preset.basePrice).toLocaleString('vi-VN')} ₫
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Simulation Control Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls Panel */}
                    <div className="lg:col-span-1 border border-zinc-800 bg-zinc-950/70 p-6 rounded-sm space-y-6">
                        <div className="border-b border-zinc-900 pb-3">
                            <h3 className="text-sm uppercase font-mono tracking-widest text-zinc-200">
                                Investment Assumptions
                            </h3>
                            <p className="text-[11px] text-zinc-500 mt-0.5">Adjust inputs to simulate wear trajectory</p>
                        </div>

                        {/* Purchase Price Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Acquisition Price</span>
                                <span className="text-emerald-400 font-semibold">{Number(purchasePrice).toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <input
                                type="range"
                                min={2000000}
                                max={60000000}
                                step={500000}
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                                className="w-full accent-emerald-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        {/* Estimated Lifespan */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Expected Lifespan</span>
                                <span className="text-emerald-400 font-semibold">{estimatedYears} Years</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={30}
                                step={1}
                                value={estimatedYears}
                                onChange={(e) => setEstimatedYears(Number(e.target.value))}
                                className="w-full accent-emerald-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        {/* Projected Wears / Year */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Wear Frequency</span>
                                <span className="text-emerald-400 font-semibold">{wearsPerYear} Wears / Year</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={150}
                                step={1}
                                value={wearsPerYear}
                                onChange={(e) => setWearsPerYear(Number(e.target.value))}
                                className="w-full accent-emerald-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        {/* Annual Care & Maintenance */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Annual Care & Steaming</span>
                                <span className="text-zinc-200">{Number(maintenancePerYear).toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={2000000}
                                step={50000}
                                value={maintenancePerYear}
                                onChange={(e) => setMaintenancePerYear(Number(e.target.value))}
                                className="w-full accent-emerald-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        {/* Expected Circular Resale Value */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400">Circular Resale Recovery</span>
                                <span className="text-amber-400 font-semibold">{expectedResalePct}%</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={85}
                                step={5}
                                value={expectedResalePct}
                                onChange={(e) => setExpectedResalePct(Number(e.target.value))}
                                className="w-full accent-emerald-400 bg-zinc-800 cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={() => setIsScheduleModalOpen(true)}
                            className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-emerald-400 text-white transition text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm"
                        >
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <span>Export Rotation Plan</span>
                        </button>
                    </div>

                    {/* Results & Analysis Matrix */}
                    <div className="lg:col-span-2">
                        {simulating ? (
                            <div className="flex flex-col items-center justify-center py-24 space-y-3">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                                    Simulating Multi-Year Amortization Trajectory...
                                </span>
                            </div>
                        ) : simulationResult ? (
                            <CostPerWearMatrix
                                summary={simulationResult.summary}
                                timeline={simulationResult.timeline}
                                garmentName={selectedPreset?.name || 'Bespoke Garment'}
                                materialGrade={selectedPreset?.materialGrade || 'Pure Fiber Archive'}
                            />
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Wear Schedule & Amortization Modal */}
            <WearScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                garmentName={selectedPreset?.name || 'Bespoke Garment'}
                summary={simulationResult?.summary}
                wearsPerYear={wearsPerYear}
                estimatedYears={estimatedYears}
            />
        </div>
    );
};

export default InvestmentCalculator;
