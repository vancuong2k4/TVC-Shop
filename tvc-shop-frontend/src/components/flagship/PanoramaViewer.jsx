import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PanoramaViewer = ({ currentSpace, onSelectHotspot }) => {
    const [activeSpot, setActiveSpot] = useState(null);

    return (
        <div className="relative aspect-[16/9] w-full border border-zinc-900 bg-zinc-950 overflow-hidden shadow-2xl group select-none">
            {/* Background Panorama Visual */}
            <img
                src={currentSpace.image_panorama}
                alt={currentSpace.name}
                className="w-full h-full object-cover filter contrast-[1.05] brightness-90 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none"></div>

            {/* Top Room Indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                    {currentSpace.name}
                </span>
            </div>

            {/* Audioscape Badge */}
            <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 border border-zinc-800/80 text-[10px] font-mono text-zinc-400">
                <svg className="w-3.5 h-3.5 text-amber-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18V6l-4 4H4v4h4l4 4z" />
                </svg>
                <span className="truncate max-w-[200px]">{currentSpace.ambient_sound}</span>
            </div>

            {/* Interactive 3D Hotspot Pins */}
            {currentSpace.interactive_hotspots && currentSpace.interactive_hotspots.map((spot) => {
                const isHovered = activeSpot?.id === spot.id;
                return (
                    <div
                        key={spot.id}
                        style={{ left: spot.pos_x, top: spot.pos_y }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                    >
                        {/* Hotspot Pulse Trigger Button */}
                        <button
                            onMouseEnter={() => setActiveSpot(spot)}
                            onClick={() => onSelectHotspot(spot)}
                            className="relative w-8 h-8 rounded-full flex items-center justify-center focus:outline-none group/pin cursor-pointer"
                        >
                            <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping"></span>
                            <span className="relative w-4 h-4 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center text-[8px] font-bold text-black shadow-lg">
                                +
                            </span>
                        </button>

                        {/* Floating Tooltip Card */}
                        {isHovered && (
                            <div 
                                onMouseLeave={() => setActiveSpot(null)}
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-4 bg-black/95 border border-amber-400/60 text-white shadow-2xl backdrop-blur-md z-40 animate-fade-in"
                            >
                                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                                    Điểm Tương Tác Trưng Bày
                                </span>
                                <h4 className="text-xs font-serif font-bold mb-1 leading-snug">{spot.title}</h4>
                                <p className="text-[11px] text-zinc-400 font-light leading-relaxed mb-3">
                                    {spot.description}
                                </p>
                                <Link
                                    to={spot.target_url}
                                    className="w-full py-1.5 bg-white text-black hover:bg-amber-300 uppercase tracking-widest text-[9px] font-semibold flex items-center justify-center space-x-1"
                                >
                                    <span>Trải Nghiệm Trực Tiếp</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Bottom Navigation Hint */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Trải Nghiệm Flagship 3D 360° Tương Tác</span>
                <span>Rê chuột để khám phá điểm trưng bày</span>
            </div>
        </div>
    );
};

export default PanoramaViewer;
