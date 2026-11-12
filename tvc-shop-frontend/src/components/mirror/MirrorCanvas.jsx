import React, { useRef, useState, useEffect } from 'react';

const MirrorCanvas = ({ activeItem, onSnapshotTaken }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [flashEffect, setFlashEffect] = useState(false);

    // Default Portrait model when camera is off or not supported
    const defaultModelImg = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop';

    const startCamera = async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            console.warn('Camera access denied or unavailable:', err);
            setCameraError('Không thể mở camera (yêu cầu quyền hoặc thiết bị không hỗ trợ). Đang dùng chế độ người mẫu chuẩn Atelier.');
            setCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const handleCaptureSnapshot = () => {
        setFlashEffect(true);
        setTimeout(() => setFlashEffect(false), 300);
        if (onSnapshotTaken) {
            onSnapshotTaken(activeItem);
        }
    };

    return (
        <div className="relative aspect-[3/4] max-w-xl mx-auto border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Camera feed or fallback portrait */}
            {cameraActive ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                />
            ) : (
                <div className="relative w-full h-full">
                    <img
                        src={defaultModelImg}
                        alt="Atelier Face Fitting Model"
                        className="w-full h-full object-cover filter contrast-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
                </div>
            )}

            {/* AR Accessory Overlays */}
            {activeItem && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center transition-all duration-500">
                    {/* Eyewear Placement */}
                    {activeItem.category === 'eyewear' && (
                        <div className="absolute top-[34%] w-[58%] transform transition-transform hover:scale-105">
                            {activeItem.overlay_svg === 'sunglasses_geometric' ? (
                                <svg viewBox="0 0 300 90" className="w-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
                                    <path d="M10 25 L135 20 L135 75 L30 75 Z" fill="#09090b" stroke="#71717a" strokeWidth="3" opacity="0.95" />
                                    <path d="M165 20 L290 25 L270 75 L165 75 Z" fill="#09090b" stroke="#71717a" strokeWidth="3" opacity="0.95" />
                                    <line x1="135" y1="25" x2="165" y2="25" stroke="#a1a1aa" strokeWidth="4" />
                                    <line x1="0" y1="28" x2="15" y2="28" stroke="#a1a1aa" strokeWidth="3" />
                                    <line x1="285" y1="28" x2="300" y2="28" stroke="#a1a1aa" strokeWidth="3" />
                                    {/* Glass sheen */}
                                    <path d="M25 35 L70 32 L40 65 Z" fill="#ffffff" opacity="0.2" />
                                    <path d="M180 32 L225 35 L195 65 Z" fill="#ffffff" opacity="0.2" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 300 90" className="w-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
                                    {/* Aviator style */}
                                    <path d="M15 15 C80 10 130 15 135 25 C140 65 100 80 40 80 C15 75 10 40 15 15 Z" fill="#451a03" stroke="#f59e0b" strokeWidth="3" opacity="0.9" />
                                    <path d="M165 25 C170 15 220 10 285 15 C290 40 285 75 260 80 C200 80 160 65 165 25 Z" fill="#451a03" stroke="#f59e0b" strokeWidth="3" opacity="0.9" />
                                    <path d="M130 18 Q150 12 170 18" fill="none" stroke="#f59e0b" strokeWidth="4" />
                                    <line x1="135" y1="28" x2="165" y2="28" stroke="#f59e0b" strokeWidth="2.5" />
                                    <path d="M30 25 Q70 20 50 60 Z" fill="#ffffff" opacity="0.25" />
                                    <path d="M180 25 Q220 20 200 60 Z" fill="#ffffff" opacity="0.25" />
                                </svg>
                            )}
                        </div>
                    )}

                    {/* Jewelry Placement */}
                    {activeItem.category === 'jewelry' && (
                        <div className="absolute top-[68%] w-[68%] transform transition-transform">
                            {activeItem.overlay_svg === 'necklace_choker' ? (
                                <svg viewBox="0 0 300 120" className="w-full drop-shadow-[0_10px_20px_rgba(255,255,255,0.4)]">
                                    <path d="M30 20 C100 110 200 110 270 20" fill="none" stroke="#e4e4e7" strokeWidth="9" strokeDasharray="6,4" />
                                    <path d="M40 26 C105 105 195 105 260 26" fill="none" stroke="#ffffff" strokeWidth="4" />
                                    {/* Baguette Sparkle Elements */}
                                    <circle cx="150" cy="80" r="5" fill="#ffffff" className="animate-pulse" />
                                    <circle cx="120" cy="72" r="4" fill="#67e8f9" />
                                    <circle cx="180" cy="72" r="4" fill="#67e8f9" />
                                </svg>
                            ) : (
                                /* Earrings Overlay */
                                <div className="absolute -top-[160px] inset-x-0 flex justify-between px-8">
                                    <svg viewBox="0 0 50 100" className="w-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                                        <circle cx="25" cy="15" r="5" fill="#f43f5e" />
                                        <polygon points="25,25 40,65 25,95 10,65" fill="#09090b" stroke="#fb7185" strokeWidth="2" />
                                    </svg>
                                    <svg viewBox="0 0 50 100" className="w-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                                        <circle cx="25" cy="15" r="5" fill="#f43f5e" />
                                        <polygon points="25,25 40,65 25,95 10,65" fill="#09090b" stroke="#fb7185" strokeWidth="2" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Flash Capture Feedback */}
            {flashEffect && (
                <div className="absolute inset-0 bg-white z-40 transition-opacity duration-300"></div>
            )}

            {/* Live Camera Guidelines Grid */}
            <div className="absolute inset-4 border border-white/10 pointer-events-none flex flex-col justify-between">
                <div className="flex justify-between p-2 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>Atelier Precision AR</span>
                    <span>Face Mesh 68-Pts</span>
                </div>
                <div className="flex justify-between p-2 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>Scale: 1.00x</span>
                    <span>Optical Lux: Optimal</span>
                </div>
            </div>

            {/* Floating Top Controls */}
            <div className="absolute top-4 right-4 z-20 flex space-x-2">
                {!cameraActive ? (
                    <button
                        onClick={startCamera}
                        className="px-3 py-1.5 bg-white/90 text-black hover:bg-white text-[10px] uppercase font-mono tracking-wider transition-all shadow-lg flex items-center space-x-1.5 backdrop-blur-sm"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Bật Webcam</span>
                    </button>
                ) : (
                    <button
                        onClick={stopCamera}
                        className="px-3 py-1.5 bg-red-600/90 text-white hover:bg-red-600 text-[10px] uppercase font-mono tracking-wider transition-all shadow-lg flex items-center space-x-1.5 backdrop-blur-sm"
                    >
                        <span>Dừng Webcam</span>
                    </button>
                )}
            </div>

            {/* Capture Button Bar at Bottom */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-2">
                <div className="text-[10px] font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-zinc-800">
                    {activeItem?.name || 'Chưa chọn phụ kiện'}
                </div>

                <button
                    onClick={handleCaptureSnapshot}
                    className="p-3 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-transform shadow-2xl flex items-center justify-center border-2 border-zinc-950"
                    title="Chụp ảnh chân dung phối phụ kiện"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MirrorCanvas;
