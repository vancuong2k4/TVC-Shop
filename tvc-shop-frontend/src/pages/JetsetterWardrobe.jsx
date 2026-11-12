import React, { useState, useEffect } from 'react';
import DestinationWeatherCard from '../components/jetsetter/DestinationWeatherCard';
import PackingGeneratorModal from '../components/jetsetter/PackingGeneratorModal';

const JetsetterWardrobe = () => {
    const [loading, setLoading] = useState(true);
    const [destinationsData, setDestinationsData] = useState(null);
    const [selectedDestKey, setSelectedDestKey] = useState('paris');
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/jetsetter/destinations');
            const data = await res.json();
            if (data.success) {
                setDestinationsData(data);
            }
        } catch (err) {
            console.error('Error fetching jetsetter destinations:', err);
        } finally {
            setLoading(false);
        }
    };

    const destinations = destinationsData?.destinations || {};
    const selectedDest = destinations[selectedDestKey] || null;

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-amber-400 selection:text-black">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-zinc-800/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-amber-500/30 bg-amber-950/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber-300">
                            Atelier Global Meteorological & Jetsetter Capsule
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Bản Đồ Khí Tượng & Tủ Đồ Du Hành Jetsetter
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                        Đồng bộ dữ liệu thời tiết thời gian thực tại các kinh đô thượng lưu toàn cầu (Paris, St. Moritz, Hồ Como, Ginza, Monaco). Tự động kiến tạo tủ đồ Capsule và lộ trình xếp vali may đo cho mọi hành trình.
                    </p>

                    <button
                        onClick={() => setIsGeneratorOpen(true)}
                        className="px-8 py-3.5 bg-white text-black hover:bg-zinc-200 transition-all uppercase tracking-[0.2em] text-xs font-semibold inline-flex items-center space-x-3 shadow-xl"
                    >
                        <span>Kiến Tạo Lộ Trình Vali May Đo</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>

                {/* Destinations Meteorological Cards Grid */}
                {loading ? (
                    <div className="py-24 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Đang kết nối trạm vệ tinh khí tượng toàn cầu...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
                        {Object.entries(destinations).map(([key, data]) => (
                            <DestinationWeatherCard
                                key={key}
                                destKey={key}
                                data={data}
                                isSelected={selectedDestKey === key}
                                onSelect={(k) => setSelectedDestKey(k)}
                            />
                        ))}
                    </div>
                )}

                {/* Selected Destination Deep-Dive Capsule & Valet Advice */}
                {selectedDest && (
                    <div className="border border-zinc-800 bg-zinc-950/80 p-8 md:p-12 backdrop-blur-md mb-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900 mb-8">
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                                    Curated Atelier Capsule Dossier
                                </span>
                                <h2 className="text-2xl md:text-3xl font-serif text-white">
                                    {selectedDest.curated_capsule.title}
                                </h2>
                                <p className="text-xs text-zinc-400 font-light mt-1">
                                    Thiết kế riêng cho khí hậu {selectedDest.city} ({selectedDest.current_weather.temp_c}°C - {selectedDest.current_weather.condition})
                                </p>
                            </div>

                            <button
                                onClick={() => setIsGeneratorOpen(true)}
                                className="px-6 py-2.5 bg-amber-400 text-black hover:bg-amber-300 uppercase tracking-widest text-xs font-semibold transition-all shrink-0"
                            >
                                Đặt May Trọn Bộ Vali
                            </button>
                        </div>

                        {/* Essential Pieces 4-Column Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {selectedDest.curated_capsule.essential_pieces.map((piece, idx) => (
                                <div key={idx} className="p-5 border border-zinc-900 bg-black/60 flex flex-col justify-between">
                                    <div>
                                        <span className="w-6 h-6 rounded-full border border-zinc-800 flex items-center justify-center font-mono text-[10px] text-zinc-500 mb-3">
                                            0{idx + 1}
                                        </span>
                                        <h4 className="text-xs font-medium text-white mb-2 leading-snug">{piece}</h4>
                                    </div>
                                    <span className="text-[10px] text-amber-300 font-mono tracking-wider block mt-3">
                                        Chuẩn Jetsetter Luxe
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Valet Packing Wisdom */}
                        <div className="p-5 border border-zinc-900 bg-black/40 text-xs text-zinc-400 font-light leading-relaxed">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                                Lời Khuyên Từ Trưởng Quản Gia Atelier:
                            </span>
                            {selectedDest.curated_capsule.packing_advice}
                        </div>
                    </div>
                )}

                {/* Jetsetter Concierge Tips */}
                <div className="border border-zinc-900 bg-zinc-950/40 p-8 max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-300">
                            Đặc Quyền Dịch Vụ Hàng Không & Khách Sạn 5 Sao TVC Valet
                        </h3>
                    </div>
                    <ul className="text-xs text-zinc-400 font-light space-y-2.5 leading-relaxed list-disc list-inside">
                        {destinationsData?.jetsetter_tips?.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                        )) || (
                            <>
                                <li>Sử dụng túi bọc trang phục bảo hộ bằng sợi cotton thoáng khí khi xếp đồ vào vali Rimowa nhôm nguyên khối.</li>
                                <li>Luôn gấp áo măng-tô lộn ngược lớp lót ra ngoài để giữ gìn bề mặt vải Cashmere không bị cọ xát.</li>
                                <li>TVC Atelier cung cấp dịch vụ giao vali trang phục thẳng tới khách sạn 5 sao trước giờ Quý khách hạ cánh.</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Modal */}
            {isGeneratorOpen && selectedDest && (
                <PackingGeneratorModal
                    destinationKey={selectedDestKey}
                    destinationData={selectedDest}
                    onClose={() => setIsGeneratorOpen(false)}
                />
            )}
        </div>
    );
};

export default JetsetterWardrobe;
