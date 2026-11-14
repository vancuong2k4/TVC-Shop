import React, { useState, useEffect } from 'react';
import PanoramaViewer from '../components/flagship/PanoramaViewer';
import VirtualTourBookingModal from '../components/flagship/VirtualTourBookingModal';

const VirtualFlagship = () => {
    const [loading, setLoading] = useState(true);
    const [flagshipData, setFlagshipData] = useState(null);
    const [activeSpaceKey, setActiveSpaceKey] = useState('grand_rotunda');
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        fetchFlagshipData();
    }, []);

    const fetchFlagshipData = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/virtual-flagship/spaces');
            const json = await res.json();
            if (json.success) {
                setFlagshipData(json);
            }
        } catch (err) {
            console.error('Error fetching virtual flagship spaces:', err);
        } finally {
            setLoading(false);
        }
    };

    const spaces = flagshipData?.spaces || {};
    const currentSpace = spaces[activeSpaceKey] || null;
    const guide = flagshipData?.experience_guide || [];

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-amber-400 selection:text-black">
            {/* Ambient Warm Golden Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-950/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-amber-500/30 bg-amber-950/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber-300">
                            3D Interactive Flagship Walkthrough & Private Concierge
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Không Gian Trải Nghiệm 3D Flagship
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                        Khám phá dinh thự thời trang TVC Atelier qua không gian 3D tương tác đa chiều. Di chuyển qua Sảnh Vòm Di Sản, Phòng Thử VIP Kín và Hầm Tuyệt Tác Bí Mật kèm âm thanh thính phòng sống động.
                    </p>

                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="px-8 py-3.5 bg-amber-400 text-black hover:bg-amber-300 transition-all uppercase tracking-[0.2em] text-xs font-semibold inline-flex items-center space-x-3 shadow-xl"
                    >
                        <span>Đặt Lịch Tham Quan Trực Tuyến 1-1 Cùng Quản Gia</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>

                {/* Room Selector Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {Object.entries(spaces).map(([key, sp]) => (
                        <button
                            key={key}
                            onClick={() => setActiveSpaceKey(key)}
                            className={`px-6 py-2.5 uppercase font-mono tracking-widest text-xs transition-all border ${
                                activeSpaceKey === key
                                    ? 'border-white bg-white text-black'
                                    : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                            }`}
                        >
                            {sp.name.split('(')[0].trim()}
                        </button>
                    ))}
                </div>

                {/* Main 3D Panoramic Canvas */}
                {loading || !currentSpace ? (
                    <div className="py-24 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Đang kết xuất không gian 3D Flagship...
                    </div>
                ) : (
                    <div className="mb-16">
                        <PanoramaViewer
                            currentSpace={currentSpace}
                            onSelectHotspot={(spot) => {
                                // Can trigger quick preview
                            }}
                        />

                        {/* Room Theme & Sensory Narrative Box */}
                        <div className="mt-4 p-6 border border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
                                    Ý Niệm Kiến Trúc Không Gian
                                </span>
                                <h3 className="text-base font-serif text-white">{currentSpace.name}</h3>
                                <p className="text-xs text-zinc-400 font-light mt-1">{currentSpace.theme}</p>
                            </div>

                            <div className="text-left md:text-right font-mono text-xs text-zinc-400 shrink-0">
                                <span className="text-[10px] text-zinc-500 uppercase block">Trưng bày tâm điểm:</span>
                                <span className="text-amber-300 font-semibold">{currentSpace.featured_mannequin}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Experience Guide */}
                <div className="border border-zinc-900 bg-zinc-950/40 p-8 max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-300">
                            Chỉ Dẫn Thưởng Lãm Không Gian Ảo TVC Flagship
                        </h3>
                    </div>
                    <ul className="text-xs text-zinc-400 font-light space-y-2.5 leading-relaxed list-disc list-inside">
                        {guide.map((g, idx) => (
                            <li key={idx}>{g}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Tour Booking Modal */}
            {isBookingOpen && currentSpace && (
                <VirtualTourBookingModal
                    room={currentSpace}
                    onClose={() => setIsBookingOpen(false)}
                    onSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default VirtualFlagship;
