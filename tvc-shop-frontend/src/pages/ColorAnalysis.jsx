import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaletteDisplayCard from '../components/color/PaletteDisplayCard';
import UndertoneQuizModal from '../components/color/UndertoneQuizModal';

const ColorAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [schema, setSchema] = useState(null);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [activePaletteKey, setActivePaletteKey] = useState('winter_noir');

    useEffect(() => {
        fetchSchema();
    }, []);

    const fetchSchema = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/color-analysis/schema');
            const data = await res.json();
            if (data.success) {
                setSchema(data);
            }
        } catch (err) {
            console.error('Error fetching color schema:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDiagnoseComplete = (result) => {
        setDiagnosisResult(result);
        if (result.recommended_palette_key) {
            setActivePaletteKey(result.recommended_palette_key);
        }
        setIsQuizOpen(false);
    };

    const palettes = schema?.seasonal_palettes || {};
    const questions = schema?.diagnostic_questions || [];
    const activePalette = palettes[activePaletteKey] || null;

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-white selection:text-black">
            {/* Ambient Background subtle aura */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-zinc-800/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 border border-zinc-800 bg-zinc-950/60 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-zinc-400">
                            Atelier Chromatic & Seasonal Undertone Studio
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Phân Tích Sắc Tố Da & Bảng Màu Cá Nhân Hóa
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                        Ứng dụng lý thuyết phân tích sắc độ 4 mùa (*Seasonal Color Theory*) chuẩn haute couture. Khám phá dải màu tôn vinh đường nét khuôn mặt, làn da và phong thái thượng lưu tự nhiên.
                    </p>

                    <button
                        onClick={() => setIsQuizOpen(true)}
                        className="px-8 py-3.5 bg-white text-black hover:bg-zinc-200 transition-all uppercase tracking-[0.2em] text-xs font-medium inline-flex items-center space-x-3 shadow-xl"
                    >
                        <span>Chẩn Đoán Sắc Tố Undertone Ngay</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>

                {/* Diagnostic Result Banner (if completed) */}
                {diagnosisResult && (
                    <div className="mb-16 border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                                    Chứng Thư Phân Tích Sắc Độ #{diagnosisResult.certificate_code}
                                </span>
                                <h2 className="text-2xl font-serif text-white mb-1">
                                    Undertone Xác Định: <span className="uppercase text-cyan-400 font-sans tracking-wide text-lg">{diagnosisResult.dominant_undertone} Undertone</span>
                                </h2>
                                <p className="text-xs text-zinc-400 font-light">
                                    Bảng màu tương thích hoàn hảo: <strong className="text-zinc-200">{palettes[diagnosisResult.recommended_palette_key]?.season}</strong>
                                </p>
                            </div>

                            <div className="flex items-center space-x-6 font-mono text-xs border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0 md:pl-6">
                                <div>
                                    <span className="text-[9px] text-zinc-500 uppercase block">Cool Score</span>
                                    <span className="text-sm text-cyan-300 font-bold">{diagnosisResult.scores?.cool || 0}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-zinc-500 uppercase block">Warm Score</span>
                                    <span className="text-sm text-amber-300 font-bold">{diagnosisResult.scores?.warm || 0}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-zinc-500 uppercase block">Neutral Score</span>
                                    <span className="text-sm text-zinc-400 font-bold">{diagnosisResult.scores?.neutral || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Seasonal Palettes Selector Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-zinc-900">
                    {Object.entries(palettes).map(([key, pal]) => (
                        <button
                            key={key}
                            onClick={() => setActivePaletteKey(key)}
                            className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all border ${
                                activePaletteKey === key 
                                    ? 'border-white bg-white text-black' 
                                    : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                            }`}
                        >
                            {pal.season}
                        </button>
                    ))}
                </div>

                {/* 4 Seasonal Palettes Display Grid */}
                {loading ? (
                    <div className="py-24 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Đang kết xuất bảng màu quang phổ...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.entries(palettes).map(([key, pal]) => (
                            <PaletteDisplayCard
                                key={key}
                                palette={pal}
                                isSelected={activePaletteKey === key}
                                onSelect={() => setActivePaletteKey(key)}
                            />
                        ))}
                    </div>
                )}

                {/* Recommended Curated Wardrobe Items */}
                {activePalette && (
                    <div className="mt-16 border border-zinc-900 bg-zinc-950/40 p-8 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                                    Curated Atelier Wardrobe Recommendation
                                </span>
                                <h3 className="text-lg font-serif text-white">
                                    Dòng Thiết Kế TVC-Shop Phù Hợp Cho {activePalette.season}
                                </h3>
                            </div>
                            <Link 
                                to="/shop" 
                                className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center space-x-1"
                            >
                                <span>Khám phá Cửa Hàng</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {activePalette.recommended_categories.map((cat, idx) => (
                                <div key={idx} className="p-4 border border-zinc-900 bg-black/60 text-center">
                                    <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center mx-auto mb-2 text-zinc-400 text-xs">
                                        0{idx + 1}
                                    </div>
                                    <p className="text-xs text-zinc-300 font-medium">{cat}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quiz Modal */}
            {isQuizOpen && (
                <UndertoneQuizModal
                    questions={questions}
                    onClose={() => setIsQuizOpen(false)}
                    onDiagnoseComplete={handleDiagnoseComplete}
                />
            )}
        </div>
    );
};

export default ColorAnalysis;
