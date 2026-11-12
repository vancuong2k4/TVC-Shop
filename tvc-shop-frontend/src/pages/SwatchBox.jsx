import React, { useState, useEffect } from 'react';
import SwatchBoxCard from '../components/swatch/SwatchBoxCard';
import SwatchOrderModal from '../components/swatch/SwatchOrderModal';

const SwatchBox = () => {
    const [loading, setLoading] = useState(true);
    const [catalog, setCatalog] = useState(null);
    const [selectedBox, setSelectedBox] = useState(null);

    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/swatch-box/catalog');
            const data = await res.json();
            if (data.success) {
                setCatalog(data);
            }
        } catch (err) {
            console.error('Error fetching swatch catalog:', err);
        } finally {
            setLoading(false);
        }
    };

    const boxes = catalog?.swatch_boxes || {};
    const servicePerks = catalog?.service_perks || [];

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
                            Atelier Tactile Swatch Box & Home Discovery
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Hộp Thử Mẫu Vải Trực Tiếp Tại Gia
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
                        Cảm nhận chân thực xúc giác sợi len Cashmere Loro Piana, tơ tằm Mulberry Como và lanh Normandie ngay tại không gian tư gia trước khi quyết định may đo. Đóng gói trong hộp sơn mài mini kèm kính lúp 10x và găng tay lụa trắng.
                    </p>
                </div>

                {/* Swatch Boxes Grid */}
                {loading ? (
                    <div className="py-24 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Đang chuẩn bị các hộp mẫu vải di sản...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
                        {Object.entries(boxes).map(([key, data]) => (
                            <SwatchBoxCard
                                key={key}
                                boxKey={key}
                                data={data}
                                onOrder={(bx) => setSelectedBox(bx)}
                            />
                        ))}
                    </div>
                )}

                {/* Service Perks Box */}
                <div className="border border-zinc-900 bg-zinc-950/60 p-8 max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-300">
                            Đặc Quyền Trải Nghiệm Mẫu Vải Xúc Giác TVC White-Glove
                        </h3>
                    </div>
                    <ul className="text-xs text-zinc-400 font-light space-y-2.5 leading-relaxed list-disc list-inside">
                        {servicePerks.map((perk, idx) => (
                            <li key={idx}>{perk}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal */}
            {selectedBox && (
                <SwatchOrderModal
                    box={selectedBox}
                    onClose={() => setSelectedBox(null)}
                    onSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default SwatchBox;
