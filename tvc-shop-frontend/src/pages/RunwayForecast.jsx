import React, { useState, useEffect } from 'react';
import AtelierCartographyMap from '../components/forecast/AtelierCartographyMap';
import RunwayBriefingModal from '../components/forecast/RunwayBriefingModal';

const RunwayForecast = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [selectedSeasonKey, setSelectedSeasonKey] = useState('fw_2026');
    const [selectedAtelier, setSelectedAtelier] = useState(null);
    const [isBriefingOpen, setIsBriefingOpen] = useState(false);

    useEffect(() => {
        fetchForecastData();
    }, []);

    const fetchForecastData = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/runway-forecast/data');
            const json = await res.json();
            if (json.success) {
                setData(json);
                if (json.global_ateliers && json.global_ateliers.length > 0) {
                    setSelectedAtelier(json.global_ateliers[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching runway forecast data:', err);
        } finally {
            setLoading(false);
        }
    };

    const seasons = data?.seasons || {};
    const ateliers = data?.global_ateliers || [];
    const trendIndex = data?.trend_index || {};
    const currentSeason = seasons[selectedSeasonKey] || null;

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-amber-400 selection:text-black">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-950/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-amber-500/30 bg-amber-950/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber-300">
                            Haute Couture Trend Forecasting & Atelier Cartography
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Dự Báo Xu Hướng Sàn Diễn & Bản Đồ May Đo
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                        Bản đồ giải mã xu hướng sàn diễn tương lai (2026 - 2027) kết hợp tọa độ 5 xưởng may đo di sản quốc tế. Cho phép giới mộ điệu đặt giữ suất phác thảo độc bản trước khi mở màn Tuần lễ Thời trang Paris & Milan.
                    </p>

                    <button
                        onClick={() => setIsBriefingOpen(true)}
                        className="px-8 py-3.5 bg-amber-400 text-black hover:bg-amber-300 transition-all uppercase tracking-[0.2em] text-xs font-semibold inline-flex items-center space-x-3 shadow-xl"
                    >
                        <span>Giữ Suất Bản Phác Thảo Trước Sàn Diễn</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>

                {/* Macro Trend Indexes Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 p-6 border border-zinc-900 bg-zinc-950/60 backdrop-blur-md">
                    <div className="p-3 text-center border-b md:border-b-0 md:border-r border-zinc-900">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                            Chỉ Số Tăng Trưởng Quiet Luxury
                        </span>
                        <span className="text-2xl font-serif text-white font-bold">{trendIndex.quiet_luxury_growth || '+42.5%'}</span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Xu hướng tối giản thượng lưu</span>
                    </div>
                    <div className="p-3 text-center border-b md:border-b-0 md:border-r border-zinc-900">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                            Minh Bạch Nguồn Gốc Sợi Vải
                        </span>
                        <span className="text-2xl font-serif text-emerald-400 font-bold">{trendIndex.sustainable_traceable_demand || '+68.0%'}</span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Tiêu chuẩn Oeko-Tex & GOTS</span>
                    </div>
                    <div className="p-3 text-center">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                            Nhu Cầu May Đo Thủ Công Bespoke
                        </span>
                        <span className="text-2xl font-serif text-amber-400 font-bold">{trendIndex.bespoke_craftsmanship_interest || '+54.2%'}</span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Độc bản One-of-a-Kind</span>
                    </div>
                </div>

                {/* Seasons Selector Tabs */}
                <div className="flex justify-center space-x-3 mb-10">
                    {Object.entries(seasons).map(([key, s]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedSeasonKey(key)}
                            className={`px-6 py-2.5 uppercase font-mono tracking-widest text-xs transition-all border ${
                                selectedSeasonKey === key
                                    ? 'border-white bg-white text-black'
                                    : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                            }`}
                        >
                            {s.title}
                        </button>
                    ))}
                </div>

                {/* Selected Season Deep-Dive Trend Dossier */}
                {currentSeason && (
                    <div className="border border-zinc-800 bg-zinc-950/80 p-8 md:p-12 mb-16 backdrop-blur-md">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Visual Asset */}
                            <div className="lg:col-span-5 relative aspect-[3/4] overflow-hidden border border-zinc-900 bg-black">
                                <img
                                    src={currentSeason.image}
                                    alt={currentSeason.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                                        Trường Phái Thẩm Mỹ Chủ Đạo:
                                    </span>
                                    <p className="text-sm font-serif text-white font-medium">{currentSeason.aesthetic_movement}</p>
                                </div>
                            </div>

                            {/* Details, Color Swatches & Silhouettes */}
                            <div className="lg:col-span-7 space-y-6">
                                <div>
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                                        Mã Bản Lưu Trữ: {currentSeason.code}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">{currentSeason.title}</h2>
                                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                                        {currentSeason.material_innovations}
                                    </p>
                                </div>

                                {/* Color Swatches Forecast */}
                                <div className="p-4 bg-black/60 border border-zinc-900">
                                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-3">
                                        Dự Báo 4 Sắc Độ Thống Trị (Color Trend Score):
                                    </span>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {currentSeason.color_forecast.map((clr, idx) => (
                                            <div key={idx} className="p-2 border border-zinc-900 bg-zinc-950 text-center">
                                                <div 
                                                    className="w-full h-8 rounded-sm mb-2 border border-white/10" 
                                                    style={{ backgroundColor: clr.hex }}
                                                ></div>
                                                <p className="text-[11px] text-white truncate font-medium">{clr.name}</p>
                                                <span className="text-[10px] font-mono text-amber-400 block mt-0.5">{clr.trend_score}% Trend</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Silhouettes Matrix */}
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">
                                        Đặc Trưng Cấu Trúc Phom Dáng (Key Silhouettes):
                                    </span>
                                    <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside font-light">
                                        {currentSeason.key_silhouettes.map((sh, idx) => (
                                            <li key={idx}>{sh}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Master Atelier Global Cartography */}
                <div className="mb-16">
                    <AtelierCartographyMap
                        ateliers={ateliers}
                        selectedAtelier={selectedAtelier}
                        onSelect={(atl) => setSelectedAtelier(atl)}
                    />
                </div>
            </div>

            {/* Briefing Modal */}
            {isBriefingOpen && currentSeason && selectedAtelier && (
                <RunwayBriefingModal
                    season={currentSeason}
                    atelier={selectedAtelier}
                    onClose={() => setIsBriefingOpen(false)}
                    onSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default RunwayForecast;
